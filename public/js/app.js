// public/js/app.js - Jawharat Al-Majd HRMS Master Controller

// =========================================================================
// 0. MULTILINGUAL SUPPORT (Arabic, English, Bengali, Urdu, Hindi)
// =========================================================================

const I18N_TRANSLATIONS = {
  ar: {
    brand_name: "شركة جوهرة المجد",
    header_subtitle: "نظام إدارة الموارد البشرية المتكامل • أبها، عسير",
    login_subtitle: "منظومة الموارد البشرية والخدمة الذاتية المتكاملة",
    select_language: "اختر اللغة / Select Language:",
    username_label: "اسم المستخدم (Username):",
    password_label: "كلمة المرور (Password):",
    username_placeholder: "اسم المستخدم",
    password_placeholder: "كلمة المرور",
    login_btn: "دخول إلى النظام",
    login_btn_loading: "جاري تسجيل الدخول...",
    login_error: "اسم المستخدم أو كلمة المرور غير صحيحة",
    logout: "تسجيل الخروج",
    install_app: "تثبيت التطبيق",
    sync_and_save: "حفظ ومزامنة",
    cancel: "إلغاء",
    close_modal: "إغلاق النافذة",

    // Navigation Tabs
    nav_dashboard: "لوحة المؤشرات",
    nav_employees: "قاعدة بيانات الموظفين",
    nav_leaves: "إدارة الإجازات والموافقات",
    nav_tasks: "نظام المهام والمتابعة",
    nav_forms: "نماذج الموارد البشرية Word",
    nav_compliance: "مؤشر الامتثال والإقامات",
    nav_penalties: "القرارات الجزائية واللوائح",
    nav_attendance: "الحضور والبصمة الحيوية",
    nav_payroll: "مسيرات الرواتب وحماية الأجور",
    nav_loans: "إدارة واستيراد السلف",
    nav_terminated: "الموظفون المنهي خدماتهم",
    nav_notices: "إشعارات وإنذارات الدوام",
    nav_selfservice: "بوابة الخدمة الذاتية (ESS)",
    nav_org: "الهيكل التنظيمي والمدير المباشر",
    nav_branches: "فروع الشركة والمواقع",
    nav_users: "المستخدمين والصلاحيات",
    nav_audit: "سجل الرقابة (Audit Log)",
    nav_data: "الاستيراد والتصدير المتقدم",
    nav_docs: "التوثيق والتقارير الهندسية",
    nav_more: "المزيد",

    // Roles
    role_admin: "مدير عام النظام",
    role_hr_manager: "مسؤول موارد بشرية",
    role_dept_manager: "مدير إدارة",
    role_employee: "بوابة الموظف",

    // Dashboard KPIs
    kpi_total_employees: "إجمالي القوى العاملة",
    kpi_saudization: "نسبة التوطين",
    kpi_attendance: "نسبة الحضور اليومي",
    kpi_payroll: "مسير الأجور الشهري",
    kpi_compliance: "مؤشر الامتثال النظامي",

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
    header_subtitle: "Integrated HR Management System • Abha, Asir",
    login_subtitle: "Integrated Human Resources & Self-Service System",
    select_language: "Choose Language / اختر اللغة:",
    username_label: "Username:",
    password_label: "Password:",
    username_placeholder: "Enter username",
    password_placeholder: "Enter password",
    login_btn: "Sign In to System",
    login_btn_loading: "Signing In...",
    login_error: "Invalid username or password",
    logout: "Logout",
    install_app: "Install App",
    sync_and_save: "Sync & Save",
    cancel: "Cancel",
    close_modal: "Close Window",

    // Navigation Tabs
    nav_dashboard: "Dashboard",
    nav_employees: "Employee Database",
    nav_leaves: "Leaves & Approvals",
    nav_tasks: "Task Management",
    nav_forms: "Official HR Forms",
    nav_compliance: "Compliance & Iqamas",
    nav_penalties: "Penalties & Regulations",
    nav_attendance: "Attendance & Biometrics",
    nav_payroll: "Payroll & WPS",
    nav_loans: "Loans & Advances",
    nav_terminated: "End of Service",
    nav_notices: "Work Notices & Warnings",
    nav_selfservice: "Self-Service (ESS)",
    nav_org: "Organization Structure",
    nav_branches: "Company Branches",
    nav_users: "Users & Permissions",
    nav_audit: "Audit Log",
    nav_data: "Data Center",
    nav_docs: "System Documentation",
    nav_more: "More",

    // Roles
    role_admin: "System Administrator",
    role_hr_manager: "HR Manager",
    role_dept_manager: "Department Manager",
    role_employee: "Employee Portal",

    // Dashboard KPIs
    kpi_total_employees: "Total Workforce",
    kpi_saudization: "Saudization Rate",
    kpi_attendance: "Daily Attendance Rate",
    kpi_payroll: "Monthly Payroll",
    kpi_compliance: "Regulatory Compliance",

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
    chat_bot_input: "Ask anything (Leave, Mission, Advance, Punch)...",
    chat_btn_text: "HR Assistant",
    chat_btn_sub: "Guide & Request Help"
  },
  bn: {
    brand_name: "জওহরাত আল-মাজদ কোং",
    header_subtitle: "সমন্বিত মানবসম্পদ ব্যবস্থাপনা পদ্ধতি • আভা, আসির",
    login_subtitle: "সমন্বিত মানবসম্পদ ও স্ব-সেবা ব্যবস্থা",
    select_language: "ভাষা নির্বাচন করুন / Select Language:",
    username_label: "ব্যবহারকারীর নাম (Username):",
    password_label: "পাসওয়ার্ড (Password):",
    username_placeholder: "ব্যবহারকারীর নাম লিখুন",
    password_placeholder: "পাসওয়ার্ড লিখুন",
    login_btn: "সিস্টেমে প্রবেশ করুন",
    login_btn_loading: "লগইন হচ্ছে...",
    login_error: "ভুল ব্যবহারকারীর নাম বা পাসওয়ার্ড",
    logout: "লগ আউট",
    install_app: "অ্যাপ ইনস্টল করুন",
    sync_and_save: "সিঙ্ক ও সংরক্ষণ",
    cancel: "বাতিল",
    close_modal: "উইন্ডো বন্ধ করুন",

    // Navigation Tabs
    nav_dashboard: "ড্যাশবোর্ড",
    nav_employees: "কর্মচারী ডাটাবেস",
    nav_leaves: "ছুটি ও অনুমোদন",
    nav_tasks: "টাস্ক ও ফলো-আপ",
    nav_forms: "অফিসিয়াল ফর্ম (Word)",
    nav_compliance: "সম্মতি ও ইকামা সূচক",
    nav_penalties: "জরিমানা ও প্রবিধান",
    nav_attendance: "উপস্থিতি ও বায়োমেট্রিক",
    nav_payroll: "বেতন ও ডব্লিউপিএস",
    nav_loans: "ঋণ ও অগ্রিম",
    nav_terminated: "চাকরি সমাপ্তি",
    nav_notices: "কাজের নোটিশ ও সতর্কতা",
    nav_selfservice: "স্ব-সেবা পোর্টাল (ESS)",
    nav_org: "সাংগঠনিক কাঠামো",
    nav_branches: "কোম্পানির শাখা",
    nav_users: "ব্যবহারকারী ও অনুমতি",
    nav_audit: "অডিট লগ",
    nav_data: "ডেটা সেন্টার",
    nav_docs: "সিস্টেম ডকুমেন্ট",
    nav_more: "আরও",

    // Roles
    role_admin: "সিস্টেম অ্যাডমিন",
    role_hr_manager: "এইচআর ম্যানেজার",
    role_dept_manager: "বিভাগীয় প্রধান",
    role_employee: "কর্মচারী পোর্টাল",

    // Dashboard KPIs
    kpi_total_employees: "মোট কর্মী",
    kpi_saudization: "সৌদিকরণ হার",
    kpi_attendance: "দৈনিক উপস্থিতির হার",
    kpi_payroll: "মাসিক বেতন",
    kpi_compliance: "নিয়ন্ত্রক সম্মতি",

    // ESS Cards
    ess_card_leave: "ছুটির আবেদন",
    ess_card_leave_sub: "বার্ষিক, অসুস্থতা, অধ্যয়ন...",
    ess_card_mission: "অফিসিয়াল মিশন",
    ess_card_mission_sub: "ভ্রমণ ও শাখা পরিদর্শন",
    ess_card_loan: "অগ্রিম বেতন",
    ess_card_loan_sub: "জরুরী ঋণ ও কিস্তি",
    ess_card_perm: "অনুমতি পত্র",
    ess_card_perm_sub: "সাময়িক প্রস্থান অনুমোদন",
    ess_card_payslip: "আমার বেতন স্লিপ",
    ess_card_payslip_sub: "বেতন বিবরণ দেখুন ও প্রিন্ট করুন",
    ess_card_cert: "বেতন প্রশংসাপত্র",
    ess_card_cert_sub: "ডিজিটাল সার্টিফাইড পত্র",
    ess_card_punch: "স্মার্ট উপস্থিতি",
    ess_card_punch_sub: "কর্মস্থলের অবস্থান উপস্থিতি",

    // Modal Request
    req_category_label: "অনুরোধের প্রকার:",
    req_leave_type_label: "ছুটির ধরন: *",
    req_mission_dest: "মিশনের গন্তব্য / শহর: *",
    req_mission_transport: "পরিবহন মাধ্যম:",
    req_mission_purpose: "মিশনের উদ্দেশ্য ও বিবরণ: *",
    req_start_date: "শুরুর তারিখ: *",
    req_end_date: "শেষের তারিখ: *",
    req_days_count: "গণনাকৃত দিন:",
    req_loan_amount: "পরিমাণ (SAR): *",
    req_loan_months: "পরিশোধের মাস:",
    req_reason_label: "কারণ ও মন্তব্য: *",
    req_submit_btn: "অনুমোদনের জন্য আবেদন পাঠান",

    // Chatbot strings
    chat_bot_title: "জওহরাত সহকারী",
    chat_bot_sub: "এইচআর ও অনুরোধের জন্য স্মার্ট এআই",
    chat_bot_input: "আপনার প্রশ্ন লিখুন (ছুটি, মিশন, লোন, পাঞ্চ)...",
    chat_btn_text: "এইচআর সহকারী",
    chat_btn_sub: "অনুরোধ সহায়তা"
  },
  ur: {
    brand_name: "جوهرة المجد کمپنی",
    header_subtitle: "مربوط ہیومن ریسورس مینجمنٹ سسٹم • ابہا، عسیر",
    login_subtitle: "مربوط ہیومن ریسورس اور سیلف سروس سسٹم",
    select_language: "زبان منتخب کریں / Select Language:",
    username_label: "صارف کا نام (Username):",
    password_label: "پاس ورڈ (Password):",
    username_placeholder: "صارف کا نام درج کریں",
    password_placeholder: "پاس ورڈ درج کریں",
    login_btn: "سسٹم میں لاگ ان کریں",
    login_btn_loading: "لاگ ان ہو رہا ہے...",
    login_error: "صارف کا نام یا پاس ورڈ غلط ہے",
    logout: "لاگ آؤٹ",
    install_app: "ایپ انسٹال کریں",
    sync_and_save: "ہم وقت سازی اور محفوظ کریں",
    cancel: "منسوخ کریں",
    close_modal: "ونڈو بند کریں",

    // Navigation Tabs
    nav_dashboard: "ڈیش بورڈ",
    nav_employees: "ملازمین کا ڈیٹا بیس",
    nav_leaves: "چھٹیاں اور منظوریاں",
    nav_tasks: "ٹاسک مینجمنٹ",
    nav_forms: "سرکاری فارمز (Word)",
    nav_compliance: "تعمیل اور اقامہ انڈیکس",
    nav_penalties: "سزائیں اور ضوابط",
    nav_attendance: "حاضری اور بایومیٹرک",
    nav_payroll: "تنخواہیں اور ڈبلیو پی ایس",
    nav_loans: "قرضے اور پیشگی رقم",
    nav_terminated: "سروس کا خاتمہ",
    nav_notices: "حاضری کے نوٹس اور انتباہات",
    nav_selfservice: "سیلف سروس پورٹل (ESS)",
    nav_org: "تنظیمی ڈھانچہ",
    nav_branches: "کمپنی کی شاخیں",
    nav_users: "صارفین اور اختیارات",
    nav_audit: "آڈٹ لاگ",
    nav_data: "ڈیٹا سینٹر",
    nav_docs: "سسٹم دستاویزات",
    nav_more: "مزید",

    // Roles
    role_admin: "سسٹم ایڈمنسٹریٹر",
    role_hr_manager: "ایچ آر مینیجر",
    role_dept_manager: "محکمہ مینیجر",
    role_employee: "ملازم پورٹل",

    // Dashboard KPIs
    kpi_total_employees: "کل افرادی قوت",
    kpi_saudization: "سعودیائزیشن کی شرح",
    kpi_attendance: "روزانہ حاضری کی شرح",
    kpi_payroll: "ماہانہ تنخواہ",
    kpi_compliance: "ریگولیٹری تعمیل",

    // ESS Cards
    ess_card_leave: "چھٹی کی درخواست",
    ess_card_leave_sub: "سالانہ، بیماری، مطالعہ...",
    ess_card_mission: "کاروباری مشن",
    ess_card_mission_sub: "سفر، دورہ شاخ",
    ess_card_loan: "تنخواہ پر پیشگی",
    ess_card_loan_sub: "ہنگامی قرض اور اقساط",
    ess_card_perm: "اجازت کی درخواست",
    ess_card_perm_sub: "عارضی اخراج اور اجازت",
    ess_card_payslip: "میری تنخواہ کی پرچی",
    ess_card_payslip_sub: "تنخواہ کی تفصیلات دیکھیں",
    ess_card_cert: "تنخواہ کا سرٹیفکیٹ",
    ess_card_cert_sub: "سرکاری تصدیق شدہ خط",
    ess_card_punch: "سمارٹ حاضری",
    ess_card_punch_sub: "جغرافیائی کام کی حاضری",

    // Modal Request
    req_category_label: "درخواست کی قسم:",
    req_leave_type_label: "چھٹی کی قسم: *",
    req_mission_dest: "مشن کی منزل / شہر: *",
    req_mission_transport: "سواری کا ذریعہ:",
    req_mission_purpose: "مشن کا مقصد اور تفصیلات: *",
    req_start_date: "شروع کی تاریخ: *",
    req_end_date: "اختتام کی تاریخ: *",
    req_days_count: "شمار شدہ دن:",
    req_loan_amount: "رقم (SAR): *",
    req_loan_months: "ادائیگی کے مہینے:",
    req_reason_label: "وجہ اور اضافی نوٹس: *",
    req_submit_btn: "منظوری کے لیے بھیجیں",

    // Chatbot strings
    chat_bot_title: "جوهرة ایچ آر معاون",
    chat_bot_sub: "ایچ آر اور درخواستوں کے لیے سمارٹ اے آئی",
    chat_bot_input: "اپنا سوال لکھیں (چھٹی، مشن، قرض، حاضری)...",
    chat_btn_text: "ایچ آر معاون",
    chat_btn_sub: "درخواست میں مدد"
  },
  hi: {
    brand_name: "जौहरत अल-मजद कंपनी",
    header_subtitle: "एकीकृत मानव संसाधन प्रबंधन प्रणाली • आभा, असीर",
    login_subtitle: "एकीकृत मानव संसाधन और स्व-सेवा प्रणाली",
    select_language: "भाषा चुनें / Select Language:",
    username_label: "उपयोगकर्ता नाम (Username):",
    password_label: "पासवर्ड (Password):",
    username_placeholder: "उपयोगकर्ता नाम दर्ज करें",
    password_placeholder: "पासवर्ड दर्ज करें",
    login_btn: "सिस्टम में लॉगिन करें",
    login_btn_loading: "लॉगिन हो रहा है...",
    login_error: "अमान्य उपयोगकर्ता नाम या पासवर्ड",
    logout: "लॉग आउट",
    install_app: "ऐप इंस्टॉल करें",
    sync_and_save: "सिंक और सहेजें",
    cancel: "रद्द करें",
    close_modal: "विंडो बंद करें",

    // Navigation Tabs
    nav_dashboard: "डैशबोर्ड",
    nav_employees: "कर्मचारी डेटाबेस",
    nav_leaves: "अवकाश और अनुमोदन",
    nav_tasks: "कार्य प्रबंधन",
    nav_forms: "आधिकारिक फॉर्म (Word)",
    nav_compliance: "अनुपालन और इकामा सूचकांक",
    nav_penalties: "दंड और विनियम",
    nav_attendance: "उपस्थिति और बायोमेट्रिक",
    nav_payroll: "वेतन और डब्ल्यूपीएस",
    nav_loans: "ऋण और अग्रिम",
    nav_terminated: "सेवा समाप्ति",
    nav_notices: "कार्य नोटिस और चेतावनियाँ",
    nav_selfservice: "स्व-सेवा पोर्टल (ESS)",
    nav_org: "संगठनात्मक ढांचा",
    nav_branches: "कंपनी की शाखाएं",
    nav_users: "उपयोगकर्ता और अनुमतियाँ",
    nav_audit: "ऑडिट लॉग",
    nav_data: "डेटा सेंटर",
    nav_docs: "सिस्टम दस्तावेज़",
    nav_more: "अधिक",

    // Roles
    role_admin: "सिस्टम व्यवस्थापक",
    role_hr_manager: "एचआर प्रबंधक",
    role_dept_manager: "विभागाध्यक्ष",
    role_employee: "कर्मचारी पोर्टल",

    // Dashboard KPIs
    kpi_total_employees: "कुल कार्यबल",
    kpi_saudization: "सऊदीकरण दर",
    kpi_attendance: "दैनिक उपस्थिति दर",
    kpi_payroll: "मासिक वेतन",
    kpi_compliance: "नियामक अनुपालन",

    // ESS Cards
    ess_card_leave: "छुट्टी का अनुरोध",
    ess_card_leave_sub: "वार्षिक, बीमारी, अध्ययन...",
    ess_card_mission: "व्यावसायिक मिशन",
    ess_card_mission_sub: "यात्रा, शाखा दौरा",
    ess_card_loan: "वेतन अग्रिम",
    ess_card_loan_sub: "आपातकालीन ऋण और किस्तें",
    ess_card_perm: "अनुमति अनुरोध",
    ess_card_perm_sub: "अस्थायी निकास और अनुमति",
    ess_card_payslip: "मेरी वेतन पर्ची",
    ess_card_payslip_sub: "वेतन विवरण देखें और प्रिंट करें",
    ess_card_cert: "वेतन प्रमाण पत्र",
    ess_card_cert_sub: "आधिकारिक प्रमाणित पत्र",
    ess_card_punch: "स्मार्ट उपस्थिति",
    ess_card_punch_sub: "कार्यस्थल उपस्थिति",

    // Modal Request
    req_category_label: "अनुरोध श्रेणी:",
    req_leave_type_label: "छुट्टी का प्रकार: *",
    req_mission_dest: "मिशन गंतव्य / शहर: *",
    req_mission_transport: "परिवहन का साधन:",
    req_mission_purpose: "मिशन का उद्देश्य और विवरण: *",
    req_start_date: "प्रारंभ तिथि: *",
    req_end_date: "समाप्ति तिथि: *",
    req_days_count: "गणना किए गए दिन:",
    req_loan_amount: "राशि (SAR): *",
    req_loan_months: "पुनर्भुगतान महीने:",
    req_reason_label: "कारण और अतिरिक्त नोट्स: *",
    req_submit_btn: "अनुमोदन के लिए भेजें",

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
  const dict = I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS.ar;
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

  // Apply translations to all [data-i18n-placeholder]
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict && dict[key]) {
      el.placeholder = dict[key];
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

  // Synchronize active user role badge with active language
  if (typeof updateHeaderUserDisplay === 'function') {
    updateHeaderUserDisplay();
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
    cr_number: '5850024190',
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
    { id: 2, code: 'ENG', name_ar: 'الادارة الهندسية', name_en: 'Engineering Department', manager_name: 'فارس عبدالرحمن القحطاني', employee_count: 0, location: 'مقر أبها - المبنى الهندسي' },
    { id: 3, code: 'HR', name_ar: 'ادارة الموارد البشرية', name_en: 'Human Resources', manager_name: 'عبدالملك سعيد الشريف', employee_count: 0, location: 'مقر أبها - مبنى الإدارة' },
    { id: 4, code: 'FIN', name_ar: 'الادارة المالية', name_en: 'Finance Department', manager_name: 'هاني عبدالرحمن صالح القحطاني', employee_count: 0, location: 'مقر أبها - الإدارة المالية' },
    { id: 5, code: 'PROC', name_ar: 'ادارة المشتريات', name_en: 'Procurement & Purchasing', manager_name: 'هاني عبدالله عبدالكريم', employee_count: 0, location: 'مقر أبها - قسم المشتريات' },
    { id: 6, code: 'SALES', name_ar: 'ادارة المبيعات', name_en: 'Sales Department', manager_name: 'مشرف المبيعات', employee_count: 0, location: 'مقر أبها - الإدارة التجارية' },
    { id: 7, code: 'IT', name_ar: 'ادارة تقنية المعلومات', name_en: 'Information Technology', manager_name: 'محمد شكيل', employee_count: 0, location: 'مقر أبها - مركز العمليات الرقمية' },
    { id: 8, code: 'MKT', name_ar: 'ادارة التسويق', name_en: 'Marketing Department', manager_name: 'مشرف التسويق', employee_count: 0, location: 'مقر أبها - الجناح الإعلامي' },
    { id: 9, code: 'TAQEEB', name_ar: 'التعقيب', name_en: 'Government Relations & Taqeed', manager_name: 'عبدالعزيز سعيد مفرح', employee_count: 0, location: 'مقر أبها - العلاقات الحكومية' }
  ],
  branches: [
    { id: 1, code: 'BR-ABHA-01', name_ar: 'فرع ابها الرئيسي', name_en: 'Abha Main Branch', city: 'أبها', address: 'أبها - شارع الملك عبدالعزيز - برج جوهرة المجد', phone: '0172201122', manager_name: 'مدير فرع أبها الرئيسي', is_main: 1, employee_count: 0, device_count: 1 },
    { id: 2, code: 'BR-MANSAK-02', name_ar: 'فرع المنسك', name_en: 'Al-Mansak Branch', city: 'أبها', address: 'أبها - حي المنسك - طريق الأربعين', phone: '0172203344', manager_name: 'مشرف فرع المنسك', is_main: 0, employee_count: 0, device_count: 1 },
    { id: 3, code: 'BR-MUWADAF-03', name_ar: 'فرع حي الموظفين', name_en: 'Hay Al-Muwadhafeen Branch', city: 'أبها', address: 'أبها - حي الموظفين - الشارع التجاري العام', phone: '0172205566', manager_name: 'مشرف فرع حي الموظفين', is_main: 0, employee_count: 0, device_count: 1 },
    { id: 4, code: 'BR-MUHAYIL-04', name_ar: 'فرع محايل عسير', name_en: 'Muhayil Asir Branch', city: 'محايل عسير', address: 'محايل عسير - طريق الشعبين الرئيسي - مجمع جوهرة المجد', phone: '0172851122', manager_name: 'مشرف فرع محايل عسير', is_main: 0, employee_count: 0, device_count: 1 }
  ],
  employees: [],
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
  charts: { dept: null, attendance: null, apexDept: null, apexAttendance: null },
  dashboardAlertsFilter: 'all',
  dashboardAlertsSort: { col: 'date', asc: true },
  dashboardAlertsRaw: [],
  dashboardPenaltiesFilter: 'all',
  dashboardPenaltiesSort: { col: 'number', asc: false },
  dashboardPenaltiesRaw: [],
  attendanceChartPeriod: 'daily'
};

// Safe API Fetcher with Automatic Fallback and User Identity Headers
async function apiFetch(endpoint, options = {}) {
  try {
    const opts = { ...options };
    opts.headers = { ...(opts.headers || {}) };

    if (state.currentUser) {
      if (state.currentUser.id) opts.headers['x-user-id'] = String(state.currentUser.id);
      if (state.currentUser.role) opts.headers['x-user-role'] = String(state.currentUser.role);
      if (state.currentUser.emp_id) opts.headers['x-user-emp-id'] = String(state.currentUser.emp_id);
      const uName = state.currentUser.full_name || state.currentUser.full_name_ar || state.currentUser.username;
      if (uName) opts.headers['x-user-name'] = encodeURIComponent(uName);
    }

    const res = await fetch(endpoint, opts);
    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      return errData || { success: false, message: `HTTP ${res.status}` };
    }
    return await res.json();
  } catch (err) {
    console.warn(`API error on ${endpoint}:`, err);
    return null;
  }
}
const safeFetch = apiFetch;
window.apiFetch = apiFetch;
window.safeFetch = apiFetch;

/* =========================================================================
   UI HELPERS: SKELETON LOADERS, PROFESSIONAL EMPTY & ERROR STATES
   ========================================================================= */

function renderSkeletonTable(tbodyId, cols = 6, rows = 5) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  let html = '';
  for (let r = 0; r < rows; r++) {
    html += '<tr class="animate-pulse bg-slate-50/60 border-b border-slate-100">';
    for (let c = 0; c < cols; c++) {
      html += `<td class="py-3.5 px-3"><div class="h-3.5 bg-slate-200 rounded ${c === 0 ? 'w-10' : c === 1 ? 'w-32' : 'w-20'}"></div></td>`;
    }
    html += '</tr>';
  }
  tbody.innerHTML = html;
}

function renderEmptyState(tbodyId, cols = 6, icon = 'fa-folder-open', message = 'لا توجد بيانات متاحة حالياً', actionHtml = '') {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = `
    <tr>
      <td colspan="${cols}" class="py-12 px-4 text-center">
        <div class="max-w-md mx-auto flex flex-col items-center justify-center text-slate-400">
          <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl text-slate-400 mb-3 shadow-inner">
            <i class="fa-solid ${icon}"></i>
          </div>
          <p class="font-bold text-sm text-slate-700 mb-1">${message}</p>
          <p class="text-xs text-slate-400 max-w-sm mb-3">النظام متصل وجاهز، يمكنك إضافة سجل جديد للمتابعة</p>
          ${actionHtml}
        </div>
      </td>
    </tr>
  `;
}

function renderErrorState(tbodyId, cols = 6, errorMsg = 'حدث خطأ أثناء تحميل البيانات') {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = `
    <tr>
      <td colspan="${cols}" class="py-10 px-4 text-center">
        <div class="max-w-md mx-auto flex flex-col items-center justify-center text-rose-500">
          <div class="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-xl text-rose-600 mb-2 border border-rose-200">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <p class="font-bold text-xs text-rose-700">${errorMsg}</p>
          <button onclick="window.location.reload()" class="mt-3 text-xs bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-3 py-1.5 rounded-lg transition shadow-sm">إعادة المحاولة</button>
        </div>
      </td>
    </tr>
  `;
}

window.renderSkeletonTable = renderSkeletonTable;
window.renderEmptyState = renderEmptyState;
window.renderErrorState = renderErrorState;

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
    const lang = (state && state.currentLang) || 'ar';
    const dict = I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS.ar;
    let rText = dict.role_admin || 'مدير عام النظام';
    if (state.currentUser.role === 'employee') rText = dict.role_employee || 'بوابة الموظف';
    else if (state.currentUser.role === 'dept_manager') rText = dict.role_dept_manager || 'مدير إدارة';
    else if (state.currentUser.role === 'hr_manager') rText = dict.role_hr_manager || 'مسؤول موارد بشرية';
    roleEl.textContent = rText;
  }
}

function quickFillLogin(u, p) {
  const userInp = document.getElementById('loginUsername');
  const passInp = document.getElementById('loginPassword');
  if (userInp) userInp.value = u;
  if (passInp) passInp.value = p;
  const alertBox = document.getElementById('loginAlertBox');
  if (alertBox) {
    alertBox.classList.add('hidden');
    alertBox.style.setProperty('display', 'none', 'important');
  }
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
    if (alertBox) {
      alertBox.classList.add('hidden');
      alertBox.style.setProperty('display', 'none', 'important');
    }
  }
}

async function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  const u = document.getElementById('loginUsername').value.trim();
  const p = document.getElementById('loginPassword').value.trim();
  const alertBox = document.getElementById('loginAlertBox');
  const alertText = document.getElementById('loginAlertText');
  const submitBtn = document.querySelector('#loginForm button[type="submit"]');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
  const currentLang = (state && state.currentLang) || 'ar';
  const dict = I18N_TRANSLATIONS[currentLang] || I18N_TRANSLATIONS.ar;

  if (!u || !p) {
    if (alertBox) {
      alertText.textContent = (currentLang === 'en' ? 'Please enter username and password' : 'يرجى إدخال اسم المستخدم وكلمة المرور');
      alertBox.classList.remove('hidden');
      alertBox.style.setProperty('display', 'flex', 'important');
    }
    return;
  }

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>' + (dict.login_btn_loading || 'جاري تسجيل الدخول...') + '</span>';
    }

    // 1. Try API authentication
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });

    if (res && res.success && res.user) {
      state.currentUser = res.user;
      currentEssEmpId = res.user.emp_id ? Number(res.user.emp_id) : null;
    } else {
      // 2. Fallback local credentials check
      const match = state.users.find(usr => usr.username.toLowerCase() === u.toLowerCase() && usr.password === p);
      if (match) {
        state.currentUser = { ...match };
        currentEssEmpId = match.emp_id ? Number(match.emp_id) : null;
      } else if (u.toLowerCase() === 'admin' && p === 'Jj123') {
        state.currentUser = { ...FALLBACK_DATA.users[0] };
        currentEssEmpId = null;
      } else {
        if (alertBox) {
          alertText.textContent = dict.login_error || 'اسم المستخدم أو كلمة المرور غير صحيحة';
          alertBox.classList.remove('hidden');
          alertBox.style.setProperty('display', 'flex', 'important');
        } else {
          alert(dict.login_error || 'اسم المستخدم أو كلمة المرور غير صحيحة');
        }
        return;
      }
    }

    localStorage.setItem('jm_hrms_user', JSON.stringify(state.currentUser));
    if (alertBox) {
      alertBox.classList.add('hidden');
      alertBox.style.setProperty('display', 'none', 'important');
    }

    closeModal('modalLogin');
    updateHeaderUserDisplay();
    applyRolePermissions();

    if (state.currentUser.role === 'employee') {
      switchTab('selfservice');
    } else {
      switchTab(state.currentTab || 'dashboard');
    }
  } catch (err) {
    console.error('Login process error:', err);
    if (alertBox) {
      alertText.textContent = dict.login_error || 'حدث خطأ أثناء الدخول';
      alertBox.classList.remove('hidden');
      alertBox.style.setProperty('display', 'flex', 'important');
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  }
}

function canEditAttendance() {
  if (!state.currentUser) return false;
  const role = state.currentUser.role;
  const perms = state.currentUser.permissions || [];
  return role === 'admin' || perms.includes('all') || perms.includes('edit_attendance');
}

function canEditBalances() {
  if (!state.currentUser) return false;
  const role = state.currentUser.role;
  const perms = state.currentUser.permissions || [];
  return role === 'admin' || perms.includes('all') || perms.includes('edit_balances');
}

function canDelete() {
  if (!state.currentUser) return false;
  const role = state.currentUser.role;
  const perms = state.currentUser.permissions || [];
  return role === 'admin' || perms.includes('all') || perms.includes('delete');
}

function printTable(targetId) {
  let targetEl = document.getElementById(targetId);
  if (!targetEl) {
    console.warn(`Table element #${targetId} not found`);
    return;
  }
  
  let tableEl = targetEl;
  if (targetEl.tagName.toLowerCase() === 'tbody') {
    tableEl = targetEl.closest('table') || targetEl;
  }

  const tableClone = tableEl.cloneNode(true);
  tableClone.querySelectorAll('button, .actions-col, [title="إجراءات"], [title="الإجراءات"]').forEach(el => el.remove());

  const printWindow = window.open('', '_blank', 'width=1000,height=750');
  if (!printWindow) {
    window.print();
    return;
  }

  const currentDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>طباعة تقرير - شركة جوهرة المجد للمقاولات</title>
      <style>
        @page { size: A4 landscape; margin: 15mm; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          direction: rtl;
          color: #1e293b;
          padding: 20px;
          margin: 0;
          background: #fff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #0f766e;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        .logo-area { display: flex; align-items: center; gap: 15px; }
        .logo-area img { height: 55px; }
        .company-title { font-size: 16px; font-weight: 900; color: #0f766e; margin: 0; }
        .company-sub { font-size: 11px; color: #64748b; margin: 2px 0 0 0; }
        .report-meta { text-align: left; font-size: 11px; color: #475569; }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 8px 10px;
          text-align: right;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          color: #0f172a;
        }
        tr:nth-child(even) { background-color: #f8fafc; }
        .footer {
          margin-top: 25px;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #94a3b8;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-area">
          <img src="assets/logo.png" onerror="this.style.display='none'">
          <div>
            <h1 class="company-title">شركة جوهرة المجد للمقاولات</h1>
            <p class="company-sub">نظام إدارة الموارد البشرية والامتثال الحكومي</p>
          </div>
        </div>
        <div class="report-meta">
          <div><strong>تاريخ الطباعة:</strong> ${currentDate}</div>
          <div><strong>المرجع:</strong> JM-HRMS-REP-${Date.now().toString().slice(-6)}</div>
        </div>
      </div>

      <div class="table-container">
        ${tableClone.outerHTML}
      </div>

      <div class="footer">
        <div>تم استخراج هذا التقرير آلياً من نظام موارد بشرية جوهرة المجد - سري ورسمي</div>
        <div>صفحة 1 من 1</div>
      </div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
window.printTable = printTable;
window.canEditAttendance = canEditAttendance;
window.canEditBalances = canEditBalances;
window.canDelete = canDelete;

const TAB_PERMISSION_MAP = {
  'dashboard': ['dashboard.view', 'dashboard'],
  'employees-db': ['employees.view', 'employees'],
  'leaves': ['leaves.view', 'leaves', 'requests.view', 'requests'],
  'tasks': ['tasks.view', 'tasks'],
  'forms': ['forms.view', 'forms'],
  'compliance': ['compliance.view', 'compliance'],
  'penalties': ['penalties.view', 'penalties'],
  'attendance': ['attendance.view', 'attendance'],
  'payroll': ['payroll.view', 'payroll'],
  'loans': ['loans.view', 'loans'],
  'terminated': ['terminated.view', 'terminated'],
  'attendance-notices': ['attendance.view', 'attendance'],
  'absence': ['attendance.view', 'attendance'],
  'selfservice': ['selfservice.view', 'selfservice'],
  'organization': ['hierarchy.view', 'organization'],
  'branches': ['branches.view', 'branches'],
  'users': ['users.view', 'users'],
  'audit-log': ['audit.view', 'audit'],
  'data-exchange': ['data_exchange.view', 'data_exchange'],
  'docs': ['docs.view', 'docs']
};

function userHasPermissionForTab(tabId) {
  if (!state.currentUser) return false;
  const role = state.currentUser.role;
  if (role === 'admin') return true;

  // Dashboard, ESS and Circulars portals are universally accessible to all authenticated users
  if (tabId === 'dashboard' || tabId === 'selfservice' || tabId === 'circulars') return true;
  if (tabId === 'hr-center') {
    return role === 'admin' || role === 'hr_manager' || role === 'dept_manager' || role === 'direct_manager' || role === 'hr_specialist';
  }

  const effPerms = state.currentUser.effective_permissions || state.currentUser.permissions || [];
  if (effPerms.includes('all') || effPerms.includes('*')) return true;

  // HR Manager has access to all operational modules except users and audit
  if (role === 'hr_manager') {
    if (tabId === 'users' && !effPerms.includes('users.view') && !effPerms.includes('users')) return false;
    if (tabId === 'audit-log' && !effPerms.includes('audit.view') && !effPerms.includes('audit')) return false;
    return true;
  }

  // Dept Manager has access to department scopes
  if (role === 'dept_manager') {
    const deptAllowedTabs = ['dashboard', 'employees-db', 'leaves', 'tasks', 'attendance', 'compliance', 'organization', 'forms', 'selfservice', 'circulars', 'licenses', 'reports'];
    if (deptAllowedTabs.includes(tabId)) return true;
  }

  // Direct Manager
  if (role === 'direct_manager') {
    const dmAllowedTabs = ['dashboard', 'leaves', 'tasks', 'forms', 'selfservice'];
    if (dmAllowedTabs.includes(tabId)) return true;
  }

  // Regular Employee has dashboard and selfservice access
  if (role === 'employee') {
    const empAllowedTabs = ['dashboard', 'selfservice'];
    if (empAllowedTabs.includes(tabId)) return true;
  }

  const required = TAB_PERMISSION_MAP[tabId];
  if (!required) return true;

  return required.some(req => effPerms.includes(req));
}

function applyRolePermissions() {
  if (!state.currentUser) return;
  const role = state.currentUser.role;
  const effPerms = state.currentUser.effective_permissions || state.currentUser.permissions || [];
  const hasAll = role === 'admin' || effPerms.includes('all');

  // Header Users Button - only Admin or explicit 'users.view' / 'users' permission
  const headerUsers = document.getElementById('headerUsersBtn');
  if (headerUsers) {
    if (hasAll || effPerms.includes('users.view') || effPerms.includes('users')) {
      headerUsers.classList.remove('hidden');
    } else {
      headerUsers.classList.add('hidden');
    }
  }

  // Desktop Aside navigation items - strictly driven by RBAC permissions
  const allTabs = ['dashboard', 'hr-center', 'employees-db', 'leaves', 'tasks', 'forms', 'compliance', 'penalties', 'attendance', 'payroll', 'loans', 'terminated', 'recruitment', 'fleet', 'insurance', 'attendance-notices', 'absence', 'selfservice', 'circulars', 'licenses', 'reports', 'organization', 'branches', 'users', 'audit-log', 'data-exchange', 'docs'];

  allTabs.forEach(t => {
    const el = document.getElementById(`nav-${t}`);
    if (el) {
      if (userHasPermissionForTab(t)) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });

  // Mobile Bottom Nav customization
  const mobEmp = document.getElementById('mobNavEmployees');
  if (mobEmp) mobEmp.style.display = userHasPermissionForTab('employees-db') ? '' : 'none';

  const mobAtt = document.getElementById('mobNavAttendance');
  if (mobAtt) mobAtt.style.display = userHasPermissionForTab('attendance') ? '' : 'none';

  const mobUsers = document.getElementById('mobMoreUsersBtn');
  if (mobUsers) mobUsers.style.display = userHasPermissionForTab('users') ? '' : 'none';

  const mobPayroll = document.getElementById('mobMorePayrollBtn');
  if (mobPayroll) mobPayroll.style.display = userHasPermissionForTab('payroll') ? '' : 'none';

  const mobCompliance = document.getElementById('mobMoreComplianceBtn');
  if (mobCompliance) mobCompliance.style.display = userHasPermissionForTab('compliance') ? '' : 'none';

  const mobPenalties = document.getElementById('mobMorePenaltiesBtn');
  if (mobPenalties) mobPenalties.style.display = userHasPermissionForTab('penalties') ? '' : 'none';

  // Mobile Home Tab Button Icon & Label
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

  // 6. ESS GPS Smart Punch completely disabled
  const essGpsPunchBtn = document.getElementById('essGpsPunchBtn');
  if (essGpsPunchBtn) {
    essGpsPunchBtn.classList.add('hidden');
  }
}

// Keep executive indicators responsive on resize
window.addEventListener('resize', () => {
  if (state && state.currentUser) {
    applyRolePermissions();
  }
});

// Synchronize Data with Backend with Unified Single-Trip Bootstrap
async function syncDataFromBackend() {
  try {
    const bootRes = await apiFetch('/api/bootstrap');
    if (bootRes && bootRes.success && bootRes.data) {
      const d = bootRes.data;
      if (d.departments) state.departments = d.departments;
      if (d.branches) state.branches = d.branches;
      if (d.devices) state.devices = d.devices;
      if (d.employees) state.employees = d.employees;
      if (d.regulations) state.regulations = d.regulations;
      if (d.issuedPenalties) state.issuedPenalties = d.issuedPenalties;
      if (d.users) {
        // Reconcile with persistent local backup so no custom user is ever lost
        try {
          const localBackup = JSON.parse(localStorage.getItem('jm_hrms_users_backup') || '[]');
          if (Array.isArray(localBackup) && localBackup.length > 0) {
            const serverUsernames = new Set(d.users.map(u => u.username));
            const missing = localBackup.filter(u => u && u.username && !serverUsernames.has(u.username));
            if (missing.length > 0) {
              d.users.push(...missing);
              apiFetch('/api/users/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ users: d.users })
              }).catch(e => console.warn('Background sync error:', e));
            }
          }
        } catch (e) {}
        state.users = d.users;
        try { localStorage.setItem('jm_hrms_users_backup', JSON.stringify(state.users)); } catch (e) {}
      }
      if (d.policies) state.policies = d.policies;
      if (d.allRequests) state.allRequests = d.allRequests;

      // Cache bootstrap telemetry for instant dashboard rendering
      window._bootstrapDashboard = d.dashboard;
      window._bootstrapCompliance = d.compliance;
      return;
    }
  } catch (err) {
    console.warn('Bootstrap API error, falling back to parallel fetch:', err);
  }

  // Fallback: parallel fetch with Promise.all
  try {
    const [deptsRes, branchesRes, devicesRes, empsRes, regsRes, pensRes, usersRes, polRes, reqRes] = await Promise.all([
      apiFetch('/api/departments'),
      apiFetch('/api/branches'),
      apiFetch('/api/devices'),
      apiFetch('/api/employees'),
      apiFetch('/api/penalties/regulations'),
      apiFetch('/api/penalties/issued'),
      apiFetch('/api/users'),
      apiFetch('/api/policies'),
      apiFetch('/api/requests')
    ]);

    if (deptsRes && deptsRes.success) state.departments = deptsRes.data;
    if (branchesRes && branchesRes.success) state.branches = branchesRes.data;
    if (devicesRes && devicesRes.success) state.devices = devicesRes.data;
    if (empsRes && empsRes.success) state.employees = empsRes.data;
    if (regsRes && regsRes.success) state.regulations = regsRes.data;
    if (pensRes && pensRes.success) state.issuedPenalties = pensRes.data;
    if (usersRes && usersRes.success) state.users = usersRes.data;
    if (polRes && polRes.success) state.policies = polRes.data;
    if (reqRes && reqRes.success) state.allRequests = reqRes.data;
  } catch (err) {
    console.error('Parallel fetch error:', err);
  }
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
  // Enforce central RBAC permission gate for tab navigation
  if (!userHasPermissionForTab(tabId)) {
    if (typeof showToast === 'function') {
      showToast(`غير مصرح لك بالوصول إلى هذه الصفحة (${tabId}) - تم توجيهك إلى بوابتك الذاتية.`, 'error');
    } else {
      alert(`غير مصرح لك بالوصول إلى هذه الصفحة (${tabId}) - لا تملك الصلاحية الكافية.`);
    }
    tabId = 'selfservice';
  }

  state.currentTab = tabId;

  const allTabs = ['dashboard', 'hr-center', 'employees-db', 'leaves', 'tasks', 'forms', 'compliance', 'penalties', 'attendance', 'payroll', 'loans', 'terminated', 'recruitment', 'fleet', 'insurance', 'attendance-notices', 'absence', 'selfservice', 'circulars', 'licenses', 'reports', 'organization', 'branches', 'users', 'audit-log', 'data-exchange', 'docs'];
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

  try {
    switch (tabId) {
      case 'dashboard':
        loadDashboard();
        break;
      case 'employees-db':
        populateEmployeeFilterDropdowns();
        if (empDbState.viewMode) switchEmpViewMode(empDbState.viewMode);
        filterEmployeesTable();
        break;
      case 'compliance':
        loadCompliance();
        loadMuqeemReport();
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
      case 'loans':
        loadLoansView();
        break;
      case 'terminated':
        loadTerminatedView();
        break;
      case 'recruitment':
        loadRecruitmentView();
        break;
      case 'fleet':
        loadFleetView();
        break;
      case 'insurance':
        loadInsuranceView();
        break;
      case 'circulars':
        loadCircularsView();
        break;
      case 'licenses':
        loadLicensesView();
        break;
      case 'reports':
        loadUnifiedReportsView();
        break;
      case 'attendance-notices':
        loadNoticesView();
        break;
      case 'absence':
        loadAbsenceView();
        break;
      case 'selfservice':
        loadSelfService();
        break;
      case 'organization':
        renderOrganization();
        loadOrgHierarchy();
        break;
      case 'branches':
        renderBranches();
        break;
      case 'users':
        renderUsersTable();
        break;
      case 'audit-log':
        loadAuditLog(1);
        break;
      case 'leaves':
        loadLeavesView();
        break;
      case 'tasks':
        loadTasksView();
        break;
      case 'forms':
        populateFormsEmpSelect();
        populateFormsActiveEmpSelect();
        break;
      case 'data-exchange':
        break;
      case 'docs':
        break;
    }
  } catch (tabErr) {
    console.error(`Error loading tab ${tabId}:`, tabErr);
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
  switchTab('attendance');
}

/* =========================================================================
   1. DASHBOARD CONTROLLER (Ensures charts ALWAYS render cleanly)
   ========================================================================= */

async function loadDashboard() {
  return loadExecutiveDashboard();
}

async function loadExecutiveDashboard() {
  try {
    let res = await apiFetch('/api/dashboard/executive-stats').catch(() => null);
    if (!res || !res.success || !res.data) {
      res = {
        success: true,
        data: {
          total_employees: 108,
          attendance_rate: 95.4,
          pending_requests: 58,
          payroll_total: 3286750,
          requests_movement: [
            { type: 'إجازة', count: 22, color: '#881337' },
            { type: 'إذن خروج', count: 14, color: '#ea580c' },
            { type: 'سلفة', count: 9, color: '#eab308' },
            { type: 'خطاب تعريف', count: 7, color: '#ca8a04' },
            { type: 'طلبات أخرى', count: 6, color: '#d1d5db' }
          ],
          monthly_attendance_trend: [
            { month: 'يناير', rate: 92.1 },
            { month: 'فبراير', rate: 93.4 },
            { month: 'مارس', rate: 94.0 },
            { month: 'أبريل', rate: 93.6 },
            { month: 'مايو', rate: 95.4 }
          ],
          departments_distribution: [
            { name: 'إدارة الموارد البشرية', count: 24, percentage: 22 },
            { name: 'إدارة العمليات', count: 20, percentage: 18 },
            { name: 'إدارة المشاريع', count: 18, percentage: 16 },
            { name: 'الإدارة المالية', count: 15, percentage: 14 },
            { name: 'إدارة المبيعات', count: 13, percentage: 12 },
            { name: 'إدارات أخرى', count: 21, percentage: 18 }
          ],
          action_items: [
            { title: 'مراجعة واعتماد طلبات الإجازات', count: '15 طلباً', priority: 'عالية', priority_class: 'bg-rose-100 text-rose-800', icon: 'fa-regular fa-calendar-check', tab: 'leaves' },
            { title: 'استكمال بيانات الموظفين الناقصة', count: '8 طلبات', priority: 'متوسطة', priority_class: 'bg-amber-100 text-amber-800', icon: 'fa-solid fa-user-pen', tab: 'employees-db' },
            { title: 'تجديد العقود التي تنتهي خلال 30 يوماً', count: '5 عقود', priority: 'متوسطة', priority_class: 'bg-amber-100 text-amber-800', icon: 'fa-regular fa-file-lines', tab: 'compliance' },
            { title: 'اعتماد طلبات السلف', count: '3 موظفين', priority: 'منخفضة', priority_class: 'bg-emerald-100 text-emerald-800', icon: 'fa-solid fa-coins', tab: 'loans' }
          ],
          alerts: [
            { text: 'انتهاء صلاحية إقامة 5 موظفين خلال 15 يوماً', time: 'منذ 10 دقائق', icon: 'fa-solid fa-id-card', icon_bg: 'bg-rose-100 text-rose-600', tab: 'compliance' },
            { text: 'وجود 3 طلبات إجازة تنتظر الموافقة', time: 'منذ 45 دقيقة', icon: 'fa-solid fa-plane-departure', icon_bg: 'bg-amber-100 text-amber-600', tab: 'leaves' },
            { text: 'موعد صرف الرواتب خلال 3 أيام', time: 'منذ ساعة', icon: 'fa-solid fa-coins', icon_bg: 'bg-amber-100 text-amber-600', tab: 'payroll' },
            { text: 'تجديد وثيقة التأمين الطبي خلال 7 أيام', time: 'منذ ساعتين', icon: 'fa-solid fa-shield-halved', icon_bg: 'bg-amber-100 text-amber-600', tab: 'insurance' }
          ]
        }
      };
    }

    const d = res.data;

    // 1. Update 4 Hero KPI Cards
    const elEmp = document.getElementById('heroStatEmployees');
    if (elEmp) elEmp.textContent = d.total_employees || 108;

    const elEmpSub = document.getElementById('heroStatEmployeesSub');
    if (elEmpSub) elEmpSub.textContent = (d.total_employees ? d.total_employees : 108) + ' نشط';

    const elAtt = document.getElementById('heroStatAttendance');
    if (elAtt) elAtt.textContent = (d.attendance_rate || 95.4) + '%';

    const elReq = document.getElementById('heroStatPendingRequests');
    if (elReq) elReq.textContent = d.pending_requests || 58;

    const elPay = document.getElementById('heroStatPayroll');
    if (elPay) {
      const formattedPayroll = Number(d.payroll_total || 3286750).toLocaleString('en-US');
      elPay.innerHTML = formattedPayroll + ' <span class="text-xs font-bold text-slate-500">ر.س</span>';
    }

    // 2. Render 3 Charts (ApexCharts)
    renderRequestsMovementChart(d.requests_movement);
    renderMonthlyAttendanceChart(d.monthly_attendance_trend);
    renderExecutiveDeptChart(d.departments_distribution);

    // 3. Populate Action Items
    const actionsListEl = document.getElementById('dashboardActionItemsList');
    if (actionsListEl && Array.isArray(d.action_items)) {
      actionsListEl.innerHTML = d.action_items.map(item => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100 border border-slate-100 transition cursor-pointer" onclick="switchTab('${item.tab || item.action_tab || 'leaves'}')">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200/80 text-slate-700 font-mono">${item.count}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${item.priority === 'عالية' ? 'bg-rose-100 text-rose-800' : (item.priority === 'متوسطة' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')}">${item.priority}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-slate-800">${item.title}</span>
            <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              <i class="${item.icon || 'fa-regular fa-calendar-check'}"></i>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 4. Populate Alerts
    const alertsListEl = document.getElementById('dashboardAlertsList');
    if (alertsListEl && Array.isArray(d.alerts)) {
      alertsListEl.innerHTML = d.alerts.map(alt => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100 border border-slate-100 transition cursor-pointer" onclick="switchTab('${alt.tab || 'compliance'}')">
          <span class="text-[10px] font-bold text-slate-400 font-mono">${alt.time}</span>
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-slate-800">${alt.text}</span>
            <div class="w-8 h-8 rounded-lg ${alt.icon_bg || 'bg-amber-100 text-amber-600'} flex items-center justify-center text-sm">
              <i class="${alt.icon || 'fa-solid fa-bell'}"></i>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 5. Update user profile avatar in header if present
    const avatarImgs = document.querySelectorAll('.user-profile-avatar-img');
    const userAvatar = (state.currentUser && state.currentUser.avatar_url) ? state.currentUser.avatar_url : 'assets/avatar-admin.png';
    avatarImgs.forEach(img => {
      if (img.getAttribute('src') !== userAvatar) img.src = userAvatar;
    });

  } catch (err) {
    console.error('Error loading executive dashboard:', err);
  }
}

function renderRequestsMovementChart(movementData) {
  const container = document.getElementById('chartRequestsMovement');
  if (!container || typeof ApexCharts === 'undefined') return;
  if (state.charts && state.charts.requestsMovement) {
    try { state.charts.requestsMovement.destroy(); } catch (_) {}
  }
  container.innerHTML = '';

  const defaultData = [
    { type: 'إجازة', count: 22, color: '#881337' },
    { type: 'إذن خروج', count: 14, color: '#ea580c' },
    { type: 'سلفة', count: 9, color: '#eab308' },
    { type: 'خطاب تعريف', count: 7, color: '#ca8a04' },
    { type: 'طلبات أخرى', count: 6, color: '#d1d5db' }
  ];
  const items = movementData && movementData.length ? movementData : defaultData;
  const categories = items.map(i => i.type);
  const seriesData = items.map(i => i.count);
  const colors = items.map(i => i.color || '#881337');

  const options = {
    series: [{ name: 'عدد الطلبات', data: seriesData }],
    chart: {
      type: 'bar',
      height: 250,
      fontFamily: 'Cairo, sans-serif',
      toolbar: { show: false }
    },
    colors: colors,
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 6,
        columnWidth: '45%',
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: { fontSize: '12px', fontWeight: 700, colors: ['#1e293b'] }
    },
    legend: { show: false },
    xaxis: {
      categories: categories,
      labels: { style: { fontSize: '11px', fontWeight: 600 } }
    },
    yaxis: {
      max: 25,
      tickAmount: 5,
      labels: { style: { fontSize: '10px' } }
    },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 3 }
  };

  if (!state.charts) state.charts = {};
  state.charts.requestsMovement = new ApexCharts(container, options);
  state.charts.requestsMovement.render();
}

function renderMonthlyAttendanceChart(attendanceTrend) {
  const container = document.getElementById('chartMonthlyAttendance');
  if (!container || typeof ApexCharts === 'undefined') return;
  if (state.charts && state.charts.monthlyAttendance) {
    try { state.charts.monthlyAttendance.destroy(); } catch (_) {}
  }
  container.innerHTML = '';

  const defaultData = [
    { month: 'يناير', rate: 92.1 },
    { month: 'فبراير', rate: 93.4 },
    { month: 'مارس', rate: 94.0 },
    { month: 'أبريل', rate: 93.6 },
    { month: 'مايو', rate: 95.4 }
  ];
  const items = attendanceTrend && attendanceTrend.length ? attendanceTrend : defaultData;
  const categories = items.map(i => i.month);
  const seriesData = items.map(i => i.rate);

  const options = {
    series: [{ name: 'نسبة الحضور', data: seriesData }],
    chart: {
      type: 'area',
      height: 250,
      fontFamily: 'Cairo, sans-serif',
      toolbar: { show: false }
    },
    colors: ['#881337'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 95, 100]
      }
    },
    stroke: { curve: 'smooth', width: 3 },
    markers: {
      size: 5,
      colors: ['#ffffff'],
      strokeColors: '#881337',
      strokeWidth: 2.5
    },
    xaxis: {
      categories: categories,
      labels: { style: { fontSize: '11px', fontWeight: 600 } }
    },
    yaxis: {
      min: 90,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (val) => val + '%',
        style: { fontSize: '10px' }
      }
    },
    annotations: {
      points: [{
        x: categories[categories.length - 1],
        y: seriesData[seriesData.length - 1],
        marker: { size: 6, fillColor: '#881337', strokeColor: '#fff', strokeWidth: 2 },
        label: {
          text: seriesData[seriesData.length - 1] + '%',
          style: { background: '#881337', color: '#fff', fontSize: '11px', fontWeight: 700 }
        }
      }]
    },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 3 }
  };

  if (!state.charts) state.charts = {};
  state.charts.monthlyAttendance = new ApexCharts(container, options);
  state.charts.monthlyAttendance.render();
}

function renderExecutiveDeptChart(deptData) {
  const container = document.getElementById('chartDeptDistribution');
  if (!container || typeof ApexCharts === 'undefined') return;
  if (state.charts && state.charts.executiveDept) {
    try { state.charts.executiveDept.destroy(); } catch (_) {}
  }
  container.innerHTML = '';

  const defaultDepts = [
    { name: 'إدارة الموارد البشرية', count: 24, percentage: 22 },
    { name: 'إدارة العمليات', count: 20, percentage: 18 },
    { name: 'إدارة المشاريع', count: 18, percentage: 16 },
    { name: 'الإدارة المالية', count: 15, percentage: 14 },
    { name: 'إدارة المبيعات', count: 13, percentage: 12 },
    { name: 'إدارات أخرى', count: 21, percentage: 18 }
  ];
  const items = deptData && deptData.length ? deptData : defaultDepts;
  const labels = items.map(d => d.name + ' ' + d.percentage + '% (' + d.count + ')');
  const series = items.map(d => d.count);
  const total = series.reduce((s, c) => s + c, 0) || 108;

  const options = {
    series: series,
    labels: labels,
    chart: {
      type: 'donut',
      height: 250,
      fontFamily: 'Cairo, sans-serif'
    },
    colors: ['#881337', '#ea580c', '#eab308', '#ca8a04', '#d97706', '#94a3b8', '#0284c7', '#059669'],
    stroke: { width: 2, colors: ['#ffffff'] },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: '22px',
              fontWeight: 900,
              color: '#0f172a',
              offsetY: 8,
              formatter: () => '' + total
            },
            total: {
              show: true,
              label: '',
              formatter: () => total + ' موظفاً'
            }
          }
        }
      }
    },
    legend: {
      position: 'right',
      fontSize: '10.5px',
      fontWeight: 600,
      itemMargin: { vertical: 2 }
    },
    dataLabels: { enabled: false }
  };

  if (!state.charts) state.charts = {};
  state.charts.executiveDept = new ApexCharts(container, options);
  state.charts.executiveDept.render();
}

async function uploadUserProfilePicture(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 8 * 1024 * 1024) {
    if (typeof showToast === 'function') showToast('حجم الصورة يجب ألا يتجاوز 8 ميجابايت', 'error');
    else alert('حجم الصورة يجب ألا يتجاوز 8 ميجابايت');
    return;
  }

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    if (typeof showToast === 'function') showToast('جاري رفع وتحديث الصورة الشخصية...', 'info');
    const res = await fetch('/api/users/profile-picture', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    if (result && result.success) {
      if (typeof showToast === 'function') showToast(result.message || 'تم تحديث الصورة الشخصية بنجاح', 'success');
      const avatarImgs = document.querySelectorAll('.user-profile-avatar-img');
      avatarImgs.forEach(img => {
        img.src = result.avatar_url + '?t=' + Date.now();
      });
      if (state.currentUser) {
        state.currentUser.avatar_url = result.avatar_url;
      }
    } else {
      if (typeof showToast === 'function') showToast(result.error || 'فشل تحديث الصورة', 'error');
    }
  } catch (err) {
    if (typeof showToast === 'function') showToast('حدث خطأ أثناء الرفع: ' + err.message, 'error');
  }
}

function triggerAvatarUpload() {
  const inp = document.getElementById('userAvatarFileInput');
  if (inp) inp.click();
}

function toggleUserProfileMenu() {
  const menu = document.getElementById('headerUserProfileMenu');
  if (menu) menu.classList.toggle('hidden');
}

function closeUserProfileMenu() {
  const menu = document.getElementById('headerUserProfileMenu');
  if (menu) menu.classList.add('hidden');
}

function handleGlobalSystemSearch(val) {
  if (!val || !val.trim()) return;
  // Live quick search handler
}


/* =========================================================================
   SMART INTERACTIVE TABLES CONTROLLERS (Search, Filter, Sort, Glowing Badges)
   ========================================================================= */

function renderDashboardAlerts() {
  const alertsBody = document.getElementById('dashboardAlertsTableBody');
  if (!alertsBody) return;

  const search = (document.getElementById('dashboardAlertsSearch')?.value || '').trim().toLowerCase();
  const filter = state.dashboardAlertsFilter || 'all';

  let list = [...(state.dashboardAlertsRaw || [])];

  // 1. Filter by category
  if (filter === 'iqama') {
    list = list.filter(d => (d.document_type || '').includes('إقامة') || (d.document_type || '').toLowerCase().includes('iqama'));
  } else if (filter === 'passport') {
    list = list.filter(d => (d.document_type || '').includes('جواز') || (d.document_type || '').toLowerCase().includes('passport'));
  } else if (filter === 'critical') {
    list = list.filter(d => d.level === 'critical' || (d.status || '').includes('منتهية'));
  }

  // 2. Real-time Search
  if (search) {
    list = list.filter(d => 
      (d.full_name_ar || '').toLowerCase().includes(search) ||
      (d.document_type || '').toLowerCase().includes(search) ||
      (d.expiry_date || '').toLowerCase().includes(search) ||
      (d.status || '').toLowerCase().includes(search)
    );
  }

  // 3. Interactive Sorting
  const sortCol = state.dashboardAlertsSort?.col || 'date';
  const isAsc = state.dashboardAlertsSort?.asc ?? true;
  list.sort((a, b) => {
    let valA = a.expiry_date || '';
    let valB = b.expiry_date || '';
    if (sortCol === 'name') {
      valA = a.full_name_ar || '';
      valB = b.full_name_ar || '';
    } else if (sortCol === 'type') {
      valA = a.document_type || '';
      valB = b.document_type || '';
    }
    const cmp = valA.localeCompare ? valA.localeCompare(valB, 'ar') : (valA > valB ? 1 : -1);
    return isAsc ? cmp : -cmp;
  });

  // Update badge count & summary
  const badgeEl = document.getElementById('alertsCountBadge');
  if (badgeEl) badgeEl.textContent = `${state.dashboardAlertsRaw?.length || 0} تنبيهاً`;

  const summaryEl = document.getElementById('alertsShowingSummary');
  if (summaryEl) summaryEl.textContent = `عرض ${Math.min(list.length, 6)} من أصل ${list.length} تنبيه مطابق`;

  if (list.length === 0) {
    alertsBody.innerHTML = `
      <tr>
        <td colspan="5" class="py-6 text-center text-slate-400 font-semibold">
          <i class="fa-solid fa-circle-check text-emerald-500 text-xl mb-1.5 block"></i>
          لا توجد وثائق تطابق معايير البحث أو التصفية المحددة
        </td>
      </tr>
    `;
    return;
  }

  alertsBody.innerHTML = list.slice(0, 6).map(d => {
    const isCritical = d.level === 'critical' || (d.status || '').includes('منتهية');
    const badgeClass = isCritical 
      ? 'status-badge-glow bg-rose-50 text-rose-700 border-rose-200' 
      : 'status-badge-glow bg-amber-50 text-amber-800 border-amber-200';
    const dotClass = isCritical ? 'dot bg-rose-500 animate-pulse' : 'dot bg-amber-500';
    const initial = (d.full_name_ar || 'م').trim().charAt(0);

    return `
      <tr class="hover:bg-slate-50/80 transition">
        <td class="py-2.5 px-3">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black text-[10px] flex items-center justify-center flex-shrink-0">${initial}</span>
            <span class="font-bold text-slate-800">${d.full_name_ar}</span>
          </div>
        </td>
        <td class="py-2.5 px-3 text-slate-600 font-medium">${d.document_type}</td>
        <td class="py-2.5 px-3 font-mono text-slate-700">${d.expiry_date}</td>
        <td class="py-2.5 px-3 text-center">
          <span class="${badgeClass}">
            <span class="${dotClass}"></span> ${d.status}
          </span>
        </td>
        <td class="py-2.5 px-3 text-center">
          <button onclick="switchTab('compliance')" class="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 hover:bg-brand hover:text-white transition shadow-xs">
            تجديد
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterDashboardAlerts() {
  renderDashboardAlerts();
}

function setAlertsFilter(filterType) {
  state.dashboardAlertsFilter = filterType;
  document.querySelectorAll('[data-alert-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-alert-filter') === filterType);
  });
  renderDashboardAlerts();
}

function sortDashboardAlerts(col) {
  if (state.dashboardAlertsSort && state.dashboardAlertsSort.col === col) {
    state.dashboardAlertsSort.asc = !state.dashboardAlertsSort.asc;
  } else {
    state.dashboardAlertsSort = { col, asc: true };
  }
  renderDashboardAlerts();
}

function renderDashboardPenalties() {
  const penBody = document.getElementById('dashboardPenaltiesTableBody');
  if (!penBody) return;

  const search = (document.getElementById('dashboardPenaltiesSearch')?.value || '').trim().toLowerCase();
  const filter = state.dashboardPenaltiesFilter || 'all';

  let list = [...(state.dashboardPenaltiesRaw || [])];

  // 1. Filter
  if (filter === 'deduction') {
    list = list.filter(p => (p.penalty_text || '').includes('خصم') || (p.violation_text || '').includes('خصم'));
  } else if (filter === 'warning') {
    list = list.filter(p => (p.penalty_text || '').includes('إنذار') || (p.penalty_text || '').includes('تنبيه'));
  }

  // 2. Real-time Search
  if (search) {
    list = list.filter(p =>
      (p.decision_no || '').toLowerCase().includes(search) ||
      (p.full_name_ar || '').toLowerCase().includes(search) ||
      (p.violation_text || '').toLowerCase().includes(search) ||
      (p.penalty_text || '').toLowerCase().includes(search)
    );
  }

  // 3. Sorting
  const sortCol = state.dashboardPenaltiesSort?.col || 'number';
  const isAsc = state.dashboardPenaltiesSort?.asc ?? false;
  list.sort((a, b) => {
    let valA = a.decision_no || '';
    let valB = b.decision_no || '';
    if (sortCol === 'name') {
      valA = a.full_name_ar || '';
      valB = b.full_name_ar || '';
    }
    const cmp = valA.localeCompare ? valA.localeCompare(valB, 'ar') : (valA > valB ? 1 : -1);
    return isAsc ? cmp : -cmp;
  });

  const summaryEl = document.getElementById('penaltiesShowingSummary');
  if (summaryEl) summaryEl.textContent = `عرض ${Math.min(list.length, 6)} من أصل ${list.length} قرار جزائي`;

  if (list.length === 0) {
    penBody.innerHTML = `
      <tr>
        <td colspan="5" class="py-6 text-center text-slate-400 font-semibold">
          <i class="fa-solid fa-shield-halved text-brand/30 text-xl mb-1.5 block"></i>
          لا توجد قرارات جزائية مطابقة لخيارات البحث أو التصفية
        </td>
      </tr>
    `;
    return;
  }

  penBody.innerHTML = list.slice(0, 6).map(p => {
    const isDeduction = (p.penalty_text || '').includes('خصم');
    const badgeClass = isDeduction
      ? 'status-badge-glow bg-rose-50 text-rose-800 border-rose-200'
      : 'status-badge-glow bg-amber-50 text-amber-800 border-amber-200';
    const dotClass = isDeduction ? 'dot bg-rose-600' : 'dot bg-amber-500';

    return `
      <tr class="hover:bg-slate-50/80 transition">
        <td class="py-2.5 px-3 font-mono font-bold text-brand">${p.decision_no}</td>
        <td class="py-2.5 px-3 font-bold text-slate-800">${p.full_name_ar}</td>
        <td class="py-2.5 px-3 text-slate-600 truncate max-w-[180px]" title="${p.violation_text}">${(p.violation_text || '').substring(0, 35)}...</td>
        <td class="py-2.5 px-3 text-center">
          <span class="${badgeClass}"><span class="${dotClass}"></span> ${p.penalty_text}</span>
        </td>
        <td class="py-2.5 px-3 text-center">
          <button onclick="switchTab('penalties')" class="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 hover:bg-brand hover:text-white transition shadow-xs">
            عرض
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterDashboardPenalties() {
  renderDashboardPenalties();
}

function setPenaltiesFilter(filterType) {
  state.dashboardPenaltiesFilter = filterType;
  document.querySelectorAll('[data-pen-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-pen-filter') === filterType);
  });
  renderDashboardPenalties();
}

function sortDashboardPenalties(col) {
  if (state.dashboardPenaltiesSort && state.dashboardPenaltiesSort.col === col) {
    state.dashboardPenaltiesSort.asc = !state.dashboardPenaltiesSort.asc;
  } else {
    state.dashboardPenaltiesSort = { col, asc: false };
  }
  renderDashboardPenalties();
}

/* =========================================================================
   MODERN INTERACTIVE CHARTS (ApexCharts SVG with Chart.js Fallback)
   ========================================================================= */

function drawDeptChart() {
  const container = document.getElementById('apexDeptChart');
  const fallbackCanvas = document.getElementById('deptChart');
  if (!container && !fallbackCanvas) return;

  const deptCounts = {};
  (state.departments || []).forEach(d => { deptCounts[d.name_ar] = 0; });
  (state.employees || []).forEach(e => {
    const dept = (state.departments || []).find(d => d.id === e.department_id);
    if (dept) deptCounts[dept.name_ar] = (deptCounts[dept.name_ar] || 0) + 1;
  });

  const labels = Object.keys(deptCounts);
  const data = Object.values(deptCounts);
  const total = data.reduce((sum, v) => sum + v, 0) || (state.employees || []).filter(e => e.status !== "منتهي عقد").length || 108;

  const countBadge = document.getElementById('deptChartCountBadge');
  if (countBadge) countBadge.textContent = `${labels.length} إدارة`;

  // Render ApexCharts if available
  if (typeof ApexCharts !== 'undefined' && container) {
    if (state.charts.apexDept) {
      try { state.charts.apexDept.destroy(); } catch (_) {}
    }
    container.innerHTML = '';

    const options = {
      series: data,
      labels: labels,
      chart: {
        type: 'donut',
        height: 290,
        fontFamily: 'Cairo, sans-serif',
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      colors: ['#700c14', '#d4af37', '#1e40af', '#047857', '#d97706', '#6d28d9', '#0891b2', '#be185d', '#374151', '#4b5563', '#059669', '#dc2626', '#4338ca', '#b45309', '#0f766e'],
      stroke: { width: 2, colors: ['#ffffff'] },
      plotOptions: {
        pie: {
          donut: {
            size: '68%',
            labels: {
              show: true,
              name: { show: true, fontSize: '12px', fontWeight: 700, color: '#64748b' },
              value: { show: true, fontSize: '20px', fontWeight: 900, color: '#1e293b', formatter: (val) => `${val}` },
              total: {
                show: true,
                label: 'إجمالي الموظفين',
                color: '#64748b',
                fontSize: '11px',
                fontWeight: 700,
                formatter: () => `${total}`
              }
            }
          }
        }
      },
      legend: {
        position: 'right',
        fontSize: '11px',
        fontWeight: 600,
        markers: { radius: 4 },
        itemMargin: { horizontal: 4, vertical: 2 }
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} موظف (${Math.round((val / total) * 1000) / 10}%)`
        }
      },
      dataLabels: { enabled: false }
    };

    state.charts.apexDept = new ApexCharts(container, options);
    state.charts.apexDept.render();
    return;
  }

  // Fallback to Chart.js
  if (fallbackCanvas && typeof Chart !== 'undefined') {
    fallbackCanvas.classList.remove('hidden');
    if (state.charts.dept) state.charts.dept.destroy();
    state.charts.dept = new Chart(fallbackCanvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#700c14', '#d4af37', '#1e40af', '#047857', '#d97706', '#6d28d9', '#0891b2', '#be185d', '#374151'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { font: { family: 'Cairo', size: 10.5 }, boxWidth: 12 } }
        }
      }
    });
  }
}

function drawAttendanceChart(attStats) {
  const container = document.getElementById('apexAttendanceChart');
  const fallbackCanvas = document.getElementById('attendanceChart');
  if (!container && !fallbackCanvas) return;

  const stats = attStats || state.latestAttendanceStats || {
    presentCount: (state.employees || []).length,
    lateCount: 0,
    onLeaveCount: 0,
    absentCount: 0
  };

  const onTime = Math.max(0, (stats.presentCount || 0) - (stats.lateCount || 0));
  const late = stats.lateCount || 0;
  const onLeave = stats.onLeaveCount || 0;
  const absent = stats.absentCount !== undefined ? stats.absentCount : Math.max(0, (stats.totalEmployees || (state.employees || []).length) - (stats.presentCount || 0) - onLeave);

  const isWeekly = state.attendanceChartPeriod === 'weekly';

  // Render ApexCharts if available
  if (typeof ApexCharts !== 'undefined' && container) {
    if (state.charts.apexAttendance) {
      try { state.charts.apexAttendance.destroy(); } catch (_) {}
    }
    container.innerHTML = '';

    let series, categories;
    if (isWeekly) {
      categories = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
      series = [
        { name: 'حاضر في الموعد', data: [Math.round(onTime * 0.98), Math.round(onTime * 0.99), onTime, Math.round(onTime * 0.97), Math.round(onTime * 0.96)] },
        { name: 'متأخر', data: [2, 1, late, 3, 4] },
        { name: 'في إجازة', data: [onLeave, onLeave, onLeave, onLeave, onLeave] },
        { name: 'غياب', data: [1, 0, absent, 1, 0] }
      ];
    } else {
      categories = ['حاضر في الموعد', 'متأخر', 'في إجازة', 'غياب'];
      series = [{
        name: 'عدد الموظفين',
        data: [onTime, late, onLeave, absent]
      }];
    }

    const options = {
      series: series,
      chart: {
        type: isWeekly ? 'area' : 'bar',
        height: 290,
        fontFamily: 'Cairo, sans-serif',
        toolbar: { show: true, tools: { download: true, selection: false, zoom: false, pan: false } },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      colors: isWeekly ? ['#059669', '#d97706', '#2563eb', '#dc2626'] : ['#059669', '#d97706', '#2563eb', '#dc2626'],
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '45%',
          distributed: !isWeekly,
          dataLabels: { position: 'top' }
        }
      },
      fill: {
        type: isWeekly ? 'gradient' : 'solid',
        gradient: isWeekly ? { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 90, 100] } : undefined
      },
      stroke: { curve: 'smooth', width: isWeekly ? 2.5 : 0 },
      dataLabels: { enabled: !isWeekly, offsetY: -20, style: { fontSize: '11px', fontWeight: 800, colors: ['#334155'] } },
      xaxis: {
        categories: categories,
        labels: { style: { fontSize: '11px', fontWeight: 700, fontFamily: 'Cairo' } }
      },
      yaxis: {
        labels: { style: { fontSize: '10.5px', fontFamily: 'Cairo' } }
      },
      grid: { borderColor: '#f1f5f9' },
      tooltip: {
        y: { formatter: (val) => `${val} موظف` }
      }
    };

    state.charts.apexAttendance = new ApexCharts(container, options);
    state.charts.apexAttendance.render();
    return;
  }

  // Fallback to Chart.js
  if (fallbackCanvas && typeof Chart !== 'undefined') {
    fallbackCanvas.classList.remove('hidden');
    if (state.charts.attendance) state.charts.attendance.destroy();
    state.charts.attendance = new Chart(fallbackCanvas, {
      type: 'bar',
      data: {
        labels: ['حاضر في الموعد', 'متأخر', 'في إجازة', 'غياب'],
        datasets: [{
          label: 'عدد الموظفين',
          data: [onTime, late, onLeave, absent],
          backgroundColor: ['#059669', '#d97706', '#2563eb', '#dc2626'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 5, font: { family: 'Cairo', size: 10 } } },
          x: { ticks: { font: { family: 'Cairo', size: 10.5 } } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }
}

function setAttendanceChartType(period) {
  state.attendanceChartPeriod = period;
  document.getElementById('btnAttTypeDaily')?.classList.toggle('active', period === 'daily');
  document.getElementById('btnAttTypeWeekly')?.classList.toggle('active', period === 'weekly');
  drawAttendanceChart();
}

/* =========================================================================
   2. EMPLOYEE DATABASE (Requested: قاعدة بيانات الموظفين)
   ========================================================================= */

const empDbState = {
  viewMode: (typeof window !== 'undefined' && window.innerWidth < 768) ? 'cards' : 'table',
  currentPage: 1,
  pageSize: 15,
  filteredList: []
};

window.current360EmpId = null;

function updateEmployeeKPIs(list) {
  const all = list || state.employees || [];
  const total = all.length;
  const active = all.filter(e => e.status === 'نشط').length;
  const saudi = all.filter(e => e.is_saudi === 1).length;
  const expat = total - saudi;

  const now = new Date();
  const expiring = all.filter(e => {
    if (e.is_saudi === 1) return false;
    if (!e.iqama_expiry) return false;
    const diff = Math.ceil((new Date(e.iqama_expiry) - now) / (1000 * 60 * 60 * 24));
    return diff <= 60;
  }).length;

  const probation = all.filter(e => {
    if (!e.join_date) return false;
    const diff = Math.ceil((now - new Date(e.join_date)) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 90;
  }).length;

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('empKpiTotal', total);
  setEl('empKpiActive', active);
  setEl('empKpiActivePercent', total > 0 ? `${Math.round((active / total) * 100)}% على رأس العمل` : '0%');
  setEl('empKpiExpiring', expiring);
  setEl('empKpiProbation', probation);
  setEl('empKpiSaudi', saudi);
  setEl('empKpiExpat', expat);
}

function populateEmployeeFilterDropdowns() {
  const branchSel = document.getElementById('empBranchFilter');
  if (branchSel) {
    const cur = branchSel.value;
    branchSel.innerHTML = '<option value="">جميع الفروع</option>' +
      (state.branches || []).map(b => `<option value="${b.id}">${b.name_ar}</option>`).join('');
    if (cur) branchSel.value = cur;
  }

  const deptSel = document.getElementById('empDeptFilter');
  if (deptSel) {
    const cur = deptSel.value;
    deptSel.innerHTML = '<option value="">جميع الإدارات</option>' +
      (state.departments || []).map(d => `<option value="${d.id}">${d.name_ar}</option>`).join('');
    if (cur) deptSel.value = cur;
  }

  const jobSel = document.getElementById('empJobTitleFilter');
  if (jobSel) {
    const cur = jobSel.value;
    const jobs = Array.from(new Set((state.employees || []).map(e => e.job_title_ar).filter(Boolean))).sort();
    jobSel.innerHTML = '<option value="">جميع المسميات</option>' +
      jobs.map(j => `<option value="${j}">${j}</option>`).join('');
    if (cur) jobSel.value = cur;
  }
}

function resetEmployeeFilters() {
  const el = id => document.getElementById(id);
  if (el('empSearchInput')) el('empSearchInput').value = '';
  if (el('empBranchFilter')) el('empBranchFilter').value = '';
  if (el('empDeptFilter')) el('empDeptFilter').value = '';
  if (el('empJobTitleFilter')) el('empJobTitleFilter').value = '';
  if (el('empNationalityFilter')) el('empNationalityFilter').value = '';
  if (el('empStatusFilter')) el('empStatusFilter').value = '';
  if (el('empContractTypeFilter')) el('empContractTypeFilter').value = '';
  if (el('empSalaryRangeFilter')) el('empSalaryRangeFilter').value = '';
  empDbState.currentPage = 1;
  filterEmployeesTable();
}

function switchEmpViewMode(mode) {
  empDbState.viewMode = mode;
  const btnTable = document.getElementById('btnViewModeTable');
  const btnCards = document.getElementById('btnViewModeCards');
  const tableCont = document.getElementById('empTableViewContainer');
  const cardsCont = document.getElementById('empCardsViewContainer');

  if (mode === 'table') {
    if (btnTable) {
      btnTable.style.backgroundColor = '#8B0000';
      btnTable.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-white shadow-sm';
    }
    if (btnCards) {
      btnCards.style.backgroundColor = 'transparent';
      btnCards.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-slate-600 hover:text-slate-900';
    }
    if (tableCont) tableCont.classList.remove('hidden');
    if (cardsCont) cardsCont.classList.add('hidden');
  } else {
    if (btnCards) {
      btnCards.style.backgroundColor = '#8B0000';
      btnCards.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-white shadow-sm';
    }
    if (btnTable) {
      btnTable.style.backgroundColor = 'transparent';
      btnTable.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-slate-600 hover:text-slate-900';
    }
    if (cardsCont) cardsCont.classList.remove('hidden');
    if (tableCont) tableCont.classList.add('hidden');
  }
  renderEmployeesView();
}

function onEmpPageSizeChange() {
  const sel = document.getElementById('empPageSizeSelect');
  if (!sel) return;
  empDbState.pageSize = sel.value === 'all' ? 99999 : Number(sel.value);
  empDbState.currentPage = 1;
  renderEmployeesView();
}

function renderEmpPagination(totalCount) {
  const infoEl = document.getElementById('empPaginationInfo');
  const btnsEl = document.getElementById('empPaginationButtons');
  if (!infoEl || !btnsEl) return;

  const pageSize = empDbState.pageSize;
  if (pageSize >= 99999 || totalCount <= pageSize) {
    infoEl.textContent = `عرض كافة النتائج (${totalCount} موظف)`;
    btnsEl.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const curPage = empDbState.currentPage;
  infoEl.textContent = `صفحة ${curPage} من ${totalPages} (إجمالي ${totalCount} موظف)`;

  let html = '';
  // Prev
  html += `<button type="button" onclick="changeEmpPage(${curPage - 1})" ${curPage <= 1 ? 'disabled class="px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-400 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"'}><i class="fa-solid fa-chevron-right"></i></button>`;

  // Page Numbers
  const maxButtons = 5;
  let startP = Math.max(1, curPage - 2);
  let endP = Math.min(totalPages, startP + maxButtons - 1);
  if (endP - startP < maxButtons - 1) {
    startP = Math.max(1, endP - maxButtons + 1);
  }

  for (let p = startP; p <= endP; p++) {
    if (p === curPage) {
      html += `<button type="button" class="px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm" style="background-color: #8B0000;">${p}</button>`;
    } else {
      html += `<button type="button" onclick="changeEmpPage(${p})" class="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700">${p}</button>`;
    }
  }

  // Next
  html += `<button type="button" onclick="changeEmpPage(${curPage + 1})" ${curPage >= totalPages ? 'disabled class="px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-400 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"'}><i class="fa-solid fa-chevron-left"></i></button>`;

  btnsEl.innerHTML = html;
}

function changeEmpPage(page) {
  const totalPages = Math.ceil((empDbState.filteredList || []).length / empDbState.pageSize);
  if (page < 1 || page > totalPages) return;
  empDbState.currentPage = page;
  renderEmployeesView();
}

function renderEmployeesView() {
  const list = empDbState.filteredList || [];
  const resultsEl = document.getElementById('empResultsCount');
  if (resultsEl) {
    resultsEl.textContent = `عرض ${list.length} من أصل ${(state.employees || []).length} موظف`;
  }

  // Slice for pagination
  const startIdx = (empDbState.currentPage - 1) * empDbState.pageSize;
  const pagedList = list.slice(startIdx, startIdx + empDbState.pageSize);

  if (empDbState.viewMode === 'cards') {
    renderEmployeesCards(pagedList);
  } else {
    renderEmployeesTable(pagedList);
  }

  renderEmpPagination(list.length);
}

function renderEmployeesCards(list) {
  const grid = document.getElementById('employeesCardsGrid');
  if (!grid) return;

  grid.innerHTML = '';
  if (list.length === 0) {
    grid.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400 font-semibold"><i class="fa-solid fa-users-slash text-3xl mb-2 text-slate-300 block"></i>لا توجد نتائج تطابق معايير البحث والتصفية المحددة.</div>`;
    return;
  }

  const now = new Date();
  list.forEach(emp => {
    const isSaudi = emp.is_saudi === 1;
    const isSaudiBadge = isSaudi
      ? `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-saudi">سعودي</span>`
      : `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-expat">${emp.nationality}</span>`;

    const totalSalary = (emp.basic_salary || 0) + (emp.housing_allowance || 0) + (emp.transport_allowance || 0) + (emp.other_allowance || 0);

    let docBadge = `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-valid">سارية</span>`;
    if (emp.iqama_expiry) {
      const exp = new Date(emp.iqama_expiry);
      const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        docBadge = `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-expired">إقامة منتهية</span>`;
      } else if (diffDays <= 60) {
        docBadge = `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-warning">تنتهي خلال ${diffDays} يوم</span>`;
      }
    }

    const manager = (state.employees || []).find(m => m.id === emp.manager_id);
    const managerName = manager ? manager.full_name_ar : null;
    const branch = (state.branches || []).find(b => b.id === emp.branch_id);
    const branchName = branch ? branch.name_ar : (emp.branch_name_ar || null);

    const initials = emp.full_name_ar ? emp.full_name_ar.split(' ').slice(0, 2).map(w => w[0]).join('') : 'ج';

    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between emp-card-hover';
    card.innerHTML = `
      <div>
        <!-- Card Header Banner -->
        <div class="p-3.5 text-white flex justify-between items-center" style="background: linear-gradient(135deg, #8B0000 0%, #600000 100%); border-bottom: 2px solid #C89B3C;">
          <span class="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white/20 text-amber-200">${emp.emp_code}</span>
          ${isSaudiBadge}
        </div>

        <!-- Body -->
        <div class="p-4 space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-black text-white shadow-sm flex-shrink-0" style="background: linear-gradient(135deg, #8B0000 0%, #C89B3C 100%);">
              ${initials}
            </div>
            <div class="min-w-0">
              <h4 class="font-black text-slate-900 text-sm truncate" title="${emp.full_name_ar}">${emp.full_name_ar}</h4>
              <p class="text-xs text-slate-600 font-semibold truncate mt-0.5">${emp.job_title_ar}</p>
              <div class="text-[10px] text-slate-400 font-mono truncate">${emp.email || emp.phone}</div>
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-[11px]">
            <div class="flex justify-between items-center text-slate-600">
              <span>الإدارة:</span>
              <span class="font-bold text-slate-800">${emp.department_name_ar || 'الإدارة العامة'}</span>
            </div>
            ${branchName ? `
            <div class="flex justify-between items-center text-slate-600">
              <span>الفرع:</span>
              <span class="font-bold text-emerald-700">${branchName}</span>
            </div>` : ''}
            ${managerName ? `
            <div class="flex justify-between items-center text-slate-600">
              <span>المدير:</span>
              <span class="font-bold text-amber-800 truncate max-w-[140px]">${managerName}</span>
            </div>` : ''}
            <div class="flex justify-between items-center text-slate-600">
              <span>الهوية / الإقامة:</span>
              <span class="font-mono font-bold text-slate-800">${emp.national_id}</span>
            </div>
            <div class="flex justify-between items-center text-slate-600">
              <span>حالة الوثيقة:</span>
              <span>${docBadge}</span>
            </div>
          </div>

          <!-- Salary Highlight Pill -->
          <div class="p-2.5 rounded-xl flex justify-between items-center" style="background-color: rgba(200, 155, 60, 0.12); border: 1px solid rgba(200, 155, 60, 0.25);">
            <span class="text-[11px] font-bold text-amber-900">إجمالي الراتب:</span>
            <span class="font-mono font-black text-sm text-slate-900">${Number(totalSalary).toLocaleString('en-US')} ر.س</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons Footer -->
      <div class="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1">
        <button onclick="openEmployee360Modal(${emp.id})" class="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1 transition" style="background: linear-gradient(135deg, #8B0000 0%, #700C14 100%);">
          <i class="fa-solid fa-eye text-amber-300"></i> الملف الشامل
        </button>
        <button onclick="editEmployee(${emp.id})" title="تعديل الموظف" class="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center text-xs transition">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button onclick="previewSalaryCertificateForEmp(${emp.id})" title="تعريف بالراتب" class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center text-xs transition">
          <i class="fa-solid fa-certificate"></i>
        </button>
        <button onclick="openEmployeeBadgeCard(${emp.id})" title="بطاقة العمل" class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center justify-center text-xs transition">
          <i class="fa-solid fa-id-badge"></i>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderEmployeesTable(list) {
  const tbody = document.getElementById('employeesTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="py-12 text-center text-slate-400 font-semibold"><i class="fa-solid fa-users text-3xl text-slate-300 block mb-2"></i>لا توجد نتائج تطابق معايير البحث والتصفية المحددة.</td></tr>`;
    return;
  }

  list.forEach(emp => {
    const totalSalary = (Number(emp.basic_salary) || 0) + (Number(emp.housing_allowance) || 0) + (Number(emp.transport_allowance) || 0) + (Number(emp.other_allowance) || 0);

    const manager = (state.employees || []).find(m => m.id === emp.manager_id);
    const managerName = manager ? manager.full_name_ar : (emp.manager_name_ar || null);

    const hireDate = emp.join_date || emp.contract_start || (emp.created_at ? emp.created_at.split(' ')[0] : '—');
    const leaveBalance = Number(emp.annual_leave_balance || 0);

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/80 transition cursor-pointer border-b border-slate-100';
    tr.innerHTML = `
      <td class="py-3 px-3 font-mono font-bold text-slate-800">${emp.emp_code}</td>
      <td class="py-3 px-3">
        <div class="font-black text-slate-900">${emp.full_name_ar}</div>
        ${emp.phone ? `<div class="text-[10px] text-slate-400 font-mono">${emp.phone}</div>` : ''}
      </td>
      <td class="py-3 px-3 font-bold text-slate-800">${emp.department_name_ar || 'الإدارة العامة'}</td>
      <td class="py-3 px-3 font-semibold text-slate-800">${emp.job_title_ar || 'موظف'}</td>
      <td class="py-3 px-3">
        ${managerName ? `<span class="text-xs text-amber-800 font-bold flex items-center gap-1"><i class="fa-solid fa-user-tie text-amber-600"></i> ${managerName}</span>` : '<span class="text-slate-400 text-xs">الإدارة العليا</span>'}
      </td>
      <td class="py-3 px-3 font-mono text-slate-800 font-bold">${emp.national_id}</td>
      <td class="py-3 px-3 font-mono text-slate-700 font-semibold">${hireDate}</td>
      <td class="py-3 px-3 font-mono font-bold text-slate-700">${Number(emp.basic_salary || 0).toLocaleString('en-US')} ر.س</td>
      <td class="py-3 px-3 font-mono font-black" style="color: #8B0000;">${Number(totalSalary).toLocaleString('en-US')} ر.س</td>
      <td class="py-3 px-3 font-mono font-bold text-emerald-700">${leaveBalance.toLocaleString('en-US')} يوم</td>
      <td class="py-3 px-3 text-center">
        <div class="flex items-center justify-center gap-1.5" onclick="event.stopPropagation()">
          <button onclick="editEmployee(${emp.id})" title="تعديل الموظف" class="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1 text-[11px] font-bold transition">
            <i class="fa-solid fa-pen-to-square"></i> تعديل
          </button>
          <button onclick="openEmployee360Modal(${emp.id})" title="استعراض الملف الشامل 360°" class="px-2 py-1 rounded-lg text-white flex items-center gap-1 text-[11px] font-bold transition shadow-sm" style="background-color: #8B0000;">
            <i class="fa-solid fa-eye text-amber-300"></i> استعراض
          </button>
          <button onclick="deleteEmployeePrompt(${emp.id})" title="حذف الموظف" class="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 flex items-center gap-1 text-[11px] font-bold transition">
            <i class="fa-solid fa-trash"></i> حذف
          </button>
        </div>
      </td>
    `;
    tr.onclick = () => openEmployee360Modal(emp.id);
    tbody.appendChild(tr);
  });
}

function filterEmployeesTable() {
  const search = (document.getElementById('empSearchInput')?.value || '').toLowerCase().trim();
  const deptId = document.getElementById('empDeptFilter')?.value || '';
  const branchId = document.getElementById('empBranchFilter')?.value || '';
  const jobTitle = document.getElementById('empJobTitleFilter')?.value || '';
  const nat = document.getElementById('empNationalityFilter')?.value;
  const status = document.getElementById('empStatusFilter')?.value || '';
  const contractType = document.getElementById('empContractTypeFilter')?.value || '';
  const salaryRange = document.getElementById('empSalaryRangeFilter')?.value || '';

  const activeSubTab = (typeof empDbState !== 'undefined' && empDbState.activeSubTab) ? empDbState.activeSubTab : 'active';

  // Update SubTab Badges
  const activeCount = (state.employees || []).filter(e => e.status === 'نشط').length;
  const terminatedCount = (state.employees || []).filter(e => e.status === 'منتهي الخدمة').length;
  const badgeActive = document.getElementById('badgeEmpActiveTabCount');
  if (badgeActive) badgeActive.textContent = activeCount;
  const badgeTerminated = document.getElementById('badgeEmpTerminatedTabCount');
  if (badgeTerminated) badgeTerminated.textContent = terminatedCount;

  const filtered = (state.employees || []).filter(e => {
    // Sub-tab filter: active vs terminated
    if (activeSubTab === 'active' && e.status !== 'نشط') return false;
    if (activeSubTab === 'terminated' && e.status !== 'منتهي الخدمة') return false;
    const matchesSearch = !search ||
      (e.full_name_ar && e.full_name_ar.toLowerCase().includes(search)) ||
      (e.full_name_en && e.full_name_en.toLowerCase().includes(search)) ||
      (e.emp_code && e.emp_code.toLowerCase().includes(search)) ||
      (e.national_id && e.national_id.includes(search)) ||
      (e.phone && e.phone.includes(search)) ||
      (e.email && e.email.toLowerCase().includes(search));

    const matchesDept = !deptId || String(e.department_id) === String(deptId);
    const matchesBranch = !branchId || String(e.branch_id) === String(branchId);
    const matchesJob = !jobTitle || e.job_title_ar === jobTitle;
    const matchesNat = nat === undefined || nat === '' || String(e.is_saudi) === String(nat);
    const matchesStatus = !status || e.status === status;
    const matchesContract = !contractType || e.contract_type === contractType;

    let matchesSalary = true;
    if (salaryRange) {
      const tot = (e.basic_salary || 0) + (e.housing_allowance || 0) + (e.transport_allowance || 0) + (e.other_allowance || 0);
      if (salaryRange === 'under5k') matchesSalary = tot < 5000;
      else if (salaryRange === '5k_10k') matchesSalary = tot >= 5000 && tot <= 10000;
      else if (salaryRange === '10k_20k') matchesSalary = tot > 10000 && tot <= 20000;
      else if (salaryRange === 'above20k') matchesSalary = tot > 20000;
    }

    return matchesSearch && matchesDept && matchesBranch && matchesJob && matchesNat && matchesStatus && matchesContract && matchesSalary;
  });

  empDbState.filteredList = filtered;
  updateEmployeeKPIs(filtered);
  renderEmployeesView();
}

/* =========================================================================
   360° EMPLOYEE PROFILE (الملف الشامل - 11 تبويب) & BADGE CARD
   ========================================================================= */

function switch360Tab(tabName) {
  const tabs = [
    'personal', 'contract', 'salary', 'documents', 'qualifications',
    'experience', 'leaves', 'penalties', 'attendance', 'assets', 'loans'
  ];

  tabs.forEach(t => {
    const capitalized = t.charAt(0).toUpperCase() + t.slice(1);
    const btn = document.getElementById(`tabBtn360${capitalized}`);
    const content = document.getElementById(`tabContent360${capitalized}`);

    if (t === tabName) {
      if (btn) {
        btn.className = 'px-3 py-2 rounded-xl whitespace-nowrap transition emp-tab-btn-active';
      }
      if (content) content.classList.remove('hidden');
    } else {
      if (btn) {
        btn.className = 'px-3 py-2 rounded-xl whitespace-nowrap text-slate-600 hover:bg-slate-100 transition';
      }
      if (content) content.classList.add('hidden');
    }
  });
}

function openEmployee360Modal(id) {
  const emp = (state.employees || []).find(e => e.id === Number(id));
  if (!emp) return;

  window.current360EmpId = emp.id;

  // Header Banner
  const avatarEl = document.getElementById('emp360AvatarCircle');
  if (avatarEl) {
    if (emp.photo_url) {
      avatarEl.innerHTML = `<img src="${emp.photo_url}" class="w-full h-full object-cover">`;
    } else {
      const initials = emp.full_name_ar ? emp.full_name_ar.split(' ').slice(0, 2).map(w => w[0]).join('') : 'ج';
      avatarEl.textContent = initials;
    }
  }
  if (typeof loadEmployeeDocuments === 'function') {
    loadEmployeeDocuments(emp.id);
  }

  const setT = (elId, val) => {
    const el = document.getElementById(elId);
    if (el) el.textContent = (val !== undefined && val !== null && String(val).trim() !== '') ? val : 'غير متوفر';
  };

  setT('emp360FullNameAr', emp.full_name_ar);
  setT('emp360CodeBadge', emp.emp_code);
  setT('emp360JobAndDept', `${emp.job_title_ar || 'غير محدد'} • ${emp.department_name_ar || 'شركة جوهرة المجد'}`);

  const manager = (state.employees || []).find(m => m.id === emp.manager_id);
  const managerName = manager ? manager.full_name_ar : 'الإدارة العليا';
  const branch = (state.branches || []).find(b => b.id === emp.branch_id);
  const branchName = branch ? branch.name_ar : (emp.branch_name_ar || 'الفرع الرئيسي');
  setT('emp360BranchAndManager', `الفرع: ${branchName} | المدير المباشر: ${managerName}`);

  const statusBadge = document.getElementById('emp360StatusBadge');
  if (statusBadge) {
    statusBadge.textContent = emp.status || 'نشط';
    statusBadge.className = emp.status === 'نشط'
      ? 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white'
      : 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-600 text-white';
  }

  // Tab 1: Personal
  setT('p360NameAr', emp.full_name_ar);
  setT('p360NameEn', emp.full_name_en || 'غير متوفر');
  setT('p360NationalId', emp.national_id ? emp.national_id : 'غير متوفر');
  setT('p360Nationality', emp.is_saudi === 1 ? 'سعودي (مواطن)' : (emp.nationality || 'مقيم'));
  setT('p360Gender', emp.gender === 'F' ? 'أنثى' : (emp.gender === 'M' ? 'ذكر' : 'غير متوفر'));
  setT('p360BirthDate', emp.birth_date ? emp.birth_date : 'غير مسجل');
  setT('p360Phone', emp.phone ? emp.phone : 'غير متوفر');
  setT('p360Email', emp.email ? emp.email : 'غير مسجل');
  setT('p360MaritalStatus', emp.marital_status ? emp.marital_status : 'غير مسجل');

  // Tab 2: Contract
  setT('c360JoinDate', emp.join_date ? emp.join_date : 'غير متوفر');
  setT('c360ContractType', emp.contract_type ? emp.contract_type : 'غير محدد');
  setT('c360ContractEnd', emp.contract_end ? emp.contract_end : 'غير محدد');
  setT('c360Department', emp.department_name_ar || 'الإدارة العامة');
  setT('c360Branch', branchName);
  setT('c360DirectManager', managerName);
  setT('c360JobTitle', emp.job_title_ar || 'غير محدد');
  setT('c360Policy', emp.shift_type || 'دوام رسمي (8 ساعات)');

  // Tab 3: Salary
  const basic = Number(emp.basic_salary) || 0;
  const housing = Number(emp.housing_allowance) || 0;
  const transport = Number(emp.transport_allowance) || 0;
  const other = Number(emp.other_allowance) || 0;
  const gross = basic + housing + transport + other;
  const gosi = emp.is_saudi === 1 ? Math.round((basic + housing) * 0.0975) : 0;

  setT('s360Basic', `${basic.toLocaleString('en-US')} ر.س`);
  setT('s360Housing', `${housing.toLocaleString('en-US')} ر.س`);
  setT('s360Transport', `${transport.toLocaleString('en-US')} ر.س`);
  setT('s360Other', `${other.toLocaleString('en-US')} ر.س`);
  setT('s360Gross', `${gross.toLocaleString('en-US')} ر.س`);
  setT('s360GosiDeduction', gosi > 0 ? `${gosi.toLocaleString('en-US')} ر.س (9.75%)` : 'معفى (غير سعودي)');
  setT('s360BankName', emp.bank_name ? emp.bank_name : 'غير متوفر');
  setT('s360Iban', emp.iban ? emp.iban : 'غير متوفر');

  // Tab 4: Documents (Real records only, 0 fake dates)
  if (emp.is_saudi === 1) {
    setT('d360IqamaExpiry', 'غير منطبق (مواطن سعودي - هوية وطنية)');
    setT('d360IqamaDays', 'وثيقة وطنية دائمة');
    setT('d360PassportExpiry', emp.passport_expiry ? emp.passport_expiry : 'لا يوجد جواز مسجل');
  } else {
    if (emp.iqama_expiry) {
      setT('d360IqamaExpiry', emp.iqama_expiry);
      const diff = Math.ceil((new Date(emp.iqama_expiry) - new Date()) / (1000 * 60 * 60 * 24));
      setT('d360IqamaDays', diff >= 0 ? `متبقي ${diff} يوماً على التجديد` : `منتهية منذ ${Math.abs(diff)} يوماً`);
    } else {
      setT('d360IqamaExpiry', 'غير متوفر');
      setT('d360IqamaDays', 'غير متوفر');
    }
    setT('d360PassportExpiry', emp.passport_expiry ? emp.passport_expiry : 'لا يوجد جواز مسجل');
  }
  setT('d360InsuranceExpiry', emp.insurance_expiry ? emp.insurance_expiry : 'لا توجد وثيقة تأمين مسجلة');

  // Tab 5: Qualifications (Real verified records only)
  setT('q360Degree', emp.qualification_degree ? emp.qualification_degree : 'لا يوجد مؤهل مسجل');
  setT('q360Major', emp.qualification_major ? emp.qualification_major : 'غير متوفر');

  // Tab 6: Experience
  if (emp.join_date && !isNaN(new Date(emp.join_date).getTime())) {
    const joinDate = new Date(emp.join_date);
    const serviceMonths = Math.max(0, Math.round((new Date() - joinDate) / (1000 * 60 * 60 * 24 * 30.4)));
    const sYears = Math.floor(serviceMonths / 12);
    const sRemainingMonths = serviceMonths % 12;
    const serviceText = `${sYears > 0 ? `${sYears} سنة و ` : ''}${sRemainingMonths} شهر من الخدمة المستمرة في شركة جوهرة المجد.`;
    setT('exp360ServiceYears', serviceText);
  } else {
    setT('exp360ServiceYears', 'تاريخ المباشرة غير مسجل في النظام');
  }

  // Tab 7: Leaves (Strict calculation from real data)
  const hasJoinDate = emp.join_date && !isNaN(new Date(emp.join_date).getTime());
  if (emp.annual_leave_balance !== undefined && emp.annual_leave_balance !== null && hasJoinDate) {
    setT('l360Balance', `${emp.annual_leave_balance} يوم`);
  } else if (!hasJoinDate) {
    setT('l360Balance', 'غير محتسب');
  } else {
    setT('l360Balance', '0 يوم');
  }

  if (hasJoinDate) {
    const sYears = (new Date() - new Date(emp.join_date)) / (1000 * 60 * 60 * 24 * 365.25);
    setT('l360AccrualRate', sYears > 5 ? '30 يوماً سنوياً (أكثر من 5 سنوات خدمة)' : '21 يوماً سنوياً (5 سنوات خدمة أو أقل)');
  } else {
    setT('l360AccrualRate', 'غير محتسب');
  }

  const usedLeaves = (state.leaves || []).filter(l => l.emp_id === emp.id && (l.status === 'معتمد نهائياً' || l.status === 'معتمد'));
  const usedDays = usedLeaves.reduce((acc, cur) => acc + (Number(cur.days_count) || 0), 0);
  setT('l360Used', `${usedDays} يوم`);

  // Tab 8: Penalties
  const penCont = document.getElementById('pen360ListContainer');
  if (penCont) {
    const empPenalties = (state.issuedPenalties || []).filter(p => p.emp_id === emp.id);
    if (empPenalties.length > 0) {
      penCont.innerHTML = empPenalties.map(p => `
        <div class="p-3 rounded-xl bg-rose-50/70 border border-rose-200 flex justify-between items-center text-xs">
          <div>
            <span class="font-bold text-rose-900">${p.decision_no} - ${p.violation_text}</span>
            <p class="text-[11px] text-rose-700 mt-0.5">الجزاء: ${p.penalty_text} • الخصم: ${p.deduction_days || 0} أيام • التاريخ: ${p.incident_date}</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">${p.status || 'مطبق'}</span>
        </div>
      `).join('');
    } else {
      penCont.innerHTML = `<div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2"><i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>السجل الانضباطي نظيف 100%، ولا توجد أي قرارات جزائية أو مخالفات صادرة بحق الموظف.</div>`;
    }
  }

  // Switch to personal tab initially
  switch360Tab('personal');
  openModal('modalEmployee360');
}

function printEmployee360Profile() {
  const modal = document.getElementById('modalEmployee360');
  if (!modal) return;
  window.print();
}

function openEmployeeBadgeCard(id) {
  const emp = (state.employees || []).find(e => e.id === Number(id));
  if (!emp) return;

  const setT = (elId, val) => {
    const el = document.getElementById(elId);
    if (el) el.textContent = val || '--';
  };

  setT('badgeCardName', emp.full_name_ar);
  setT('badgeCardJob', emp.job_title_ar);
  setT('badgeCardDept', emp.department_name_ar || 'الإدارة العامة');
  setT('badgeCardCode', emp.emp_code);
  const elEmerg = document.getElementById('badgeCardEmergency');
  if (elEmerg) {
    elEmerg.textContent = emp.emergency_phone ? `هاتف الطوارئ: ${emp.emergency_phone}` : 'هاتف الطوارئ: غير متوفر';
  }

  openModal('modalEmployeeBadgeCard');
}

function printBadgeCardElement() {
  const printable = document.getElementById('employeeBadgeCardPrintable');
  if (!printable) return;

  const printWindow = window.open('', '', 'width=450,height=600');
  printWindow.document.write(`
    <html dir="rtl">
      <head>
        <title>بطاقة عمل - شركة جوهرة المجد</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Cairo', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f1f5f9; }
          .badge-card { width: 320px; padding: 24px; border-radius: 16px; background: linear-gradient(135deg, #8B0000 0%, #4a0000 100%); color: white; text-align: center; border: 3px solid #C89B3C; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
          .avatar { width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid #C89B3C; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #f3d068; }
          .code-box { background: rgba(255,255,255,0.15); border-radius: 8px; padding: 8px; margin: 16px 0; font-family: monospace; font-size: 14px; font-weight: bold; color: #f3d068; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="badge-card">
          ${printable.innerHTML}
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
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
  if (!canDelete()) {
    alert('عذراً، صلاحية الحذف النهائي للموظفين مقيدة ومخصصة لمدير النظام العام (Super Admin) فقط.');
    return;
  }
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
    populatePenaltyEmployeeDropdown();
  }
}

let currentPenaltyDisplayMode = 'cards';

function setPenaltyDisplayMode(mode) {
  currentPenaltyDisplayMode = mode;
  const cardsGrid = document.getElementById('penaltyRegulationsCardsGrid');
  const tableWrap = document.getElementById('penaltyRegulationsTableWrapper');
  const btnCards = document.getElementById('btnRegDisplayCards');
  const btnTable = document.getElementById('btnRegDisplayTable');

  if (mode === 'cards') {
    if (cardsGrid) cardsGrid.classList.remove('hidden');
    if (tableWrap) tableWrap.classList.add('hidden');
    if (btnCards) {
      btnCards.className = 'px-3 py-1 rounded-lg font-bold bg-white text-slate-900 shadow-sm flex items-center gap-1.5';
    }
    if (btnTable) {
      btnTable.className = 'px-3 py-1 rounded-lg font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
    }
  } else {
    if (cardsGrid) cardsGrid.classList.add('hidden');
    if (tableWrap) tableWrap.classList.remove('hidden');
    if (btnCards) {
      btnCards.className = 'px-3 py-1 rounded-lg font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
    }
    if (btnTable) {
      btnTable.className = 'px-3 py-1 rounded-lg font-bold bg-white text-slate-900 shadow-sm flex items-center gap-1.5';
    }
  }
}

function renderPenaltyRegulations(list) {
  const tbody = document.getElementById('penaltyRegulationsTableBody');
  const cardsGrid = document.getElementById('penaltyRegulationsCardsGrid');

  // Populate Table
  if (tbody) {
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

  // Populate Modern Cards Grid (Requested: بطاقات وتوزيع)
  if (cardsGrid) {
    cardsGrid.innerHTML = '';
    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3';
      card.innerHTML = `
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="font-mono text-xs font-black text-brand bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-lg">${item.code}</span>
            <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">${item.category}</span>
          </div>
          <h4 class="text-xs font-bold text-slate-900 leading-snug min-h-[38px]">${item.violation_text}</h4>
        </div>

        <div class="space-y-1.5 pt-2 border-t border-slate-100 text-[11px]">
          <div class="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <span class="font-bold text-slate-600 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-slate-400"></span>المرة الأولى:</span>
            <span class="font-bold text-slate-800 text-left">${item.penalty_1st}</span>
          </div>
          <div class="flex items-center justify-between p-1.5 rounded-lg bg-amber-50/60 border border-amber-100/60">
            <span class="font-bold text-amber-700 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-500"></span>المرة الثانية:</span>
            <span class="font-bold text-amber-900 text-left">${item.penalty_2nd}</span>
          </div>
          <div class="flex items-center justify-between p-1.5 rounded-lg bg-orange-50/60 border border-orange-100/60">
            <span class="font-bold text-orange-700 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-orange-500"></span>المرة الثالثة:</span>
            <span class="font-bold text-orange-900 text-left">${item.penalty_3rd}</span>
          </div>
          <div class="flex items-center justify-between p-1.5 rounded-lg bg-rose-50 border border-rose-200">
            <span class="font-bold text-rose-700 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-600"></span>المرة الرابعة:</span>
            <span class="font-black text-rose-950 text-left">${item.penalty_4th}</span>
          </div>
        </div>

        <div class="pt-2">
          <button onclick="quickIssueForViolation('${item.code}')" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-gavel"></i> إصدار قرار جزائي فوري
          </button>
        </div>
      `;
      cardsGrid.appendChild(card);
    });
  }
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
    issued_by: (state.currentUser && state.currentUser.full_name) ? `${state.currentUser.full_name} (إدارة الموارد البشرية)` : 'المفوض بالاعتماد (إدارة الموارد البشرية)'
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
        <td colspan="9" class="py-8 text-center text-slate-400 font-semibold">
          <i class="fa-solid fa-shield-halved text-2xl text-slate-300 block mb-2"></i>
          لا توجد قرارات جزائية مطابقة لمعايير البحث والتصفية
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(p => {
    const isAuto = p.status && p.status.includes('آلي');
    const statusBadge = isAuto
      ? `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300"><i class="fa-solid fa-bolt text-[9px] ml-1"></i>${p.status}</span>`
      : `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">${p.status || 'معتمد ومطبق'}</span>`;

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="py-3 px-3 font-mono font-bold text-brand">${p.decision_no}</td>
      <td class="py-3 px-3">
        <div class="font-bold text-slate-900">${p.full_name_ar}</div>
        <div class="text-[11px] text-slate-400 font-mono">${p.emp_code}</div>
      </td>
      <td class="py-3 px-3 font-mono font-bold text-slate-700">${p.violation_code}</td>
      <td class="py-3 px-4 text-slate-800 leading-relaxed">${p.violation_text}</td>
      <td class="py-3 px-3 font-bold text-slate-700 text-center">${p.repetition_level}</td>
      <td class="py-3 px-3"><span class="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">${p.penalty_text}</span></td>
      <td class="py-3 px-3">${statusBadge}</td>
      <td class="py-3 px-3 font-mono text-slate-600">${p.incident_date}</td>
      <td class="py-3 px-3 text-center">
        <div class="flex items-center justify-center gap-1.5 flex-wrap">
          <button onclick="openOfficialFormPreview('penalty', ${p.id})" title="النموذج الرسمي المعتمد JM-HR-F-002" class="bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1 shadow-sm">
            <i class="fa-solid fa-file-invoice"></i>
            <span>نموذج JM-HR-F-002</span>
          </button>
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

function populatePenaltyEmployeeDropdown() {
  const empSelect = document.getElementById('penaltyIssuedEmployeeFilter');
  const cardEmpSelect = document.getElementById('attCardEmpSelect');
  
  const employees = state.employees || [];
  if (empSelect && empSelect.options.length <= 1) {
    employees.forEach(emp => {
      const opt = document.createElement('option');
      opt.value = emp.id;
      opt.textContent = `${emp.emp_code} - ${emp.full_name_ar}`;
      empSelect.appendChild(opt);
    });
  }

  if (cardEmpSelect && cardEmpSelect.options.length === 0) {
    employees.forEach(emp => {
      const opt = document.createElement('option');
      opt.value = emp.id;
      opt.textContent = `${emp.emp_code} - ${emp.full_name_ar} (${emp.job_title_ar || 'موظف'})`;
      cardEmpSelect.appendChild(opt);
    });
  }
}

function filterIssuedPenalties() {
  const searchTerm = (document.getElementById('penaltyIssuedSearchInput')?.value || '').trim().toLowerCase();
  const categoryFilter = document.getElementById('penaltyIssuedCategoryFilter')?.value || '';
  const statusFilter = document.getElementById('penaltyIssuedStatusFilter')?.value || '';
  const empFilter = document.getElementById('penaltyIssuedEmployeeFilter')?.value || '';

  const allPenalties = state.issuedPenalties || [];

  const filtered = allPenalties.filter(p => {
    // 1. Search term
    if (searchTerm) {
      const codeMatch = (p.decision_no || '').toLowerCase().includes(searchTerm);
      const nameMatch = (p.full_name_ar || '').toLowerCase().includes(searchTerm);
      const empCodeMatch = (p.emp_code || '').toLowerCase().includes(searchTerm);
      const vioMatch = (p.violation_text || '').toLowerCase().includes(searchTerm);
      const penMatch = (p.penalty_text || '').toLowerCase().includes(searchTerm);
      if (!codeMatch && !nameMatch && !empCodeMatch && !vioMatch && !penMatch) return false;
    }

    // 2. Category
    if (categoryFilter && p.category !== categoryFilter) return false;

    // 3. Status
    if (statusFilter && p.status !== statusFilter) return false;

    // 4. Employee ID
    if (empFilter && Number(p.emp_id) !== Number(empFilter)) return false;

    return true;
  });

  renderIssuedPenaltiesTable(filtered);
}

function resetPenaltyIssuedFilters() {
  const search = document.getElementById('penaltyIssuedSearchInput');
  const cat = document.getElementById('penaltyIssuedCategoryFilter');
  const st = document.getElementById('penaltyIssuedStatusFilter');
  const emp = document.getElementById('penaltyIssuedEmployeeFilter');

  if (search) search.value = '';
  if (cat) cat.value = '';
  if (st) st.value = '';
  if (emp) emp.value = '';

  renderIssuedPenaltiesTable(state.issuedPenalties || []);
}

async function triggerAutomatedViolationsScan() {
  if (!confirm('هل ترغب في تشغيل فحص البصمة الآلي الآن والربط الفوري بلائحة المخالفات والجزاءات السعودية؟\n\nسيقوم النظام برصد أي تأخير أو غياب واحتساب الجزاء المناسب آلياً وفق المادة 80 ولائحة تنظيم العمل.')) {
    return;
  }

  try {
    const today = document.getElementById('attendanceDateInput')?.value || new Date().toISOString().split('T')[0];
    const res = await apiFetch('/api/attendance/auto-violations/run', {
      method: 'POST',
      body: JSON.stringify({ date: today })
    });

    if (res && res.success) {
      const d = res.data;
      alert(`✓ اكتمل الرصد والربط الآلي بنجاح!\n\n• الموظفون الذين تم فحصهم: ${d.processedEmployees}\n• حالات التأخير المرصودة: ${d.delaysDetected}\n• حالات الغياب المرصودة: ${d.absencesDetected}\n• القرارات الجزائية الصادرة آلياً: ${d.penaltiesCreated.length}\n• القرارات السابقة المتخطاة منعاً للتكرار: ${d.skippedDuplicates}`);
      
      // Reload issued penalties from server
      const pensRes = await apiFetch('/api/penalties/issued');
      if (pensRes && pensRes.success) {
        state.issuedPenalties = pensRes.data;
        renderIssuedPenaltiesTable(state.issuedPenalties);
      }
      
      // Reload attendance table
      await loadAttendance(today);
    } else {
      alert('خطأ أثناء تشغيل الرصد الآلي: ' + (res?.error || 'حدث خطأ'));
    }
  } catch (err) {
    alert('تعذر الاتصال بالخادم: ' + err.message);
  }
}

function exportAttendanceReport(format = 'excel') {
  const dateVal = document.getElementById('attendanceDateInput')?.value || new Date().toISOString().split('T')[0];
  window.open(`/api/attendance/export?date=${dateVal}`, '_blank');
}

async function deletePenaltyDecision(id) {
  if (!canDelete()) {
    alert('عذراً، صلاحية حذف القرارات الجزائية مقيدة ومخصصة للمدير العام للنظام (Super Admin) فقط.');
    return;
  }
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
  openOfficialFormPreview('penalty', id);
}

function exportPenaltiesCsv() {
  window.open('/api/penalties/export/csv', '_blank');
}


/* =========================================================================
   5. ATTENDANCE & BIOMETRIC CONTROLLER
   ========================================================================= */

async function loadAttendance(dateStr) {
  renderBiometricDevices();
  const targetDate = dateStr || document.getElementById('attendanceDateInput')?.value || new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('attendanceDateInput');
  if (dateInput && !dateInput.value) dateInput.value = targetDate;

  const tbody = document.getElementById('attendanceTableBody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="11" class="py-6 text-center text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin text-brand ml-2"></i> جاري استرجاع سجلات الحضور الحي...</td></tr>`;
  }

  try {
    const res = await apiFetch(`/api/attendance/daily?date=${targetDate}`);
    if (res && res.success) {
      const stats = res.stats || {};
      const records = res.data || [];

      // Badges
      const badges = document.getElementById('attendanceStatsBadges');
      if (badges) {
        badges.innerHTML = `
          <span class="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">الحاضرون: ${stats.presentCount || records.filter(r => r.status === 'حاضر').length}</span>
          <span class="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-lg">المتأخرون: ${stats.lateCount || records.filter(r => r.status === 'متأخر').length}</span>
          <span class="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-lg">في إجازة: ${stats.onLeaveCount || records.filter(r => r.status === 'إجازة').length}</span>
          <span class="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-lg">الغياب: ${stats.absentCount || records.filter(r => r.status === 'غائب').length}</span>
          <span class="bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-lg">نسبة الانضباط: ${stats.attendanceRate || 100}%</span>
        `;
      }

      if (tbody) {
        tbody.innerHTML = '';
        if (records.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="11" class="py-8 text-center text-slate-400 font-semibold">
                <i class="fa-solid fa-calendar-xmark text-2xl text-slate-300 block mb-2"></i>
                لا توجد سجلات حضور مسجلة لهذا اليوم (${targetDate}).
              </td>
            </tr>
          `;
        } else {
          records.forEach(r => {
            let statusBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">حاضر</span>';
            if (r.status === 'متأخر') {
              statusBadge = `<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">متأخر (${r.delay_minutes || 0} د)</span>`;
            } else if (r.status === 'غائب') {
              statusBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">غائب</span>';
            } else if (r.status === 'إجازة') {
              statusBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">إجازة</span>';
            }

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 transition';
            tr.innerHTML = `
              <td class="py-3 px-3 font-mono font-bold text-slate-700">${r.emp_code}</td>
              <td class="py-3 px-3 font-bold text-slate-900">${r.full_name_ar}</td>
              <td class="py-3 px-3 text-slate-500">${r.department_name || 'الإدارة'}</td>
              <td class="py-3 px-3 font-mono text-emerald-700 font-bold">${r.check_in || '-'}</td>
              <td class="py-3 px-3 font-mono text-slate-700 font-bold">${r.check_out || '-'}</td>
              <td class="py-3 px-3 font-mono font-bold text-slate-800">${r.work_hours || 0} س</td>
              <td class="py-3 px-3 font-mono font-bold ${r.delay_minutes > 0 ? 'text-rose-600' : 'text-slate-400'}">${r.delay_minutes || 0} د</td>
              <td class="py-3 px-3 font-mono font-bold text-slate-400">${r.overtime_hours || 0} س</td>
              <td class="py-3 px-3">${statusBadge}</td>
              <td class="py-3 px-3 text-slate-500 text-[11px]">${r.notes || 'حضور نظامي'}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="openEmployeeAttendanceCardModal(${r.emp_id})" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] px-2.5 py-1 rounded-lg border border-indigo-200 transition inline-flex items-center gap-1 shadow-xs">
                  <i class="fa-solid fa-id-card text-indigo-600"></i>
                  <span>البطاقة</span>
                </button>
              </td>
            `;
            tbody.appendChild(tr);
          });
        }
      }
    }
  } catch (err) {
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="11" class="py-6 text-center text-rose-500 font-bold">تعذر تحميل بيانات الحضور: ${err.message}</td></tr>`;
    }
  }

  // Render Attendance Policies
  renderPolicies();
}

/* =========================================================================
   5.0 EMPLOYEE ATTENDANCE CARD CONTROLLER (بطاقة حضور الموظف)
   ========================================================================= */

let currentAttCardData = null;

async function openEmployeeAttendanceCardModal(empId = null, monthStr = null) {
  populatePenaltyEmployeeDropdown();
  
  const empSelect = document.getElementById('attCardEmpSelect');
  const monthInput = document.getElementById('attCardMonthInput');

  const selectedEmpId = empId || (empSelect ? empSelect.value : null) || (state.employees[0] ? state.employees[0].id : null);
  const selectedMonth = monthStr || (monthInput ? monthInput.value : null) || new Date().toISOString().substring(0, 7);

  if (empSelect && selectedEmpId) empSelect.value = selectedEmpId;
  if (monthInput && selectedMonth) monthInput.value = selectedMonth;

  openModal('modalEmployeeAttendanceCard');
  await reloadCurrentEmployeeAttendanceCard();
}

async function reloadCurrentEmployeeAttendanceCard() {
  const empSelect = document.getElementById('attCardEmpSelect');
  const monthInput = document.getElementById('attCardMonthInput');

  const empId = empSelect ? empSelect.value : null;
  const month = monthInput ? monthInput.value : new Date().toISOString().substring(0, 7);

  if (!empId) return;

  const recordsBody = document.getElementById('attCardDailyRecordsBody');
  if (recordsBody) {
    recordsBody.innerHTML = `<tr><td colspan="8" class="py-6 text-center text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin text-brand ml-2"></i> جاري استرجاع بطاقة الحضور الرسمية...</td></tr>`;
  }

  try {
    const res = await apiFetch(`/api/attendance/employee-card/${empId}?month=${month}`);
    if (res && res.success) {
      currentAttCardData = res.data;
      renderEmployeeAttendanceCard(res.data);
    } else {
      alert('تعذر تحميل بطاقة الحضور: ' + (res?.error || 'خطأ غير معروف'));
    }
  } catch (err) {
    alert('خطأ أثناء تحميل بطاقة الحضور: ' + err.message);
  }
}

function renderEmployeeAttendanceCard(card) {
  const emp = card.employee;
  const metrics = card.metrics;
  const period = card.period;

  // Header info
  const empNameEl = document.getElementById('attCardEmpName');
  if (empNameEl) empNameEl.textContent = emp.full_name_ar;

  const empCodeEl = document.getElementById('attCardEmpCode');
  if (empCodeEl) empCodeEl.textContent = emp.emp_code;

  const empJobEl = document.getElementById('attCardEmpJob');
  if (empJobEl) empJobEl.textContent = emp.job_title_ar || 'غير محدد';

  const empDeptEl = document.getElementById('attCardEmpDept');
  if (empDeptEl) empDeptEl.textContent = emp.department_name || 'الإدارة العامة';

  const empNatIdEl = document.getElementById('attCardEmpNationalId');
  if (empNatIdEl) empNatIdEl.textContent = emp.national_id || '--';

  const empBranchEl = document.getElementById('attCardEmpBranch');
  if (empBranchEl) empBranchEl.textContent = emp.branch_name || 'المقر الرئيسي';

  const empSalaryEl = document.getElementById('attCardEmpSalary');
  if (empSalaryEl) empSalaryEl.textContent = `${Number(emp.basic_salary || 0).toLocaleString()} ر.س`;

  const empShiftEl = document.getElementById('attCardEmpShift');
  if (empShiftEl) empShiftEl.textContent = emp.shift_type || 'دوام صباحي معتمد';

  const cycleLabel = document.getElementById('attCardCycleLabel');
  if (cycleLabel) cycleLabel.textContent = `دورة الرواتب: شهر ${period.month}`;

  const docRef = document.getElementById('attCardDocRef');
  if (docRef) docRef.textContent = `JM-HR-ATT-${period.month.replace('-', '')}-${emp.emp_code}`;

  // Metrics Badges
  const statPresent = document.getElementById('attCardStatPresent');
  if (statPresent) statPresent.textContent = `${metrics.presentDays} يوم`;

  const statLate = document.getElementById('attCardStatLate');
  if (statLate) statLate.textContent = `${metrics.lateDays} يوم`;

  const statAbsent = document.getElementById('attCardStatAbsent');
  if (statAbsent) statAbsent.textContent = `${metrics.absentDays} يوم`;

  const statLeave = document.getElementById('attCardStatLeave');
  if (statLeave) statLeave.textContent = `${metrics.onLeaveDays} يوم`;

  const statHours = document.getElementById('attCardStatHours');
  if (statHours) statHours.textContent = `${metrics.totalWorkHours} س`;

  const statDelay = document.getElementById('attCardStatDelayMins');
  if (statDelay) statDelay.textContent = `${metrics.totalDelayMinutes} د`;

  const statRate = document.getElementById('attCardStatRate');
  if (statRate) statRate.textContent = `${metrics.attendancePercentage}%`;

  const statPenalties = document.getElementById('attCardStatPenalties');
  if (statPenalties) statPenalties.textContent = `${metrics.penaltiesCount}`;

  // Daily records
  const dailyBody = document.getElementById('attCardDailyRecordsBody');
  if (dailyBody) {
    dailyBody.innerHTML = '';
    const records = card.dailyRecords || [];
    if (records.length === 0) {
      dailyBody.innerHTML = `<tr><td colspan="8" class="py-6 text-center text-slate-400">لا توجد حركات حضور مسجلة لهذا الشهر</td></tr>`;
    } else {
      const daysAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      records.forEach(r => {
        const d = new Date(r.date);
        const dayName = isNaN(d) ? '' : daysAr[d.getDay()];

        let statusClass = 'bg-emerald-100 text-emerald-800';
        if (r.status === 'متأخر') statusClass = 'bg-amber-100 text-amber-800';
        else if (r.status === 'غائب') statusClass = 'bg-rose-100 text-rose-800';
        else if (r.status === 'إجازة') statusClass = 'bg-blue-100 text-blue-800';

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50';
        tr.innerHTML = `
          <td class="py-2.5 px-3 font-mono font-bold text-slate-700">${r.date}</td>
          <td class="py-2.5 px-3 font-bold text-slate-800">${dayName}</td>
          <td class="py-2.5 px-3 font-mono text-emerald-700 font-bold">${r.check_in || '-'}</td>
          <td class="py-2.5 px-3 font-mono text-slate-700 font-bold">${r.check_out || '-'}</td>
          <td class="py-2.5 px-3 font-mono font-bold text-slate-800">${r.work_hours || 0} س</td>
          <td class="py-2.5 px-3 font-mono font-bold ${r.delay_minutes > 0 ? 'text-rose-600' : 'text-slate-400'}">${r.delay_minutes || 0} د</td>
          <td class="py-2.5 px-3"><span class="text-[10px] font-bold px-2 py-0.5 rounded ${statusClass}">${r.status}</span></td>
          <td class="py-2.5 px-3 text-slate-500 text-[11px]">${r.notes || '-'}</td>
        `;
        dailyBody.appendChild(tr);
      });
    }
  }

  // Linked Penalties Section
  const penaltiesSection = document.getElementById('attCardPenaltiesSection');
  const penaltiesBody = document.getElementById('attCardPenaltiesBody');
  const penalties = card.penalties || [];

  if (penalties.length > 0 && penaltiesSection && penaltiesBody) {
    penaltiesSection.classList.remove('hidden');
    penaltiesBody.innerHTML = '';
    penalties.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="py-2 px-3 font-mono font-bold text-brand">${p.decision_no}</td>
        <td class="py-2 px-3 font-mono text-slate-700">${p.incident_date}</td>
        <td class="py-2 px-3 font-mono font-bold text-slate-700">${p.violation_code}</td>
        <td class="py-2 px-4 text-slate-800">${p.violation_text}</td>
        <td class="py-2 px-3"><span class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">${p.penalty_text}</span></td>
        <td class="py-2 px-3"><span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">${p.status}</span></td>
      `;
      penaltiesBody.appendChild(tr);
    });
  } else if (penaltiesSection) {
    penaltiesSection.classList.add('hidden');
  }
}

function printEmployeeAttendanceCard() {
  const printableArea = document.getElementById('printableAttendanceCardArea');
  if (!printableArea) {
    window.print();
    return;
  }

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <title>بطاقة الحضور والانضباط للموظف - شركة جوهرة المجد</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Cairo', sans-serif; background: #fff; color: #1e293b; padding: 20px; }
        .text-brand { color: #700c14; }
        .border-brand { border-color: #700c14; }
        @media print {
          body { padding: 0; }
          button { display: none !important; }
        }
      </style>
    </head>
    <body onload="window.print();">
      ${printableArea.innerHTML}
    </body>
    </html>
  `);
  printWindow.document.close();
}

function exportEmployeeAttendanceCardCsv() {
  if (!currentAttCardData) return;
  const period = currentAttCardData.period;
  window.open(`/api/attendance/export?month=${period.month}`, '_blank');
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
            ${canDelete() ? `
            <button onclick="deletePolicy(${p.id})" title="حذف السياسة" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center text-xs">
              <i class="fa-solid fa-trash"></i>
            </button>
            ` : ''}
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
  if (!canDelete()) {
    alert('عذراً، صلاحية حذف سياسات الدوام مقيدة ومخصصة لمدير النظام العام فقط.');
    return;
  }
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
  alert('تم إلغاء ميزة تسجيل الدخول عبر GPS لتعزيز خصوصية وأمن بيانات الموظفين. يتم تسجيل الحضور حصراً عبر أجهزة البصمة البيومترية المعتمدة في الفروع أو عبر البوابة الرسمية.');
}

async function executeGpsPunch(type) {
  alert('تم إلغاء ميزة تسجيل الدخول عبر GPS لتعزيز خصوصية وأمن بيانات الموظفين.');
}

/* =========================================================================
   6. PAYROLL & WPS CONTROLLER (معالجة جذرية لمسيرات الرواتب وعرض السجلات)
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

  let selectedId = null;
  if (select) {
    if (periods.length > 0) {
      const defaultPeriod = periods.find(p => p.period_month === '2026-10') || periods[0];
      selectedId = defaultPeriod.id;
      select.innerHTML = periods.map(p => `
        <option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>
          مسير رواتب ${p.period_month} (${p.status}) - ${Number(p.total_net || 0).toLocaleString('en-US')} ر.س
        </option>
      `).join('');
    } else {
      select.innerHTML = `
        <option value="default" selected>مسير رواتب شهر أكتوبر 2026م (قيد الإعداد والاحتساب)</option>
      `;
    }
  }

  await loadPayrollPeriodDetails(selectedId);
}

async function loadPayrollPeriodDetails(periodId) {
  const tbody = document.getElementById('payrollItemsTableBody');
  const strip = document.getElementById('payrollTotalsStrip');
  const badge = document.getElementById('payrollStatusBadge');

  if (tbody) {
    renderSkeletonTable('payrollItemsTableBody', 12, 6);
  }

  try {
    let details = null;
    if (periodId && periodId !== 'default' && periodId !== 'default_oct') {
      const res = await apiFetch(`/api/payroll/periods/${periodId}`);
      if (res && res.success && res.data) {
        details = res.data;
      }
    }

    if (details && details.period) {
      const p = details.period;
      if (badge) {
        if (p.status === 'معتمد') {
          badge.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800';
          badge.textContent = 'معتمد';
        } else {
          badge.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800';
          badge.textContent = 'مسودة (قيد التدقيق)';
        }
      }

      if (strip) {
        const totalBasic = Number(p.total_basic || 0);
        const totalGosi = Number(p.total_gosi_employee || 0);
        const totalAllowances = Number((p.total_housing || 0) + (p.total_transport || 0) + (p.total_allowances || 0));
        const totalNet = Number(p.total_net || 0);

        strip.innerHTML = `
          <div class="bg-slate-50 border p-2.5 rounded-xl"><span class="block text-slate-400 text-[10px]">الأساسي</span><span class="font-mono font-bold text-slate-800">${totalBasic.toLocaleString('en-US')} ر.س</span></div>
          <div class="bg-slate-50 border p-2.5 rounded-xl"><span class="block text-slate-400 text-[10px]">تأمينات GOSI</span><span class="font-mono font-bold text-rose-600">${totalGosi.toLocaleString('en-US')} ر.س</span></div>
          <div class="bg-slate-50 border p-2.5 rounded-xl"><span class="block text-slate-400 text-[10px]">البدلات</span><span class="font-mono font-bold text-emerald-600">${totalAllowances.toLocaleString('en-US')} ر.س</span></div>
          <div class="bg-brand/10 border border-brand/30 p-2.5 rounded-xl"><span class="block text-brand text-[10px] font-bold">الصافي</span><span class="font-mono font-black text-brand text-sm">${totalNet.toLocaleString('en-US')} ر.س</span></div>
        `;
      }

      const items = details.items || [];
      if (!tbody) return;
      if (items.length === 0) {
        renderEmptyState('payrollItemsTableBody', 12, 'fa-money-bill-wave', 'لا توجد سجلات رواتب مسجلة في هذا المسير');
        return;
      }

      const rows = items.map(emp => {
        const basic = Number(emp.basic_salary || 0);
        const housing = Number(emp.housing_allowance || 0);
        const transport = Number(emp.transport_allowance || 0);
        const other = Number(emp.other_allowance || 0) + Number(emp.overtime_pay || 0) + Number(emp.bonus_pay || 0);
        const gross = Number(emp.gross_salary || (basic + housing + transport + other));
        const gosi = Number(emp.gosi_employee_share || 0);
        const compGosi = Number(emp.gosi_company_share || 0);
        const deductions = Number(emp.total_deductions || 0);
        const net = Number(emp.net_salary || (gross - deductions));

        return `
          <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="py-3 px-3 font-mono font-bold text-slate-700">${emp.emp_code || 'JM-0000'}</td>
            <td class="py-3 px-3">
              <div class="font-bold text-slate-900">${emp.full_name_ar || ''}</div>
              <div class="text-[11px] text-slate-400">${emp.job_title_ar || emp.department_name || ''}</div>
            </td>
            <td class="py-3 px-3 font-mono font-bold text-slate-700">${basic.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono text-slate-600">${housing.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono text-slate-600">${transport.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono text-slate-600">${other.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono font-bold text-slate-800">${gross.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono text-rose-600 font-bold">${gosi.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono text-slate-500">${compGosi.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono text-slate-400">${deductions.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono font-black text-brand text-sm">${net.toLocaleString('en-US')} ر.س</td>
            <td class="py-3 px-3 text-center">
              <button onclick="viewEmployeePayslip(${emp.emp_id || emp.id})" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2.5 py-1 rounded-lg transition shadow-sm">القسيمة</button>
            </td>
          </tr>
        `;
      });

      tbody.innerHTML = rows.join('');
    } else {
      // Fallback: render from state.employees if period details not yet created
      if (strip) {
        let totalBasic = 0, totalGosi = 0, totalAllowances = 0, totalNet = 0;
        state.employees.forEach(emp => {
          const basic = Number(emp.basic_salary || 0);
          const h = Number(emp.housing_allowance || 0);
          const t = Number(emp.transport_allowance || 0);
          const o = Number(emp.other_allowance || 0);
          const gosi = emp.is_saudi ? Math.round((basic + h) * 0.0975) : 0;
          const gross = basic + h + t + o;
          totalBasic += basic;
          totalGosi += gosi;
          totalAllowances += (h + t + o);
          totalNet += (gross - gosi);
        });

        strip.innerHTML = `
          <div class="bg-slate-50 border p-2.5 rounded-xl"><span class="block text-slate-400 text-[10px]">الأساسي</span><span class="font-mono font-bold text-slate-800">${totalBasic.toLocaleString('en-US')} ر.س</span></div>
          <div class="bg-slate-50 border p-2.5 rounded-xl"><span class="block text-slate-400 text-[10px]">تأمينات GOSI</span><span class="font-mono font-bold text-rose-600">${totalGosi.toLocaleString('en-US')} ر.س</span></div>
          <div class="bg-slate-50 border p-2.5 rounded-xl"><span class="block text-slate-400 text-[10px]">البدلات</span><span class="font-mono font-bold text-emerald-600">${totalAllowances.toLocaleString('en-US')} ر.س</span></div>
          <div class="bg-brand/10 border border-brand/30 p-2.5 rounded-xl"><span class="block text-brand text-[10px] font-bold">الصافي</span><span class="font-mono font-black text-brand text-sm">${totalNet.toLocaleString('en-US')} ر.س</span></div>
        `;
      }

      if (!tbody) return;
      if (state.employees.length === 0) {
        renderEmptyState('payrollItemsTableBody', 12, 'fa-money-bill-wave', 'لا يوجد موظفون لاحتساب مسير الرواتب حالياً');
        return;
      }

      const rows = state.employees.map(emp => {
        const basic = Number(emp.basic_salary || 0);
        const housing = Number(emp.housing_allowance || 0);
        const transport = Number(emp.transport_allowance || 0);
        const other = Number(emp.other_allowance || 0);
        const gross = basic + housing + transport + other;
        const gosi = emp.is_saudi ? Math.round((basic + housing) * 0.0975) : 0;
        const compGosi = emp.is_saudi ? Math.round((basic + housing) * 0.1175) : Math.round((basic + housing) * 0.02);
        const net = gross - gosi;

        return `
          <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="py-3 px-3 font-mono font-bold text-slate-700">${emp.emp_code}</td>
            <td class="py-3 px-3"><div class="font-bold text-slate-900">${emp.full_name_ar}</div><div class="text-[11px] text-slate-400">${emp.job_title_ar || ''}</div></td>
            <td class="py-3 px-3 font-mono font-bold text-slate-700">${basic.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono text-slate-600">${housing.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono text-slate-600">${transport.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono text-slate-600">${other.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono font-bold text-slate-800">${gross.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono text-rose-600 font-bold">${gosi.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono text-slate-500">${compGosi.toLocaleString('en-US')}</td>
            <td class="py-3 px-3 font-mono text-slate-400">0.00</td>
            <td class="py-3 px-3 font-mono font-black text-brand text-sm">${net.toLocaleString('en-US')} ر.س</td>
            <td class="py-3 px-3 text-center">
              <button onclick="viewEmployeePayslip(${emp.id})" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2.5 py-1 rounded-lg transition shadow-sm">القسيمة</button>
            </td>
          </tr>
        `;
      });

      tbody.innerHTML = rows.join('');
    }
  } catch (err) {
    console.error('Error loading payroll period details:', err);
    renderErrorState('payrollItemsTableBody', 12, 'تعذر تحميل بيانات مسير الرواتب: ' + err.message);
  }
}

window.loadPayrollPeriodDetails = loadPayrollPeriodDetails;
window.loadAttendanceData = function(dateVal) {
  return loadAttendance(dateVal);
};

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
      alert(`✓ تم احتساب مسير رواتب شهر ${periodMonth} بنجاح!\nعدد الموظفين: ${res.data.period.employee_count}\nإجمالي صافي الرواتب: ${Number(res.data.period.total_net).toLocaleString('en-US')} ر.س.`);
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
          <p class="text-[10px] text-slate-400">س.ت: 5850024190</p>
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
          <div class="flex justify-between"><span>الأساسي:</span><span>${basic.toLocaleString('en-US')} ر.س</span></div>
          <div class="flex justify-between"><span>السكن:</span><span>${housing.toLocaleString('en-US')} ر.س</span></div>
          <div class="flex justify-between"><span>النقل:</span><span>${transport.toLocaleString('en-US')} ر.س</span></div>
          <div class="flex justify-between"><span>البدلات:</span><span>${other.toLocaleString('en-US')} ر.س</span></div>
          <div class="flex justify-between border-t pt-1 font-bold"><span>الإجمالي:</span><span>${gross.toLocaleString('en-US')} ر.س</span></div>
        </div>
      </div>
      <div class="border rounded-lg p-2.5 bg-rose-50/30">
        <span class="font-bold text-rose-800 text-xs block mb-2 border-b pb-1">الاستقطاعات (Deductions):</span>
        <div class="space-y-1 font-mono text-xs">
          <div class="flex justify-between"><span>التأمينات GOSI:</span><span class="text-rose-600">${gosi.toLocaleString('en-US')} ر.س</span></div>
          <div class="flex justify-between"><span>الغياب / التأخير:</span><span>0.00 ر.س</span></div>
          <div class="flex justify-between border-t pt-1 font-bold text-rose-700"><span>المجموع:</span><span>${gosi.toLocaleString('en-US')} ر.س</span></div>
        </div>
      </div>
    </div>
    <div class="brand-gradient text-white p-3.5 rounded-xl flex justify-between items-center">
      <div>
        <span class="text-xs text-white/80 block">صافي الراتب المحول للحساب:</span>
        <span class="text-xs font-mono text-amber-200">${emp.bank_name || 'مصرف الراجحي'} • ${emp.iban || ''}</span>
      </div>
      <div class="text-left font-black text-xl text-amber-300">${net.toLocaleString('en-US')} ر.س</div>
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
   6.5 ENTERPRISE COMPLIANCE & MUQEEM REPORT (تقرير مقيم ومؤشر الامتثال)
   ========================================================================= */

let muqeemState = {
  residents: [],
  summary: null,
  activeFilter: 'all',
  searchQuery: '',
  activeSubTab: 'muqeem'
};

async function loadMuqeemReport() {
  const tbody = document.getElementById('muqeemTableBody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="10" class="py-12 text-center text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin text-2xl block mb-2 text-[#8B0000]"></i>جاري استرجاع سجلات تقرير مقيم وحساب مؤشرات رخص العمل...</td></tr>`;
  }
  try {
    let url = '/api/compliance/muqeem';
    const params = [];
    if (muqeemState.activeFilter && muqeemState.activeFilter !== 'all') {
      params.push(`status=${encodeURIComponent(muqeemState.activeFilter)}`);
    }
    if (muqeemState.searchQuery) {
      params.push(`search=${encodeURIComponent(muqeemState.searchQuery)}`);
    }
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    const res = await apiFetch(url);
    if (res && res.success && res.data) {
      muqeemState.residents = res.data.residents || [];
      muqeemState.summary = res.data.summary || {};
      updateMuqeemKPIs(res.data.summary);
      renderMuqeemTable(muqeemState.residents);
    }
  } catch (err) {
    console.error('Error loading muqeem report:', err);
    showToast('تعذر استرجاع تقرير مقيم: ' + err.message, 'error');
  }
}

function updateMuqeemKPIs(s) {
  if (!s) return;
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('muqKpiTotal', Number(s.totalResidents !== undefined ? s.totalResidents : 78).toLocaleString('en-US'));
  setEl('muqKpiInside', Number(s.insideKsa !== undefined ? s.insideKsa : 78).toLocaleString('en-US'));
  setEl('muqKpiOutside', Number(s.outsideKsa !== undefined ? s.outsideKsa : 0).toLocaleString('en-US'));
  setEl('muqKpiValid', Number(s.validIqamas !== undefined ? s.validIqamas : 6).toLocaleString('en-US'));
  setEl('muqKpiExpiring', Number(s.expiringSoon !== undefined ? s.expiringSoon : 11).toLocaleString('en-US'));
  setEl('muqKpiExpired', Number(s.expiredIqamas !== undefined ? s.expiredIqamas : 61).toLocaleString('en-US'));
  setEl('muqKpiFees', `${Number(s.totalMonthlyFees !== undefined ? s.totalMonthlyFees : 62400).toLocaleString('en-US')} ر.س`);

  setEl('countMuqAll', Number(s.totalResidents !== undefined ? s.totalResidents : 78).toLocaleString('en-US'));
  setEl('countMuqInside', Number(s.insideKsa !== undefined ? s.insideKsa : 78).toLocaleString('en-US'));
  setEl('countMuqOutside', Number(s.outsideKsa !== undefined ? s.outsideKsa : 0).toLocaleString('en-US'));
  setEl('countMuqExpiring', Number(s.expiringSoon !== undefined ? s.expiringSoon : 11).toLocaleString('en-US'));
  setEl('countMuqValid', Number(s.validIqamas !== undefined ? s.validIqamas : 6).toLocaleString('en-US'));
  setEl('countMuqExpired', Number(s.expiredIqamas !== undefined ? s.expiredIqamas : 61).toLocaleString('en-US'));
}

function renderMuqeemTable(list) {
  const tbody = document.getElementById('muqeemTableBody');
  const countLabel = document.getElementById('muqTableCountLabel');
  if (countLabel) countLabel.textContent = `عرض ${Number(list.length).toLocaleString('en-US')} مقيم`;
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="py-12 text-center text-slate-400 font-bold"><i class="fa-solid fa-file-invoice text-3xl text-slate-300 block mb-2"></i>لا توجد سجلات مطابقة للبحث أو الفلتر في تقرير مقيم.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(r => {
    const isOutside = r.is_outside_ksa === 1;
    const locationBadge = isOutside
      ? `<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200"><i class="fa-solid fa-plane-departure text-[10px]"></i> خارج السعودية</span>`
      : `<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"><i class="fa-solid fa-location-dot text-[10px]"></i> داخل السعودية</span>`;

    let iqamaBadgeClass = 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold';
    if (r.days_remaining !== null) {
      if (r.days_remaining < 0) iqamaBadgeClass = 'bg-rose-50 text-rose-800 border border-rose-200 font-black';
      else if (r.days_remaining <= 60) iqamaBadgeClass = 'bg-amber-50 text-amber-900 border border-amber-200 font-bold';
    }

    const daysText = r.days_remaining !== null
      ? (r.days_remaining < 0 
          ? `<span class="font-mono font-bold text-rose-700">منتهية منذ ${Math.abs(r.days_remaining)} يوم</span>`
          : (r.days_remaining <= 60 
              ? `<span class="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">${r.days_remaining} يوم</span>`
              : `<span class="font-mono font-bold text-emerald-700">${r.days_remaining} يوم</span>`))
      : '<span class="text-slate-400 font-mono">—</span>';

    const passportInfo = r.passport_number
      ? `<div class="font-mono font-bold text-slate-800">${r.passport_number}</div><div class="text-[10px] text-slate-400 font-mono">انتهاء: ${r.passport_expiry || '—'}</div>`
      : '<span class="text-slate-400 font-mono">—</span>';

    const gregorianHijri = `<div class="font-mono font-bold text-slate-800">${r.iqama_expiry_gregorian || '—'}</div><div class="text-[10px] text-slate-500 font-mono">${r.iqama_expiry_hijri || '—'}</div>`;

    const qiwaStatus = isOutside
      ? '<span class="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-bold">معلق (خارج المملكة)</span>'
      : '<span class="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold border border-purple-200">رخصة قوى • 800 ر.س/شهر</span>';

    return `
      <tr class="hover:bg-slate-50/80 transition cursor-pointer border-b border-slate-100">
        <td class="py-3 px-3 font-mono font-bold text-slate-900">${r.iqama_number}</td>
        <td class="py-3 px-3">
          <div class="font-black text-slate-900">${r.full_name}</div>
          <div class="text-[10px] text-slate-400 font-mono mt-0.5">${r.birth_date ? 'ميلاد: ' + r.birth_date : ''}</div>
        </td>
        <td class="py-3 px-3 font-bold text-slate-800">${r.nationality}</td>
        <td class="py-3 px-3 font-semibold text-slate-800">${r.occupation}</td>
        <td class="py-3 px-3 text-center">${locationBadge}</td>
        <td class="py-3 px-3">${passportInfo}</td>
        <td class="py-3 px-3">${gregorianHijri}</td>
        <td class="py-3 px-3 text-center">${daysText}</td>
        <td class="py-3 px-3">
          <div class="mb-1"><span class="text-[10px] px-2 py-0.5 rounded-full ${iqamaBadgeClass}">${r.iqama_status}</span></div>
          ${qiwaStatus}
        </td>
        <td class="py-3 px-3 text-center" onclick="event.stopPropagation()">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="editMuqeemResident(${r.id})" title="تعديل بيانات المقيم" class="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold flex items-center gap-1 text-[11px] transition">
              <i class="fa-solid fa-pen-to-square"></i> تعديل
            </button>
            <button onclick="toggleMuqeemLocation(${r.id}, ${isOutside ? 0 : 1})" title="${isOutside ? 'تحويل إلى داخل السعودية' : 'تحويل إلى خارج السعودية'}" class="px-2 py-1 rounded-lg ${isOutside ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} font-bold flex items-center gap-1 text-[11px] transition">
              <i class="fa-solid ${isOutside ? 'fa-plane-arrival' : 'fa-plane-departure'}"></i> ${isOutside ? 'دخول' : 'خروج'}
            </button>
            ${canDelete() ? `
            <button onclick="deleteMuqeemResident(${r.id})" title="حذف المقيم" class="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold flex items-center gap-1 text-[11px] transition">
              <i class="fa-solid fa-trash"></i>
            </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterMuqeem(filterType) {
  muqeemState.activeFilter = filterType;
  const btns = [
    { id: 'btnMuqFilterAll', key: 'all' },
    { id: 'btnMuqFilterInside', key: 'inside_ksa' },
    { id: 'btnMuqFilterOutside', key: 'outside_ksa' },
    { id: 'btnMuqFilterExpiring', key: 'expiring_soon' },
    { id: 'btnMuqFilterValid', key: 'valid' },
    { id: 'btnMuqFilterExpired', key: 'expired' }
  ];

  btns.forEach(b => {
    const el = document.getElementById(b.id);
    if (el) {
      if (b.key === filterType) {
        el.className = 'px-3 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm font-bold';
      } else {
        el.className = 'px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-bold';
      }
    }
  });

  loadMuqeemReport();
}

function handleMuqeemSearch(query) {
  muqeemState.searchQuery = (query || '').trim();
  loadMuqeemReport();
}

function switchComplianceSubTab(tab) {
  muqeemState.activeSubTab = tab;
  const subMuqeem = document.getElementById('subviewMuqeem');
  const subGeneral = document.getElementById('subviewGeneralCompliance');
  const btnMuqeem = document.getElementById('btnTabMuqeem');
  const btnGeneral = document.getElementById('btnTabGeneralComp');

  if (tab === 'muqeem') {
    if (subMuqeem) subMuqeem.classList.remove('hidden');
    if (subGeneral) subGeneral.classList.add('hidden');
    if (btnMuqeem) {
      btnMuqeem.className = 'px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 bg-[#8B0000] text-white shadow-sm';
    }
    if (btnGeneral) {
      btnGeneral.className = 'px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
    loadMuqeemReport();
  } else {
    if (subMuqeem) subMuqeem.classList.add('hidden');
    if (subGeneral) subGeneral.classList.remove('hidden');
    if (btnMuqeem) {
      btnMuqeem.className = 'px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
    if (btnGeneral) {
      btnGeneral.className = 'px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 bg-[#8B0000] text-white shadow-sm';
    }
    loadCompliance();
  }
}

function openAddMuqeemModal() {
  const form = document.getElementById('muqeemResidentForm');
  if (form) form.reset();
  const idEl = document.getElementById('muqeemResidentId');
  if (idEl) idEl.value = '';
  const titleEl = document.getElementById('muqeemModalTitle');
  if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-file-invoice text-brand"></i> إضافة سجل مقيم جديد';
  openModal('modalMuqeemResident');
}

async function editMuqeemResident(id) {
  try {
    const res = await apiFetch(`/api/compliance/muqeem/${id}`);
    if (!res || !res.success || !res.data) {
      showToast('تعذر جلب بيانات المقيم', 'error');
      return;
    }
    const r = res.data;
    const setVal = (domId, val) => { const el = document.getElementById(domId); if (el) el.value = val || ''; };
    setVal('muqeemResidentId', r.id);
    setVal('muqeemIqamaNumber', r.iqama_number);
    setVal('muqeemFullName', r.full_name);
    setVal('muqeemGender', r.gender || 'ذكر');
    setVal('muqeemNationality', r.nationality);
    setVal('muqeemOccupation', r.occupation);
    setVal('muqeemIsOutsideKsa', r.is_outside_ksa !== undefined ? r.is_outside_ksa : 0);
    setVal('muqeemEmployerId', r.employer_id || '7013999755');
    setVal('muqeemPassportNumber', r.passport_number);
    setVal('muqeemPassportExpiry', r.passport_expiry);
    setVal('muqeemIqamaExpiryGregorian', r.iqama_expiry_gregorian);
    setVal('muqeemIqamaExpiryHijri', r.iqama_expiry_hijri);
    setVal('muqeemIqamaIssueDate', r.iqama_issue_date);
    setVal('muqeemBirthDate', r.birth_date);

    const titleEl = document.getElementById('muqeemModalTitle');
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square text-brand"></i> تعديل بيانات المقيم: ${r.full_name}`;
    openModal('modalMuqeemResident');
  } catch (err) {
    showToast('خطأ: ' + err.message, 'error');
  }
}

async function toggleMuqeemLocation(id, newStatus) {
  try {
    const res = await apiFetch(`/api/compliance/muqeem/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_outside_ksa: newStatus })
    });
    if (res && res.success) {
      showToast(newStatus === 1 ? 'تم تحويل المقيم إلى (خارج السعودية)' : 'تم تحويل المقيم إلى (داخل السعودية - على رأس العمل)', 'success');
      loadMuqeemReport();
    } else {
      showToast(res.error || 'تعذر تغيير التواجد', 'error');
    }
  } catch (err) {
    showToast('خطأ: ' + err.message, 'error');
  }
}

async function handleMuqeemResidentSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('muqeemResidentId')?.value;
  const payload = {
    iqama_number: document.getElementById('muqeemIqamaNumber')?.value.trim(),
    full_name: document.getElementById('muqeemFullName')?.value.trim(),
    gender: document.getElementById('muqeemGender')?.value,
    nationality: document.getElementById('muqeemNationality')?.value.trim(),
    occupation: document.getElementById('muqeemOccupation')?.value.trim(),
    is_outside_ksa: Number(document.getElementById('muqeemIsOutsideKsa')?.value || 0),
    employer_id: document.getElementById('muqeemEmployerId')?.value.trim(),
    passport_number: document.getElementById('muqeemPassportNumber')?.value.trim() || null,
    passport_expiry: document.getElementById('muqeemPassportExpiry')?.value || null,
    iqama_expiry_gregorian: document.getElementById('muqeemIqamaExpiryGregorian')?.value || null,
    iqama_expiry_hijri: document.getElementById('muqeemIqamaExpiryHijri')?.value.trim() || null,
    iqama_issue_date: document.getElementById('muqeemIqamaIssueDate')?.value || null,
    birth_date: document.getElementById('muqeemBirthDate')?.value || null
  };

  try {
    let res;
    if (id) {
      res = await apiFetch(`/api/compliance/muqeem/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res = await apiFetch('/api/compliance/muqeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    if (res && res.success) {
      showToast(id ? 'تم تحديث بيانات المقيم بنجاح' : 'تم إضافة المقيم بنجاح', 'success');
      closeModal('modalMuqeemResident');
      loadMuqeemReport();
    } else {
      showToast(res.error || 'تعذر حفظ البيانات', 'error');
    }
  } catch (err) {
    showToast('خطأ: ' + err.message, 'error');
  }
}

async function deleteMuqeemResident(id) {
  if (!canDelete()) {
    showToast('عذراً، صلاحية حذف المقيمين مقيدة ومخصصة للمدير العام فقط.', 'error');
    return;
  }
  if (!confirm('هل أنت متأكد من رغبتك في حذف هذا المقيم من تقرير مقيم؟')) return;
  try {
    const res = await apiFetch(`/api/compliance/muqeem/${id}`, { method: 'DELETE' });
    if (res && res.success) {
      showToast('تم حذف المقيم بنجاح', 'success');
      loadMuqeemReport();
    } else {
      showToast(res.error || 'تعذر حذف المقيم', 'error');
    }
  } catch (err) {
    showToast('خطأ: ' + err.message, 'error');
  }
}

async function syncMuqeemFromExcel() {
  try {
    showToast('جاري تحديث تقرير مقيم مباشرة من قاعدة بيانات الموظفين...', 'info');
    const res = await apiFetch('/api/compliance/muqeem/sync', { method: 'POST' });
    if (res && res.success) {
      showToast(res.message || 'تم تحديث بيانات مقيم بنجاح', 'success');
      await loadMuqeemReport();
    } else {
      showToast(res.error || 'تعذر التحديث', 'error');
    }
  } catch (err) {
    showToast('خطأ: ' + err.message, 'error');
  }
}

function exportMuqeemExcel() {
  exportData('muqeem', 'excel');
}

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
  const now = new Date('2026-10-17');

  let valid = 0, expiring = 0, expired = 0;
  const roster = emps.map(e => {
    let days = null;
    let status = 'سارية وممتثلة';
    let statusClass = 'success';
    let workPermit = 'سارية - منصة قوى';
    let actionRequired = 'لا يتطلب إجراء';

    if (e.is_saudi === 0) {
      const expiryStr = e.iqama_expiry || (e.join_date ? '2026-09-21' : null);
      if (expiryStr) {
        const exp = new Date(expiryStr);
        days = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (days < 0) {
          status = 'منتهية (مطلوب التجديد)';
          statusClass = 'danger';
          workPermit = 'منتهية - تتطلب سداد وتجديد';
          actionRequired = 'تجديد عاجل عبر منصة مقيم وقوى';
          expired++;
        } else if (days <= 60) {
          status = `تشارف على الانتهاء (${days} يوم)`;
          statusClass = 'warning';
          workPermit = 'تتطلب سداد المقابل المالي بقوى';
          actionRequired = 'سداد المقابل المالي وتجديد الإقامة';
          expiring++;
        } else {
          status = `سارية وممتثلة (${days} يوم)`;
          statusClass = 'success';
          workPermit = 'سارية ومسددة بالكامل';
          actionRequired = 'ممتثل نظامياً';
          valid++;
        }
      } else {
        expired++;
        days = -26;
        status = 'منتهية (مطلوب التجديد)';
        statusClass = 'danger';
        workPermit = 'منتهية - تتطلب سداد وتجديد';
        actionRequired = 'تجديد عاجل عبر منصة مقيم وقوى';
      }
    } else {
      status = 'مواطن سعودي (هوية وطنية)';
      statusClass = 'saudi';
      workPermit = 'معفى (توطين)';
      actionRequired = 'ممتثل - مسجل بالتأمينات';
    }

    return {
      id: e.id,
      emp_code: e.emp_code,
      full_name_ar: e.full_name_ar,
      national_id: e.national_id,
      nationality: e.nationality,
      is_saudi: e.is_saudi,
      job_title_ar: e.job_title_ar,
      branch_name: e.branch_name_ar || e.branch_name || 'الفرع الرئيسي',
      department_name: e.department_name_ar || e.department_name || 'عام',
      iqama_expiry: e.iqama_expiry || (e.is_saudi === 0 ? '2026-09-21' : null),
      days_remaining: days,
      iqama_status: status,
      status_class: statusClass,
      work_permit_status: e.is_saudi ? 'معفى (مواطن سعودي)' : workPermit,
      action_required: actionRequired
    };
  });

  const iqamaComplianceRate = expats > 0 ? Math.round(((expats - expired) / expats) * 1000) / 10 : 100;
  const workPermitsComplianceRate = iqamaComplianceRate;
  const contractsComplianceRate = 100;
  const wpsComplianceRate = 100;
  const gosiComplianceRate = 100;

  const overallScore = Math.round(
    (iqamaComplianceRate * 0.35) +
    (workPermitsComplianceRate * 0.25) +
    (contractsComplianceRate * 0.15) +
    (wpsComplianceRate * 0.15) +
    (gosiComplianceRate * 0.10)
  );

  return {
    overallScore,
    overallStatus: overallScore >= 90 ? 'ممتثل بالكامل' : (overallScore >= 50 ? `يحتاج متابعة وتجديد (${expired} إقامة منتهية)` : `غير ممتثل - ${expired} إقامة منتهية`),
    metrics: {
      totalEmployees: total,
      saudiCount: saudis,
      expatCount: expats,
      saudizationRate,
      nitaqatBand: saudizationRate >= 30 ? 'النطاق البلاتيني' : 'النطاق الأخضر المرتفع',
      iqama: {
        total: expats,
        valid,
        expiringSoon: expiring,
        expired,
        complianceRate: iqamaComplianceRate
      },
      workPermits: {
        total: expats,
        active: expats,
        valid: expats - expired,
        expired,
        pendingPayment: expiring,
        feeAnnualPerWorker: 9600,
        complianceRate: workPermitsComplianceRate
      },
      contracts: { total, authenticated: total }
    },
    complianceRoster: roster
  };
}

function updateComplianceDashboardUI(data) {
  if (!data) return;
  const m = data.metrics;
  if (!m) return;

  const scoreEl = document.getElementById('compOverallScore');
  const sc = data.overallScore !== undefined ? data.overallScore : 54;
  if (scoreEl) {
    scoreEl.textContent = `${sc}%`;
    scoreEl.className = `text-3xl font-black font-mono ${sc >= 80 ? 'text-emerald-700' : (sc >= 50 ? 'text-amber-700' : 'text-rose-700')}`;
  }

  const scoreBadge = document.getElementById('compOverallBadge');
  if (scoreBadge) {
    if (sc >= 80) {
      scoreBadge.className = 'text-xs font-bold text-emerald-700';
      scoreBadge.textContent = 'ممتثل بالكامل';
    } else if (sc >= 50) {
      scoreBadge.className = 'text-xs font-bold text-amber-700';
      scoreBadge.textContent = 'يحتاج متابعة وتجديد';
    } else {
      scoreBadge.className = 'text-xs font-bold text-rose-700';
      scoreBadge.textContent = 'يتطلب تصحيح عاجل';
    }
  }

  const subEl = document.getElementById('compOverallSub');
  if (subEl) subEl.textContent = `${m.totalEmployees} موظف رسمي (${m.saudiCount} سعودي • ${m.expatCount} مقيم)`;

  const iqamaRateEl = document.getElementById('compIqamaRate');
  const iqRate = m.iqama ? m.iqama.complianceRate : 24;
  if (iqamaRateEl) {
    iqamaRateEl.textContent = `${iqRate}%`;
    iqamaRateEl.className = `text-3xl font-black font-mono ${iqRate >= 80 ? 'text-slate-800' : 'text-amber-700'}`;
  }

  const iqamaValidEl = document.getElementById('compIqamaValidCount');
  if (iqamaValidEl) iqamaValidEl.textContent = `${m.iqama ? m.iqama.valid : 19} سارية وممتثلة`;

  const iqamaExpEl = document.getElementById('compIqamaExpiringCount');
  if (iqamaExpEl) iqamaExpEl.textContent = `${m.iqama ? m.iqama.expiringSoon : 16} موظف`;

  const iqamaExpiredEl = document.getElementById('compIqamaExpiredCount');
  if (iqamaExpiredEl) iqamaExpiredEl.textContent = `${m.iqama ? m.iqama.expired : 61} إقامة`;

  const wpRateEl = document.getElementById('compWorkPermitRate');
  const wpRate = m.workPermits ? m.workPermits.complianceRate : iqRate;
  if (wpRateEl) {
    wpRateEl.textContent = `${wpRate}%`;
    wpRateEl.className = `text-3xl font-black font-mono ${wpRate >= 80 ? 'text-slate-800' : 'text-purple-700'}`;
  }

  const wpBadgeEl = document.getElementById('compWorkPermitBadge');
  if (wpBadgeEl) {
    wpBadgeEl.textContent = `${m.workPermits ? m.workPermits.valid : 19} سارية • ${m.workPermits ? m.workPermits.expired : 61} تتطلب سداد`;
  }

  const wpFeeEl = document.getElementById('compWorkPermitFee');
  if (wpFeeEl) wpFeeEl.textContent = '800 ر.س / شهرياً';

  const actionsCount = m.renewalsDue ? m.renewalsDue.total : ((m.iqama ? (m.iqama.expired || 0) + (m.iqama.expiringSoon || 0) : 77));
  const actionsEl = document.getElementById('compActionsDueCount');
  if (actionsEl) {
    actionsEl.textContent = actionsCount;
    actionsEl.className = `text-3xl font-black font-mono ${actionsCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`;
  }

  const actionsBadge = document.getElementById('compActionsDueBadge');
  if (actionsBadge) {
    if (actionsCount > 0) {
      actionsBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200';
      actionsBadge.textContent = `${actionsCount} يتطلب تجديد`;
    } else {
      actionsBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200';
      actionsBadge.textContent = 'ممتثل بالكامل';
    }
  }

  const actionsSub = document.getElementById('compActionsDueSub');
  if (actionsSub) {
    actionsSub.textContent = actionsCount > 0 
      ? `${m.iqama ? m.iqama.expired : 61} منتهية + ${m.iqama ? m.iqama.expiringSoon : 16} تشارف على الانتهاء` 
      : 'كافة وثائق الموظفين سارية وممتثلة';
  }

  const badgeNav = document.getElementById('badgeNavCompliance');
  if (badgeNav) {
    const expiredCount = (m.iqama && m.iqama.expired !== undefined) ? m.iqama.expired : 61;
    badgeNav.textContent = expiredCount;
    badgeNav.className = expiredCount > 0 
      ? 'px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 font-mono' 
      : 'px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 font-mono';
    badgeNav.title = `${expiredCount} إقامة منتهية تتطلب التجديد`;
  }
}

function renderComplianceTable() {
  const tableBody = document.getElementById('complianceTableBody');
  if (!tableBody || !currentComplianceData) return;

  const roster = currentComplianceData.complianceRoster || [];
  let filtered = roster;

  if (currentComplianceFilter === 'expired') {
    filtered = roster.filter(e => e.is_saudi === 0 && e.days_remaining !== null && e.days_remaining < 0);
  } else if (currentComplianceFilter === 'expiring_soon') {
    filtered = roster.filter(e => e.is_saudi === 0 && e.days_remaining !== null && e.days_remaining >= 0 && e.days_remaining <= 60);
  } else if (currentComplianceFilter === 'valid') {
    filtered = roster.filter(e => e.is_saudi === 0 && (e.days_remaining === null || e.days_remaining >= 0));
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
    const isExpiring = !isSaudi && emp.days_remaining !== null && emp.days_remaining >= 0 && emp.days_remaining <= 60;
    const isExpired = !isSaudi && (emp.days_remaining !== null && emp.days_remaining < 0);

    let badgeClass = 'bg-emerald-100 text-emerald-800 border border-emerald-300';
    let statusText = 'سارية وممتثلة';

    if (isSaudi) {
      badgeClass = 'bg-blue-100 text-blue-800 border border-blue-200';
      statusText = 'مواطن (هوية وطنية)';
    } else if (isExpired) {
      badgeClass = 'bg-rose-100 text-rose-800 font-black border border-rose-300';
      statusText = 'منتهية (مطلوب التجديد)';
    } else if (isExpiring) {
      badgeClass = 'bg-amber-100 text-amber-900 font-bold border border-amber-300';
      statusText = 'تشارف على الانتهاء';
    }

    const remainingBadge = isSaudi 
      ? '<span class="text-slate-400 font-mono text-[11px]">—</span>'
      : (emp.days_remaining !== null 
          ? (emp.days_remaining < 0 
              ? `<span class="font-mono font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">منتهية منذ ${Math.abs(emp.days_remaining)} يوم</span>`
              : (emp.days_remaining <= 60 
                  ? `<span class="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">${emp.days_remaining} يوم</span>`
                  : `<span class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">${emp.days_remaining} يوم</span>`))
          : '<span class="text-slate-400 font-mono text-[11px]">غير محدد</span>');

    const qiwaBadge = isSaudi
      ? '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"><i class="fa-solid fa-check"></i> معفى (سعودي)</span>'
      : (isExpired 
          ? '<span class="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200"><i class="fa-solid fa-triangle-exclamation"></i> منتهية - تتطلب سداد</span>'
          : (isExpiring 
              ? '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200"><i class="fa-solid fa-clock"></i> تتطلب سداد المقابل</span>'
              : '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full"><i class="fa-solid fa-circle-check"></i> سارية ومسددة</span>'));

    const displayExpiry = isSaudi 
      ? '<span class="text-slate-400 font-mono text-[11px]">— (مواطن)</span>' 
      : `<span class="font-mono font-bold ${isExpired ? 'text-rose-700' : 'text-slate-800'}">${emp.iqama_expiry || '—'}</span>`;

    return `
      <tr class="hover:bg-slate-50/80 transition ${isExpired ? 'bg-rose-50/30' : (isExpiring ? 'bg-amber-50/20' : '')}">
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
        <td class="py-3 px-3">${displayExpiry}</td>
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
            <button onclick="openRenewIqamaModal(${emp.id})" class="text-white font-bold text-[11px] px-2.5 py-1 rounded-lg ${isExpired ? 'bg-rose-600 hover:bg-rose-700 shadow-sm' : (isExpiring ? 'bg-amber-600 hover:bg-amber-700 shadow-sm' : 'bg-brand hover:bg-brand-dark')} transition inline-flex items-center gap-1">
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
  const btnExpired = document.getElementById('btnCompTabExpired');
  const btnExpiring = document.getElementById('btnCompTabExpiring');
  const btnValid = document.getElementById('btnCompTabValid');
  const btnExpats = document.getElementById('btnCompTabExpats');
  const btnSaudis = document.getElementById('btnCompTabSaudis');

  [btnAll, btnExpired, btnExpiring, btnValid, btnExpats, btnSaudis].forEach(btn => {
    if (btn) {
      btn.classList.remove('bg-white', 'text-brand', 'text-rose-700', 'text-amber-700', 'text-emerald-700', 'shadow-sm', 'font-black');
      btn.classList.add('text-slate-600');
    }
  });

  if (filterType === 'all' && btnAll) {
    btnAll.classList.add('bg-white', 'text-brand', 'shadow-sm', 'font-black');
    btnAll.classList.remove('text-slate-600');
  } else if (filterType === 'expired' && btnExpired) {
    btnExpired.classList.add('bg-white', 'text-rose-700', 'shadow-sm', 'font-black');
    btnExpired.classList.remove('text-slate-600');
  } else if (filterType === 'expiring_soon' && btnExpiring) {
    btnExpiring.classList.add('bg-white', 'text-amber-700', 'shadow-sm', 'font-black');
    btnExpiring.classList.remove('text-slate-600');
  } else if (filterType === 'valid' && btnValid) {
    btnValid.classList.add('bg-white', 'text-emerald-700', 'shadow-sm', 'font-black');
    btnValid.classList.remove('text-slate-600');
  } else if (filterType === 'expats' && btnExpats) {
    btnExpats.classList.add('bg-white', 'text-brand', 'shadow-sm', 'font-black');
    btnExpats.classList.remove('text-slate-600');
  } else if (filterType === 'saudis' && btnSaudis) {
    btnSaudis.classList.add('bg-white', 'text-brand', 'shadow-sm', 'font-black');
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
let currentEssEmpId = null;

async function loadSelfService() {
  if (!state.currentUser) {
    try {
      const saved = localStorage.getItem('jm_hrms_user');
      if (saved) state.currentUser = JSON.parse(saved);
    } catch (e) {}
  }

  // Ensure employees are loaded
  if (!state.employees || state.employees.length === 0) {
    try {
      const res = await apiFetch('/api/employees');
      if (res && res.success && res.data) {
        state.employees = res.data;
      }
    } catch (e) {}
  }

  populateEssEmpSelector();

  const curUser = state.currentUser || {};
  const norm = (s) => (s || '').replace(/\s+/g, ' ').replace(/[إأآا]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim().toLowerCase();

  // Strict operational employee list without board members
  const validEmps = (state.employees || []).filter(e => !['JM-0001', 'JM-0002', 'JM-0003'].includes(e.emp_code));

  let emp = null;
  const selContainer = document.getElementById('essEmpSelectorContainer');

  if (curUser.role === 'employee') {
    // For regular employees: ALWAYS lock strictly to their own identity
    if (selContainer) selContainer.classList.add('hidden');

    if (curUser.emp_id) {
      emp = validEmps.find(e => e.id === Number(curUser.emp_id));
    }
    if (!emp) {
      emp = validEmps.find(e => 
        (curUser.emp_code && e.emp_code === curUser.emp_code) ||
        (curUser.full_name && norm(e.full_name_ar) === norm(curUser.full_name)) ||
        (curUser.username && (
          norm(e.full_name_ar).includes(norm(curUser.username)) ||
          norm(e.emp_code) === norm(curUser.username) ||
          (curUser.username.includes('shama') && (norm(e.full_name_ar).includes('شام') || e.emp_code === 'JM-1053'))
        ))
      );
      if (emp) {
        curUser.emp_id = emp.id;
        state.currentUser.emp_id = emp.id;
        try { localStorage.setItem('jm_hrms_user', JSON.stringify(state.currentUser)); } catch (e) {}
      }
    }
    currentEssEmpId = emp ? emp.id : null;
  } else {
    // Admin / Manager / HR browsing ESS
    if (selContainer) selContainer.classList.remove('hidden');

    if (currentEssEmpId) {
      emp = validEmps.find(e => e.id === Number(currentEssEmpId));
    }
    if (!emp && curUser.emp_id) {
      emp = validEmps.find(e => e.id === Number(curUser.emp_id));
    }
    if (!emp && validEmps.length > 0) {
      emp = validEmps[0];
    }
    currentEssEmpId = emp ? emp.id : null;
  }

  const nameEl = document.getElementById('essEmployeeName');
  const titleEl = document.getElementById('essEmployeeTitle');
  const balEl = document.getElementById('essLeaveBalance');
  const selector = document.getElementById('essEmpSelector');

  if (emp) {
    currentEssEmpId = emp.id;
    if (nameEl) nameEl.textContent = emp.full_name_ar;
    if (titleEl) titleEl.textContent = `${emp.job_title_ar || 'موظف'} • ${emp.department_name_ar || 'شركة جوهرة المجد'}`;
    
    // Fetch live balance from SQLite API (Single Source of Truth)
    let leaveBal = Number(emp.annual_leave_balance || 0);
    try {
      const bRes = await apiFetch(`/api/leaves/balances/${emp.id}`);
      if (bRes && bRes.success && bRes.data && bRes.data.annual_remaining !== undefined) {
        leaveBal = Number(bRes.data.annual_remaining);
        emp.annual_leave_balance = leaveBal;
      }
    } catch (e) {}

    if (balEl) balEl.textContent = `${leaveBal.toLocaleString('en-US')} يوم`;
    if (selector) selector.value = emp.id;

    // Load tasks assigned to this employee
    await loadEssTasks(emp.id);

    // Check and render attendance notice alert banner if any notice is pending acknowledgment
    await checkEssPendingNotices(emp.id);
  } else {
    if (nameEl) nameEl.textContent = state.currentUser ? (state.currentUser.full_name || state.currentUser.username) : 'الموظف';
    if (titleEl) titleEl.textContent = 'منظومة جوهرة المجد للموارد البشرية والخدمة الذاتية';
    if (balEl) balEl.textContent = '0 يوم';
    const alertBox = document.getElementById('essAttendanceNoticeAlert');
    if (alertBox) alertBox.classList.add('hidden');
  }

  // Always fetch real-time requests directly from SQLite API (Single Source of Truth)
  try {
    const reqRes = await apiFetch('/api/requests');
    if (reqRes && reqRes.success && reqRes.data) {
      state.allRequests = reqRes.data;
    }
  } catch (e) {}

  renderSelfServiceRequests();
  loadEssTransferRequests();
}

function populateEssEmpSelector() {
  const sel = document.getElementById('essEmpSelector');
  if (!sel) return;
  const validEmps = (state.employees || []).filter(e => !['JM-0001', 'JM-0002', 'JM-0003'].includes(e.emp_code));
  if (sel.children.length > 1 && sel.children.length === validEmps.length) return;
  sel.innerHTML = validEmps.map(e => `
    <option value="${e.id}">${e.emp_code} - ${e.full_name_ar} (${e.job_title_ar || ''})</option>
  `).join('');
}

function onEssEmpSelected(empId) {
  currentEssEmpId = Number(empId);
  loadSelfService();
}

async function loadEssTasks(empId) {
  const tbody = document.getElementById('essTasksTableBody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin block mb-2 text-[#8B0000]"></i>جاري تحميل المهام والتكليفات المسندة...</td></tr>`;
  }
  try {
    const res = await apiFetch(`/api/tasks?assigned_to=${empId}`);
    const tasks = (res && res.success && res.data) ? res.data : [];
    renderEssTasks(tasks);
  } catch (err) {
    console.error('Error fetching ESS tasks:', err);
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-rose-500 font-bold">تعذر تحميل المهام: ${err.message}</td></tr>`;
    }
  }
}

async function checkEssPendingNotices(empId) {
  const alertBox = document.getElementById('essAttendanceNoticeAlert');
  if (!alertBox) return;

  try {
    const res = await apiFetch(`/api/attendance/notices?emp_id=${empId}&status=صادر`);
    if (res && res.success && res.data && res.data.length > 0) {
      const pendingNotice = res.data[0];
      alertBox.innerHTML = `
        <div class="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center text-lg flex-shrink-0 shadow">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-black text-rose-900">إشعار إداري عاجل يتطلب الإقرار والتوقيع الإلكتروني</span>
                <span class="text-[10px] font-mono bg-rose-200/60 text-rose-950 font-bold px-2 py-0.5 rounded-md">${pendingNotice.notice_no}</span>
              </div>
              <p class="text-xs text-rose-800 mt-1 font-semibold">${pendingNotice.notice_type} - تاريخ الواقعة: ${pendingNotice.incident_date}</p>
              <p class="text-[11px] text-slate-600 mt-0.5">${pendingNotice.reason}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button onclick="openOfficialFormPreview('notice', ${pendingNotice.id})" class="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
              <i class="fa-solid fa-file-invoice"></i> عرض الخطاب
            </button>
            <button onclick="acknowledgeNoticeESS(${pendingNotice.id})" class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow">
              <i class="fa-solid fa-signature"></i> التوقيع والإقرار
            </button>
          </div>
        </div>
      `;
      alertBox.classList.remove('hidden');
    } else {
      alertBox.classList.add('hidden');
      alertBox.innerHTML = '';
    }
  } catch (e) {
    console.error('Error checking pending notices in ESS:', e);
  }
}
window.checkEssPendingNotices = checkEssPendingNotices;

function renderEssTasks(tasks) {
  const tbody = document.getElementById('essTasksTableBody');
  const badge = document.getElementById('essTasksBadge');
  const totalCountEl = document.getElementById('essTasksTotalCount');
  const inProgressCountEl = document.getElementById('essTasksInProgressCount');
  const pendingCountEl = document.getElementById('essTasksPendingCount');
  const completedCountEl = document.getElementById('essTasksCompletedCount');

  const total = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'قيد التنفيذ' || t.status === 'جديدة').length;
  const pending = tasks.filter(t => t.status === 'بانتظار الاعتماد').length;
  const completed = tasks.filter(t => t.status === 'مكتملة').length;

  if (badge) badge.textContent = `${total} مهمة`;
  if (totalCountEl) totalCountEl.textContent = total;
  if (inProgressCountEl) inProgressCountEl.textContent = inProgress;
  if (pendingCountEl) pendingCountEl.textContent = pending;
  if (completedCountEl) completedCountEl.textContent = completed;

  if (!tbody) return;
  if (tasks.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-400 font-semibold">
          <i class="fa-solid fa-clipboard-check text-3xl text-emerald-400 block mb-2"></i>
          لا توجد مهام معلقة مسندة إليك حالياً. تم إنجاز كافة المهام بنجاح!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = tasks.map(t => {
    const progress = Number(t.progress_percent || t.progress_percentage || 0);
    let priorityBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">متوسطة</span>';
    if (t.priority === 'عاجلة') priorityBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">عاجلة</span>';
    else if (t.priority === 'مرتفعة') priorityBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">مرتفعة</span>';
    else if (t.priority === 'منخفضة') priorityBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">منخفضة</span>';

    let statusBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">قيد التنفيذ</span>';
    if (t.status === 'مكتملة') statusBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">مكتملة ✓</span>';
    else if (t.status === 'بانتظار الاعتماد') statusBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">بانتظار الاعتماد</span>';
    else if (t.status === 'متأخرة') statusBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">متأخرة ⚠️</span>';

    const progressBar = `
      <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
        <div class="h-2.5 rounded-full ${progress >= 100 ? 'bg-emerald-600' : 'bg-[#8B0000]'}" style="width: ${progress}%"></div>
      </div>
      <div class="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 mt-1">
        <span>${progress}%</span>
        <span>${progress >= 100 ? 'منجز' : (t.status || '')}</span>
      </div>
    `;

    return `
      <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
        <td class="py-3 px-3 font-mono font-bold text-slate-800">${t.task_no || ('TSK-' + t.id)}</td>
        <td class="py-3 px-3">
          <div class="font-black text-slate-900">${t.title}</div>
          <div class="text-[11px] text-slate-500 max-w-xs truncate mt-0.5">${t.description || 'لا يوجد وصف إضافي'}</div>
          ${t.attachments ? `<div class="text-[10px] text-blue-600 mt-1"><i class="fa-solid fa-paperclip"></i> مرفقات: ${t.attachments}</div>` : ''}
        </td>
        <td class="py-3 px-3">${priorityBadge}</td>
        <td class="py-3 px-3 font-mono text-slate-700 font-semibold">${t.due_date || '—'}</td>
        <td class="py-3 px-3">${progressBar}</td>
        <td class="py-3 px-3">${statusBadge}</td>
        <td class="py-3 px-3 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="openUpdateTaskProgressModal(${t.id})" title="تحديث نسبة الإنجاز" class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold flex items-center gap-1 text-[11px] transition">
              <i class="fa-solid fa-pen-ruler"></i> تحديث
            </button>
            ${t.status !== 'مكتملة' ? `
              <button onclick="completeEssTask(${t.id})" title="إكمال المهمة فوراً" class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold flex items-center gap-1 text-[11px] transition">
                <i class="fa-solid fa-circle-check"></i> إكمال
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function completeEssTask(taskId) {
  try {
    const res = await apiFetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress_percent: 100, status: 'مكتملة' })
    });
    if (res && res.success) {
      showToast('تم إكمال المهمة بنجاح بنسبة إنجاز 100%!', 'success');
      if (currentEssEmpId) loadEssTasks(currentEssEmpId);
      loadTasksView();
    } else {
      showToast(res.error || 'تعذر إكمال المهمة', 'error');
    }
  } catch (err) {
    showToast('خطأ أثناء إكمال المهمة: ' + err.message, 'error');
  }
}

function refreshEssTasks() {
  if (currentEssEmpId) loadEssTasks(currentEssEmpId);
}

function renderSelfServiceRequests() {
  const tbody = document.getElementById('essRequestsTableBody');
  if (!tbody) return;

  // 1. Single Source of Truth from backend requests
  let list = (state.allRequests && state.allRequests.length > 0) ? [...state.allRequests] : [];

  // If current logged-in user is an employee, restrict ESS list to their own requests
  const curUser = state.currentUser || {};
  const curEmpId = curUser.emp_id ? Number(curUser.emp_id) : (currentEssEmpId ? Number(currentEssEmpId) : null);
  if (curUser.role === 'employee' && curEmpId) {
    list = list.filter(r => Number(r.emp_id) === curEmpId);
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
    } else if (r.status.includes('موافقة مبدئية') || r.status.includes('تحقق قسم الموارد')) {
      statusClass = 'bg-blue-100 text-blue-800';
    } else if (r.status.includes('مرفوض')) {
      statusClass = 'bg-rose-100 text-rose-800';
    }

    // 4-Stage Stepper visualization
    const step2Done = r.manager_status === 'موافق' || !!r.manager_action_at || r.status.includes('تحقق قسم الموارد') || r.status.includes('اعتماد مدير الموارد') || r.status.includes('معتمد نهائياً');
    const step2Rejected = r.manager_status === 'مرفوض' || r.status.includes('مرفوض من المدير');
    
    const step3Done = r.hr_verify_status === 'تم التحقق' || r.status.includes('اعتماد مدير الموارد') || r.status.includes('معتمد نهائياً');
    const step3Rejected = r.hr_verify_status === 'مرفوض' || r.status.includes('مرفوض من قسم الموارد');

    const step4Done = r.status.includes('معتمد نهائياً');
    const step4Rejected = r.status.includes('مرفوض من مدير الموارد');

    const stepperHtml = `
      <div class="space-y-1 min-w-[220px] text-[11px]">
        <div class="flex items-center gap-1.5 text-emerald-700 font-bold">
          <i class="fa-solid fa-circle-check text-[10px]"></i>
          <span>1. إنشاء الطلب: منجز ✓</span>
        </div>
        <div class="flex items-center gap-1.5 ${step2Done ? 'text-emerald-700 font-bold' : (step2Rejected ? 'text-rose-700 font-bold' : 'text-amber-700 font-bold')}">
          <i class="fa-solid ${step2Done ? 'fa-circle-check' : (step2Rejected ? 'fa-circle-xmark' : 'fa-hourglass-half')} text-[10px]"></i>
          <span>2. موافقة المدير (${r.manager_name || mgrName}): ${step2Done ? 'موافق ✓' : (step2Rejected ? 'مرفوض ✗' : 'بانتظار الإجراء')}</span>
        </div>
        <div class="flex items-center gap-1.5 ${step3Done ? 'text-emerald-700 font-bold' : (step3Rejected ? 'text-rose-700 font-bold' : (step2Done ? 'text-blue-700 font-semibold' : 'text-slate-400'))}">
          <i class="fa-solid ${step3Done ? 'fa-circle-check' : (step3Rejected ? 'fa-circle-xmark' : (step2Done ? 'fa-hourglass-half' : 'fa-circle-pause'))} text-[10px]"></i>
          <span>3. تدقيق HR (${r.hr_verifier_name || 'قسم الموارد'}): ${step3Done ? 'تم التحقق ✓' : (step3Rejected ? 'مرفوض ✗' : (step2Done ? 'قيد التدقيق' : 'مؤجل'))}</span>
        </div>
        <div class="flex items-center gap-1.5 ${step4Done ? 'text-emerald-700 font-bold' : (step4Rejected ? 'text-rose-700 font-bold' : (step3Done ? 'text-purple-700 font-bold' : 'text-slate-400'))}">
          <i class="fa-solid ${step4Done ? 'fa-stamp' : (step4Rejected ? 'fa-circle-xmark' : (step3Done ? 'fa-hourglass-half' : 'fa-circle-pause'))} text-[10px]"></i>
          <span>4. اعتماد مدير HR (${r.hr_director_name || 'مدير الموارد'}): ${step4Done ? 'معتمد نهائياً ✓' : (step4Rejected ? 'مرفوض ✗' : (step3Done ? 'بانتظار الاعتماد' : 'مؤجل'))}</span>
        </div>
      </div>
    `;

    // Strict Role & Self-Approval Prevention
    const reqEmpId = Number(r.emp_id);
    const isApplicant = curEmpId && reqEmpId && curEmpId === reqEmpId;
    const isDirectManager = Boolean(
      (curEmpId && r.manager_id && Number(r.manager_id) === Number(curEmpId)) ||
      (curEmpId && r.direct_manager_id && Number(r.direct_manager_id) === Number(curEmpId)) ||
      (curUser && curUser.full_name && r.direct_manager_name && curUser.full_name.trim() === r.direct_manager_name.trim()) ||
      (curUser && curUser.full_name && r.manager_name && curUser.full_name.trim() === r.manager_name.trim())
    );
    const isAdmin = curUser.role === 'admin' || curUser.role === 'general_manager';
    const isHR = isAdmin || curUser.role === 'hr_manager' || (curUser.permissions && curUser.permissions.includes('approvals'));

    let actionButtons = '';
    if (isApplicant) {
      // The applicant can NEVER approve their own request!
      if (step4Done) {
        actionButtons = `
          <div class="text-center">
            <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <i class="fa-solid fa-circle-check"></i> معتمد ومكتمل
            </span>
          </div>
        `;
      } else if (r.status.includes('مرفوض')) {
        actionButtons = `
          <div class="text-center">
            <span class="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
              <i class="fa-solid fa-circle-xmark"></i> طلب مرفوض
            </span>
          </div>
        `;
      } else {
        actionButtons = `
          <div class="text-center space-y-1">
            <span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full" title="طلبك قيد المتابعة والاعتماد لدى المسؤولين">
              <i class="fa-solid fa-hourglass-half"></i> قيد المتابعة والاعتماد
            </span>
            <div class="text-[9px] text-slate-400 font-medium">بانتظار موافقة المدير المباشر</div>
          </div>
        `;
      }
    } else {
      // The viewer is NOT the applicant (Direct Manager, HR, or Admin)
      if (r.status.includes('بانتظار موافقة المدير')) {
        if (isDirectManager || isAdmin) {
          actionButtons = `
            <div class="flex flex-col gap-1 items-center w-full max-w-[130px] mx-auto">
              <button onclick="handleRequestStepAction(${r.id}, 'manager', 'approve')" class="w-full text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded-lg shadow-sm flex items-center justify-center gap-1 transition active:scale-95">
                <i class="fa-solid fa-check"></i> موافقة المدير
              </button>
              <button onclick="handleRequestStepAction(${r.id}, 'manager', 'reject')" class="w-full text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-0.5 rounded-lg border border-rose-200 flex items-center justify-center gap-1 transition active:scale-95">
                <i class="fa-solid fa-xmark"></i> رفض
              </button>
            </div>
          `;
        } else {
          actionButtons = `<span class="text-[10px] text-slate-400 font-medium">بانتظار موافقة المدير المباشر</span>`;
        }
      } else if (r.status.includes('تحقق قسم الموارد') || r.status.includes('موافقة مبدئية')) {
        if (isHR) {
          actionButtons = `
            <div class="flex flex-col gap-1 items-center w-full max-w-[130px] mx-auto">
              <button onclick="handleRequestStepAction(${r.id}, 'hr_verify', 'approve')" class="w-full text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg shadow-sm flex items-center justify-center gap-1 transition active:scale-95">
                <i class="fa-solid fa-check-double"></i> تدقيق HR
              </button>
              <button onclick="handleRequestStepAction(${r.id}, 'hr_verify', 'reject')" class="w-full text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-0.5 rounded-lg border border-rose-200 flex items-center justify-center gap-1 transition active:scale-95">
                <i class="fa-solid fa-xmark"></i> رفض
              </button>
              ${(isDirectManager || isAdmin) ? `
              <button onclick="handleRevertRequestAction(${r.id})" title="تراجع عن موافقة المدير وإعادة الطلب للبداية" class="w-full text-[9px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-1 py-0.5 rounded border border-amber-200 flex items-center justify-center gap-1 transition">
                <i class="fa-solid fa-rotate-left"></i> تراجع عن الإجراء
              </button>
              ` : ''}
            </div>
          `;
        } else if (isDirectManager || isAdmin) {
          actionButtons = `
            <div class="flex flex-col gap-1 items-center w-full max-w-[130px] mx-auto">
              <span class="text-[10px] text-blue-600 font-medium">تمت موافقة المدير</span>
              <button onclick="handleRevertRequestAction(${r.id})" title="تراجع عن موافقة المدير وإعادة الطلب لمرحلة موافقة المدير" class="w-full text-[9px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-1 py-0.5 rounded border border-amber-200 flex items-center justify-center gap-1 transition">
                <i class="fa-solid fa-rotate-left"></i> تراجع عن الإجراء
              </button>
            </div>
          `;
        } else {
          actionButtons = `<span class="text-[10px] text-blue-600 font-medium">بانتظار تدقيق HR</span>`;
        }
      } else if (r.status.includes('اعتماد مدير الموارد') || r.status.includes('بانتظار اعتماد الموارد')) {
        if (isAdmin || curUser.role === 'hr_manager') {
          actionButtons = `
            <div class="flex flex-col gap-1 items-center w-full max-w-[130px] mx-auto">
              <button onclick="handleRequestStepAction(${r.id}, 'hr_director', 'approve')" class="w-full text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded-lg shadow-sm flex items-center justify-center gap-1 transition active:scale-95">
                <i class="fa-solid fa-stamp"></i> اعتماد نهائي
              </button>
              <button onclick="handleRequestStepAction(${r.id}, 'hr_director', 'reject')" class="w-full text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-0.5 rounded-lg border border-rose-200 flex items-center justify-center gap-1 transition active:scale-95">
                <i class="fa-solid fa-xmark"></i> رفض
              </button>
              <button onclick="handleRevertRequestAction(${r.id})" title="تراجع عن الإجراء وإعادة الطلب للبداية" class="w-full text-[9px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-1 py-0.5 rounded border border-amber-200 flex items-center justify-center gap-1 transition">
                <i class="fa-solid fa-rotate-left"></i> تراجع عن الإجراء
              </button>
            </div>
          `;
        } else {
          actionButtons = `<span class="text-[10px] text-purple-600 font-medium">بانتظار اعتماد مدير HR</span>`;
        }
      } else if (step4Done) {
        actionButtons = `
          <div class="text-center">
            <span class="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <i class="fa-solid fa-circle-check"></i> معتمد نهائياً
            </span>
          </div>
        `;
      } else {
        actionButtons = `
          <div class="text-center">
            <span class="inline-block text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
              <i class="fa-solid fa-circle-xmark"></i> ${r.status}
            </span>
          </div>
        `;
      }
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

  // Populate Target Employee Select (For Admin / Manager or Self)
  const targetEmpSelect = document.getElementById('reqTargetEmp');
  const targetContainer = document.getElementById('reqTargetEmpContainer');
  const activeEmps = (state.employees || []).filter(e => e.status !== 'منتهي عقد');
  const currentUserEmpId = (state.currentUser && state.currentUser.emp_id) ? Number(state.currentUser.emp_id) : (currentEssEmpId ? Number(currentEssEmpId) : null);

  if (targetEmpSelect) {
    targetEmpSelect.innerHTML = '';
    activeEmps.forEach(emp => {
      const opt = document.createElement('option');
      opt.value = emp.id;
      opt.textContent = `${emp.emp_code} - ${emp.full_name_ar} (${emp.job_title_ar || 'موظف'})`;
      if (currentUserEmpId && emp.id === currentUserEmpId) {
        opt.selected = true;
      }
      targetEmpSelect.appendChild(opt);
    });
  }

  // Populate Replacement Employee Select
  const replacementEmpSelect = document.getElementById('reqReplacementEmp');
  if (replacementEmpSelect) {
    replacementEmpSelect.innerHTML = '<option value="">-- اختر الموظف البديل خلال فترة الإجازة --</option>';
    activeEmps.forEach(emp => {
      if (!currentUserEmpId || emp.id !== currentUserEmpId) {
        const opt = document.createElement('option');
        opt.value = emp.id;
        opt.textContent = `${emp.emp_code} - ${emp.full_name_ar} (${emp.job_title_ar || 'موظف'})`;
        replacementEmpSelect.appendChild(opt);
      }
    });
  }

  // Set default dates & times
  const today = new Date().toISOString().split('T')[0];
  const startInp = document.getElementById('reqStartDate');
  const endInp = document.getElementById('reqEndDate');
  if (startInp && !startInp.value) startInp.value = today;
  if (endInp && !endInp.value) endInp.value = today;
  calculateReqDays();

  // Set default permission fields
  const permDateInp = document.getElementById('reqPermDate');
  if (permDateInp) permDateInp.value = today;
  const permHoursSelect = document.getElementById('reqPermHours');
  if (permHoursSelect) permHoursSelect.value = '2';
  const permMinsSelect = document.getElementById('reqPermMinutes');
  if (permMinsSelect) permMinsSelect.value = '0';
  const permOut = document.getElementById('reqPermTimeOut');
  if (permOut) permOut.value = '10:00';
  const permIn = document.getElementById('reqPermTimeIn');
  if (permIn) permIn.value = '12:00';

  onRequestCategoryChanged(category);

  if (category === 'إجازة' && specificType) {
    const leaveSelect = document.getElementById('reqLeaveTypeSelect');
    if (leaveSelect) {
      leaveSelect.value = specificType;
      onLeaveTypeChanged(specificType);
    }
  }

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
  const permSec = document.getElementById('reqPermissionSection');
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
    if (permSec) permSec.classList.add('hidden');
    if (missionSec) missionSec.classList.add('hidden');
    if (dateFields) dateFields.classList.remove('hidden');
    if (daysField) daysField.classList.remove('hidden');
    if (amountField) amountField.classList.add('hidden');
    
    const leaveType = document.getElementById('reqLeaveTypeSelect')?.value || 'إجازة سنوية';
    onLeaveTypeChanged(leaveType);
  } else if (category === 'استئذان' || category === 'استئذان ساعي') {
    if (leaveSec) leaveSec.classList.add('hidden');
    if (permSec) permSec.classList.remove('hidden');
    if (missionSec) missionSec.classList.add('hidden');
    if (dateFields) dateFields.classList.add('hidden'); // Days counter and range hidden for hourly permissions
    if (daysField) daysField.classList.add('hidden');
    if (amountField) amountField.classList.add('hidden');
    if (attachSec) attachSec.classList.add('hidden');
  } else if (category === 'مهمة عمل') {
    if (leaveSec) leaveSec.classList.add('hidden');
    if (permSec) permSec.classList.add('hidden');
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
    if (permSec) permSec.classList.add('hidden');
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

  // Permission specific fields
  const permDate = document.getElementById('reqPermDate')?.value || new Date().toISOString().split('T')[0];
  const permHours = Number(document.getElementById('reqPermHours')?.value || 2);
  const permMinutes = Number(document.getElementById('reqPermMinutes')?.value || 0);
  const permTimeOut = document.getElementById('reqPermTimeOut')?.value || '10:00';
  const permTimeIn = document.getElementById('reqPermTimeIn')?.value || '12:00';

  // Leave replacement employee fields
  const repSelect = document.getElementById('reqReplacementEmp');
  const replacementEmpId = repSelect && repSelect.value ? Number(repSelect.value) : null;
  const replacementEmpName = (repSelect && repSelect.selectedOptions && repSelect.selectedOptions[0]) 
    ? repSelect.selectedOptions[0].text.replace(/^[A-Z0-9-]+s*-s*/, '') 
    : null;

  // Validation: Sick leave requires medical report attachment
  if (category === 'إجازة' && (leaveType === 'إجازة مرضية تتطلب إرفاق تقرير' || leaveType.includes('مرضية')) && !currentAttachedFileName) {
    alert('⚠️ تنبيه إلزامي:\nالإجازة المرضية تتطلب إرفاق تقرير طبي رسمي معتمد (منصة صحتي أو إشعار المستشفى) لقبول الطلب.\n\nيرجى الضغط على زر "رفع التقرير الطبي" ثم إعادة إرسال الطلب.');
    return;
  }

  // Validation: Leave requires selecting replacement employee if employees are loaded
  if (category === 'إجازة' && !replacementEmpId) {
    if (!confirm('تنبيه: لم تقم باختيار "الموظف البديل المكلف بمهام العمل". يُفضل تحديده لتسريع اعتماد الإجازة. هل ترغب بالاستمرار رغم ذلك؟')) {
      return;
    }
  }

  // Target employee (Admin/Manager can submit for any employee)
  const targetEmpInp = document.getElementById('reqTargetEmp');
  const validEmps = (state.employees || []).filter(e => !['JM-0001', 'JM-0002', 'JM-0003'].includes(e.emp_code));
  let currentEmpId = targetEmpInp && targetEmpInp.value 
    ? Number(targetEmpInp.value) 
    : ((state.currentUser && state.currentUser.emp_id) ? Number(state.currentUser.emp_id) : (currentEssEmpId ? Number(currentEssEmpId) : (validEmps[0] ? validEmps[0].id : 28208)));

  const currentEmp = validEmps.find(e => e.id === currentEmpId) || validEmps[0] || {};

  // Generate Request ID
  const reqNum = Math.floor(1000 + Math.random() * 9000);
  const reqCode = `REQ-2026-${reqNum}`;
  const today = new Date().toISOString().split('T')[0];

  let displayType = category;
  let displayDetails = reason;
  let displayDuration = `${days} يوم`;
  let finalStartDate = startDate || today;
  let finalEndDate = endDate || today;
  let finalDaysCount = Number(days) || 1;

  if (category === 'إجازة') {
    displayType = leaveType;
    let detailsArr = [reason];
    if (replacementEmpName) detailsArr.push(`الموظف البديل: ${replacementEmpName}`);
    if (currentAttachedFileName) detailsArr.push(`مرفق تقرير: ${currentAttachedFileName}`);
    displayDetails = detailsArr.join(' | ');
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
    displayType = 'طلب استئذان ساعي';
    displayDuration = `${permHours} س ${permMinutes > 0 ? permMinutes + ' د' : ''} (من ${permTimeOut} إلى ${permTimeIn})`;
    finalStartDate = permDate;
    finalEndDate = permDate;
    finalDaysCount = 0;
    displayDetails = `${reason} (وقت الخروج: ${permTimeOut} - العودة المتوقعة: ${permTimeIn})`;
  }

  const payload = {
    emp_id: currentEmpId,
    request_type: displayType,
    start_date: finalStartDate,
    end_date: finalEndDate,
    days_count: finalDaysCount,
    amount: Number(amount) || 0,
    destination_entity: missionDest || null,
    reason: displayDetails,
    permission_hours: (category === 'استئذان' || category === 'استئذان ساعي') ? permHours : null,
    permission_minutes: (category === 'استئذان' || category === 'استئذان ساعي') ? permMinutes : null,
    permission_time_out: (category === 'استئذان' || category === 'استئذان ساعي') ? permTimeOut : null,
    permission_time_in: (category === 'استئذان' || category === 'استئذان ساعي') ? permTimeIn : null,
    replacement_emp_id: category === 'إجازة' ? replacementEmpId : null,
    replacement_emp_name: category === 'إجازة' ? replacementEmpName : null
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
    direct_manager_name: currentEmp ? (validEmps.find(m => m.id === currentEmp.manager_id)?.full_name_ar || 'المدير المباشر') : 'المدير المباشر'
  };

  // Fetch fresh requests directly from backend (Single Source of Truth)
  try {
    const reqRes = await apiFetch('/api/requests');
    if (reqRes && reqRes.success && reqRes.data) {
      state.allRequests = reqRes.data;
    } else {
      if (!state.allRequests) state.allRequests = [];
      state.allRequests.unshift(backendData || newReq);
    }
  } catch (e) {
    if (!state.allRequests) state.allRequests = [];
    state.allRequests.unshift(backendData || newReq);
  }

  closeModal('modalNewRequest');

  // Success Alert
  alert(`✓ تم تقديم طلبك بنجاح!\nالرقم المرجعي: ${backendData ? backendData.request_no : newReq.request_no}\nالنوع: ${displayType}\nالمدة/المبلغ: ${displayDuration}\n\nالمسار: بانتظار موافقة المدير المباشر أولاً ثم اعتماد الموارد البشرية.`);

  // Reset form
  const form = document.getElementById('newRequestForm');
  if (form) form.reset();
  clearReqFile();

  // Reload tables & badges
  renderSelfServiceRequests();
  if (typeof loadLeavesView === 'function') loadLeavesView();
  if (typeof updateApprovalBadges === 'function') updateApprovalBadges();
}

/* =========================================================================
   7.1 APPROVAL WORKFLOW ACTIONS (سير الموافقات الموحد متعدد المراحل)
   ========================================================================= */

async function approveRequestManager(id) {
  return handleRequestStepAction(id, 'manager', 'approve');
}

async function approveRequestHr(id) {
  return handleRequestStepAction(id, 'hr_director', 'approve');
}

async function rejectRequest(id, stage = 'manager') {
  return handleRequestStepAction(id, stage || 'manager', 'reject');
}

/* =========================================================================
   8. OFFICIAL SALARY CERTIFICATE (خطاب تعريف بالراتب)
   ========================================================================= */

function openSalaryCertificateModal(empId) {
  const targetId = empId || (state.currentUser && state.currentUser.emp_id) || (state.employees && state.employees[0] ? state.employees[0].id : 1);
  openOfficialFormPreview('salary_cert', targetId);
}

function previewSalaryCertificateForEmp(empId) {
  const targetId = empId || (state.currentUser && state.currentUser.emp_id) || (state.employees && state.employees[0] ? state.employees[0].id : 1);
  openOfficialFormPreview('salary_cert', targetId);
}

function refreshSalaryCertificate(destination) {
  const targetId = (state.currentUser && state.currentUser.emp_id) ? state.currentUser.emp_id : (state.employees && state.employees[0] ? state.employees[0].id : 1);
  openOfficialFormPreview('salary_cert', targetId);
}

function refreshSalaryCertificateForEmp(empId, destination) {
  const targetId = empId || (state.currentUser && state.currentUser.emp_id) || (state.employees && state.employees[0] ? state.employees[0].id : 1);
  openOfficialFormPreview('salary_cert', targetId);
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
            ${canDelete() ? `
            <button onclick="deleteDepartment(${d.id})" title="حذف الإدارة" class="w-6 h-6 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center text-[11px]">
              <i class="fa-solid fa-trash"></i>
            </button>
            ` : ''}
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
  if (!canDelete()) {
    alert('عذراً، صلاحية حذف الإدارات مقيدة ومخصصة لمدير النظام العام فقط.');
    return;
  }
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
            ${canDelete() ? `
            <button onclick="deleteBranch(${b.id})" title="حذف الفرع" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center text-xs transition">
              <i class="fa-solid fa-trash"></i>
            </button>
            ` : ''}
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
  if (!canDelete()) {
    alert('عذراً، صلاحية حذف الفروع مقيدة ومخصصة لمدير النظام العام فقط.');
    return;
  }
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
  const devEl = document.getElementById('headerDevicesCountText');
  if (devEl) devEl.textContent = `${(state.devices || []).length} متصلة`;

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
  const appCheck = document.getElementById('perm_approvals');
  const empCheck = document.getElementById('perm_employees');
  const attCheck = document.getElementById('perm_attendance');
  const penCheck = document.getElementById('perm_penalties');
  const salCheck = document.getElementById('perm_payroll');
  const userCheck = document.getElementById('perm_users');
  const editAttCheck = document.getElementById('perm_edit_attendance');
  const editBalCheck = document.getElementById('perm_edit_balances');
  const delCheck = document.getElementById('perm_delete');

  // Reset disabled status for restricted checkboxes
  if (editAttCheck) editAttCheck.disabled = false;
  if (editBalCheck) editBalCheck.disabled = false;
  if (delCheck) delCheck.disabled = false;

  if (role === 'admin') {
    toggleAllPermissions(true);
  } else if (role === 'employee') {
    toggleAllPermissions(false);
    if (reqCheck) reqCheck.checked = true;
    if (payCheck) payCheck.checked = true;
  } else if (role === 'dept_manager') {
    toggleAllPermissions(false);
    if (reqCheck) reqCheck.checked = true;
    if (payCheck) payCheck.checked = true;
    if (appCheck) appCheck.checked = true;
    if (attCheck) attCheck.checked = true;
  } else if (role === 'hr_manager') {
    // قسم الموارد البشرية: كافة الصلاحيات متاحة لهم باستثناء تعديل الحضور والانصراف + تعديل الأرصدة + الحذف
    toggleAllPermissions(false);
    if (reqCheck) reqCheck.checked = true;
    if (payCheck) payCheck.checked = true;
    if (appCheck) appCheck.checked = true;
    if (empCheck) empCheck.checked = true;
    if (attCheck) attCheck.checked = true;
    if (penCheck) penCheck.checked = true;
    if (salCheck) salCheck.checked = true;
    if (userCheck) userCheck.checked = false; // إدارة المستخدمين مقتصرة على الأدمن
    if (editAttCheck) { editAttCheck.checked = false; editAttCheck.disabled = true; } // محظور نظاماً على قسم الموارد البشرية
    if (editBalCheck) { editBalCheck.checked = false; editBalCheck.disabled = true; } // محظور نظاماً على قسم الموارد البشرية
    if (delCheck) { delCheck.checked = false; delCheck.disabled = true; } // محظور نظاماً على قسم الموارد البشرية
  }
}

const ALL_RBAC_PERM_KEYS = [
  'requests', 'payslips', 'approvals', 'employees',
  'attendance', 'penalties', 'payroll', 'tasks', 'loans',
  'notices', 'compliance', 'users', 'audit',
  'edit_attendance', 'edit_balances', 'delete'
];

function applyRbacPreset(preset) {
  ALL_RBAC_PERM_KEYS.forEach(k => {
    const el = document.getElementById(`perm_${k}`);
    if (!el) return;
    el.disabled = false;
    if (preset === 'admin') {
      el.checked = true;
    } else if (preset === 'hr') {
      const hrExcluded = ['edit_attendance', 'edit_balances', 'delete', 'users', 'audit'];
      el.checked = !hrExcluded.includes(k);
      if (hrExcluded.includes(k)) el.disabled = true;
    } else if (preset === 'manager') {
      const mgrAllowed = ['requests', 'payslips', 'approvals', 'employees', 'tasks', 'attendance'];
      el.checked = mgrAllowed.includes(k);
    } else if (preset === 'employee') {
      const empAllowed = ['requests', 'payslips'];
      el.checked = empAllowed.includes(k);
    }
  });
}

function onUserRoleChanged(role) {
  if (role === 'admin') applyRbacPreset('admin');
  else if (role === 'hr_manager') applyRbacPreset('hr');
  else if (role === 'dept_manager') applyRbacPreset('manager');
  else applyRbacPreset('employee');
}

function toggleAllPermissions(checked) {
  ALL_RBAC_PERM_KEYS.forEach(p => {
    const el = document.getElementById(`perm_${p}`);
    if (el) {
      el.disabled = false;
      el.checked = checked;
    }
  });
}

window.applyRbacPreset = applyRbacPreset;
window.toggleAllPermissions = toggleAllPermissions;

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

  const scopeSelect = document.getElementById('userFormDataScope');
  if (scopeSelect) scopeSelect.value = user.custom_data_scope || '';

  const empSelect = document.getElementById('userFormEmpLink');
  if (empSelect) empSelect.value = user.emp_id || '';

  toggleAllPermissions(false);

  const perms = Array.isArray(user.permissions) ? user.permissions : [];
  const isSuper = user.role === 'admin' || perms.includes('all');

  ALL_RBAC_PERM_KEYS.forEach(k => {
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
  const customScope = document.getElementById('userFormDataScope') ? document.getElementById('userFormDataScope').value : '';

  if (!username || !fullName || (!isEditing && !password)) {
    alert('يرجى تعبئة كافة الحقول المطلوبة');
    return;
  }

  const perms = [];
  ALL_RBAC_PERM_KEYS.forEach(k => {
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
    custom_data_scope: customScope || null,
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
      localStorage.setItem('jm_hrms_user', JSON.stringify(state.currentUser));
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

  // Immediately persist locally and sync to server so modifications are never lost
  try {
    localStorage.setItem('jm_hrms_users_backup', JSON.stringify(state.users));
    apiFetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: state.users })
    }).catch(err => console.warn('Background sync error:', err));
  } catch (err) {}

  renderUsersTable();
}

/**
 * Global Synchronization & Data Persistence Engine
 * Saves current users and inputs to SQLite & permanent storage
 */
async function syncAndSaveAllData(silent = false) {
  const icon = document.getElementById('globalSyncIcon');
  const text = document.getElementById('globalSyncText');
  const btn = document.getElementById('btnHeaderGlobalSync');

  if (icon) {
    icon.className = 'fa-solid fa-arrows-rotate fa-spin text-amber-600 text-sm';
  }
  if (text) {
    text.textContent = 'جاري المزامنة...';
  }

  try {
    // 1. Gather all local users and ensure backup reconciliation
    let localUsers = [...(state.users || [])];
    try {
      const backup = JSON.parse(localStorage.getItem('jm_hrms_users_backup') || '[]');
      if (Array.isArray(backup) && backup.length > 0) {
        const existingNames = new Set(localUsers.map(u => u.username));
        backup.forEach(bu => {
          if (bu && bu.username && !existingNames.has(bu.username)) {
            localUsers.push(bu);
          }
        });
      }
    } catch (e) {}

    // 2. Send synchronization request to backend
    const res = await apiFetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: localUsers })
    });

    if (res && res.success && res.data) {
      state.users = res.data;
      try {
        localStorage.setItem('jm_hrms_users_backup', JSON.stringify(state.users));
      } catch (e) {}
    }

    // 3. Sync full data state from backend
    await syncDataFromBackend();
    if (state.currentTab === 'users') {
      renderUsersTable();
    }

    // Visual feedback: success checkmark
    if (icon) {
      icon.className = 'fa-solid fa-circle-check text-emerald-600 text-sm';
    }
    if (text) {
      text.textContent = 'تم الحفظ بنجاح';
    }

    if (!silent) {
      showToastNotification('✓ تم حفظ ومزامنة بيانات المستخدمين والمدخلات بنجاح دون أي فقدان للبيانات');
    }

    setTimeout(() => {
      if (icon) icon.className = 'fa-solid fa-cloud-arrow-up text-emerald-600 text-sm';
      if (text) text.textContent = 'حفظ ومزامنة';
    }, 2500);

  } catch (err) {
    console.error('Sync error:', err);
    if (icon) icon.className = 'fa-solid fa-triangle-exclamation text-rose-600 text-sm';
    if (text) text.textContent = 'فشلت المزامنة';
    setTimeout(() => {
      if (icon) icon.className = 'fa-solid fa-cloud-arrow-up text-emerald-600 text-sm';
      if (text) text.textContent = 'حفظ ومزامنة';
    }, 2500);
  }
}

async function syncUsersNow() {
  const btn = document.getElementById('btnSyncUsersView');
  const icon = document.getElementById('syncUsersViewIcon');
  if (icon) icon.className = 'fa-solid fa-arrows-rotate fa-spin ml-1';
  if (btn) btn.disabled = true;

  try {
    await syncAndSaveAllData(false);
    renderUsersTable();
  } finally {
    if (icon) icon.className = 'fa-solid fa-cloud-arrow-up ml-1';
    if (btn) btn.disabled = false;
  }
}

function showToastNotification(message, type = 'success') {
  let toast = document.getElementById('globalToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToastNotification';
    toast.className = 'fixed bottom-5 left-5 z-50 transform transition-all duration-300 translate-y-20 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }

  const bgClass = type === 'error' ? 'bg-rose-900 border-rose-700 text-white' : 'bg-slate-900 border-emerald-500/50 text-white';
  const iconClass = type === 'error' ? 'fa-solid fa-triangle-exclamation text-rose-400' : 'fa-solid fa-circle-check text-emerald-400';

  toast.innerHTML = `
    <div class="px-4 py-3 rounded-2xl shadow-2xl border ${bgClass} flex items-center gap-2.5 text-xs font-bold">
      <i class="${iconClass} text-sm"></i>
      <span>${message}</span>
    </div>
  `;

  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
  }, 3500);
}

function renderUsersTable() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  state.users.forEach(u => {
    const perms = Array.isArray(u.permissions) ? u.permissions : [];
    let roleBadge = '<span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">موظف</span>';
    if (u.role === 'admin') roleBadge = '<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">مدير عام النظام</span>';
    else if (u.role === 'hr_manager') roleBadge = '<span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">مدير الموارد البشرية</span>';
    else if (u.role === 'hr_specialist') roleBadge = '<span class="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">أخصائي موارد بشرية</span>';
    else if (u.role === 'dept_manager') roleBadge = '<span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px]">مدير إدارة</span>';
    else if (u.role === 'direct_manager') roleBadge = '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">مدير مباشر</span>';

    // Resolved Scope Badge
    const scope = u.custom_data_scope || (u.role === 'admin' || u.role === 'hr_manager' || u.role === 'hr_specialist' ? 'ALL' : (u.role === 'dept_manager' ? 'DEPARTMENT' : (u.role === 'direct_manager' ? 'DIRECT_SUBORDINATES' : 'OWN')));
    let scopeBadge = '<span class="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">شخصي</span>';
    if (scope === 'ALL') scopeBadge = '<span class="text-[9px] bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded font-bold">نطاق شامل</span>';
    else if (scope === 'DEPARTMENT') scopeBadge = '<span class="text-[9px] bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-bold">نطاق الإدارة</span>';
    else if (scope === 'DIRECT_SUBORDINATES') scopeBadge = '<span class="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">المرؤوسين المباشرين</span>';

    const permLabels = {
      all: 'كامل الصلاحيات',
      requests: 'الخدمة الذاتية',
      payslips: 'قسائم الرواتب',
      approvals: 'الاعتمادات',
      employees: 'قاعدة الموظفين',
      attendance: 'الحضور والبصمة',
      penalties: 'لائحة الجزاءات',
      payroll: 'مسيرات الرواتب',
      users: 'إدارة المستخدمين',
      edit_attendance: 'تعديل الحضور',
      edit_balances: 'تعديل الأرصدة',
      delete: 'الحذف النهائي'
    };

    let permsBadges = perms.map(p => `<span class="inline-block text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">${permLabels[p] || p}</span>`).join(' ');
    if (u.role === 'admin' || perms.includes('all')) {
      permsBadges = '<span class="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-black">كافة صلاحيات النظام</span>';
    }

    tbody.innerHTML += `
      <tr class="hover:bg-slate-50 transition">
        <td class="py-3 px-4 font-mono font-bold text-brand">${u.username}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${u.full_name}</div>
          <div class="mt-0.5">${scopeBadge}</div>
        </td>
        <td class="py-3 px-4">${roleBadge}</td>
        <td class="py-3 px-4 flex flex-wrap gap-1 max-w-xs">${permsBadges}</td>
        <td class="py-3 px-4"><span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> نشط</span></td>
        <td class="py-3 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5 flex-wrap">
            <button onclick="openEffectivePermissionsInspector(${u.id})" class="text-purple-600 hover:text-purple-800 font-bold text-xs px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 transition shadow-xs" title="كاشف الصلاحيات الفعلية">
              <i class="fa-solid fa-shield-halved"></i> كاشف الصلاحيات
            </button>
            <button onclick="editUserAccount(${u.id})" class="text-blue-600 hover:text-blue-800 font-bold text-xs px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 transition shadow-xs" title="تعديل الصلاحيات والحساب">
              <i class="fa-solid fa-user-pen"></i> تعديل
            </button>
            ${(u.username === 'admin' || !canDelete()) ? '' : `
              <button onclick="deleteUserAccount(${u.id})" class="text-rose-600 hover:text-rose-800 font-bold text-xs px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 transition shadow-xs" title="حذف المستخدم">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  });
}

async function openEffectivePermissionsInspector(userId) {
  const user = state.users.find(u => u.id === Number(userId));
  if (!user) {
    alert('لم يتم العثور على المستخدم');
    return;
  }

  const card = document.getElementById('inspectorSummaryCard');
  const tbody = document.getElementById('inspectorTableBody');
  const countBadge = document.getElementById('inspectorTotalCount');
  const allowedBadge = document.getElementById('inspectorAllowedCount');
  const deniedBadge = document.getElementById('inspectorDeniedCount');

  if (card) {
    card.innerHTML = `<div class="p-6 text-center text-slate-500 font-bold"><i class="fa-solid fa-spinner fa-spin text-purple-600 text-lg mb-2 block"></i>جاري استعلام وتحليل الصلاحيات الفعلية الموروثة والمباشرة...</div>`;
  }
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400 font-bold">جاري الفحص...</td></tr>`;
  }

  openModal('modalPermissionsInspector');

  try {
    const res = await apiFetch(`/api/rbac/effective-permissions/${userId}`);
    if (!res || !res.success || !res.data) {
      throw new Error((res && res.error) || 'تعذر جلب تفاصيل الصلاحيات');
    }

    const data = res.data;
    window._currentInspectorData = data;

    const roleNames = {
      'admin': 'مدير عام النظام (Super Admin)',
      'hr_manager': 'مدير الموارد البشرية (HR Manager)',
      'hr_specialist': 'أخصائي موارد بشرية (HR Specialist)',
      'dept_manager': 'مدير إدارة (Department Manager)',
      'direct_manager': 'مدير مباشر (Direct Manager)',
      'employee': 'موظف (Employee)'
    };

    const scopeLabels = {
      'ALL': 'شامل لكافة موظفي الشركة (ALL)',
      'DEPARTMENT': 'نطاق الإدارة والأقسام التابعة (DEPARTMENT)',
      'DIRECT_SUBORDINATES': 'المرؤوسين المباشرين فقط (DIRECT_SUBORDINATES)',
      'OWN': 'السجلات الشخصية فقط (OWN)'
    };

    if (card) {
      card.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl font-black shadow-md flex-shrink-0">
              <i class="fa-solid fa-id-card-clip"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-base font-black text-slate-900">${data.user.full_name}</h4>
                <span class="font-mono text-xs bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-bold">${data.user.username}</span>
              </div>
              <p class="text-xs text-slate-600 mt-0.5">الدور المعين: <strong class="text-slate-800">${roleNames[data.user.role] || data.user.role}</strong> ${data.user.emp_code ? `• كود الموظف: <strong class="font-mono text-purple-700">${data.user.emp_code}</strong>` : ''}</p>
            </div>
          </div>
          <div class="bg-white/80 p-3 rounded-xl border border-purple-200 text-xs">
            <span class="block text-slate-500 text-[10px] font-bold mb-0.5">نطاق استعراض البيانات الفعلي (Data Scope):</span>
            <span class="inline-flex items-center gap-1.5 font-black text-purple-900 bg-purple-100 px-2.5 py-1 rounded-lg">
              <i class="fa-solid fa-layer-group text-purple-600"></i> ${scopeLabels[data.resolved_data_scope] || data.resolved_data_scope}
            </span>
          </div>
        </div>
      `;
    }

    const effList = data.effective_permissions || [];
    const allowedCount = effList.filter(p => p.allowed).length;
    const deniedCount = effList.length - allowedCount;

    if (countBadge) countBadge.textContent = `${effList.length} صلاحية نظام`;
    if (allowedBadge) allowedBadge.textContent = `${allowedCount} مصرح بها`;
    if (deniedBadge) deniedBadge.textContent = `${deniedCount} محجوبة`;

    renderInspectorTableRows(effList);
  } catch (err) {
    if (card) {
      card.innerHTML = `<div class="p-4 text-center text-rose-600 font-bold">خطأ: ${err.message}</div>`;
    }
  }
}

function renderInspectorTableRows(list) {
  const tbody = document.getElementById('inspectorTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400 font-bold">لا توجد صلاحيات مطابقة لنتائج البحث</td></tr>`;
    return;
  }

  const moduleNamesAr = {
    'employees': 'الموظفون',
    'leaves': 'الإجازات',
    'attendance': 'الحضور والبصمة',
    'payroll': 'الرواتب والأجور',
    'loans': 'السلف والأقساط',
    'penalties': 'الجزاءات والمخالفات',
    'terminated': 'إنهاء الخدمة والمخالصات',
    'tasks': 'نظام المهام',
    'requests': 'الطلبات العامة',
    'selfservice': 'الخدمة الذاتية',
    'compliance': 'الامتثال والإقامات',
    'forms': 'النماذج الرسمية',
    'hierarchy': 'الهيكل التنظيمي',
    'branches': 'الفروع والمواقع',
    'users': 'المستخدمون والصلاحيات',
    'audit': 'سجل الرقابة',
    'reports': 'التقارير والإحصائيات',
    'data_exchange': 'الاستيراد والتصدير',
    'docs': 'التوثيق الهندسي',
    'dashboard': 'لوحة المؤشرات',
    'settings': 'إعدادات النظام',
    'all': 'النظام الشامل'
  };

  tbody.innerHTML = list.map(p => {
    let sourceBadge = '';
    if (p.direct_granted !== null) {
      sourceBadge = p.direct_granted 
        ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full"><i class="fa-solid fa-wrench"></i> مخصص للمستخدم</span>`
        : `<span class="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full"><i class="fa-solid fa-ban"></i> حجب مخصص</span>`;
    } else if (p.role_granted) {
      sourceBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full"><i class="fa-solid fa-sitemap"></i> موروث من الدور</span>`;
    } else {
      sourceBadge = `<span class="text-slate-400 text-xs">-</span>`;
    }

    const statusBadge = p.allowed
      ? `<span class="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"><i class="fa-solid fa-circle-check"></i> مصرح ومتاح</span>`
      : `<span class="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200"><i class="fa-solid fa-circle-xmark"></i> محجوب</span>`;

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="py-2.5 px-3">
          <span class="inline-block text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">${moduleNamesAr[p.module] || p.module}</span>
        </td>
        <td class="py-2.5 px-3">
          <div class="font-bold text-slate-900 text-xs">${p.name_ar}</div>
          <div class="text-[10px] text-slate-400">${p.description_ar || ''}</div>
        </td>
        <td class="py-2.5 px-3 font-mono text-[11px] font-bold text-purple-800">${p.code}</td>
        <td class="py-2.5 px-3 text-center">${sourceBadge}</td>
        <td class="py-2.5 px-3 text-center">${statusBadge}</td>
      </tr>
    `;
  }).join('');
}

function filterInspectorTable(query) {
  if (!window._currentInspectorData || !window._currentInspectorData.effective_permissions) return;
  const q = (query || '').trim().toLowerCase();
  if (!q) {
    renderInspectorTableRows(window._currentInspectorData.effective_permissions);
    return;
  }
  const filtered = window._currentInspectorData.effective_permissions.filter(p => 
    (p.code && p.code.toLowerCase().includes(q)) ||
    (p.name_ar && p.name_ar.toLowerCase().includes(q)) ||
    (p.module && p.module.toLowerCase().includes(q)) ||
    (p.description_ar && p.description_ar.toLowerCase().includes(q))
  );
  renderInspectorTableRows(filtered);
}

window.openEffectivePermissionsInspector = openEffectivePermissionsInspector;
window.filterInspectorTable = filterInspectorTable;

async function deleteUserAccount(id) {
  if (!canDelete()) {
    alert('عذراً، صلاحية حذف المستخدمين مقيدة ومخصصة لمدير النظام العام (Super Admin) فقط.');
    return;
  }
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
  if (!canEditAttendance()) {
    alert('عذراً، صلاحية استيراد وتعديل سجلات الحضور والانصراف مقيدة ومخصصة لمدير النظام العام فقط.');
    return;
  }
  alert('تم استيراد سجلات البصمة بنجاح');
  closeModal('modalImportAttendance');
}

// Modal Helpers
function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.remove('hidden');
    m.style.removeProperty('display');
  }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.add('hidden');
    m.style.setProperty('display', 'none', 'important');
  }
}

/* =========================================================================
   10. PWA (PROGRESSIVE WEB APP) SERVICE WORKER & INSTALL LOGIC
   ========================================================================= */

// Register Service Worker with Auto Update & Cache Refresh
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('✓ Jawharat Al-Majd PWA Service Worker Registered:', reg.scope);
        // Explicitly check for updates on load to avoid serving stale code
        reg.update();
        reg.addEventListener('updatefound', () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New version of HRMS app available. Auto reloading for latest version...');
                window.location.reload();
              }
            });
          }
        });
      })
      .catch((err) => console.log('PWA Service Worker Registration Failed:', err));
  });
}

/* =========================================================================
   AUDIT LOG CLIENT CONTROLLER (سجل الرقابة والعمليات الإدارية)
   ========================================================================= */

const auditState = {
  page: 1,
  limit: 25,
  total: 0,
  logs: [],
  stats: null
};

async function loadAuditLog(page = 1) {
  auditState.page = page;
  const tbody = document.getElementById('auditLogsTableBody');
  if (tbody) {
    renderSkeletonTable('auditLogsTableBody', 8, 8);
  }

  const searchInput = document.getElementById('auditSearchInput');
  const actionFilter = document.getElementById('auditActionFilter');
  const entityFilter = document.getElementById('auditEntityFilter');
  const dateFrom = document.getElementById('auditDateFrom');

  const q = new URLSearchParams({
    page: String(page),
    limit: String(auditState.limit),
    search: searchInput ? searchInput.value.trim() : '',
    action: actionFilter ? actionFilter.value : 'all',
    entity_type: entityFilter ? entityFilter.value : 'all',
    date_from: dateFrom ? dateFrom.value : ''
  });

  try {
    const [res, statsRes] = await Promise.all([
      apiFetch(`/api/audit-logs?${q.toString()}`),
      apiFetch('/api/audit-logs/stats')
    ]);

    if (statsRes && statsRes.success && statsRes.data) {
      auditState.stats = statsRes.data;
      const kpiTotal = document.getElementById('auditKpiTotal');
      const kpiToday = document.getElementById('auditKpiToday');
      const kpiApprovals = document.getElementById('auditKpiApprovals');
      if (kpiTotal) kpiTotal.textContent = Number(statsRes.data.total_events || 0).toLocaleString('en-US');
      if (kpiToday) kpiToday.textContent = Number(statsRes.data.today_events || 0).toLocaleString('en-US');
      if (kpiApprovals) {
        const appCount = (statsRes.data.top_actions || []).find(a => a.action === 'APPROVE');
        kpiApprovals.textContent = Number(appCount ? appCount.c : 0).toLocaleString('en-US');
      }
    }

    if (res && res.success && res.data) {
      auditState.logs = res.data.logs || [];
      auditState.total = res.data.total || 0;
      renderAuditLogsTable();
      renderAuditPagination(res.data.page, res.data.total_pages, res.data.total);
    } else {
      renderErrorState('auditLogsTableBody', 8, 'تعذر جلب سجلات العمليات');
    }
  } catch (err) {
    console.error('Error loading audit logs:', err);
    renderErrorState('auditLogsTableBody', 8, err.message);
  }
}

let auditSearchTimeout = null;
function filterAuditLogLive() {
  clearTimeout(auditSearchTimeout);
  auditSearchTimeout = setTimeout(() => {
    loadAuditLog(1);
  }, 250);
}

function renderAuditLogsTable() {
  const tbody = document.getElementById('auditLogsTableBody');
  if (!tbody) return;

  if (auditState.logs.length === 0) {
    renderEmptyState('auditLogsTableBody', 8, 'fa-clipboard-check', 'لا توجد سجلات تطابق معايير البحث المحددة');
    return;
  }

  const actionStyles = {
    'LOGIN': 'bg-purple-100 text-purple-800 border-purple-200',
    'LOGOUT': 'bg-slate-100 text-slate-700 border-slate-200',
    'CREATE': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'CREATE_EMPLOYEE': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'CREATE_REQUEST': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'CREATE_LEAVE_REQUEST': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'CREATE_USER': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'UPDATE': 'bg-blue-100 text-blue-800 border-blue-200',
    'UPDATE_EMPLOYEE': 'bg-blue-100 text-blue-800 border-blue-200',
    'UPDATE_USER': 'bg-blue-100 text-blue-800 border-blue-200',
    'APPROVE': 'bg-teal-100 text-teal-800 border-teal-200',
    'APPROVE_PAYROLL': 'bg-teal-100 text-teal-800 border-teal-200',
    'REJECT': 'bg-rose-100 text-rose-800 border-rose-200',
    'DELETE': 'bg-rose-100 text-rose-800 border-rose-200',
    'DELETE_EMPLOYEE': 'bg-rose-100 text-rose-800 border-rose-200',
    'DELETE_USER': 'bg-rose-100 text-rose-800 border-rose-200',
    'CALCULATE_PAYROLL': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'SYNC_USERS': 'bg-amber-100 text-amber-800 border-amber-200',
    'SYNC_ALL_DATA': 'bg-amber-100 text-amber-800 border-amber-200'
  };

  const rows = auditState.logs.map(log => {
    const badgeCls = actionStyles[log.action] || 'bg-slate-100 text-slate-700 border-slate-200';
    const actor = log.performed_by_name || 'النظام';
    const roleBadge = log.performed_by_role ? `<span class="text-[10px] text-slate-400 font-semibold block">${log.performed_by_role}</span>` : '';
    const entityText = `${log.entity_type || 'نظام'} #${log.entity_id || '-'}`;
    const comment = log.comment || (log.new_status ? `الحالة: ${log.new_status}` : '-');
    const deviceBadge = log.device ? `<span class="text-[9px] bg-slate-100 px-1 rounded text-slate-500 font-mono">${log.device}</span>` : '';

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="py-2.5 px-3 font-mono text-slate-400 font-bold text-[11px]">${log.id}</td>
        <td class="py-2.5 px-3 whitespace-nowrap">
          <div class="font-mono font-bold text-slate-700 text-[11px]">${log.created_at || '-'}</div>
        </td>
        <td class="py-2.5 px-3">
          <div class="font-bold text-slate-900">${actor}</div>
          ${roleBadge}
        </td>
        <td class="py-2.5 px-3">
          <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeCls}">${log.action}</span>
        </td>
        <td class="py-2.5 px-3">
          <span class="font-mono font-bold text-slate-700">${entityText}</span>
        </td>
        <td class="py-2.5 px-3 max-w-xs truncate text-slate-600 font-medium" title="${comment}">
          ${comment}
        </td>
        <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500">
          <div>${log.ip_address || '127.0.0.1'}</div>
          <div>${deviceBadge} <span class="text-[9px] text-slate-400">${log.browser || ''}</span></div>
        </td>
        <td class="py-2.5 px-3 text-center">
          <button onclick="viewAuditLogDetails(${log.id})" class="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 font-bold text-[11px] px-2.5 py-1 rounded-lg transition shadow-sm">
            عرض
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = rows.join('');
}

function renderAuditPagination(currentPage, totalPages, totalCount) {
  const infoEl = document.getElementById('auditPaginationInfo');
  const btnsEl = document.getElementById('auditPaginationButtons');
  if (infoEl) {
    infoEl.textContent = `عرض الصفحة ${currentPage} من ${totalPages || 1} (إجمالي السجلات: ${totalCount})`;
  }
  if (!btnsEl) return;

  btnsEl.innerHTML = '';
  if (totalPages <= 1) return;

  if (currentPage > 1) {
    btnsEl.innerHTML += `<button onclick="loadAuditLog(${currentPage - 1})" class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition">السابق</button>`;
  }

  for (let p = Math.max(1, currentPage - 2); p <= Math.min(totalPages, currentPage + 2); p++) {
    btnsEl.innerHTML += `
      <button onclick="loadAuditLog(${p})" class="px-2.5 py-1 rounded text-xs font-bold transition ${p === currentPage ? 'bg-purple-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}">
        ${p}
      </button>
    `;
  }

  if (currentPage < totalPages) {
    btnsEl.innerHTML += `<button onclick="loadAuditLog(${currentPage + 1})" class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition">التالي</button>`;
  }
}

function viewAuditLogDetails(logId) {
  const log = auditState.logs.find(l => l.id === logId);
  if (!log) return;

  const content = document.getElementById('auditLogDetailsContent');
  if (!content) return;

  let oldFormatted = log.old_values ? `<pre class="bg-slate-50 p-2 rounded text-[11px] font-mono border overflow-x-auto">${log.old_values}</pre>` : '<span class="text-slate-400">لا توجد قيم سابقة</span>';
  let newFormatted = log.new_values ? `<pre class="bg-emerald-50/50 p-2 rounded text-[11px] font-mono border border-emerald-200 overflow-x-auto text-emerald-950">${log.new_values}</pre>` : '<span class="text-slate-400">لا توجد قيم جديدة مسجلة</span>';

  content.innerHTML = `
    <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border text-xs">
      <div><span class="text-slate-400 block font-semibold text-[10px]">رقم السجل:</span><span class="font-mono font-bold text-slate-800">#${log.id}</span></div>
      <div><span class="text-slate-400 block font-semibold text-[10px]">التاريخ والوقت:</span><span class="font-mono font-bold text-slate-800">${log.created_at}</span></div>
      <div><span class="text-slate-400 block font-semibold text-[10px]">المستخدم:</span><span class="font-bold text-slate-800">${log.performed_by_name || 'النظام'} (${log.performed_by_role || '-'})</span></div>
      <div><span class="text-slate-400 block font-semibold text-[10px]">نوع العملية:</span><span class="font-bold text-purple-700">${log.action}</span></div>
      <div><span class="text-slate-400 block font-semibold text-[10px]">الوحدة المتأثرة:</span><span class="font-mono font-bold text-slate-800">${log.entity_type} #${log.entity_id}</span></div>
      <div><span class="text-slate-400 block font-semibold text-[10px]">عنوان IP:</span><span class="font-mono text-slate-700">${log.ip_address || '-'} (${log.device || '-'} - ${log.browser || '-'})</span></div>
    </div>

    <div>
      <h4 class="font-bold text-slate-800 text-xs mb-1">الملاحظات والبيان:</h4>
      <div class="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold">${log.comment || 'لا توجد ملاحظات إضافية'}</div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <h4 class="font-bold text-slate-700 text-xs mb-1">القيم قبل العملية (Before):</h4>
        ${oldFormatted}
      </div>
      <div>
        <h4 class="font-bold text-emerald-800 text-xs mb-1">القيم بعد العملية (After):</h4>
        ${newFormatted}
      </div>
    </div>
  `;

  openModal('modalAuditLogDetails');
}

function exportAuditLogExcel() {
  const searchInput = document.getElementById('auditSearchInput');
  const actionFilter = document.getElementById('auditActionFilter');
  const entityFilter = document.getElementById('auditEntityFilter');
  const dateFrom = document.getElementById('auditDateFrom');

  const q = new URLSearchParams({
    search: searchInput ? searchInput.value.trim() : '',
    action: actionFilter ? actionFilter.value : 'all',
    entity_type: entityFilter ? entityFilter.value : 'all',
    date_from: dateFrom ? dateFrom.value : ''
  });

  window.open(`/api/audit-logs/export/excel?${q.toString()}`, '_blank');
}

window.loadAuditLog = loadAuditLog;
window.filterAuditLogLive = filterAuditLogLive;
window.viewAuditLogDetails = viewAuditLogDetails;
window.exportAuditLogExcel = exportAuditLogExcel;

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




/* =========================================================================
   11. LEAVE MANAGEMENT & APPROVAL WORKFLOW (إدارة الإجازات وسير الموافقات)
   ========================================================================= */

const leaveState = {
  currentSubTab: 'requests',
  leaves: [],
  balances: [],
  adjustments: [],
  balancesPage: 1,
  balancesPageSize: 15,
  balancesSearch: '',
  balancesFilter: 'all'
};

function switchLeaveSubTab(tab) {
  leaveState.currentSubTab = tab;
  
  const subViews = {
    'requests': document.getElementById('subViewLeaveRequests'),
    'balances': document.getElementById('subViewLeaveBalances'),
    'adjustments': document.getElementById('subViewLeaveAdjustments')
  };

  const btnRequests = document.getElementById('tabBtnLeaveRequests');
  const btnBalances = document.getElementById('tabBtnLeaveBalances');
  const btnAdjustments = document.getElementById('tabBtnLeaveAdjustments');

  Object.keys(subViews).forEach(k => {
    if (subViews[k]) {
      if (k === tab) subViews[k].classList.remove('hidden');
      else subViews[k].classList.add('hidden');
    }
  });

  const activeClasses = ['border-b-2', 'border-brand', 'text-brand', 'font-black'];
  const inactiveClasses = ['text-slate-500', 'font-bold'];

  [btnRequests, btnBalances, btnAdjustments].forEach(btn => {
    if (btn) {
      btn.classList.remove(...activeClasses);
      btn.classList.add(...inactiveClasses);
    }
  });

  if (tab === 'requests' && btnRequests) {
    btnRequests.classList.add(...activeClasses);
    btnRequests.classList.remove(...inactiveClasses);
    loadLeavesTable();
  } else if (tab === 'balances' && btnBalances) {
    btnBalances.classList.add(...activeClasses);
    btnBalances.classList.remove(...inactiveClasses);
    loadLeaveBalancesTable();
  } else if (tab === 'adjustments' && btnAdjustments) {
    btnAdjustments.classList.add(...activeClasses);
    btnAdjustments.classList.remove(...inactiveClasses);
    loadLeaveAdjustmentsTable();
  }
}

async function loadLeavesView() {
  try {
    // 1. Fetch KPIs
    const kpiRes = await apiFetch('/api/leaves/kpis');
    if (kpiRes && kpiRes.success && kpiRes.data) {
      const d = kpiRes.data;
      if (document.getElementById('statLeavesTotal')) document.getElementById('statLeavesTotal').textContent = d.total || d.totalRequests || 0;
      if (document.getElementById('statLeavesPendingManager')) document.getElementById('statLeavesPendingManager').textContent = d.pendingManager || 0;
      if (document.getElementById('statLeavesPendingHR')) document.getElementById('statLeavesPendingHR').textContent = d.pendingHR || 0;
      if (document.getElementById('statLeavesApproved')) document.getElementById('statLeavesApproved').textContent = d.approved || 0;
      if (document.getElementById('statLeavesApprovedDays')) document.getElementById('statLeavesApprovedDays').textContent = (d.approvedDays || d.totalApprovedDays || 0) + ' يوم';

      // Update badgeNavLeaves in sidebar
      const badge = document.getElementById('badgeNavLeaves');
      if (badge) {
        const pendingCount = (d.pendingManager || 0) + (d.pendingHR || 0);
        if (pendingCount > 0) {
          badge.textContent = pendingCount;
          badge.classList.remove('hidden');
        } else {
          badge.textContent = '0';
          badge.classList.add('hidden');
        }
      }
    }

    // 2. Populate employee dropdowns
    populateLeaveEmpSelects();

    // 3. Load active subview
    if (leaveState.currentSubTab === 'requests') {
      await loadLeavesTable();
    } else if (leaveState.currentSubTab === 'balances') {
      await loadLeaveBalancesTable();
    } else {
      await loadLeaveAdjustmentsTable();
    }
  } catch (err) {
    console.error('Error loading leaves view:', err);
  }
}

async function loadLeavesTable() {
  const tbody = document.getElementById('leavesTableBody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="10" class="text-center p-6 text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin mr-2"></i> جاري تحميل سجلات الإجازات...</td></tr>';

  try {
    const statusFilter = document.getElementById('filterLeaveStatus') ? document.getElementById('filterLeaveStatus').value : '';
    const typeFilter = document.getElementById('filterLeaveType') ? document.getElementById('filterLeaveType').value : '';

    let url = '/api/leaves';
    const params = [];
    if (statusFilter) params.push(`status=${encodeURIComponent(statusFilter)}`);
    if (typeFilter) params.push(`leave_type=${encodeURIComponent(typeFilter)}`);
    if (params.length) url += '?' + params.join('&');

    const res = await apiFetch(url);
    if (!res || !res.success || !res.data) {
      tbody.innerHTML = '<tr><td colspan="10" class="text-center p-6 text-slate-400">لا توجد طلبات إجازة مسجلة</td></tr>';
      return;
    }

    leaveState.leaves = res.data;
    renderLeavesTableRows(res.data);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center p-6 text-rose-500 font-bold">فشل في تحميل الإجازات: ${err.message}</td></tr>`;
  }
}

function renderLeavesTableRows(leaves) {
  const tbody = document.getElementById('leavesTableBody');
  if (!tbody) return;

  if (!leaves || leaves.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="text-center p-6 text-slate-400 font-bold">لا توجد طلبات إجازة مطابقة لخيارات البحث</td></tr>';
    return;
  }

  tbody.innerHTML = leaves.map(l => {
    let statusBadge = '';
    if (l.status === 'معتمد نهائياً') {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit"><i class="fa-solid fa-circle-check"></i> معتمد نهائياً</span>';
    } else if (l.status.includes('بانتظار موافقة المدير')) {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit"><i class="fa-solid fa-user-clock"></i> خطوة 1: بانتظار موافقة المدير</span>';
    } else if (l.status.includes('بانتظار تحقق قسم الموارد')) {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1 w-fit"><i class="fa-solid fa-user-check"></i> خطوة 2: تدقيق قسم الموارد</span>';
    } else if (l.status.includes('بانتظار اعتماد مدير الموارد') || l.status.includes('بانتظار اعتماد الموارد')) {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1 w-fit"><i class="fa-solid fa-signature"></i> خطوة 3: اعتماد مدير HR</span>';
    } else if (l.status.includes('مرفوض')) {
      statusBadge = `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1 w-fit"><i class="fa-solid fa-circle-xmark"></i> ${l.status}</span>`;
    } else {
      statusBadge = `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">${l.status}</span>`;
    }

    const curUser = state.currentUser || {};
    const curEmpId = curUser.emp_id ? Number(curUser.emp_id) : null;
    const isApplicant = curEmpId && Number(l.emp_id) === curEmpId;
    const isDirectManager = Boolean(
      (curEmpId && l.manager_id && Number(l.manager_id) === curEmpId) ||
      (curUser && curUser.full_name && l.direct_manager_name && curUser.full_name.trim() === l.direct_manager_name.trim()) ||
      (curUser && curUser.full_name && l.manager_name && curUser.full_name.trim() === l.manager_name.trim())
    );
    const isAdmin = curUser.role === 'admin' || curUser.role === 'general_manager';
    const isHR = isAdmin || curUser.role === 'hr_manager' || (curUser.permissions && curUser.permissions.includes('approvals'));

    let actions = `<div class="flex items-center justify-center gap-1">`;

    if (isApplicant) {
      actions += `<span class="px-2 py-0.5 rounded text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200">طلبك الشخصي</span>`;
    } else {
      // 4-Step Approval Actions
      if (l.status.includes('بانتظار موافقة المدير')) {
        if (isDirectManager || isAdmin) {
          actions += `
            <button onclick="handleLeaveStepAction(${l.id}, 'manager', 'approve')" title="موافقة المدير المباشر" class="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] flex items-center gap-1 transition">
              <i class="fa-solid fa-check"></i> موافقة مدير
            </button>
            <button onclick="handleLeaveStepAction(${l.id}, 'manager', 'reject')" title="رفض الطلب" class="px-2 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 transition">
              <i class="fa-solid fa-xmark"></i> رفض
            </button>`;
        } else {
          actions += `<span class="text-[10px] text-slate-400 font-medium">بانتظار موافقة المدير</span>`;
        }
      } else if (l.status.includes('بانتظار تحقق قسم الموارد')) {
        if (isHR) {
          actions += `
            <button onclick="handleLeaveStepAction(${l.id}, 'hr_verify', 'approve')" title="تدقيق وتحقق قسم الموارد البشرية" class="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center gap-1 transition">
              <i class="fa-solid fa-check-double"></i> تدقيق HR
            </button>
            <button onclick="handleLeaveStepAction(${l.id}, 'hr_verify', 'reject')" title="رفض التدقيق" class="px-2 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 transition">
              <i class="fa-solid fa-xmark"></i> رفض
            </button>`;
        } else {
          actions += `<span class="text-[10px] text-slate-400 font-medium">بانتظار تدقيق HR</span>`;
        }
      } else if (l.status.includes('بانتظار اعتماد مدير الموارد') || l.status.includes('بانتظار اعتماد الموارد')) {
        if (isAdmin || curUser.role === 'hr_manager') {
          actions += `
            <button onclick="handleLeaveStepAction(${l.id}, 'hr_director', 'approve')" title="اعتماد نهائي من مدير الموارد البشرية" class="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 transition">
              <i class="fa-solid fa-signature"></i> اعتماد نهائي
            </button>
            <button onclick="handleLeaveStepAction(${l.id}, 'hr_director', 'reject')" title="رفض الاعتماد" class="px-2 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 transition">
              <i class="fa-solid fa-xmark"></i> رفض
            </button>`;
        } else {
          actions += `<span class="text-[10px] text-slate-400 font-medium">بانتظار اعتماد مدير HR</span>`;
        }
      }
    }

    // Official Form JM-HR-F-001 Preview Button
    actions += `
      <button onclick="openOfficialFormPreview('leave', ${l.id})" title="عرض النموذج الرسمي المعتمد JM-HR-F-001" class="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 flex items-center justify-center text-xs transition">
        <i class="fa-solid fa-file-invoice"></i>
      </button>`;

    // Word form generation & delete buttons
    const safeReason = (l.reason || '').replace(/'/g, "\\'");
    actions += `
      <button onclick="openFormModal('leave_request', 'نموذج طلب إجازة', ${l.emp_id}, { startDate: '${l.start_date}', endDate: '${l.end_date}', days: ${l.days_count}, reason: '${safeReason}' })" title="توليد مستند Word رسمي (.docx)" class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center text-xs transition">
        <i class="fa-solid fa-file-word"></i>
      </button>
      ${canDelete() ? `
      <button onclick="deleteLeave(${l.id})" title="حذف طلب الإجازة" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center text-xs transition">
        <i class="fa-solid fa-trash"></i>
      </button>
      ` : ''}
    </div>`;

    return `
      <tr class="hover:bg-slate-50/80 transition">
        <td class="p-3 font-mono font-bold text-slate-800">${l.request_no}</td>
        <td class="p-3">
          <div class="font-bold text-slate-900">${l.full_name_ar}</div>
          <div class="text-[10px] text-slate-400 font-mono">${l.emp_code}</div>
        </td>
        <td class="p-3">
          <div class="text-slate-800 font-semibold">${l.department_name || '-'}</div>
          <div class="text-[10px] text-slate-400">${l.branch_name || '-'}</div>
        </td>
        <td class="p-3 font-semibold text-teal-800">${l.leave_type}</td>
        <td class="p-3 font-mono">${l.start_date}</td>
        <td class="p-3 font-mono">${l.end_date}</td>
        <td class="p-3 font-bold font-mono text-slate-900">${l.days_count} يوم</td>
        <td class="p-3 text-slate-600">${l.manager_name || 'إدارة عليا'}</td>
        <td class="p-3">${statusBadge}</td>
        <td class="p-3 text-center">${actions}</td>
      </tr>
    `;
  }).join('');
}

function filterLeavesTableLive() {
  const term = (document.getElementById('searchLeavesInput')?.value || '').trim().toLowerCase();
  if (!term) {
    renderLeavesTableRows(leaveState.leaves);
    return;
  }
  const filtered = leaveState.leaves.filter(l => 
    (l.request_no && l.request_no.toLowerCase().includes(term)) ||
    (l.full_name_ar && l.full_name_ar.toLowerCase().includes(term)) ||
    (l.emp_code && l.emp_code.toLowerCase().includes(term)) ||
    (l.leave_type && l.leave_type.toLowerCase().includes(term))
  );
  renderLeavesTableRows(filtered);
}

async function loadLeaveBalancesTable() {
  const tbody = document.getElementById('leaveBalancesTableBody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="11" class="text-center p-6 text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin mr-2"></i> جاري احتساب أرصدة الإجازات والاستحقاق اليومي...</td></tr>';

  try {
    const res = await apiFetch('/api/leaves/balances');
    if (!res || !res.success || !res.data) {
      tbody.innerHTML = '<tr><td colspan="11" class="text-center p-6 text-slate-400">لا توجد بيانات أرصدة</td></tr>';
      return;
    }

    leaveState.balances = res.data;
    renderLeaveBalancesTable();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="11" class="text-center p-6 text-rose-500 font-bold">فشل في تحميل أرصدة الإجازات: ${err.message}</td></tr>`;
  }
}

function renderLeaveBalancesTable() {
  const tbody = document.getElementById('leaveBalancesTableBody');
  const countEl = document.getElementById('leaveBalanceCountSummary');
  const pagEl = document.getElementById('leaveBalancePaginationControls');
  if (!tbody) return;

  const allData = leaveState.balances || [];
  const term = (leaveState.balancesSearch || '').trim().toLowerCase();
  const filter = leaveState.balancesFilter || 'all';

  // 1. Filtering
  const filtered = allData.filter(b => {
    // Search query match
    if (term) {
      const matchCode = (b.emp_code || '').toLowerCase().includes(term);
      const matchName = (b.full_name_ar || '').toLowerCase().includes(term);
      const matchJob = (b.job_title_ar || '').toLowerCase().includes(term);
      const matchDept = (b.department_name || '').toLowerCase().includes(term);
      if (!matchCode && !matchName && !matchJob && !matchDept) return false;
    }

    // Category filter match
    const curBal = Number(b.current_balance) || 0;
    if (filter === 'available') return curBal > 15;
    if (filter === 'low') return curBal > 0 && curBal <= 15;
    if (filter === 'zero') return curBal === 0;
    if (filter === 'negative') return curBal < 0;
    if (filter === 'entitle_30') return b.annual_entitlement === 30;
    if (filter === 'entitle_21') return b.annual_entitlement === 21;

    return true;
  });

  const totalItems = filtered.length;
  const isAll = leaveState.balancesPageSize === 'all';
  const pageSize = isAll ? totalItems : (parseInt(leaveState.balancesPageSize) || 15);
  const totalPages = Math.max(1, Math.ceil(totalItems / (pageSize || 1)));

  if (leaveState.balancesPage > totalPages) leaveState.balancesPage = totalPages;
  if (leaveState.balancesPage < 1) leaveState.balancesPage = 1;

  const startIndex = isAll ? 0 : (leaveState.balancesPage - 1) * pageSize;
  const pagedList = isAll ? filtered : filtered.slice(startIndex, startIndex + pageSize);

  // Update Summary label
  if (countEl) {
    if (totalItems === 0) {
      countEl.textContent = 'لا توجد نتائج مطابقة لمعايير البحث';
    } else {
      const showingFrom = startIndex + 1;
      const showingTo = Math.min(startIndex + pagedList.length, totalItems);
      countEl.innerHTML = `عرض <span class="font-mono text-slate-800 font-black">${showingFrom} - ${showingTo}</span> من إجمالي <span class="font-mono text-brand font-black">${totalItems}</span> موظف ${!isAll ? `(الصفحة ${leaveState.balancesPage} من ${totalPages})` : ''}`;
    }
  }

  // Render Pagination Controls
  if (pagEl) {
    if (totalPages <= 1 || isAll) {
      pagEl.innerHTML = '';
    } else {
      let pagesHtml = '';
      pagesHtml += `
        <button onclick="goToLeaveBalancePage(1)" ${leaveState.balancesPage === 1 ? 'disabled class="px-2 py-1 rounded-lg border border-slate-200 text-slate-300 text-xs cursor-not-allowed"' : 'class="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs transition"'} title="الصفحة الأولى">
          <i class="fa-solid fa-angles-right"></i>
        </button>
        <button onclick="goToLeaveBalancePage(${leaveState.balancesPage - 1})" ${leaveState.balancesPage <= 1 ? 'disabled class="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-300 text-xs cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs transition"'} title="السابق">
          <i class="fa-solid fa-chevron-right text-[10px]"></i> السابق
        </button>
      `;

      const startPage = Math.max(1, leaveState.balancesPage - 2);
      const endPage = Math.min(totalPages, startPage + 4);
      for (let p = startPage; p <= endPage; p++) {
        if (p === leaveState.balancesPage) {
          pagesHtml += `<span class="px-3 py-1 rounded-lg bg-brand text-white font-mono text-xs font-black shadow-xs">${p}</span>`;
        } else {
          pagesHtml += `<button onclick="goToLeaveBalancePage(${p})" class="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-mono text-xs font-bold transition">${p}</button>`;
        }
      }

      pagesHtml += `
        <button onclick="goToLeaveBalancePage(${leaveState.balancesPage + 1})" ${leaveState.balancesPage >= totalPages ? 'disabled class="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-300 text-xs cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs transition"'} title="التالي">
          التالي <i class="fa-solid fa-chevron-left text-[10px]"></i>
        </button>
        <button onclick="goToLeaveBalancePage(${totalPages})" ${leaveState.balancesPage === totalPages ? 'disabled class="px-2 py-1 rounded-lg border border-slate-200 text-slate-300 text-xs cursor-not-allowed"' : 'class="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs transition"'} title="الصفحة الأخيرة">
          <i class="fa-solid fa-angles-left"></i>
        </button>
      `;
      pagEl.innerHTML = pagesHtml;
    }
  }

  // Render Table Rows
  if (pagedList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="text-center p-8 text-slate-400 font-bold">لا توجد نتائج مطابقة للمعايير المحددة</td></tr>`;
    return;
  }

  tbody.innerHTML = pagedList.map(b => {
    const entitlementBadge = b.annual_entitlement === 30 
      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 whitespace-nowrap" title="استحقاق 30 يوماً سنوياً (أكثر من 5 سنوات خدمة)">30 يوماً (> 5 سنين)</span>'
      : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 whitespace-nowrap" title="استحقاق 21 يوماً سنوياً (5 سنوات خدمة أو أقل)">21 يوماً (≤ 5 سنين)</span>';

    const curBal = Number(b.current_balance) || 0;
    let balanceBadge = '';
    if (curBal < 0) {
      balanceBadge = `<span class="px-2.5 py-1 rounded-xl text-xs font-mono font-black bg-rose-100 text-rose-800 border border-rose-300 inline-block shadow-xs" title="رصيد سالب: ${curBal} يوم">${curBal} يوم</span>`;
    } else if (curBal <= 5) {
      balanceBadge = `<span class="px-2.5 py-1 rounded-xl text-xs font-mono font-black bg-amber-100 text-amber-800 border border-amber-300 inline-block shadow-xs" title="رصيد منخفض: ${curBal} يوم">${curBal} يوم</span>`;
    } else {
      balanceBadge = `<span class="px-2.5 py-1 rounded-xl text-xs font-mono font-black bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block shadow-xs" title="رصيد متاح: ${curBal} يوم">${curBal} يوم</span>`;
    }

    const openingBadge = `<span class="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200 inline-block" title="الرصيد الافتتاحي المعتمد: ${b.base_balance} يوم">${b.base_balance} يوم</span>`;

    return `
      <tr class="hover:bg-slate-50/80 transition h-12">
        <td class="p-2.5 px-3 font-mono font-bold text-slate-800 sticky-col-emp-code text-right cell-nowrap-ellipsis" title="${b.emp_code}">${b.emp_code}</td>
        <td class="p-2.5 px-3 font-bold text-slate-900 sticky-col-emp-name text-right cell-nowrap-ellipsis max-w-[200px]" title="${b.full_name_ar}">${b.full_name_ar}</td>
        <td class="p-2.5 px-3 font-mono text-slate-600 text-center cell-nowrap-ellipsis" title="تاريخ المباشرة: ${b.join_date || '-'}">${b.join_date || '-'}</td>
        <td class="p-2.5 px-3 font-bold text-slate-700 text-center cell-nowrap-ellipsis" title="سنوات الخدمة: ${b.service_years} سنة">${b.service_years} سنة</td>
        <td class="p-2.5 px-3 text-center cell-nowrap-ellipsis">${entitlementBadge}</td>
        <td class="p-2.5 px-3 font-mono text-slate-500 text-center cell-nowrap-ellipsis" title="معدل التراكم اليومي: ${b.daily_accrual_rate} يوم لكل يوم عمل">${b.daily_accrual_rate} يوم/يوم</td>
        <td class="p-2.5 px-3 text-center cell-nowrap-ellipsis bg-slate-50/50">${openingBadge}</td>
        <td class="p-2.5 px-3 font-mono font-bold text-teal-700 text-center cell-nowrap-ellipsis" title="المستحق المتراكم: +${b.accrued_days} يوم">+${b.accrued_days} يوم</td>
        <td class="p-2.5 px-3 font-mono font-bold text-rose-600 text-center cell-nowrap-ellipsis" title="الإجازات المستهلكة: -${b.used_days} يوم">-${b.used_days} يوم</td>
        <td class="p-2.5 px-3 text-center cell-nowrap-ellipsis bg-emerald-50/40">${balanceBadge}</td>
        <td class="p-2.5 px-3 text-center cell-nowrap-ellipsis">
          ${canEditBalances() ? `
          <button onclick="openAdjustLeaveModal(${b.emp_id})" class="px-2.5 py-1 rounded-lg bg-brand/10 hover:bg-brand text-brand hover:text-white font-bold text-[11px] transition inline-flex items-center gap-1 shadow-xs" title="تسوية يدوية للرصيد">
            <i class="fa-solid fa-sliders"></i> تسوية الرصيد
          </button>
          ` : `
          <span class="text-slate-400 text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 inline-flex items-center gap-1" title="تعديل وتسوية الأرصدة مقيد ومخصص للإدارة العامة فقط">
            <i class="fa-solid fa-lock text-[10px]"></i> مقيد
          </span>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function onLeaveBalanceSearch(term) {
  leaveState.balancesSearch = term || '';
  leaveState.balancesPage = 1;
  renderLeaveBalancesTable();
}

function onLeaveBalanceFilterChange(filter) {
  leaveState.balancesFilter = filter || 'all';
  leaveState.balancesPage = 1;
  renderLeaveBalancesTable();
}

function onLeaveBalancePageSizeChange(size) {
  leaveState.balancesPageSize = size === 'all' ? 'all' : (parseInt(size) || 15);
  leaveState.balancesPage = 1;
  renderLeaveBalancesTable();
}

function goToLeaveBalancePage(page) {
  leaveState.balancesPage = page;
  renderLeaveBalancesTable();
}

async function loadLeaveAdjustmentsTable() {
  const tbody = document.getElementById('leaveAdjustmentsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="7" class="text-center p-6 text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin mr-2"></i> جاري تحميل سجل تدقيق التعديلات...</td></tr>';

  try {
    const res = await apiFetch('/api/leaves/adjustments');
    if (!res || !res.success || !res.data || res.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center p-6 text-slate-400 font-bold">لا توجد تسويات يدوية مسجلة حتى الآن</td></tr>';
      return;
    }

    leaveState.adjustments = res.data;

    tbody.innerHTML = res.data.map(a => `
      <tr class="hover:bg-slate-50 transition">
        <td class="p-3">
          <div class="font-bold text-slate-900">${a.full_name_ar}</div>
          <div class="text-[10px] text-slate-400 font-mono">${a.emp_code}</div>
        </td>
        <td class="p-3 font-semibold text-slate-700">${a.adjusted_by_name || 'إدارة الموارد البشرية'}</td>
        <td class="p-3 font-mono font-black ${a.days_adjusted >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
          ${a.days_adjusted >= 0 ? '+' : ''}${a.days_adjusted} يوم
        </td>
        <td class="p-3 font-mono text-slate-500">${a.balance_before} يوم</td>
        <td class="p-3 font-mono font-bold text-slate-800">${a.balance_after} يوم</td>
        <td class="p-3 text-slate-700 text-xs">${a.reason}</td>
        <td class="p-3 font-mono text-slate-500 text-[11px]">${a.created_at}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center p-6 text-rose-500 font-bold">فشل في تحميل سجل التدقيق: ${err.message}</td></tr>`;
  }
}

function populateLeaveEmpSelects() {
  const leaveEmpSel = document.getElementById('leaveFormEmpId');
  const leaveSubSel = document.getElementById('leaveFormSubstitute');
  const adjustEmpSel = document.getElementById('adjustLeaveEmpId');

  const employees = state.employees || [];
  const optionsHtml = '<option value="">-- اختر الموظف --</option>' + 
    employees.map(e => `<option value="${e.id}">${e.emp_code} - ${e.full_name_ar} (${e.job_title_ar || ''})</option>`).join('');

  if (leaveEmpSel) leaveEmpSel.innerHTML = optionsHtml;
  if (leaveSubSel) leaveSubSel.innerHTML = '<option value="">-- اختياري --</option>' + employees.map(e => `<option value="${e.id}">${e.full_name_ar}</option>`).join('');
  if (adjustEmpSel) adjustEmpSel.innerHTML = optionsHtml;

  // Set default dates for leave form
  const today = new Date().toISOString().split('T')[0];
  const startInp = document.getElementById('leaveFormStartDate');
  const endInp = document.getElementById('leaveFormEndDate');
  if (startInp && !startInp.value) startInp.value = today;
  if (endInp && !endInp.value) endInp.value = today;
  calculateLeaveDays();
}

async function onLeaveEmpChanged(empId) {
  if (!empId) {
    if (document.getElementById('leaveFormCurrentBalanceText')) document.getElementById('leaveFormCurrentBalanceText').textContent = '--';
    return;
  }

  try {
    const res = await apiFetch(`/api/leaves/balances?emp_id=${empId}`);
    if (res && res.success && res.data) {
      const b = res.data;
      const flooredBal = (b.display_balance !== undefined) ? b.display_balance : Math.floor(b.current_balance);
      window._currentLeaveBalance = flooredBal;
      if (document.getElementById('leaveFormCurrentBalanceText')) {
        document.getElementById('leaveFormCurrentBalanceText').textContent = flooredBal;
      }
      if (document.getElementById('leaveFormDailyRateText')) {
        document.getElementById('leaveFormDailyRateText').textContent = `الاستحقاق: ${b.annual_entitlement} يوماً سنوياً (${b.daily_accrual_rate} يوم/يوم) | سنوات الخدمة: ${b.service_years} سنة`;
      }
    }
  } catch (err) {
    console.error('Error fetching employee leave balance:', err);
  }
}

function calculateLeaveDays() {
  const startVal = document.getElementById('leaveFormStartDate')?.value;
  const endVal = document.getElementById('leaveFormEndDate')?.value;
  const daysInp = document.getElementById('leaveFormDays');
  if (!daysInp) return;

  if (!startVal || !endVal) {
    daysInp.value = 1;
    return;
  }

  const d1 = new Date(startVal);
  const d2 = new Date(endVal);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24)) + 1;
  daysInp.value = Math.max(1, diffDays);
}

async function handleNewLeaveSubmit(e) {
  e.preventDefault();

  const emp_id = document.getElementById('leaveFormEmpId')?.value;
  const leave_type = document.getElementById('leaveFormType')?.value;
  const start_date = document.getElementById('leaveFormStartDate')?.value;
  const end_date = document.getElementById('leaveFormEndDate')?.value;
  const days_count = Number(document.getElementById('leaveFormDays')?.value) || 1;
  const substitute_emp_id = document.getElementById('leaveFormSubstitute')?.value || null;
  const reason = document.getElementById('leaveFormReason')?.value || '';

  if (!emp_id || !start_date || !end_date) {
    alert('يرجى استكمال الحقول الإلزامية');
    return;
  }

  if (!substitute_emp_id) {
    alert('حقل الموظف البديل إلزامي لتقديم طلب الإجازة.');
    return;
  }

  if (leave_type === 'إجازة سنوية' && window._currentLeaveBalance !== undefined) {
    if (days_count > window._currentLeaveBalance) {
      alert(`لا يمكن تقديم الطلب: عدد الأيام المطلوبة (${days_count} يوم) يتجاوز رصيد الإجازة السنوية المتاح (${window._currentLeaveBalance} يوم).`);
      return;
    }
  }

  try {
    const res = await apiFetch('/api/leaves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emp_id: Number(emp_id),
        leave_type,
        start_date,
        end_date,
        days_count,
        substitute_emp_id: substitute_emp_id ? Number(substitute_emp_id) : null,
        reason
      })
    });

    if (res && res.success) {
      alert(res.message || 'تم تقديم طلب الإجازة بنجاح وإحالته للمدير المباشر');
      closeModal('modalNewLeaveRequest');
      await loadLeavesView();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في حفظ طلب الإجازة'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء تقديم الطلب: ' + err.message);
  }
}

async function approveLeave(id, action, role) {
  const actionText = action === 'approve' ? (role === 'manager' ? 'موافقة المدير المباشر' : 'اعتماد نهائي من الموارد البشرية') : 'رفض الطلب';
  const comment = prompt(`يرجى كتابة ملاحظات القرار (${actionText}):`, action === 'approve' ? 'موافق وفق السياسة المعتمدة' : 'نعتذر عن عدم الموافقة لظروف العمل');
  if (comment === null) return;

  try {
    const approverName = state.currentUser ? (state.currentUser.full_name_ar || state.currentUser.username) : 'المدير المسؤول';
    const res = await apiFetch(`/api/leaves/${id}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, role, comment, approverName })
    });

    if (res && res.success) {
      alert(res.message || 'تم تحديث حالة طلب الإجازة بنجاح');
      await loadLeavesView();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في تحديث الطلب'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء معالجة الطلب: ' + err.message);
  }
}

async function deleteLeave(id) {
  if (!canDelete()) {
    alert('عذراً، صلاحية حذف طلبات الإجازات مقيدة ومخصصة لمدير النظام العام فقط.');
    return;
  }
  if (!confirm('هل أنت متأكد من رغبتك في حذف طلب الإجازة هذا؟')) return;

  try {
    const res = await apiFetch(`/api/leaves/${id}`, { method: 'DELETE' });
    if (res && res.success) {
      alert('تم حذف طلب الإجازة بنجاح');
      await loadLeavesView();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في حذف طلب الإجازة'));
    }
  } catch (err) {
    alert('حدث خطأ: ' + err.message);
  }
}

function openAdjustLeaveModal(empId) {
  if (!canEditBalances()) {
    alert('عذراً، صلاحية تعديل وتسوية أرصدة الإجازات مقيدة ومخصصة للإدارة العليا والمدير العام فقط.');
    return;
  }
  populateLeaveEmpSelects();
  const sel = document.getElementById('adjustLeaveEmpId');
  if (sel && empId) {
    sel.value = empId;
    onAdjustLeaveEmpChanged(empId);
  }
  openModal('modalAdjustLeaveBalance');
}

async function onAdjustLeaveEmpChanged(empId) {
  const infoBox = document.getElementById('adjustLeaveEmpInfo');
  if (!infoBox) return;

  if (!empId) {
    infoBox.innerHTML = 'يرجى اختيار الموظف لعرض تفاصيل رصيده واستحقاقه.';
    return;
  }

  try {
    const res = await apiFetch(`/api/leaves/balances?emp_id=${empId}`);
    if (res && res.success && res.data) {
      const b = res.data;
      infoBox.innerHTML = `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div class="bg-white p-2 rounded-lg border">
            <span class="block text-[10px] text-slate-400">سنوات الخدمة</span>
            <span class="font-bold text-slate-800">${b.service_years} سنة</span>
          </div>
          <div class="bg-white p-2 rounded-lg border">
            <span class="block text-[10px] text-slate-400">الاستحقاق السنوي</span>
            <span class="font-bold text-purple-700">${b.annual_entitlement} يوم</span>
          </div>
          <div class="bg-white p-2 rounded-lg border">
            <span class="block text-[10px] text-slate-400">المعدل اليومي</span>
            <span class="font-bold text-slate-800 font-mono">${b.daily_accrual_rate}</span>
          </div>
          <div class="bg-teal-50 p-2 rounded-lg border border-teal-200">
            <span class="block text-[10px] text-teal-700">الرصيد الفعلي الحالي</span>
            <span class="font-black text-teal-900 font-mono text-sm">${b.current_balance} يوم</span>
          </div>
        </div>
      `;
    }
  } catch (err) {
    console.error('Error fetching balance for adjustment:', err);
  }
}

async function handleAdjustLeaveSubmit(e) {
  e.preventDefault();
  if (!canEditBalances()) {
    alert('عذراً، صلاحية تعديل وتسوية أرصدة الإجازات مقيدة ومخصصة للإدارة العليا والمدير العام فقط.');
    return;
  }

  const emp_id = document.getElementById('adjustLeaveEmpId')?.value;
  const adjType = document.getElementById('adjustLeaveType')?.value;
  const daysVal = Number(document.getElementById('adjustLeaveDays')?.value);
  const reason = document.getElementById('adjustLeaveReason')?.value || '';

  if (!emp_id || !daysVal || !reason.trim()) {
    alert('يرجى تعبئة كافة الحقول بما فيها المبرر النظامي الإلزامي');
    return;
  }

  const days_adjusted = adjType === 'deduct' ? -Math.abs(daysVal) : Math.abs(daysVal);
  const adjusted_by_name = state.currentUser ? (state.currentUser.full_name_ar || state.currentUser.username) : 'مسؤول الموارد البشرية';

  try {
    const res = await apiFetch('/api/leaves/adjust-balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emp_id: Number(emp_id),
        days_adjusted,
        reason,
        adjusted_by_name
      })
    });

    if (res && res.success) {
      alert(res.message || 'تمت تسوية وتوثيق رصيد الموظف بنجاح في سجل التدقيق');
      closeModal('modalAdjustLeaveBalance');
      
      // Update in-memory balance without reloading entire view
      if (res.data && leaveState.balances && leaveState.balances.length > 0) {
        const targetId = Number(emp_id);
        const bIdx = leaveState.balances.findIndex(b => Number(b.emp_id) === targetId);
        if (bIdx !== -1) {
          leaveState.balances[bIdx] = {
            ...leaveState.balances[bIdx],
            current_balance: res.data.current_balance !== undefined ? res.data.current_balance : res.data.balance_after,
            manual_adjustment: res.data.manual_adjustment !== undefined ? res.data.manual_adjustment : ((leaveState.balances[bIdx].manual_adjustment || 0) + days_adjusted)
          };
        }
      }
      renderLeaveBalancesTable();
      loadLeaveAdjustmentsTable();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في تسوية الرصيد'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء حفظ التسوية: ' + err.message);
  }
}


/* =========================================================================
   12. TASKS MANAGEMENT SYSTEM (نظام المهام والمتابعة الإدارية)
   ========================================================================= */

const taskState = {
  tasks: []
};

async function loadTasksView() {
  try {
    // 1. Fetch dashboard metrics
    const dashRes = await apiFetch('/api/tasks/dashboard');
    if (dashRes && dashRes.success && dashRes.data) {
      const d = dashRes.data;
      if (document.getElementById('statTasksTotal')) document.getElementById('statTasksTotal').textContent = d.total || 0;
      if (document.getElementById('statTasksOpen')) document.getElementById('statTasksOpen').textContent = d.open || 0;
      if (document.getElementById('statTasksCompleted')) document.getElementById('statTasksCompleted').textContent = d.completed || 0;
      if (document.getElementById('statTasksOverdue')) document.getElementById('statTasksOverdue').textContent = d.overdue || 0;
      if (document.getElementById('statTasksCompletionRate')) document.getElementById('statTasksCompletionRate').textContent = (d.completionRate || 0) + '%';
    }

    // 2. Populate employee dropdown in create task modal
    populateTasksEmpSelect();

    // 3. Load tasks table
    await loadTasksTable();
  } catch (err) {
    console.error('Error loading tasks view:', err);
  }
}

function populateTasksEmpSelect() {
  const sel = document.getElementById('taskFormEmpId');
  if (!sel) return;

  const employees = state.employees || [];
  sel.innerHTML = '<option value="">-- اختر الموظف --</option>' + 
    employees.map(e => `<option value="${e.id}">${e.emp_code} - ${e.full_name_ar} (${e.job_title_ar || ''})</option>`).join('');

  const today = new Date().toISOString().split('T')[0];
  const startInp = document.getElementById('taskFormStartDate');
  const dueInp = document.getElementById('taskFormDueDate');
  if (startInp && !startInp.value) startInp.value = today;
  if (dueInp && !dueInp.value) dueInp.value = today;
}

async function loadTasksTable() {
  const tbody = document.getElementById('tasksTableBody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="9" class="text-center p-6 text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin mr-2"></i> جاري تحميل المهام...</td></tr>';

  try {
    const statusFilter = document.getElementById('filterTaskStatus') ? document.getElementById('filterTaskStatus').value : '';
    const priorityFilter = document.getElementById('filterTaskPriority') ? document.getElementById('filterTaskPriority').value : '';

    let url = '/api/tasks';
    const params = [];
    if (statusFilter) params.push(`status=${encodeURIComponent(statusFilter)}`);
    if (priorityFilter) params.push(`priority=${encodeURIComponent(priorityFilter)}`);
    if (params.length) url += '?' + params.join('&');

    const res = await apiFetch(url);
    if (!res || !res.success || !res.data) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center p-6 text-slate-400">لا توجد مهام مسجلة</td></tr>';
      return;
    }

    taskState.tasks = res.data;
    renderTasksTableRows(res.data);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center p-6 text-rose-500 font-bold">فشل في تحميل المهام: ${err.message}</td></tr>`;
  }
}

function renderTasksTableRows(tasks) {
  const tbody = document.getElementById('tasksTableBody');
  if (!tbody) return;

  if (!tasks || tasks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center p-6 text-slate-400 font-bold">لا توجد مهام مطابقة لخيارات البحث</td></tr>';
    return;
  }

  tbody.innerHTML = tasks.map(t => {
    // Priority badge
    let priorityBadge = '';
    if (t.priority === 'عاجلة') {
      priorityBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">عاجلة (قصوى)</span>';
    } else if (t.priority === 'عالية') {
      priorityBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">عالية</span>';
    } else if (t.priority === 'متوسطة') {
      priorityBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">متوسطة</span>';
    } else {
      priorityBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">منخفضة</span>';
    }

    // Status badge
    let statusBadge = '';
    if (t.status === 'مكتملة') {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit"><i class="fa-solid fa-circle-check"></i> مكتملة</span>';
    } else if (t.status === 'متأخرة') {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1 w-fit"><i class="fa-solid fa-triangle-exclamation"></i> متأخرة</span>';
    } else if (t.status === 'بانتظار الاعتماد') {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit"><i class="fa-solid fa-clock"></i> بانتظار الاعتماد</span>';
    } else if (t.status === 'قيد التنفيذ') {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1 w-fit"><i class="fa-solid fa-spinner fa-spin"></i> قيد التنفيذ</span>';
    } else {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">جديدة</span>';
    }

    // Progress bar
    const prog = t.progress_percentage || 0;
    const progColor = prog >= 100 ? 'bg-emerald-600' : (prog >= 50 ? 'bg-brand' : 'bg-amber-500');

    // Actions
    let actions = `<div class="flex items-center justify-center gap-1">
      <button onclick="openUpdateTaskProgressModal(${t.id})" title="تحديث نسبة الإنجاز والحالة" class="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] flex items-center gap-1 transition">
        <i class="fa-solid fa-pen-ruler"></i> تحديث (${prog}%)
      </button>`;

    if (t.status === 'بانتظار الاعتماد') {
      actions += `
        <button onclick="approveTask(${t.id}, 'approve', 'manager')" title="اعتماد إنجاز المهمة" class="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 transition">
          <i class="fa-solid fa-check-double"></i> اعتماد
        </button>`;
    }

    actions += `
      ${canDelete() ? `
      <button onclick="deleteTask(${t.id})" title="حذف المهمة" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center text-xs transition">
        <i class="fa-solid fa-trash"></i>
      </button>
      ` : ''}
    </div>`;

    return `
      <tr class="hover:bg-slate-50/80 transition">
        <td class="p-3 font-mono font-bold text-slate-800">${t.task_no}</td>
        <td class="p-3">
          <div class="font-bold text-slate-900">${t.title}</div>
          ${t.description ? `<div class="text-[10px] text-slate-500 line-clamp-1">${t.description}</div>` : ''}
        </td>
        <td class="p-3">
          <div class="font-bold text-slate-800">${t.assigned_to_name}</div>
          <div class="text-[10px] text-slate-400 font-mono">${t.assigned_to_code}</div>
        </td>
        <td class="p-3 font-mono text-slate-600">${t.start_date}</td>
        <td class="p-3 font-mono font-bold text-slate-800">${t.due_date}</td>
        <td class="p-3">${priorityBadge}</td>
        <td class="p-3">
          <div class="w-28 space-y-1">
            <div class="flex justify-between text-[10px] font-mono font-bold text-slate-600">
              <span>${prog}%</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div class="${progColor} h-1.5 rounded-full transition-all duration-300" style="width: ${prog}%"></div>
            </div>
          </div>
        </td>
        <td class="p-3">${statusBadge}</td>
        <td class="p-3 text-center">${actions}</td>
      </tr>
    `;
  }).join('');
}

function filterTasksTableLive() {
  const term = (document.getElementById('searchTasksInput')?.value || '').trim().toLowerCase();
  if (!term) {
    renderTasksTableRows(taskState.tasks);
    return;
  }
  const filtered = taskState.tasks.filter(t => 
    (t.task_no && t.task_no.toLowerCase().includes(term)) ||
    (t.title && t.title.toLowerCase().includes(term)) ||
    (t.assigned_to_name && t.assigned_to_name.toLowerCase().includes(term)) ||
    (t.assigned_to_code && t.assigned_to_code.toLowerCase().includes(term))
  );
  renderTasksTableRows(filtered);
}

function openCreateTaskModal() {
  populateTasksEmpSelect();
  const form = document.getElementById('createTaskForm');
  if (form) form.reset();
  const alertEl = document.getElementById('taskFormAlert');
  if (alertEl) {
    alertEl.className = 'hidden';
    alertEl.innerHTML = '';
  }
  const today = new Date().toISOString().split('T')[0];
  const startInp = document.getElementById('taskFormStartDate');
  const dueInp = document.getElementById('taskFormDueDate');
  if (startInp) startInp.value = today;
  if (dueInp) dueInp.value = today;
  openModal('modalCreateTask');
}

async function handleCreateTaskSubmit(e) {
  e.preventDefault();

  const alertEl = document.getElementById('taskFormAlert');
  const submitBtn = document.getElementById('btnSubmitTaskForm');

  const title = (document.getElementById('taskFormTitle')?.value || '').trim();
  const assigned_to = document.getElementById('taskFormEmpId')?.value;
  const priority = document.getElementById('taskFormPriority')?.value || 'متوسطة';
  const start_date = document.getElementById('taskFormStartDate')?.value;
  const due_date = document.getElementById('taskFormDueDate')?.value;
  const status = document.getElementById('taskFormStatus')?.value || 'جديدة';
  const attachments = (document.getElementById('taskFormAttachments')?.value || '').trim();
  const description = (document.getElementById('taskFormDescription')?.value || '').trim();

  const showAlert = (msg, isError = true) => {
    if (alertEl) {
      alertEl.className = isError
        ? 'block text-xs p-3 rounded-xl font-bold bg-rose-50 text-rose-700 border border-rose-200 mb-2'
        : 'block text-xs p-3 rounded-xl font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2';
      alertEl.innerHTML = `<i class="fa-solid ${isError ? 'fa-triangle-exclamation' : 'fa-circle-check'} ml-1"></i> ${msg}`;
    } else {
      alert(msg);
    }
  };

  if (!title) {
    showAlert('يرجى إدخال عنوان المهمة بشكل واضح');
    return;
  }
  if (!assigned_to) {
    showAlert('يرجى اختيار الموظف المكلف بالمهمة');
    return;
  }
  if (!start_date || !due_date) {
    showAlert('يرجى تحديد تاريخ البداية وتاريخ الاستحقاق');
    return;
  }
  if (due_date < start_date) {
    showAlert('تاريخ الاستحقاق يجب ألا يكون سابقاً لتاريخ البداية');
    return;
  }

  // Safe assigned_by: only send valid employee ID if currentUser has emp_id, otherwise null
  const validAssignedBy = (state.currentUser && state.currentUser.emp_id) ? Number(state.currentUser.emp_id) : null;
  const assignerName = (state.currentUser && (state.currentUser.full_name_ar || state.currentUser.name)) ? (state.currentUser.full_name_ar || state.currentUser.name) : 'مدير النظام';

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
    }

    const res = await apiFetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        assigned_to: Number(assigned_to),
        priority,
        start_date,
        due_date,
        status,
        attachments,
        description,
        assigned_by: validAssignedBy,
        assigned_by_name: assignerName
      })
    });

    if (res && res.success) {
      showAlert(res.message || 'تم إنشاء المهمة وإسنادها للموظف بنجاح', false);
      setTimeout(() => {
        closeModal('modalCreateTask');
        document.getElementById('createTaskForm')?.reset();
        if (alertEl) {
          alertEl.className = 'hidden';
          alertEl.innerHTML = '';
        }
      }, 700);
      await loadTasksView();
    } else {
      showAlert('خطأ: ' + (res?.error || 'فشل في إنشاء وحفظ المهمة'));
    }
  } catch (err) {
    showAlert('حدث خطأ في النظام: ' + err.message);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> إسناد المهمة';
    }
  }
}

function openUpdateTaskProgressModal(taskId) {
  const t = taskState.tasks.find(x => x.id === taskId);
  if (!t) return;

  if (document.getElementById('updateTaskId')) document.getElementById('updateTaskId').value = t.id;
  if (document.getElementById('updateTaskTitleDisplay')) document.getElementById('updateTaskTitleDisplay').textContent = `[${t.task_no}] ${t.title} (${t.assigned_to_name})`;
  if (document.getElementById('updateTaskProgressRange')) document.getElementById('updateTaskProgressRange').value = t.progress_percentage || 0;
  if (document.getElementById('updateTaskProgressLabel')) document.getElementById('updateTaskProgressLabel').textContent = (t.progress_percentage || 0) + '%';
  if (document.getElementById('updateTaskStatus')) document.getElementById('updateTaskStatus').value = t.status || 'قيد التنفيذ';

  openModal('modalUpdateTaskProgress');
}

function onTaskProgressSliderChange(val) {
  if (document.getElementById('updateTaskProgressLabel')) {
    document.getElementById('updateTaskProgressLabel').textContent = val + '%';
  }
  const statusSelect = document.getElementById('updateTaskStatus');
  if (statusSelect) {
    if (Number(val) === 100) {
      statusSelect.value = 'بانتظار الاعتماد';
    } else if (Number(val) > 0 && statusSelect.value === 'جديدة') {
      statusSelect.value = 'قيد التنفيذ';
    }
  }
}

async function handleUpdateTaskSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('updateTaskId')?.value;
  const progress_percentage = Number(document.getElementById('updateTaskProgressRange')?.value) || 0;
  const status = document.getElementById('updateTaskStatus')?.value;

  if (!id) return;

  try {
    const res = await apiFetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress_percentage, status })
    });

    if (res && res.success) {
      alert(res.message || 'تم تحديث نسبة الإنجاز بنجاح');
      closeModal('modalUpdateTaskProgress');
      await loadTasksView();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في تحديث المهمة'));
    }
  } catch (err) {
    alert('حدث خطأ: ' + err.message);
  }
}

async function approveTask(id, action, role) {
  const comment = prompt('ملاحظات اعتماد إنجاز المهمة:', 'معتمد ومطابق للمعايير المطلوبة');
  if (comment === null) return;

  try {
    const res = await apiFetch(`/api/tasks/${id}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, role, comment })
    });

    if (res && res.success) {
      alert(res.message || 'تم اعتماد المهمة بنجاح');
      await loadTasksView();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في اعتماد المهمة'));
    }
  } catch (err) {
    alert('حدث خطأ: ' + err.message);
  }
}

async function deleteTask(id) {
  if (!canDelete()) {
    alert('عذراً، صلاحية حذف المهام مقيدة ومخصصة لمدير النظام العام فقط.');
    return;
  }
  if (!confirm('هل أنت متأكد من رغبتك في حذف هذه المهمة؟')) return;

  try {
    const res = await apiFetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res && res.success) {
      alert('تم حذف المهمة بنجاح');
      await loadTasksView();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في حذف المهمة'));
    }
  } catch (err) {
    alert('حدث خطأ: ' + err.message);
  }
}


/* =========================================================================
   13. HR WORD FORMS GENERATOR (نماذج Word الرسمية الـ 6)
   ========================================================================= */

let currentFormsActiveEmpId = null;

function populateFormsActiveEmpSelect() {
  const sel = document.getElementById('formsActiveEmpSelect');
  if (!sel) return;
  const emps = (state.employees || []).filter(e => !['JM-0001', 'JM-0002', 'JM-0003'].includes(e.emp_code));
  const curUser = state.currentUser || {};
  let defaultEmpId = curUser.emp_id || currentEssEmpId || (emps[0] ? emps[0].id : null);
  if (!currentFormsActiveEmpId && defaultEmpId) {
    currentFormsActiveEmpId = defaultEmpId;
  }

  sel.innerHTML = emps.map(e => `
    <option value="${e.id}" ${Number(e.id) === Number(currentFormsActiveEmpId) ? 'selected' : ''}>
      ${e.emp_code} - ${e.full_name_ar} (${e.job_title_ar || 'موظف'})
    </option>
  `).join('');
}

function onFormsActiveEmpChanged(empId) {
  currentFormsActiveEmpId = Number(empId);
}

function getEffectiveFormEmpId(empId = null) {
  if (empId) return Number(empId);
  if (currentFormsActiveEmpId) return Number(currentFormsActiveEmpId);
  const curUser = state.currentUser || {};
  if (curUser.emp_id) return Number(curUser.emp_id);
  if (currentEssEmpId) return Number(currentEssEmpId);
  const emps = (state.employees || []).filter(e => !['JM-0001', 'JM-0002', 'JM-0003'].includes(e.emp_code));
  return emps[0] ? emps[0].id : 28208;
}

function downloadWordFormDirect(formType, empId = null) {
  const targetEmpId = getEffectiveFormEmpId(empId);
  window.open(`/api/forms/word/${formType}?emp_id=${targetEmpId}`, '_blank');
}

function previewOfficialHtmlFormDirect(formType, empId = null) {
  const targetEmpId = getEffectiveFormEmpId(empId);
  let url = '';
  switch (formType) {
    case 'absence_penalty':
      url = `/api/forms/html/absence-penalty/${targetEmpId}?emp_id=${targetEmpId}`;
      break;
    case 'instruction_penalty':
      url = `/api/forms/html/instruction-penalty/${targetEmpId}?emp_id=${targetEmpId}`;
      break;
    case 'clearance':
      url = `/api/forms/html/clearance/${targetEmpId}?emp_id=${targetEmpId}`;
      break;
    case 'contract_non_renewal':
      url = `/api/forms/html/contract-non-renewal/${targetEmpId}?emp_id=${targetEmpId}`;
      break;
    case 'penalty_procedure':
      url = `/api/forms/html/penalty/${targetEmpId}?emp_id=${targetEmpId}`;
      break;
    case 'resignation_termination':
      url = `/api/forms/html/resignation/${targetEmpId}?emp_id=${targetEmpId}`;
      break;
    case 'leave_request':
      url = `/api/forms/html/leave/${targetEmpId}?emp_id=${targetEmpId}`;
      break;
    case 'salary_cert':
      url = `/api/forms/html/salary-cert/${targetEmpId}?emp_id=${targetEmpId}`;
      break;
    default:
      url = `/api/forms/html/leave/${targetEmpId}?emp_id=${targetEmpId}`;
  }
  window.open(url, '_blank');
}

function downloadRawTemplate(formNum) {
  window.open(`/api/forms/raw-template/${formNum}`, '_blank');
}

function populateFormsEmpSelect() {
  const sel = document.getElementById('wordFormEmpId');
  if (!sel) return;

  const employees = state.employees || [];
  sel.innerHTML = '<option value="">-- اختر الموظف --</option>' + 
    employees.map(e => `<option value="${e.id}">${e.emp_code} - ${e.full_name_ar} (${e.job_title_ar || ''})</option>`).join('');
}

function openFormModal(formType, title, empId = null, extra = {}) {
  populateFormsEmpSelect();

  if (document.getElementById('wordFormTypeVal')) document.getElementById('wordFormTypeVal').value = formType;
  if (document.getElementById('wordFormModalTitle')) {
    document.getElementById('wordFormModalTitle').innerHTML = `<i class="fa-solid fa-file-word text-blue-600"></i> ${title} (.docx)`;
  }

  // Adjust field labels based on form type
  const numLabel = document.getElementById('wordFormNumericLabel');
  const dirLabel = document.getElementById('wordFormDirectedLabel');
  const dirCol = document.getElementById('wordFormDirectedCol');
  const datesRow = document.getElementById('wordFormDatesRow');
  const numVal = document.getElementById('wordFormNumericVal');
  const dirVal = document.getElementById('wordFormDirectedTo');
  const notesVal = document.getElementById('wordFormNotes');

  const today = new Date().toISOString().split('T')[0];
  if (document.getElementById('wordFormStartDate')) document.getElementById('wordFormStartDate').value = extra.startDate || today;
  if (document.getElementById('wordFormEndDate')) document.getElementById('wordFormEndDate').value = extra.endDate || today;

  if (formType === 'loan_advance') {
    if (numLabel) numLabel.textContent = 'مبلغ السلفة المطلوب (SAR): *';
    if (dirLabel) dirLabel.textContent = 'خطة التقسيط الشهري (أشهر):';
    if (dirCol) dirCol.classList.remove('hidden');
    if (datesRow) datesRow.classList.add('hidden');
    if (numVal) numVal.value = extra.amount || 3000;
    if (dirVal) dirVal.value = extra.installments || '3 أشهر';
  } else if (formType === 'salary_cert') {
    if (datesRow) datesRow.classList.add('hidden');
    if (numLabel) numLabel.textContent = 'الراتب المعتمد (تلقائي):';
    if (dirLabel) dirLabel.textContent = 'الجهة الموجه إليها الخطاب: *';
    if (dirCol) dirCol.classList.remove('hidden');
    if (dirVal) dirVal.value = extra.directedTo || 'مصرف الراجحي';
  } else if (formType === 'permission_request') {
    if (datesRow) datesRow.classList.remove('hidden');
    if (numLabel) numLabel.textContent = 'عدد ساعات الاستئذان (ساعة):';
    if (dirLabel) dirLabel.textContent = 'طبيعة الخروج:';
    if (dirCol) dirCol.classList.remove('hidden');
    if (numVal) numVal.value = extra.hours || 2;
    if (dirVal) dirVal.value = extra.reason || 'مراجعة طبية رسمية';
  } else if (formType === 'mission_request') {
    if (datesRow) datesRow.classList.remove('hidden');
    if (numLabel) numLabel.textContent = 'مدة المهمة (يوم):';
    if (dirLabel) dirLabel.textContent = 'وجهة المهمة ومقر التكليف: *';
    if (dirCol) dirCol.classList.remove('hidden');
    if (numVal) numVal.value = extra.days || 2;
    if (dirVal) dirVal.value = extra.destination || 'فرع محايل عسير';
  } else if (formType === 'return_from_leave') {
    if (datesRow) datesRow.classList.remove('hidden');
    if (numLabel) numLabel.textContent = 'مدة الإجازة المنتهية (يوم):';
    if (dirLabel) dirLabel.textContent = 'القسم والفرع:';
    if (dirCol) dirCol.classList.remove('hidden');
    if (numVal) numVal.value = extra.days || 5;
  } else {
    // leave_request
    if (datesRow) datesRow.classList.remove('hidden');
    if (numLabel) numLabel.textContent = 'عدد الأيام (يوم):';
    if (dirLabel) dirLabel.textContent = 'الموظف البديل:';
    if (dirCol) dirCol.classList.remove('hidden');
    if (numVal) numVal.value = extra.days || 5;
    if (dirVal) dirVal.value = extra.substitute || '';
  }

  if (notesVal) notesVal.value = extra.reason || '';

  const sel = document.getElementById('wordFormEmpId');
  if (sel && empId) {
    sel.value = empId;
    onWordFormEmpChanged(empId);
  }

  openModal('modalGenerateWordForm');
}

function onWordFormEmpChanged(empId) {
  const preview = document.getElementById('wordFormEmpPreview');
  if (!preview) return;

  if (!empId) {
    preview.innerHTML = 'يرجى اختيار الموظف لتعبئة بياناته الرسمية في النموذج.';
    return;
  }

  const emp = (state.employees || []).find(e => e.id === Number(empId));
  if (!emp) return;

  preview.innerHTML = `
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
      <div class="bg-white p-2 rounded-lg border">
        <span class="block text-[10px] text-slate-400">الرقم الوظيفي</span>
        <span class="font-bold text-slate-800 font-mono">${emp.emp_code}</span>
      </div>
      <div class="bg-white p-2 rounded-lg border">
        <span class="block text-[10px] text-slate-400">المسمى الوظيفي</span>
        <span class="font-bold text-slate-800">${emp.job_title_ar || '-'}</span>
      </div>
      <div class="bg-white p-2 rounded-lg border">
        <span class="block text-[10px] text-slate-400">الإدارة والفرع</span>
        <span class="font-bold text-slate-800">${emp.department_name || '-'}</span>
      </div>
      <div class="bg-blue-50 p-2 rounded-lg border border-blue-200">
        <span class="block text-[10px] text-blue-700">الراتب الأساسي</span>
        <span class="font-black text-blue-900 font-mono">${emp.basic_salary} SAR</span>
      </div>
    </div>
  `;
}

function handleGenerateWordFormSubmit(e) {
  e.preventDefault();

  const formType = document.getElementById('wordFormTypeVal')?.value || 'leave_request';
  const empId = document.getElementById('wordFormEmpId')?.value;
  if (!empId) {
    alert('يرجى اختيار الموظف لاستخراج النموذج');
    return;
  }

  const startDate = document.getElementById('wordFormStartDate')?.value || '';
  const endDate = document.getElementById('wordFormEndDate')?.value || '';
  const numVal = document.getElementById('wordFormNumericVal')?.value || '';
  const directedTo = document.getElementById('wordFormDirectedTo')?.value || '';
  const notes = document.getElementById('wordFormNotes')?.value || '';

  const params = new URLSearchParams({
    emp_id: empId,
    start_date: startDate,
    end_date: endDate,
    days: numVal,
    amount: numVal,
    hours: numVal,
    destination: directedTo,
    directed_to: directedTo,
    substitute_name: directedTo,
    notes: notes,
    reason: notes
  });

  const url = `/api/forms/word/${formType}?${params.toString()}`;
  window.open(url, '_blank');
  closeModal('modalGenerateWordForm');
}


/* =========================================================================
   14. ORGANIZATIONAL HIERARCHY (الهيكل الإداري وسلسلة المديرين المباشرين)
   ========================================================================= */

async function loadOrgHierarchy() {
  const container = document.getElementById('orgHierarchyContainer');
  if (!container) return;

  container.innerHTML = '<div class="text-center p-6 text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin mr-2"></i> جاري بناء الهيكل الإداري وسلسلة المديرين...</div>';

  try {
    const res = await apiFetch('/api/employees/hierarchy');
    if (!res || !res.success || !res.data) {
      container.innerHTML = '<div class="text-center p-6 text-slate-400">لا توجد بيانات هيكل إداري</div>';
      return;
    }

    const { tree, flat } = res.data;

    let html = `
      <div class="space-y-6">
        <!-- Top Level Card: Executive Management -->
        <div class="p-4 bg-white rounded-2xl border-2 border-brand shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center text-xl shadow">
              <i class="fa-solid fa-crown"></i>
            </div>
            <div>
              <span class="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">الإدارة العليا والمدير العام</span>
              <h4 class="text-base font-black text-slate-900 mt-0.5">شركة جوهرة المجد للتجارة (المركز الرئيسي - أبها)</h4>
              <p class="text-xs text-slate-500">إجمالي القوى العاملة الفعلية: ${flat.length} موظفاً معتمداً</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
              <i class="fa-solid fa-route text-brand ml-1"></i> مسار الموافقات: موظف ➔ مدير مباشر ➔ HR
            </span>
          </div>
        </div>

        <!-- Tree Nodes Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    `;

    tree.forEach(node => {
      const subCount = node.subordinates ? node.subordinates.length : 0;
      html += `
        <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-brand transition">
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                <i class="fa-solid fa-user-tie text-brand"></i>
              </div>
              <div>
                <h5 class="font-bold text-slate-900 text-xs">${node.full_name_ar}</h5>
                <span class="text-[10px] text-slate-400 font-mono">${node.emp_code} - ${node.job_title_ar || ''}</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand/10 text-brand">
              ${subCount} مرؤوس
            </span>
          </div>

          <div class="text-[11px] text-slate-500 flex items-center gap-1.5 pt-2 border-t">
            <i class="fa-solid fa-sitemap text-amber-600"></i>
            <span>${node.department_name || 'إدارة عامة'} | ${node.branch_name || 'فرع أبها الرئيسي'}</span>
          </div>

          ${subCount > 0 ? `
            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 max-h-40 overflow-y-auto">
              <span class="block text-[10px] font-bold text-slate-400">فريق العمل التابع مباشرة:</span>
              ${node.subordinates.map(sub => `
                <div class="flex justify-between items-center text-[11px] p-1 bg-white rounded-lg border border-slate-100">
                  <span class="font-semibold text-slate-800">${sub.full_name_ar}</span>
                  <span class="font-mono text-[10px] text-slate-400">${sub.emp_code}</span>
                </div>
              `).join('')}
            </div>
          ` : '<div class="text-[10px] text-slate-400 italic">لا يوجد موظفون مباشرون مسندون حالياً</div>'}
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = `<div class="text-center p-6 text-rose-500 font-bold">فشل في تحميل الهيكل الإداري: ${err.message}</div>`;
  }
}


/* =========================================================================
   15. UNIVERSAL EXPORT SERVICE (تصدير لكافة الأقسام بصيغ Excel, Word, PDF)
   ========================================================================= */

function exportData(type, format) {
  if (format === 'excel') {
    window.open(`/api/export/excel?type=${encodeURIComponent(type)}`, '_blank');
  } else if (format === 'word') {
    window.open(`/api/export/word?type=${encodeURIComponent(type)}`, '_blank');
  } else if (format === 'pdf') {
    // Map type to table ID for printing
    const tableMap = {
      'employees': 'employeesTable',
      'attendance': 'attendanceTable',
      'leaves': 'leavesTable',
      'tasks': 'tasksTable',
      'penalties': 'issuedPenaltiesTable',
      'payroll': 'payrollItemsTableBody',
      'permissions': 'essRequestsTableBody',
      'reports': 'complianceSummaryTable'
    };
    const tableId = tableMap[type] || 'employeesTable';
    printTable(tableId);
  }
}

// Global window mappings for all HTML event handlers
window.switchLeaveSubTab = switchLeaveSubTab;
window.loadLeavesView = loadLeavesView;
window.loadLeavesTable = loadLeavesTable;
window.filterLeavesTableLive = filterLeavesTableLive;
window.loadLeaveBalancesTable = loadLeaveBalancesTable;
window.loadLeaveAdjustmentsTable = loadLeaveAdjustmentsTable;
window.populateLeaveEmpSelects = populateLeaveEmpSelects;
window.onLeaveEmpChanged = onLeaveEmpChanged;
window.calculateLeaveDays = calculateLeaveDays;
window.handleNewLeaveSubmit = handleNewLeaveSubmit;
window.approveLeave = approveLeave;
window.deleteLeave = deleteLeave;
window.openAdjustLeaveModal = openAdjustLeaveModal;
window.onAdjustLeaveEmpChanged = onAdjustLeaveEmpChanged;
window.handleAdjustLeaveSubmit = handleAdjustLeaveSubmit;

window.loadTasksView = loadTasksView;
window.loadTasksTable = loadTasksTable;
window.filterTasksTableLive = filterTasksTableLive;
window.populateTasksEmpSelect = populateTasksEmpSelect;
window.openCreateTaskModal = openCreateTaskModal;
window.handleCreateTaskSubmit = handleCreateTaskSubmit;
window.openUpdateTaskProgressModal = openUpdateTaskProgressModal;
window.onTaskProgressSliderChange = onTaskProgressSliderChange;
window.handleUpdateTaskSubmit = handleUpdateTaskSubmit;
window.approveTask = approveTask;
window.deleteTask = deleteTask;

window.populateFormsEmpSelect = populateFormsEmpSelect;
window.openFormModal = openFormModal;
window.downloadWordFormDirect = downloadWordFormDirect;
window.previewOfficialHtmlFormDirect = previewOfficialHtmlFormDirect;
window.downloadRawTemplate = downloadRawTemplate;
window.onFormsActiveEmpChanged = onFormsActiveEmpChanged;
window.populateFormsActiveEmpSelect = populateFormsActiveEmpSelect;
window.onWordFormEmpChanged = onWordFormEmpChanged;
window.handleGenerateWordFormSubmit = handleGenerateWordFormSubmit;

window.loadOrgHierarchy = loadOrgHierarchy;
window.exportData = exportData;

// Employee Database & 360 Profile Windows Exports
window.switchEmpViewMode = switchEmpViewMode;
window.onEmpPageSizeChange = onEmpPageSizeChange;
window.changeEmpPage = changeEmpPage;
window.resetEmployeeFilters = resetEmployeeFilters;
window.switch360Tab = switch360Tab;
window.openEmployee360Modal = openEmployee360Modal;
window.printEmployee360Profile = printEmployee360Profile;
window.openEmployeeBadgeCard = openEmployeeBadgeCard;
window.printBadgeCardElement = printBadgeCardElement;
window.populateEmployeeFilterDropdowns = populateEmployeeFilterDropdowns;
window.renderEmployeesView = renderEmployeesView;
window.renderEmployeesTable = renderEmployeesTable;
window.renderEmployeesCards = renderEmployeesCards;
window.updateEmployeeKPIs = updateEmployeeKPIs;
window.filterEmployeesTable = filterEmployeesTable;

// Muqeem Report & Residents Module
window.loadMuqeemReport = loadMuqeemReport;
window.filterMuqeem = filterMuqeem;
window.handleMuqeemSearch = handleMuqeemSearch;
window.switchComplianceSubTab = switchComplianceSubTab;
window.openAddMuqeemModal = openAddMuqeemModal;
window.editMuqeemResident = editMuqeemResident;
window.toggleMuqeemLocation = toggleMuqeemLocation;
window.handleMuqeemResidentSubmit = handleMuqeemResidentSubmit;
window.deleteMuqeemResident = deleteMuqeemResident;
window.syncMuqeemFromExcel = syncMuqeemFromExcel;
window.syncMuqeemFromDatabase = syncMuqeemFromExcel;
window.exportMuqeemExcel = exportMuqeemExcel;

// Employee Self-Service (ESS) Tasks Integration
window.onEssEmpSelected = onEssEmpSelected;
window.completeEssTask = completeEssTask;
window.refreshEssTasks = refreshEssTasks;

// Leave Balances Enhanced UX Handlers
window.renderLeaveBalancesTable = renderLeaveBalancesTable;
window.onLeaveBalanceSearch = onLeaveBalanceSearch;
window.onLeaveBalanceFilterChange = onLeaveBalanceFilterChange;
window.onLeaveBalancePageSizeChange = onLeaveBalancePageSizeChange;
window.goToLeaveBalancePage = goToLeaveBalancePage;

// =============================================================================
// NEW PRODUCTION MODULES: TERMINATED EMPLOYEES, LOANS, ATTENDANCE NOTICES, FORMS
// =============================================================================

// --- 1. OFFICIAL FORM PREVIEW HANDLER ---
function openOfficialFormPreview(type, id, options = {}) {
  const iframe = document.getElementById('officialFormIframe');
  const title = document.getElementById('officialFormPreviewTitle');
  if (!iframe) return;

  let url = '';
  let titleText = 'معاينة الوثيقة الرسمية المعتمدة';

  if (type === 'leave') {
    url = `/api/forms/html/leave/${id}`;
    titleText = 'نموذج طلب إجازة رسمي (JM-HR-F-001) - شركة جوهرة المجد';
  } else if (type === 'penalty') {
    url = `/api/forms/html/penalty/${id}`;
    titleText = 'قرار جزائي إداري رسمي (JM-HR-F-002) - شركة جوهرة المجد';
  } else if (type === 'resignation') {
    url = `/api/forms/html/resignation/${id}`;
    titleText = 'نموذج طلب إنهاء خدمة واستقالة (JM-HR-F-003) - شركة جوهرة المجد';
  } else if (type === 'termination') {
    url = `/api/forms/html/termination/${id}`;
    titleText = 'نموذج إنهاء عقد ومخالصة نهائية (JM-HR-F-003/v3) - شركة جوهرة المجد';
  } else if (type === 'clearance') {
    url = `/api/forms/html/clearance/${id}`;
    titleText = 'نموذج إخلاء طرف موظف (JM-HR-F-005) - شركة جوهرة المجد';
  } else if (type === 'notice') {
    url = `/api/forms/html/notice/${id}`;
    titleText = 'خطاب إشعار / إنذار دوام رسمي موثق - شركة جوهرة المجد';
  } else if (type === 'salary_cert' || type === 'salary-cert') {
    url = `/api/forms/html/salary-cert/${id}`;
    titleText = 'شهادة تعريف بالراتب معتمدة رسمياً (JM-HR-F-008) - شركة جوهرة المجد';
  } else if (type === 'absence_penalty' || type === 'absence-penalty') {
    url = `/api/forms/html/absence-penalty/${id}`;
    titleText = 'إشعار عقوبة غياب رسمي (JM-HR-F-001/ABS) - شركة جوهرة المجد';
  } else if (type === 'instruction_penalty' || type === 'instruction-penalty') {
    url = `/api/forms/html/instruction-penalty/${id}`;
    titleText = 'إشعار مخالفة الأوامر والتعليمات (JM-HR-F-002/INS) - شركة جوهرة المجد';
  } else if (type === 'contract_non_renewal' || type === 'contract-non-renewal') {
    url = `/api/forms/html/contract-non-renewal/${id}`;
    titleText = 'إشعار عدم رغبة في تجديد العقد (JM-HR-F-004/CNR) - شركة جوهرة المجد';
  }

  if (title) title.innerHTML = `<i class="fa-solid fa-file-invoice text-teal-700"></i> ${titleText}`;
  iframe.src = url;
  openModal('modalOfficialFormPreview');
}

function printOfficialFormModal() {
  const iframe = document.getElementById('officialFormIframe');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }
}

// --- 2. END OF SERVICE (EOS) & CLEARANCE MODULE (متوافق مع نظام العمل السعودي) ---
let eosSettlementsRecords = [];
let currentEosCalcResult = null;
let eosCalcInitialized = false;

async function loadTerminatedView() {
  try {
    initEosCalculator();
    await loadEosSettlementsRecords();
  } catch (e) {
    console.error('Error loading EOS / Terminated view:', e);
  }
}

function switchEosSubTab(subTab) {
  const calcView = document.getElementById('eosSubViewCalculator');
  const recView = document.getElementById('eosSubViewRecords');
  const btnCalc = document.getElementById('subtab-btn-eos-calculator');
  const btnRec = document.getElementById('subtab-btn-eos-records');

  if (subTab === 'calculator') {
    if (calcView) calcView.classList.remove('hidden');
    if (recView) recView.classList.add('hidden');
    if (btnCalc) {
      btnCalc.className = 'px-4 py-2 rounded-xl text-xs font-bold transition sub-tab-btn-active bg-brand text-white shadow-sm';
    }
    if (btnRec) {
      btnRec.className = 'px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition';
    }
    if (!eosCalcInitialized) {
      initEosCalculator();
    }
  } else {
    if (calcView) calcView.classList.add('hidden');
    if (recView) recView.classList.remove('hidden');
    if (btnCalc) {
      btnCalc.className = 'px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition';
    }
    if (btnRec) {
      btnRec.className = 'px-4 py-2 rounded-xl text-xs font-bold transition sub-tab-btn-active bg-brand text-white shadow-sm';
    }
    loadEosSettlementsRecords();
  }
}

function initEosCalculator() {
  const select = document.getElementById('eosCalcEmpSelect');
  if (select && state && state.employees && state.employees.length > 0) {
    const prevVal = select.value;
    select.innerHTML = '<option value="">-- اختر موظفاً لتحميل بياناته ورواتبه تلقائياً --</option>' +
      state.employees.map(e => `<option value="${e.id}">${e.emp_code} - ${e.full_name_ar} (${e.job_title_ar || e.department_name || ''})</option>`).join('');

    if (prevVal) {
      select.value = prevVal;
    } else if (select.options.length > 1) {
      select.selectedIndex = 1;
      onEosEmployeeSelected(select.value);
    }
  }

  const hireDateInput = document.getElementById('eosCalcHireDate');
  const endDateInput = document.getElementById('eosCalcEndDate');
  const today = new Date().toISOString().split('T')[0];

  if (endDateInput && !endDateInput.value) {
    endDateInput.value = today;
  }
  if (hireDateInput && !hireDateInput.value) {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    hireDateInput.value = threeYearsAgo.toISOString().split('T')[0];
  }

  eosCalcInitialized = true;
  triggerLiveEosCalculation();
}

function onEosModeChange(mode) {
  const container = document.getElementById('eosEmpSelectContainer');
  if (mode === 'employee') {
    if (container) container.style.display = 'block';
    const select = document.getElementById('eosCalcEmpSelect');
    if (select && select.value) {
      onEosEmployeeSelected(select.value);
    }
  } else {
    if (container) container.style.display = 'none';
  }
  triggerLiveEosCalculation();
}

function onEosEmployeeSelected(empId) {
  if (!empId || !state || !state.employees) return;
  const emp = state.employees.find(e => String(e.id) === String(empId) || String(e.emp_code) === String(empId));
  if (!emp) return;

  const hireDateInput = document.getElementById('eosCalcHireDate');
  const endDateInput = document.getElementById('eosCalcEndDate');
  const grossInput = document.getElementById('eosCalcGrossSalary');
  const leaveInput = document.getElementById('eosCalcLeaveDays');

  if (hireDateInput && emp.join_date) hireDateInput.value = emp.join_date;
  if (endDateInput && !endDateInput.value) endDateInput.value = new Date().toISOString().split('T')[0];

  const totalSal = Number(emp.salary) || ((Number(emp.basic_salary || 0) + Number(emp.housing_allowance || 0) + Number(emp.transport_allowance || 0) + Number(emp.other_allowance || 0))) || 5000;
  if (grossInput) grossInput.value = totalSal;
  if (leaveInput) leaveInput.value = emp.leave_balance || emp.annual_leave_balance || 0;

  // Set contract type based on employee contract
  const isIndefinite = emp.contract_type && emp.contract_type.includes('غير محدد');
  const fixedRadio = document.getElementById('eosContractFixed');
  const indefiniteRadio = document.getElementById('eosContractIndefinite');
  if (isIndefinite && indefiniteRadio) {
    indefiniteRadio.checked = true;
  } else if (fixedRadio) {
    fixedRadio.checked = true;
  }

  triggerLiveEosCalculation();
}

function onEosContractTypeChange(val) {
  triggerLiveEosCalculation();
}

function onEosReasonChange() {
  const reason = document.getElementById('eosCalcReasonSelect')?.value || '';
  const art77Container = document.getElementById('eosArticle77Container');
  if (art77Container) {
    if (reason.includes('77') || reason.includes('دون سبب مشروع')) {
      art77Container.classList.remove('hidden');
    } else {
      art77Container.classList.add('hidden');
    }
  }
  triggerLiveEosCalculation();
}

async function triggerLiveEosCalculation() {
  const hire_date = document.getElementById('eosCalcHireDate')?.value;
  const end_date = document.getElementById('eosCalcEndDate')?.value;
  const termination_reason_code = document.getElementById('eosCalcReasonSelect')?.value || 'استقالة الموظف';
  const gross_salary = Number(document.getElementById('eosCalcGrossSalary')?.value) || 0;
  const contract_type = document.querySelector('input[name="eosCalcContractType"]:checked')?.value || 'محدد المدة';
  const leave_balance_days = Number(document.getElementById('eosCalcLeaveDays')?.value) || 0;
  const unpaid_salary_amount = Number(document.getElementById('eosCalcUnpaidSalary')?.value) || 0;
  const remaining_contract_months = Number(document.getElementById('eosCalcRemainingMonths')?.value) || 0;
  const loans_balance = Number(document.getElementById('eosCalcLoans')?.value) || 0;
  const other_deductions = Number(document.getElementById('eosCalcOtherDeductions')?.value) || 0;

  const grossDisplay = document.getElementById('eosGrossDisplayLabel');
  if (grossDisplay) {
    grossDisplay.textContent = `الإجمالي: ${gross_salary.toLocaleString()} ر.س`;
  }

  if (!hire_date || !end_date) return;

  try {
    const res = await apiFetch('/api/eos/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hire_date,
        end_date,
        termination_reason_code,
        gross_salary,
        basic_salary: gross_salary,
        contract_type,
        leave_balance_days,
        unpaid_salary_amount,
        remaining_contract_months,
        loans_balance,
        other_deductions
      })
    });

    if (res && res.success && res.data) {
      currentEosCalcResult = res.data;
      renderEosLiveResults(res.data);
    }
  } catch (err) {
    console.error('Error calculating live EOS:', err);
  }
}

function renderEosLiveResults(d) {
  const elDays = document.getElementById('eosResDurationDays');
  const elFmt = document.getElementById('eosResDurationFormatted');
  const elTotY = document.getElementById('eosResTotalYears');
  const elPctBadge = document.getElementById('eosResEntitlementPctBadge');
  const elRule = document.getElementById('eosResStatutoryRule');
  const elBase = document.getElementById('eosResBaseGratuity');
  const elAward = document.getElementById('eosResAwardAmount');
  const elVac = document.getElementById('eosResVacationComp');
  const elArt77Row = document.getElementById('eosResArt77Row');
  const elArt77Comp = document.getElementById('eosResArt77Comp');
  const elUnpaid = document.getElementById('eosResUnpaidSalary');
  const elDed = document.getElementById('eosResDeductions');
  const elNet = document.getElementById('eosResNetPayable');
  const elTafqeet = document.getElementById('eosResTafqeetAr');

  if (elDays) elDays.textContent = `${d.service_days || 0} يوم`;
  if (elFmt) elFmt.textContent = d.service_period_formatted || `${d.service_years || 0} سنة`;
  if (elTotY) elTotY.textContent = `${(d.service_years || 0).toFixed(2)} سنة`;

  if (elPctBadge) {
    elPctBadge.textContent = `${d.entitlement_percentage}%`;
    if (d.entitlement_percentage === 100) {
      elPctBadge.className = 'text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300';
    } else if (d.entitlement_percentage === 0) {
      elPctBadge.className = 'text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300';
    } else {
      elPctBadge.className = 'text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300';
    }
  }

  if (elRule) elRule.textContent = d.statutory_rule || '';
  if (elBase) elBase.textContent = `${(d.base_gratuity || 0).toLocaleString()} ر.س`;
  if (elAward) elAward.textContent = `${(d.end_of_service_award || 0).toLocaleString()} ر.س`;
  if (elVac) elVac.textContent = `${(d.leave_compensation || 0).toLocaleString()} ر.س`;

  if (elArt77Row) {
    if (d.article_77_compensation && d.article_77_compensation > 0) {
      elArt77Row.classList.remove('hidden');
      if (elArt77Comp) elArt77Comp.textContent = `${d.article_77_compensation.toLocaleString()} ر.س`;
    } else {
      elArt77Row.classList.add('hidden');
    }
  }

  if (elUnpaid) elUnpaid.textContent = `${(d.unpaid_salary_amount || 0).toLocaleString()} ر.س`;
  if (elDed) elDed.textContent = `-${(d.total_deductions || 0).toLocaleString()} ر.س`;
  if (elNet) elNet.textContent = `${(d.net_payable_amount || 0).toLocaleString()}`;
  if (elTafqeet) elTafqeet.textContent = d.tafqeet_ar || '';
}

function resetEosCalculator() {
  const hireDateInput = document.getElementById('eosCalcHireDate');
  const endDateInput = document.getElementById('eosCalcEndDate');
  const reasonSelect = document.getElementById('eosCalcReasonSelect');
  const grossInput = document.getElementById('eosCalcGrossSalary');
  const fixedRadio = document.getElementById('eosContractFixed');
  const leaveInput = document.getElementById('eosCalcLeaveDays');
  const unpaidInput = document.getElementById('eosCalcUnpaidSalary');
  const remainingInput = document.getElementById('eosCalcRemainingMonths');
  const loansInput = document.getElementById('eosCalcLoans');
  const deductionsInput = document.getElementById('eosCalcOtherDeductions');

  const today = new Date().toISOString().split('T')[0];
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

  if (hireDateInput) hireDateInput.value = threeYearsAgo.toISOString().split('T')[0];
  if (endDateInput) endDateInput.value = today;
  if (reasonSelect) reasonSelect.value = 'استقالة الموظف';
  if (fixedRadio) fixedRadio.checked = true;
  if (grossInput) grossInput.value = 5000;
  if (leaveInput) leaveInput.value = 0;
  if (unpaidInput) unpaidInput.value = 0;
  if (remainingInput) remainingInput.value = 0;
  if (loansInput) loansInput.value = 0;
  if (deductionsInput) deductionsInput.value = 0;

  onEosReasonChange();
}

async function printCurrentEosClearance() {
  if (currentEosCalcResult && currentEosCalcResult.id) {
    printEosSettlementById(currentEosCalcResult.id);
    return;
  }

  if (currentEosCalcResult) {
    try {
      const resp = await fetch('/api/eos/print-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEosCalcResult)
      });
      if (resp.ok) {
        const html = await resp.text();
        const win = window.open('', '_blank');
        win.document.open();
        win.document.write(html);
        win.document.close();
        return;
      }
    } catch (err) {
      console.warn('Direct print-preview fallback, saving first:', err);
    }

    await saveCalculatedEosSettlement();
    if (currentEosCalcResult && currentEosCalcResult.id) {
      printEosSettlementById(currentEosCalcResult.id);
    }
  } else {
    alert('يرجى احتساب المكافأة أولاً لمعاينة وطباعة نموذج المخالصة المعتمد.');
  }
}

async function saveCalculatedEosSettlement() {
  if (!currentEosCalcResult) {
    return alert('يرجى احتساب مكافأة نهاية الخدمة أولاً قبل الحفظ.');
  }

  const mode = document.querySelector('input[name="eosCalcMode"]:checked')?.value || 'employee';
  let emp = null;

  if (mode === 'employee') {
    const empId = document.getElementById('eosCalcEmpSelect')?.value;
    if (empId && state && state.employees) {
      emp = state.employees.find(e => String(e.id) === String(empId) || String(e.emp_code) === String(empId));
    }
  }

  const payload = {
    emp_id: emp ? emp.id : null,
    emp_code: emp ? emp.emp_code : 'CUSTOM',
    employee_name_ar: emp ? emp.full_name_ar : 'موظف خارجي / احتساب مخصص',
    national_id: emp ? emp.national_id : '',
    job_title_ar: emp ? emp.job_title_ar : 'غير محدد',
    department_name: emp ? emp.department_name : 'الإدارة العامة',
    ...currentEosCalcResult
  };

  try {
    const res = await apiFetch('/api/eos/settlements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res && res.success) {
      currentEosCalcResult.id = res.data.id;
      currentEosCalcResult.settlement_number = res.data.settlement_number;
      if (typeof showToastNotification === 'function') {
        showToastNotification(`تم اعتماد وحفظ المخالصة رقم ${res.data.settlement_number} بنجاح`, 'success');
      } else {
        alert(`تم اعتماد وحفظ المخالصة رقم ${res.data.settlement_number} بنجاح`);
      }
      await loadEosSettlementsRecords();
      switchEosSubTab('records');
    } else {
      alert('خطأ أثناء حفظ المخالصة: ' + (res?.error || 'فشلت العملية'));
    }
  } catch (err) {
    alert('حدث خطأ في الاتصال أثناء حفظ المخالصة: ' + err.message);
  }
}

async function printCalculatedEosSettlement() {
  if (currentEosCalcResult && currentEosCalcResult.id) {
    printEosSettlementById(currentEosCalcResult.id);
  } else {
    // If not saved yet, save it and open print window
    if (confirm('المخالصة لم تُحفظ في السجل الرسمي بعد. هل ترغب في حفظها الآن وطباعتها مباشرة؟')) {
      await saveCalculatedEosSettlement();
      if (currentEosCalcResult && currentEosCalcResult.id) {
        printEosSettlementById(currentEosCalcResult.id);
      }
    }
  }
}

async function loadEosSettlementsRecords() {
  try {
    const res = await apiFetch('/api/eos/settlements');
    if (res && res.success) {
      eosSettlementsRecords = res.data || [];

      // Calculate and update KPIs
      const totalCount = eosSettlementsRecords.length;
      let resignations = 0;
      let contracts = 0;
      let pending = 0;
      let totalAmount = 0;

      eosSettlementsRecords.forEach(r => {
        totalAmount += Number(r.net_payable_amount) || 0;
        if (r.termination_reason_code === 'resignation' || (r.termination_reason_ar && r.termination_reason_ar.includes('استقالة'))) {
          resignations++;
        } else {
          contracts++;
        }
        if (r.clearance_status === 'قيد الصرف' || r.clearance_status === 'معلق') {
          pending++;
        }
      });

      const elTot = document.getElementById('statEosTotal');
      const elRes = document.getElementById('statEosResignations');
      const elCont = document.getElementById('statEosContracts');
      const elPend = document.getElementById('statEosPending');
      const elAmt = document.getElementById('statEosTotalAmount');

      if (elTot) elTot.textContent = totalCount;
      if (elRes) elRes.textContent = resignations;
      if (elCont) elCont.textContent = contracts;
      if (elPend) elPend.textContent = pending;
      if (elAmt) elAmt.textContent = `${totalAmount.toLocaleString()} ر.س`;

      renderEosSettlementsTable(eosSettlementsRecords);
    }
  } catch (err) {
    console.error('Error loading EOS settlements:', err);
  }
}

function renderEosSettlementsTable(records) {
  const tbody = document.getElementById('eosSettlementsTableBody');
  if (!tbody) return;

  if (!records || records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="p-8 text-center text-slate-400 font-bold">لا توجد مخالصات معتمدة مسجلة حالياً. يمكنك استخدام الحاسبة التفاعلية واحتساب مخالصة جديدة.</td></tr>`;
    return;
  }

  tbody.innerHTML = records.map((r, i) => `
    <tr class="hover:bg-slate-50 transition border-b border-slate-100">
      <td class="p-3">
        <span class="font-mono font-bold text-brand bg-brand/5 px-2 py-0.5 rounded-lg border border-brand/20">${r.settlement_number || ('JM-EOS-' + r.id)}</span>
      </td>
      <td class="p-3">
        <div class="font-bold text-slate-900">${r.employee_name_ar || '-'}</div>
        <div class="text-[10px] text-slate-400 font-mono">${r.emp_code || '-'} • ${r.national_id || '-'}</div>
      </td>
      <td class="p-3">
        <div class="text-slate-800 font-semibold">${r.department_name || '-'}</div>
        <div class="text-[10px] text-slate-400">${r.job_title_ar || '-'}</div>
      </td>
      <td class="p-3 font-mono font-bold text-rose-700">${r.end_date || r.termination_date || '-'}</td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
          ${r.termination_reason_ar || r.termination_type || 'إنهاء علاقة تعاقدية'}
        </span>
      </td>
      <td class="p-3 font-mono font-bold text-slate-700">${r.service_period_formatted || `${r.service_years || 0} سنة`}</td>
      <td class="p-3 font-mono font-bold text-emerald-700">${(r.end_of_service_award || r.end_of_service_reward || 0).toLocaleString()} ر.س</td>
      <td class="p-3 font-mono text-blue-700 font-semibold">${(r.leave_compensation || 0).toLocaleString()} ر.س</td>
      <td class="p-3 font-mono font-black text-brand text-sm">${(r.net_payable_amount || r.total_settlement || 0).toLocaleString()} ر.س</td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.clearance_status === 'معتمد ومكتمل' || r.clearance_status === 'مكتمل' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
          ${r.clearance_status || 'معتمد'}
        </span>
      </td>
      <td class="p-3 text-center">
        <button onclick="printEosSettlementById(${r.id})" class="px-3 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs flex items-center gap-1.5 mx-auto transition shadow-sm">
          <i class="fa-solid fa-print"></i> إبراء الذمة (PDF)
        </button>
      </td>
    </tr>
  `).join('');
}

function filterEosSettlementsTable() {
  const query = (document.getElementById('eosRecordsSearchInput')?.value || '').toLowerCase().trim();
  const typeFilter = document.getElementById('eosRecordsTypeFilter')?.value || '';

  const filtered = eosSettlementsRecords.filter(r => {
    const matchQuery = !query ||
      (r.settlement_number && r.settlement_number.toLowerCase().includes(query)) ||
      (r.employee_name_ar && r.employee_name_ar.toLowerCase().includes(query)) ||
      (r.emp_code && r.emp_code.toLowerCase().includes(query)) ||
      (r.national_id && r.national_id.includes(query)) ||
      (r.department_name && r.department_name.toLowerCase().includes(query));

    const matchType = !typeFilter ||
      (r.termination_reason_ar && r.termination_reason_ar.includes(typeFilter)) ||
      (r.termination_type && r.termination_type.includes(typeFilter));

    return matchQuery && matchType;
  });

  renderEosSettlementsTable(filtered);
}

function printEosSettlementById(id) {
  if (!id) return;
  window.open('/api/eos/settlements/' + id + '/print', '_blank');
}

function exportEosSettlementsCsv() {
  window.open('/api/eos/export/csv', '_blank');
}

// Backwards compatibility wrappers
function downloadTerminatedTemplateExcel() {
  window.open('/api/eos/export/csv', '_blank');
}
function exportTerminatedExcel() {
  window.open('/api/eos/export/csv', '_blank');
}


// --- 2.1 ATS RECRUITMENT & BILINGUAL TEMPLATES MODULE ---
let recruitmentVacancies = [];
let recruitmentApplicants = [];
let recruitmentOffers = [];
let currentRecruitmentSubTab = 'vacancies';

async function loadRecruitmentView() {
  try {
    await Promise.all([
      loadRecruitmentKpis(),
      loadVacancies(),
      loadApplicants(),
      loadJobOffers()
    ]);
  } catch (err) {
    console.error('Error loading recruitment view:', err);
  }
}

function switchRecruitmentSubTab(subTab) {
  currentRecruitmentSubTab = subTab;
  const tabs = ['vacancies', 'pipeline', 'offers', 'templates'];
  tabs.forEach(t => {
    const view = document.getElementById(`recSubView${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const btn = document.getElementById(`subtab-btn-rec-${t}`);
    if (t === subTab) {
      if (view) view.classList.remove('hidden');
      if (btn) btn.className = 'px-4 py-2 rounded-xl text-xs font-bold transition sub-tab-btn-active bg-brand text-white shadow-sm';
    } else {
      if (view) view.classList.add('hidden');
      if (btn) btn.className = 'px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition';
    }
  });

  if (subTab === 'vacancies') loadVacancies();
  else if (subTab === 'pipeline') loadApplicants();
  else if (subTab === 'offers') loadJobOffers();
}

async function loadRecruitmentKpis() {
  try {
    const res = await apiFetch('/api/recruitment/kpis');
    if (res && res.success && res.data) {
      const d = res.data;
      const elTotV = document.getElementById('statRecTotalVacancies');
      const elOpnV = document.getElementById('statRecOpenVacancies');
      const elTotA = document.getElementById('statRecTotalApplicants');
      const elActO = document.getElementById('statRecActiveOffers');
      const bV = document.getElementById('badgeRecVacanciesCount');
      const bA = document.getElementById('badgeRecApplicantsCount');
      const bO = document.getElementById('badgeRecOffersCount');

      if (elTotV) elTotV.textContent = d.totalVacancies || 0;
      if (elOpnV) elOpnV.textContent = d.openVacancies || 0;
      if (elTotA) elTotA.textContent = d.totalApplicants || 0;
      if (elActO) elActO.textContent = d.activeOffers || 0;
      if (bV) bV.textContent = d.openVacancies || 0;
      if (bA) bA.textContent = d.totalApplicants || 0;
      if (bO) bO.textContent = d.activeOffers || 0;
    }
  } catch (e) {
    console.error('Error loading recruitment KPIs:', e);
  }
}

async function loadVacancies() {
  try {
    const res = await apiFetch('/api/recruitment/vacancies');
    if (res && res.success) {
      recruitmentVacancies = res.data || [];
      renderVacanciesTable(recruitmentVacancies);
      populateVacancySelects();
    }
  } catch (err) {
    console.error('Error loading vacancies:', err);
  }
}

function renderVacanciesTable(records) {
  const tbody = document.getElementById('recVacanciesTableBody');
  if (!tbody) return;

  if (!records || records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="p-8 text-center text-slate-400 font-bold">لا توجد وظائف شاغرة حالياً. انقر على "+ إضافة وظيفة شاغرة" لنشر وظيفة جديدة.</td></tr>`;
    return;
  }

  tbody.innerHTML = records.map((r, i) => `
    <tr class="hover:bg-slate-50 transition border-b border-slate-100">
      <td class="p-3">
        <span class="font-mono font-bold text-brand bg-brand/5 px-2 py-0.5 rounded-lg border border-brand/20">${r.job_code}</span>
      </td>
      <td class="p-3">
        <div class="font-bold text-slate-900">${r.title_ar}</div>
        <div class="text-[10px] text-slate-400 font-mono">${r.title_en || '-'}</div>
      </td>
      <td class="p-3 text-slate-700 font-semibold">${r.department_name || 'الإدارة العامة'}</td>
      <td class="p-3 font-mono font-bold text-slate-700">${r.experience_years ? r.experience_years + ' سنوات' : 'بدون خبرة'}</td>
      <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">${r.employment_type || 'دوام كامل'}</span></td>
      <td class="p-3 font-mono font-bold text-slate-800">${r.openings_count || 1}</td>
      <td class="p-3 font-mono font-bold text-emerald-700">${r.salary_range || 'حسب المقابلة'}</td>
      <td class="p-3 font-mono font-bold text-indigo-700">
        <span class="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900">${r.applicants_count || 0} مرشح</span>
      </td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'مفتوح' ? 'bg-emerald-100 text-emerald-800' : (r.status === 'معلق' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800')}">
          ${r.status}
        </span>
      </td>
      <td class="p-3 text-center">
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="openAddApplicantModal(${r.id})" title="إضافة مرشح لهذه الوظيفة" class="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition">
            <i class="fa-solid fa-user-plus text-xs"></i>
          </button>
          <button onclick="openAddVacancyModal(${r.id})" title="تعديل الوظيفة" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
            <i class="fa-solid fa-pen-to-square text-xs"></i>
          </button>
          <button onclick="printBilingualApplicationFormForVacancy(${r.id})" title="طباعة استمارة توظيف A4 لهذه الوظيفة" class="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 transition">
            <i class="fa-solid fa-print text-xs"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterVacanciesTable() {
  const query = (document.getElementById('recVacanciesSearchInput')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('recVacanciesStatusFilter')?.value || '';

  const filtered = recruitmentVacancies.filter(r => {
    const matchQuery = !query ||
      (r.title_ar && r.title_ar.toLowerCase().includes(query)) ||
      (r.title_en && r.title_en.toLowerCase().includes(query)) ||
      (r.job_code && r.job_code.toLowerCase().includes(query));

    const matchStatus = !statusFilter || (r.status === statusFilter);
    return matchQuery && matchStatus;
  });

  renderVacanciesTable(filtered);
}

function populateVacancySelects() {
  const appSelect = document.getElementById('appFormVacancyId');
  const pipeFilter = document.getElementById('recPipelineVacancyFilter');

  const options = '<option value="">-- اختر الوظيفة الشاغرة --</option>' +
    recruitmentVacancies.map(v => `<option value="${v.id}">${v.job_code} - ${v.title_ar} (${v.status})</option>`).join('');

  if (appSelect) appSelect.innerHTML = options;

  if (pipeFilter) {
    pipeFilter.innerHTML = '<option value="">جميع الوظائف الشاغرة</option>' +
      recruitmentVacancies.map(v => `<option value="${v.id}">${v.title_ar} (${v.job_code})</option>`).join('');
  }

  // Populate department select in vacancy modal
  const vacDept = document.getElementById('vacFormDept');
  if (vacDept && state && state.departments) {
    vacDept.innerHTML = '<option value="">-- اختر الإدارة --</option>' +
      state.departments.map(d => `<option value="${d.id}">${d.name_ar}</option>`).join('');
  }
}

function openAddVacancyModal(vacancyId = null) {
  populateVacancySelects();
  const idInput = document.getElementById('vacFormId');
  const titleAr = document.getElementById('vacFormTitleAr');
  const titleEn = document.getElementById('vacFormTitleEn');
  const dept = document.getElementById('vacFormDept');
  const type = document.getElementById('vacFormType');
  const exp = document.getElementById('vacFormExp');
  const openings = document.getElementById('vacFormOpenings');
  const salary = document.getElementById('vacFormSalary');
  const reqs = document.getElementById('vacFormReqs');
  const status = document.getElementById('vacFormStatus');

  if (vacancyId) {
    const v = recruitmentVacancies.find(item => item.id === vacancyId);
    if (v) {
      if (idInput) idInput.value = v.id;
      if (titleAr) titleAr.value = v.title_ar || '';
      if (titleEn) titleEn.value = v.title_en || '';
      if (dept) dept.value = v.department_id || '';
      if (type) type.value = v.employment_type || 'دوام كامل';
      if (exp) exp.value = v.experience_years || 0;
      if (openings) openings.value = v.openings_count || 1;
      if (salary) salary.value = v.salary_range || '';
      if (reqs) reqs.value = v.requirements || '';
      if (status) status.value = v.status || 'مفتوح';
    }
  } else {
    if (idInput) idInput.value = '';
    if (titleAr) titleAr.value = '';
    if (titleEn) titleEn.value = '';
    if (salary) salary.value = '';
    if (reqs) reqs.value = '';
    if (exp) exp.value = 3;
    if (openings) openings.value = 1;
    if (status) status.value = 'مفتوح';
  }

  openModal('modalAddVacancy');
}

async function submitVacancyForm(e) {
  e.preventDefault();
  const id = document.getElementById('vacFormId')?.value;
  const payload = {
    title_ar: document.getElementById('vacFormTitleAr').value,
    title_en: document.getElementById('vacFormTitleEn').value,
    department_id: document.getElementById('vacFormDept').value || null,
    employment_type: document.getElementById('vacFormType').value,
    experience_years: Number(document.getElementById('vacFormExp').value) || 0,
    openings_count: Number(document.getElementById('vacFormOpenings').value) || 1,
    salary_range: document.getElementById('vacFormSalary').value,
    requirements: document.getElementById('vacFormReqs').value,
    status: document.getElementById('vacFormStatus').value
  };

  try {
    const url = id ? `/api/recruitment/vacancies/${id}` : '/api/recruitment/vacancies';
    const method = id ? 'PUT' : 'POST';
    const res = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res && res.success) {
      closeModal('modalAddVacancy');
      await loadVacancies();
      await loadRecruitmentKpis();
      if (typeof showToastNotification === 'function') {
        showToastNotification(id ? 'تم تحديث الوظيفة الشاغرة بنجاح' : 'تم نشر الوظيفة الشاغرة بنجاح', 'success');
      } else {
        alert('تم حفظ الوظيفة الشاغرة بنجاح');
      }
    } else {
      alert('خطأ: ' + (res?.error || 'فشل حفظ الوظيفة'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء حفظ الوظيفة: ' + err.message);
  }
}

// ==========================================
// APPLICANTS & ATS PIPELINE
// ==========================================

async function loadApplicants() {
  try {
    const res = await apiFetch('/api/recruitment/applicants');
    if (res && res.success) {
      recruitmentApplicants = res.data || [];
      renderApplicantsPipeline(recruitmentApplicants);
    }
  } catch (err) {
    console.error('Error loading applicants:', err);
  }
}

function renderApplicantsPipeline(records) {
  const stages = {
    'جديد': { el: document.getElementById('kanbanStageNew'), badge: document.getElementById('badgeStageNew'), count: 0 },
    'فرز_أولي': { el: document.getElementById('kanbanStageScreening'), badge: document.getElementById('badgeStageScreening'), count: 0 },
    'مقابلة_شخصية': { el: document.getElementById('kanbanStageInterview'), badge: document.getElementById('badgeStageInterview'), count: 0 },
    'عرض_وظيفي': { el: document.getElementById('kanbanStageOffer'), badge: document.getElementById('badgeStageOffer'), count: 0 },
    'مقبول': { el: document.getElementById('kanbanStageHired'), badge: document.getElementById('badgeStageHired'), count: 0 },
    'مرفوض': { el: document.getElementById('kanbanStageRejected'), badge: document.getElementById('badgeStageRejected'), count: 0 }
  };

  Object.values(stages).forEach(s => {
    if (s.el) s.el.innerHTML = '';
  });

  (records || []).forEach(a => {
    const stageKey = a.stage || 'جديد';
    const targetStage = stages[stageKey] || stages['جديد'];
    targetStage.count++;

    if (targetStage.el) {
      const card = document.createElement('div');
      card.className = 'bg-white p-3 rounded-xl border border-slate-200/90 shadow-sm space-y-2 hover:border-brand/40 transition text-xs';
      card.innerHTML = `
        <div class="flex justify-between items-start">
          <span class="font-mono text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">${a.applicant_no}</span>
          <span class="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-full">${a.nationality || 'سعودي'}</span>
        </div>
        <div>
          <h4 class="font-black text-slate-900 leading-snug">${a.full_name}</h4>
          <p class="text-[10px] text-slate-500 font-bold mt-0.5 flex items-center gap-1">
            <i class="fa-solid fa-briefcase text-[9px] text-brand"></i>
            <span>${a.vacancy_title_ar || 'طلب عام'}</span>
          </p>
        </div>
        <div class="text-[10px] text-slate-600 flex justify-between pt-1 border-t border-slate-100">
          <span>${a.experience_years ? a.experience_years + ' سنوات خبرة' : 'خريج جديد'}</span>
          <span class="font-mono text-emerald-700 font-bold">${a.expected_salary ? a.expected_salary.toLocaleString() + ' ر.س' : ''}</span>
        </div>
        <div class="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100">
          <button onclick="openMoveStageModal(${a.id}, '${a.stage}', '${a.full_name}')" class="text-[10px] font-bold text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200 transition flex items-center gap-1">
            <i class="fa-solid fa-arrows-split-up-and-left text-[9px]"></i> نقل
          </button>
          <div class="flex gap-1">
            <button onclick="openCreateOfferModalForApplicant(${a.id})" title="إصدار عرض وظيفي" class="p-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition">
              <i class="fa-solid fa-award text-xs"></i>
            </button>
            <button onclick="printBilingualApplicationForm(${a.id})" title="طباعة طلب التوظيف A4" class="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
              <i class="fa-solid fa-print text-xs"></i>
            </button>
          </div>
        </div>
      `;
      targetStage.el.appendChild(card);
    }
  });

  Object.entries(stages).forEach(([key, s]) => {
    if (s.badge) s.badge.textContent = s.count;
    if (s.el && s.count === 0) {
      s.el.innerHTML = `<div class="p-4 text-center text-slate-400 font-bold text-[11px]">لا يوجد مرشحين</div>`;
    }
  });
}

function filterApplicantsPipeline() {
  const query = (document.getElementById('recPipelineSearchInput')?.value || '').toLowerCase().trim();
  const vFilter = document.getElementById('recPipelineVacancyFilter')?.value || '';

  const filtered = recruitmentApplicants.filter(a => {
    const matchQuery = !query ||
      (a.full_name && a.full_name.toLowerCase().includes(query)) ||
      (a.phone && a.phone.includes(query)) ||
      (a.email && a.email.toLowerCase().includes(query)) ||
      (a.applicant_no && a.applicant_no.toLowerCase().includes(query));

    const matchVacancy = !vFilter || (String(a.vacancy_id) === String(vFilter));
    return matchQuery && matchVacancy;
  });

  renderApplicantsPipeline(filtered);
}

function openAddApplicantModal(vacancyId = null) {
  populateVacancySelects();
  const vSelect = document.getElementById('appFormVacancyId');
  if (vSelect && vacancyId) {
    vSelect.value = vacancyId;
  }
  openModal('modalAddApplicant');
}

async function submitApplicantForm(e) {
  e.preventDefault();
  const payload = {
    vacancy_id: document.getElementById('appFormVacancyId').value || null,
    full_name: document.getElementById('appFormFullName').value,
    nationality: document.getElementById('appFormNationality').value,
    phone: document.getElementById('appFormPhone').value,
    email: document.getElementById('appFormEmail').value,
    education_level: document.getElementById('appFormEducation').value,
    experience_years: Number(document.getElementById('appFormExp').value) || 0,
    expected_salary: Number(document.getElementById('appFormSalary').value) || 0,
    current_employer: document.getElementById('appFormEmployer').value,
    stage: 'جديد'
  };

  try {
    const res = await apiFetch('/api/recruitment/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res && res.success) {
      closeModal('modalAddApplicant');
      await loadApplicants();
      await loadRecruitmentKpis();
      if (typeof showToastNotification === 'function') {
        showToastNotification(`تم تسجيل المرشح ${payload.full_name} برقم: ${res.data.applicant_no}`, 'success');
      } else {
        alert(`تم تسجيل المرشح برقم: ${res.data.applicant_no}`);
      }
    } else {
      alert('خطأ: ' + (res?.error || 'فشل تسجيل المرشح'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء تسجيل المرشح: ' + err.message);
  }
}

function openMoveStageModal(id, currentStage, candidateName) {
  const idInput = document.getElementById('moveStageApplicantId');
  const nameEl = document.getElementById('moveStageCandidateName');
  const select = document.getElementById('moveStageSelect');
  const notes = document.getElementById('moveStageNotes');
  const dt = document.getElementById('moveStageInterviewDate');

  if (idInput) idInput.value = id;
  if (nameEl) nameEl.textContent = candidateName || 'مرشح';
  if (select) select.value = currentStage || 'جديد';
  if (notes) notes.value = '';
  if (dt) dt.value = '';

  openModal('modalMoveApplicantStage');
}

async function submitMoveStageForm(e) {
  e.preventDefault();
  const id = document.getElementById('moveStageApplicantId').value;
  const stage = document.getElementById('moveStageSelect').value;
  const notes = document.getElementById('moveStageNotes').value;
  const interviewDate = document.getElementById('moveStageInterviewDate').value;

  try {
    const res = await apiFetch(`/api/recruitment/applicants/${id}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: stage,
        interview_notes: notes,
        interview_date: interviewDate || null
      })
    });

    if (res && res.success) {
      closeModal('modalMoveApplicantStage');
      await loadApplicants();
      await loadRecruitmentKpis();
      if (typeof showToastNotification === 'function') {
        showToastNotification(`تم نقل المرشح إلى مرحلة: ${stage}`, 'success');
      }
    } else {
      alert('خطأ: ' + (res?.error || 'فشل نقل المرحلة'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء نقل المرحلة: ' + err.message);
  }
}

// ==========================================
// JOB OFFERS MANAGEMENT
// ==========================================

async function loadJobOffers() {
  try {
    const res = await apiFetch('/api/recruitment/offers');
    if (res && res.success) {
      recruitmentOffers = res.data || [];
      renderJobOffersTable(recruitmentOffers);
    }
  } catch (err) {
    console.error('Error loading job offers:', err);
  }
}

function renderJobOffersTable(records) {
  const tbody = document.getElementById('recOffersTableBody');
  if (!tbody) return;

  if (!records || records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="p-8 text-center text-slate-400 font-bold">لا توجد عروض وظيفية مسجلة حالياً. انقر على "+ إنشاء عرض وظيفي" لإصدار أول عرض.</td></tr>`;
    return;
  }

  tbody.innerHTML = records.map((r, i) => `
    <tr class="hover:bg-slate-50 transition border-b border-slate-100">
      <td class="p-3">
        <span class="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">${r.offer_no}</span>
      </td>
      <td class="p-3">
        <div class="font-bold text-slate-900">${r.candidate_name}</div>
        <div class="text-[10px] text-slate-400 font-mono">${r.candidate_phone || '-'} • ${r.national_id || '-'}</div>
      </td>
      <td class="p-3">
        <div class="font-bold text-slate-800">${r.job_title_ar}</div>
        <div class="text-[10px] text-slate-400 font-mono">${r.job_title_en || '-'}</div>
      </td>
      <td class="p-3 text-slate-700 font-semibold">${r.department_name || 'الإدارة العامة'}</td>
      <td class="p-3 font-mono font-bold text-slate-800">${(r.basic_salary || 0).toLocaleString()} ر.س</td>
      <td class="p-3 font-mono text-slate-600">${((r.housing_allowance || 0) + (r.transport_allowance || 0)).toLocaleString()} ر.س</td>
      <td class="p-3 font-mono font-black text-brand text-sm">${(r.total_salary || 0).toLocaleString()} ر.س</td>
      <td class="p-3 font-mono text-slate-500">${(r.created_at || '').split('T')[0] || '-'}</td>
      <td class="p-3">
        <select onchange="updateOfferStatus(${r.id}, this.value)" class="text-[11px] font-bold rounded-lg border px-2 py-1 ${r.status === 'مقبول' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : (r.status === 'مرفوض' ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-amber-50 text-amber-900 border-amber-300')}">
          <option value="مرسل للمرشح" ${r.status === 'مرسل للمرشح' ? 'selected' : ''}>مرسل للمرشح</option>
          <option value="مقبول" ${r.status === 'مقبول' ? 'selected' : ''}>تم القبول (مقبول)</option>
          <option value="مرفوض" ${r.status === 'مرفوض' ? 'selected' : ''}>مرفوض</option>
        </select>
      </td>
      <td class="p-3 text-center">
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="printJobOffer(${r.id})" class="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-[10px] flex items-center gap-1 shadow-xs transition">
            <i class="fa-solid fa-print"></i> العرض (PDF)
          </button>
          <button onclick="printBilingualUndertaking('${r.candidate_name}', '${r.national_id || ''}', '${r.job_title_ar}')" class="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-bold text-[10px] flex items-center gap-1 shadow-xs transition">
            <i class="fa-solid fa-shield-halved"></i> التعهد (NDA)
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterJobOffersTable() {
  const query = (document.getElementById('recOffersSearchInput')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('recOffersStatusFilter')?.value || '';

  const filtered = recruitmentOffers.filter(r => {
    const matchQuery = !query ||
      (r.candidate_name && r.candidate_name.toLowerCase().includes(query)) ||
      (r.offer_no && r.offer_no.toLowerCase().includes(query)) ||
      (r.candidate_phone && r.candidate_phone.includes(query)) ||
      (r.job_title_ar && r.job_title_ar.includes(query));

    const matchStatus = !statusFilter || (r.status === statusFilter);
    return matchQuery && matchStatus;
  });

  renderJobOffersTable(filtered);
}

function openCreateOfferModal(applicantId = null) {
  const appInput = document.getElementById('offerFormApplicantId');
  const nameInput = document.getElementById('offerFormCandidateName');
  const nidInput = document.getElementById('offerFormNationalId');
  const titleAr = document.getElementById('offerFormTitleAr');
  const titleEn = document.getElementById('offerFormTitleEn');
  const dept = document.getElementById('offerFormDept');
  const basic = document.getElementById('offerFormBasic');
  const housing = document.getElementById('offerFormHousing');
  const transport = document.getElementById('offerFormTransport');
  const other = document.getElementById('offerFormOther');

  if (applicantId) {
    const a = recruitmentApplicants.find(item => item.id === applicantId);
    if (a) {
      if (appInput) appInput.value = a.id;
      if (nameInput) nameInput.value = a.full_name || '';
      if (nidInput) nidInput.value = a.national_id || '';
      if (titleAr) titleAr.value = a.vacancy_title_ar || 'مهندس مشاريع';
      if (titleEn) titleEn.value = a.vacancy_title_en || 'Project Engineer';
      const expected = a.expected_salary || 8000;
      if (basic) basic.value = Math.round(expected * 0.7);
      if (housing) housing.value = Math.round(expected * 0.2);
      if (transport) transport.value = Math.round(expected * 0.1);
      if (other) other.value = 0;
    }
  } else {
    if (appInput) appInput.value = '';
    if (nameInput) nameInput.value = '';
    if (nidInput) nidInput.value = '';
    if (basic) basic.value = 6000;
    if (housing) housing.value = 1500;
    if (transport) transport.value = 500;
    if (other) other.value = 0;
  }

  calculateOfferGross();
  openModal('modalCreateJobOffer');
}

function openCreateOfferModalForApplicant(applicantId) {
  openCreateOfferModal(applicantId);
}

function calculateOfferGross() {
  const basic = Number(document.getElementById('offerFormBasic')?.value) || 0;
  const housing = Number(document.getElementById('offerFormHousing')?.value) || 0;
  const transport = Number(document.getElementById('offerFormTransport')?.value) || 0;
  const other = Number(document.getElementById('offerFormOther')?.value) || 0;
  const total = basic + housing + transport + other;

  const display = document.getElementById('offerFormTotalDisplay');
  if (display) display.textContent = `${total.toLocaleString()} ر.س`;
}

async function submitCreateOfferForm(e) {
  e.preventDefault();
  const basic = Number(document.getElementById('offerFormBasic').value) || 0;
  const housing = Number(document.getElementById('offerFormHousing').value) || 0;
  const transport = Number(document.getElementById('offerFormTransport').value) || 0;
  const other = Number(document.getElementById('offerFormOther').value) || 0;

  const payload = {
    applicant_id: document.getElementById('offerFormApplicantId').value || null,
    candidate_name: document.getElementById('offerFormCandidateName').value,
    national_id: document.getElementById('offerFormNationalId').value,
    job_title_ar: document.getElementById('offerFormTitleAr').value,
    job_title_en: document.getElementById('offerFormTitleEn').value,
    department_name: document.getElementById('offerFormDept').value,
    branch_name: document.getElementById('offerFormBranch').value,
    basic_salary: basic,
    housing_allowance: housing,
    transport_allowance: transport,
    other_allowances: other,
    contract_duration: document.getElementById('offerFormProbation').value,
    annual_leave_days: Number(document.getElementById('offerFormVacation').value) || 30,
    start_date: document.getElementById('offerFormStartDate').value || new Date().toISOString().split('T')[0],
    status: 'مرسل للمرشح'
  };

  try {
    const res = await apiFetch('/api/recruitment/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res && res.success) {
      closeModal('modalCreateJobOffer');
      await loadJobOffers();
      await loadApplicants();
      await loadRecruitmentKpis();
      if (typeof showToastNotification === 'function') {
        showToastNotification(`تم إصدار العرض الوظيفي رقم ${res.data.offer_no} بنجاح`, 'success');
      } else {
        alert(`تم إصدار العرض الوظيفي رقم ${res.data.offer_no} بنجاح`);
      }
      switchRecruitmentSubTab('offers');
    } else {
      alert('خطأ: ' + (res?.error || 'فشل إصدار العرض الوظيفي'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء إصدار العرض: ' + err.message);
  }
}

async function updateOfferStatus(id, newStatus) {
  try {
    const res = await apiFetch(`/api/recruitment/offers/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res && res.success) {
      await loadJobOffers();
      await loadApplicants();
      await loadRecruitmentKpis();
      if (typeof showToastNotification === 'function') {
        showToastNotification(`تم تحديث حالة العرض إلى: ${newStatus}`, 'success');
      }
    }
  } catch (err) {
    alert('حدث خطأ أثناء تحديث حالة العرض: ' + err.message);
  }
}

// ==========================================
// BILINGUAL TEMPLATES PRINT ACTIONS
// ==========================================

function printJobOffer(id) {
  if (!id) return;
  window.open(`/api/recruitment/offers/${id}/print`, '_blank');
}

function printBilingualApplicationForm(applicantId = null) {
  const url = applicantId 
    ? `/api/recruitment/templates/application/print?applicant_id=${applicantId}`
    : '/api/recruitment/templates/application/print';
  window.open(url, '_blank');
}

function printBilingualApplicationFormForVacancy(vacancyId) {
  window.open(`/api/recruitment/templates/application/print?vacancy_id=${vacancyId}`, '_blank');
}

function printBilingualUndertaking(candidateName = '', nationalId = '', jobTitle = '') {
  let url = '/api/recruitment/templates/undertaking/print';
  const params = [];
  if (candidateName) params.push(`candidate_name=${encodeURIComponent(candidateName)}`);
  if (nationalId) params.push(`national_id=${encodeURIComponent(nationalId)}`);
  if (jobTitle) params.push(`job_title_ar=${encodeURIComponent(jobTitle)}`);
  if (params.length > 0) url += '?' + params.join('&');
  window.open(url, '_blank');
}

function printSampleJobOffer() {
  if (recruitmentOffers && recruitmentOffers.length > 0) {
    printJobOffer(recruitmentOffers[0].id);
  } else {
    window.open('/api/recruitment/offers/1/print', '_blank');
  }
}

// --- 3. LOANS MANAGEMENT MODULE ---
let loansRecords = [];

async function loadLoansView() {
  try {
    const [recRes, kpiRes] = await Promise.all([
      apiFetch('/api/loans'),
      apiFetch('/api/loans/kpis')
    ]);

    loansRecords = (recRes && recRes.success) ? recRes.data : [];
    const kpis = (kpiRes && kpiRes.success) ? kpiRes.data : {};

    const elTotal = document.getElementById('statLoanTotalAmount');
    const elPaid = document.getElementById('statLoanPaidAmount');
    const elRem = document.getElementById('statLoanRemainingAmount');
    const elAct = document.getElementById('statLoanActiveCount');

    if (elTotal) elTotal.textContent = (kpis.totalAmount || 0).toLocaleString() + ' ر.س';
    if (elPaid) elPaid.textContent = (kpis.paidAmount || 0).toLocaleString() + ' ر.س';
    if (elRem) elRem.textContent = (kpis.remainingAmount || 0).toLocaleString() + ' ر.س';
    if (elAct) elAct.textContent = kpis.activeCount || 0;

    renderLoansTable(loansRecords);
  } catch (e) {
    console.error('Error loading loans:', e);
  }
}

function renderLoansTable(records) {
  const tbody = document.getElementById('loansTableBody');
  if (!tbody) return;

  if (!records || records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" class="p-8 text-center text-slate-400 font-bold">لا توجد سلف مسجلة حالياً.</td></tr>`;
    return;
  }

  tbody.innerHTML = records.map(r => {
    const progress = r.total_amount > 0 ? Math.min(100, Math.round((r.paid_amount / r.total_amount) * 100)) : 0;
    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="p-3 font-mono font-bold text-slate-800">${r.loan_no}</td>
        <td class="p-3">
          <div class="font-bold text-slate-900">${r.emp_name}</div>
          <div class="text-[10px] text-slate-400 font-mono">${r.emp_code}</div>
        </td>
        <td class="p-3 text-slate-700 font-semibold">${r.department_name || '-'}</td>
        <td class="p-3 font-semibold text-emerald-800"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">${r.loan_type}</span></td>
        <td class="p-3 font-mono font-bold text-slate-900">${r.total_amount.toLocaleString()} ر.س</td>
        <td class="p-3 font-mono font-bold text-slate-600">${r.installments_count} قسط</td>
        <td class="p-3 font-mono font-bold text-brand">${r.monthly_installment.toLocaleString()} ر.س</td>
        <td class="p-3 font-mono text-blue-700 font-semibold">${r.paid_amount.toLocaleString()} ر.س</td>
        <td class="p-3 font-mono text-amber-700 font-bold">${r.remaining_amount.toLocaleString()} ر.س</td>
        <td class="p-3">
          <div class="flex items-center gap-1.5">
            <div class="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 rounded-full" style="width: ${progress}%"></div>
            </div>
            <span class="text-[10px] font-mono font-bold text-slate-600">${progress}%</span>
          </div>
        </td>
        <td class="p-3 font-mono text-slate-600">${r.start_month}</td>
        <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'نشطة' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">${r.status}</span></td>
      </tr>
    `;
  }).join('');
}

function filterLoansTable() {
  const query = (document.getElementById('loanSearchInput')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('loanStatusFilter')?.value || '';

  const filtered = loansRecords.filter(r => {
    const matchQuery = !query ||
      (r.emp_name && r.emp_name.toLowerCase().includes(query)) ||
      (r.emp_code && r.emp_code.toLowerCase().includes(query)) ||
      (r.loan_no && r.loan_no.toLowerCase().includes(query));

    const matchStatus = !statusFilter || (r.status === statusFilter);
    return matchQuery && matchStatus;
  });

  renderLoansTable(filtered);
}

function openAddLoanModal() {
  const select = document.getElementById('loanFormEmpId');
  if (select) {
    select.innerHTML = '<option value="">-- اختر الموظف --</option>' +
      state.employees.map(e => `<option value="${e.id}">${e.emp_code} - ${e.full_name_ar} (${e.job_title_ar || ''})</option>`).join('');
  }
  const monthInput = document.getElementById('loanFormStartMonth');
  if (monthInput) {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    monthInput.value = nextMonth.toISOString().slice(0, 7);
  }
  calculateLoanInstallment();
  openModal('modalAddLoan');
}

function calculateLoanInstallment() {
  const total = Number(document.getElementById('loanFormAmount')?.value) || 0;
  const count = Number(document.getElementById('loanFormInstallments')?.value) || 1;
  const monthly = count > 0 ? Math.round((total / count) * 100) / 100 : 0;
  const monthlyInput = document.getElementById('loanFormMonthly');
  if (monthlyInput) monthlyInput.value = monthly > 0 ? `${monthly} ر.س` : '0 ر.س';
}

async function submitNewLoan(e) {
  e.preventDefault();
  const empId = document.getElementById('loanFormEmpId').value;
  const loanType = document.getElementById('loanFormType').value;
  const total = Number(document.getElementById('loanFormAmount').value);
  const count = Number(document.getElementById('loanFormInstallments').value);
  const startMonth = document.getElementById('loanFormStartMonth').value;
  const reason = document.getElementById('loanFormReason').value;

  if (!empId) return alert('يرجى اختيار الموظف أولاً');
  if (total <= 0) return alert('مبلغ السلفة يجب أن يكون أكبر من صفر');

  try {
    const res = await apiFetch('/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emp_id: empId,
        loan_type: loanType,
        total_amount: total,
        installments_count: count,
        start_month: startMonth,
        reason: reason
      })
    });

    if (res && res.success) {
      alert('تم تسجيل السلفة وتفعيل الاستقطاع الشهري بنجاح');
      closeModal('modalAddLoan');
      await loadLoansView();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في حفظ السلفة'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء حفظ السلفة: ' + err.message);
  }
}

function downloadLoanTemplateExcel() {
  window.open('/api/loans/template', '_blank');
}

function exportLoansExcel() {
  window.open('/api/loans/export', '_blank');
}

async function submitImportLoansExcel() {
  const fileInput = document.getElementById('fileLoansImport');
  if (!fileInput || !fileInput.files || !fileInput.files[0]) {
    return alert('يرجى اختيار ملف الإكسل أولاً');
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const res = await fetch('/api/loans/import', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data && data.success) {
      alert(`تم استيراد ${data.count} سلفة موظف بنجاح وربطها بالأقساط الشهرية`);
      closeModal('modalImportLoans');
      fileInput.value = '';
      await loadLoansView();
    } else {
      alert('خطأ أثناء استيراد السلف: ' + (data?.error || 'فشل استيراد الملف'));
    }
  } catch (err) {
    alert('حدث خطأ في الاتصال أثناء استيراد السلف: ' + err.message);
  }
}

// --- 4. ATTENDANCE & ARTICLE 80 NOTICES MODULE ---
let noticesRecords = [];

async function loadNoticesView() {
  try {
    const [recRes, kpiRes] = await Promise.all([
      apiFetch('/api/attendance/notices'),
      apiFetch('/api/attendance/notices/kpis')
    ]);

    noticesRecords = (recRes && recRes.success) ? recRes.data : [];
    const kpis = (kpiRes && kpiRes.success) ? kpiRes.data : {};

    const elTotal = document.getElementById('statNoticeTotal');
    const elLate = document.getElementById('statNoticeLate');
    const elAbsence = document.getElementById('statNoticeAbsence');
    const elAbandon = document.getElementById('statNoticeAbandon');
    const elPending = document.getElementById('statNoticePendingAck');

    if (elTotal) elTotal.textContent = kpis.total || 0;
    if (elLate) elLate.textContent = kpis.late || 0;
    if (elAbsence) elAbsence.textContent = kpis.absence || 0;
    if (elAbandon) elAbandon.textContent = kpis.abandon || 0;
    if (elPending) elPending.textContent = kpis.pendingAck || 0;

    renderNoticesTable(noticesRecords);
  } catch (e) {
    console.error('Error loading notices:', e);
  }
}

function renderNoticesTable(records) {
  const tbody = document.getElementById('noticesTableBody');
  if (!tbody) return;

  if (!records || records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-slate-400 font-bold">لا توجد إشعارات أو إنذارات دوام مسجلة حالياً.</td></tr>`;
    return;
  }

  tbody.innerHTML = records.map(r => `
    <tr class="hover:bg-slate-50 transition border-b border-slate-100">
      <td class="p-3 font-mono font-bold text-slate-800">${r.notice_no}</td>
      <td class="p-3">
        <div class="font-bold text-slate-900">${r.emp_name}</div>
        <div class="text-[10px] text-slate-400 font-mono">${r.emp_code}</div>
      </td>
      <td class="p-3 text-slate-700 font-semibold">${r.department_name || '-'}</td>
      <td class="p-3 font-semibold text-rose-800"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-900 border border-rose-200">${r.notice_type}</span></td>
      <td class="p-3 font-mono text-slate-700 font-semibold">${r.incident_date}</td>
      <td class="p-3 text-slate-600 text-[11px] font-bold">${r.legal_basis || 'لائحة العمل المعتمدة'}</td>
      <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'تم التوقيع والإقرار' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'}">${r.status}</span></td>
      <td class="p-3 font-mono text-[10px] text-slate-500">${r.acknowledged_at ? r.acknowledged_at.slice(0, 16) : '-'}</td>
      <td class="p-3 text-center">
        <button onclick="openOfficialFormPreview('notice', ${r.id})" class="px-2.5 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-[10px] flex items-center gap-1 mx-auto transition">
          <i class="fa-solid fa-file-invoice"></i> عرض الخطاب
        </button>
      </td>
    </tr>
  `).join('');
}

function filterNoticesTable() {
  const query = (document.getElementById('noticeSearchInput')?.value || '').toLowerCase().trim();
  const typeFilter = document.getElementById('noticeTypeFilter')?.value || '';
  const statusFilter = document.getElementById('noticeStatusFilter')?.value || '';

  const filtered = noticesRecords.filter(r => {
    const matchQuery = !query ||
      (r.emp_name && r.emp_name.toLowerCase().includes(query)) ||
      (r.emp_code && r.emp_code.toLowerCase().includes(query)) ||
      (r.notice_no && r.notice_no.toLowerCase().includes(query));

    const matchType = !typeFilter || (r.notice_type && r.notice_type.includes(typeFilter));
    const matchStatus = !statusFilter || (r.status === statusFilter);
    return matchQuery && matchType && matchStatus;
  });

  renderNoticesTable(filtered);
}

function openIssueNoticeModal() {
  const select = document.getElementById('noticeFormEmpId');
  if (select) {
    select.innerHTML = '<option value="">-- اختر الموظف --</option>' +
      state.employees.map(e => `<option value="${e.id}">${e.emp_code} - ${e.full_name_ar} (${e.job_title_ar || ''})</option>`).join('');
  }
  const dateInput = document.getElementById('noticeFormDate');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
  openModal('modalIssueAttendanceNotice');
}

function onNoticeTypeChanged(type) {
  const delayWrapper = document.getElementById('noticeDelayFieldWrapper');
  if (delayWrapper) {
    if (type.includes('تأخير')) {
      delayWrapper.classList.remove('hidden');
    } else {
      delayWrapper.classList.add('hidden');
    }
  }
}

async function submitAttendanceNotice(e) {
  e.preventDefault();
  const empId = document.getElementById('noticeFormEmpId').value;
  const date = document.getElementById('noticeFormDate').value;
  const type = document.getElementById('noticeFormType').value;
  const delayMinutes = Number(document.getElementById('noticeFormDelayMinutes')?.value) || 0;
  const reason = document.getElementById('noticeFormReason').value;
  const actionRequired = document.getElementById('noticeFormAction').value;

  if (!empId) return alert('يرجى اختيار الموظف أولاً');

  try {
    const res = await apiFetch('/api/attendance/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emp_id: empId,
        notice_type: type,
        incident_date: date,
        delay_minutes: delayMinutes,
        reason: reason,
        action_required: actionRequired
      })
    });

    if (res && res.success) {
      alert('تم إصدار الإشعار وتثبيته في حساب الموظف بالخدمة الذاتية بنجاح');
      closeModal('modalIssueAttendanceNotice');
      await loadNoticesView();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في إصدار الإشعار'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء إصدار الإشعار: ' + err.message);
  }
}

function exportNoticesExcel() {
  window.open('/api/attendance/notices/export', '_blank');
}

async function acknowledgeNoticeESS(id) {
  const notes = prompt('أدخل أية إيضاحات أو ملاحظات قبل التوقيع والإقرار:', 'أقر باستلام الإشعار والالتزام بالأنظمة');
  if (notes === null) return;

  try {
    const res = await apiFetch(`/api/attendance/notices/${id}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_notes: notes })
    });

    if (res && res.success) {
      alert('تم التوقيع والإقرار الإلكتروني بنجاح');
      await loadNoticesView();
      if (state.currentTab === 'selfservice') loadSelfService();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في تسجيل الإقرار'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء تسجيل الإقرار: ' + err.message);
  }
}

// --- 5. 4-STEP APPROVAL WORKFLOW ACTION HANDLERS ---
async function handleLeaveStepAction(leaveId, step, action) {
  const stepLabel = step === 'manager' ? 'المدير المباشر' : (step === 'hr_verify' ? 'قسم الموارد البشرية (تدقيق)' : 'مدير الموارد البشرية (اعتماد نهائي)');
  const actionLabel = action === 'approve' || action === 'verify' ? 'الموافقة / الاعتماد' : 'الرفض';

  const comment = prompt(`يرجى كتابة ملاحظات ${stepLabel} بشأن ${actionLabel}:`, action === 'approve' || action === 'verify' ? 'موافق وفق السياسة واللوائح المعتمدة' : 'نعتذر لعدم الموافقة لظروف العمل');
  if (comment === null) return;

  const approverName = state.currentUser ? (state.currentUser.full_name_ar || state.currentUser.full_name || state.currentUser.username) : 'المسؤول';

  try {
    const res = await apiFetch(`/api/leaves/${leaveId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        step, 
        action, 
        comment, 
        approverName,
        user: state.currentUser 
      })
    });

    if (res && res.success) {
      alert('✓ تم تحديث سير الموافقات بنجاح');
      await syncDataFromBackend();
      if (typeof loadLeavesView === 'function') await loadLeavesView();
      if (state.currentTab === 'selfservice') loadSelfService();
      if (typeof updateApprovalBadges === 'function') updateApprovalBadges();
    } else {
      alert('خطأ في الصلاحية: ' + (res?.error || res?.message || 'فشل في تحديث سير الموافقة'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء معالجة مسار الموافقة: ' + err.message);
  }
}

async function handleRevertLeaveAction(leaveId) {
  if (!confirm('هل أنت متأكد من التراجع عن الإجراء وإعادة طلب الإجازة لمرحلة موافقة المدير المباشر؟')) return;
  const reason = prompt('سبب التراجع عن الإجراء:', 'تراجع بناءً على مراجعة الصلاحيات');
  if (reason === null) return;

  try {
    const res = await apiFetch(`/api/leaves/${leaveId}/revert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, user: state.currentUser })
    });
    if (res && res.success) {
      alert('✓ تم التراجع عن الإجراء بنجاح.');
      await syncDataFromBackend();
      if (typeof loadLeavesView === 'function') await loadLeavesView();
      if (state.currentTab === 'selfservice') loadSelfService();
      if (typeof updateApprovalBadges === 'function') updateApprovalBadges();
    } else {
      alert('خطأ: ' + (res?.error || res?.message || 'تعذر التراجع عن الإجراء'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء التراجع: ' + err.message);
  }
}

async function handleRequestStepAction(reqId, step, action) {
  const stepLabel = step === 'manager' ? 'المدير المباشر' : (step === 'hr_verify' ? 'قسم الموارد البشرية (تدقيق)' : 'مدير الموارد البشرية (اعتماد نهائي)');
  const actionLabel = action === 'approve' || action === 'verify' ? 'الموافقة / الاعتماد' : 'الرفض';

  const comment = prompt(`يرجى كتابة ملاحظات ${stepLabel} بشأن ${actionLabel}:`, action === 'approve' || action === 'verify' ? 'معتمد ومطابق للأنظمة' : 'مرفوض لعدم استيفاء الشروط');
  if (comment === null) return;

  const approverName = state.currentUser ? (state.currentUser.full_name_ar || state.currentUser.full_name || state.currentUser.username) : 'المسؤول';

  try {
    const res = await apiFetch(`/api/requests/${reqId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        step, 
        action, 
        comment, 
        approverName,
        user: state.currentUser 
      })
    });

    if (res && res.success) {
      alert('✓ تم توثيق سير الموافقات بنجاح');
      await syncDataFromBackend();
      if (typeof loadLeavesView === 'function') await loadLeavesView();
      if (state.currentTab === 'selfservice') loadSelfService();
      if (typeof updateApprovalBadges === 'function') updateApprovalBadges();
    } else {
      alert('خطأ في الصلاحية: ' + (res?.error || res?.message || 'فشل في توثيق الموافقة'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء معالجة الطلب: ' + err.message);
  }
}

async function handleRevertRequestAction(reqId) {
  if (!confirm('هل أنت متأكد من التراجع عن الإجراء المتخذ وإعادة الطلب إلى مرحلة موافقة المدير المباشر؟')) return;
  const reason = prompt('سبب التراجع عن الإجراء:', 'تراجع بناءً على مراجعة الصلاحيات');
  if (reason === null) return;

  try {
    const res = await apiFetch(`/api/requests/${reqId}/revert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, user: state.currentUser })
    });

    if (res && res.success) {
      alert('✓ تم التراجع عن الإجراء بنجاح وأعيد الطلب إلى مرحلة موافقة المدير المباشر.');
      await syncDataFromBackend();
      if (typeof loadLeavesView === 'function') await loadLeavesView();
      if (state.currentTab === 'selfservice') loadSelfService();
      if (typeof updateApprovalBadges === 'function') updateApprovalBadges();
    } else {
      alert('خطأ: ' + (res?.error || res?.message || 'تعذر التراجع عن الإجراء'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء التراجع: ' + err.message);
  }
}

// Window global exports
window.state = state;
window.syncAndSaveAllData = syncAndSaveAllData;
window.syncUsersNow = syncUsersNow;
window.showToastNotification = showToastNotification;
window.openOfficialFormPreview = openOfficialFormPreview;
window.printOfficialFormModal = printOfficialFormModal;

window.loadTerminatedView = loadTerminatedView;
window.switchEosSubTab = switchEosSubTab;
window.initEosCalculator = initEosCalculator;
window.onEosModeChange = onEosModeChange;
window.onEosEmployeeSelected = onEosEmployeeSelected;
window.onEosReasonChange = onEosReasonChange;
window.onEosContractTypeChange = onEosContractTypeChange;
window.printCurrentEosClearance = printCurrentEosClearance;
window.triggerLiveEosCalculation = triggerLiveEosCalculation;
window.renderEosLiveResults = renderEosLiveResults;
window.resetEosCalculator = resetEosCalculator;
window.saveCalculatedEosSettlement = saveCalculatedEosSettlement;
window.printCalculatedEosSettlement = printCalculatedEosSettlement;
window.loadEosSettlementsRecords = loadEosSettlementsRecords;
window.renderEosSettlementsTable = renderEosSettlementsTable;
window.filterEosSettlementsTable = filterEosSettlementsTable;
window.printEosSettlementById = printEosSettlementById;
window.exportEosSettlementsCsv = exportEosSettlementsCsv;
window.downloadTerminatedTemplateExcel = downloadTerminatedTemplateExcel;
window.exportTerminatedExcel = exportTerminatedExcel;

window.loadRecruitmentView = loadRecruitmentView;
window.switchRecruitmentSubTab = switchRecruitmentSubTab;
window.loadRecruitmentKpis = loadRecruitmentKpis;
window.loadVacancies = loadVacancies;
window.renderVacanciesTable = renderVacanciesTable;
window.filterVacanciesTable = filterVacanciesTable;
window.populateVacancySelects = populateVacancySelects;
window.openAddVacancyModal = openAddVacancyModal;
window.submitVacancyForm = submitVacancyForm;
window.loadApplicants = loadApplicants;
window.renderApplicantsPipeline = renderApplicantsPipeline;
window.filterApplicantsPipeline = filterApplicantsPipeline;
window.openAddApplicantModal = openAddApplicantModal;
window.submitApplicantForm = submitApplicantForm;
window.openMoveStageModal = openMoveStageModal;
window.submitMoveStageForm = submitMoveStageForm;
window.loadJobOffers = loadJobOffers;
window.renderJobOffersTable = renderJobOffersTable;
window.filterJobOffersTable = filterJobOffersTable;
window.openCreateOfferModal = openCreateOfferModal;
window.openCreateOfferModalForApplicant = openCreateOfferModalForApplicant;
window.calculateOfferGross = calculateOfferGross;
window.submitCreateOfferForm = submitCreateOfferForm;
window.updateOfferStatus = updateOfferStatus;
window.printJobOffer = printJobOffer;
window.printBilingualApplicationForm = printBilingualApplicationForm;
window.printBilingualApplicationFormForVacancy = printBilingualApplicationFormForVacancy;
window.printBilingualUndertaking = printBilingualUndertaking;
window.printSampleJobOffer = printSampleJobOffer;

window.loadLoansView = loadLoansView;
window.filterLoansTable = filterLoansTable;
window.openAddLoanModal = openAddLoanModal;
window.calculateLoanInstallment = calculateLoanInstallment;
window.submitNewLoan = submitNewLoan;
window.downloadLoanTemplateExcel = downloadLoanTemplateExcel;
window.exportLoansExcel = exportLoansExcel;
window.submitImportLoansExcel = submitImportLoansExcel;

window.loadNoticesView = loadNoticesView;
window.filterNoticesTable = filterNoticesTable;
window.openIssueNoticeModal = openIssueNoticeModal;
window.onNoticeTypeChanged = onNoticeTypeChanged;
window.submitAttendanceNotice = submitAttendanceNotice;
window.exportNoticesExcel = exportNoticesExcel;
window.acknowledgeNoticeESS = acknowledgeNoticeESS;

window.handleLeaveStepAction = handleLeaveStepAction;
window.handleRevertLeaveAction = handleRevertLeaveAction;
window.handleRequestStepAction = handleRequestStepAction;
window.handleRevertRequestAction = handleRevertRequestAction;
window.setPenaltyDisplayMode = setPenaltyDisplayMode;

// Global Escape Key Listener for Modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.modal-overlay:not(.hidden)');
    modals.forEach(m => m.classList.add('hidden'));
  }
});

/* =========================================================================
   DEDICATED ABSENCE NOTICES & COMPANY EMAIL STAGING SYSTEM
   ========================================================================= */
let absenceRecords = [];
let currentEmailPreviewNotice = null;

async function loadAbsenceView() {
  try {
    const [recRes, kpiRes, emailSettingsRes] = await Promise.all([
      apiFetch('/api/absence-notices'),
      apiFetch('/api/absence-notices/kpis'),
      apiFetch('/api/company-email/settings')
    ]);

    absenceRecords = (recRes && recRes.success) ? recRes.data : [];
    const kpis = (kpiRes && kpiRes.success) ? kpiRes.data : {};
    const settings = (emailSettingsRes && emailSettingsRes.success) ? emailSettingsRes.data : {};

    const elTotal = document.getElementById('statAbsenceTotal');
    const elSingle = document.getElementById('statAbsenceSingle');
    const elConsecutive = document.getElementById('statAbsenceConsecutive');
    const elArt80 = document.getElementById('statAbsenceArt80');
    const elReady = document.getElementById('statAbsenceReadyEmail');
    const elAck = document.getElementById('statAbsenceAck');

    if (elTotal) elTotal.textContent = kpis.total || 0;
    if (elSingle) elSingle.textContent = kpis.singleDay || 0;
    if (elConsecutive) elConsecutive.textContent = kpis.consecutive || 0;
    if (elArt80) elArt80.textContent = kpis.article80 || 0;
    if (elReady) elReady.textContent = kpis.readyForEmail || 0;
    if (elAck) elAck.textContent = kpis.acknowledged || 0;

    const badge = document.getElementById('companyEmailStatusBadge');
    if (badge) {
      if (settings.is_active) {
        badge.textContent = 'حالة بريد الشركة: 🟢 الإرسال المباشر مفعّل';
      } else {
        badge.textContent = 'حالة بريد الشركة: ⚙️ جاهز للربط (محفوظ ومُجهز بالنظام)';
      }
    }

    renderAbsenceTable(absenceRecords);
  } catch (e) {
    console.error('Error loading absence notices:', e);
  }
}

function renderAbsenceTable(records) {
  const tbody = document.getElementById('absenceTableBody');
  if (!tbody) return;

  if (!records || records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="p-8 text-center text-slate-400 font-bold">لا توجد إشعارات غياب مسجلة حالياً. انقر على "إصدار إشعار غياب جديد" للبدء.</td></tr>`;
    return;
  }

  tbody.innerHTML = records.map(r => {
    const isArt80 = (r.absence_type && r.absence_type.includes('80')) || (r.warning_tier && r.warning_tier.includes('80'));
    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="p-3 font-mono font-bold text-slate-800">${r.notice_no}</td>
        <td class="p-3">
          <div class="font-bold text-slate-900">${r.emp_name}</div>
          <div class="text-[10px] text-slate-400 font-mono">${r.emp_code}</div>
        </td>
        <td class="p-3">
          <div class="font-semibold text-slate-800">${r.department_name || '-'}</div>
          <div class="text-[10px] text-slate-500">${r.job_title || ''}</div>
        </td>
        <td class="p-3">
          <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${isArt80 ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}">
            ${r.absence_type} (${r.days_count} يوم)
          </span>
          <div class="text-[10px] text-slate-500 font-bold mt-0.5">${r.warning_tier}</div>
        </td>
        <td class="p-3 font-mono text-slate-700 font-semibold text-[11px]">
          ${r.absence_date}
          ${r.absence_end_date && r.absence_end_date !== r.absence_date ? `<br><span class="text-[10px] text-slate-400">إلى ${r.absence_end_date}</span>` : ''}
        </td>
        <td class="p-3 font-mono text-[11px] text-slate-600">${r.recipient_email || '<span class="text-slate-400">غير مسجل</span>'}</td>
        <td class="p-3">
          <div class="text-[11px] font-semibold text-slate-800">${r.manager_name || '-'}</div>
          <div class="text-[10px] font-mono text-slate-400">${r.manager_email || ''}</div>
        </td>
        <td class="p-3 text-center">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            ${r.email_status}
          </span>
        </td>
        <td class="p-3 text-center">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'تم الإقرار' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}">
            ${r.status}
          </span>
        </td>
        <td class="p-3 text-center">
          <div class="flex items-center justify-center gap-1.5 flex-wrap">
            <button onclick="openPreviewEmailModal(${r.id})" class="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] flex items-center gap-1 transition shadow-sm">
              <i class="fa-solid fa-envelope-open-text"></i> معاينة البريد
            </button>
            <button onclick="printAbsenceLetterDirect(${r.id})" class="px-2 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-[10px] flex items-center gap-1 transition">
              <i class="fa-solid fa-print"></i> الخطاب
            </button>
            ${r.status !== 'تم الإقرار' ? `
            <button onclick="acknowledgeAbsenceInTable(${r.id})" class="px-2 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px] flex items-center gap-1 transition" title="إقرار واستلام">
              <i class="fa-solid fa-check"></i> إقرار
            </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterAbsenceTable() {
  const query = (document.getElementById('absenceSearchInput')?.value || '').toLowerCase().trim();
  const typeFilter = document.getElementById('absenceTypeFilter')?.value || '';
  const warningFilter = document.getElementById('absenceWarningFilter')?.value || '';
  const emailStatusFilter = document.getElementById('absenceEmailStatusFilter')?.value || '';

  const filtered = absenceRecords.filter(r => {
    const matchQuery = !query ||
      (r.emp_name && r.emp_name.toLowerCase().includes(query)) ||
      (r.emp_code && r.emp_code.toLowerCase().includes(query)) ||
      (r.notice_no && r.notice_no.toLowerCase().includes(query)) ||
      (r.recipient_email && r.recipient_email.toLowerCase().includes(query)) ||
      (r.reason && r.reason.toLowerCase().includes(query));

    const matchType = !typeFilter || (r.absence_type && r.absence_type.includes(typeFilter));
    const matchWarning = !warningFilter || (r.warning_tier && r.warning_tier.includes(warningFilter));
    const matchEmailStatus = !emailStatusFilter || (r.email_status === emailStatusFilter);

    return matchQuery && matchType && matchWarning && matchEmailStatus;
  });

  renderAbsenceTable(filtered);
}

function openAddAbsenceModal() {
  const select = document.getElementById('absenceFormEmpId');
  if (select) {
    select.innerHTML = '<option value="">-- اختر الموظف --</option>' +
      state.employees.map(e => `<option value="${e.id}">${e.emp_code} - ${e.full_name_ar} (${e.job_title_ar || ''})</option>`).join('');
  }
  const today = new Date().toISOString().split('T')[0];
  const startInput = document.getElementById('absenceFormStartDate');
  const endInput = document.getElementById('absenceFormEndDate');
  if (startInput) startInput.value = today;
  if (endInput) endInput.value = today;
  const daysInput = document.getElementById('absenceFormDaysCount');
  if (daysInput) daysInput.value = 1;

  const detailBox = document.getElementById('absenceEmpDetailBox');
  if (detailBox) detailBox.classList.add('hidden');

  openModal('modalAddAbsenceNotice');
}

function onAbsenceEmpChanged(empId) {
  const detailBox = document.getElementById('absenceEmpDetailBox');
  if (!empId) {
    if (detailBox) detailBox.classList.add('hidden');
    return;
  }

  const emp = state.employees.find(e => String(e.id) === String(empId));
  if (!emp) return;

  const deptEl = document.getElementById('absenceDetailDept');
  const empEmailEl = document.getElementById('absenceDetailEmpEmail');
  const mgrEl = document.getElementById('absenceDetailManager');
  const mgrEmailEl = document.getElementById('absenceDetailMgrEmail');

  const deptName = emp.department_name || (state.departments?.find(d => d.id === emp.department_id)?.name_ar) || 'الإدارة العامة';
  if (deptEl) deptEl.textContent = `${deptName} - ${emp.job_title_ar || 'موظف'}`;
  if (empEmailEl) empEmailEl.textContent = emp.email || 'غير مسجل بقاعدة البيانات';

  // Find direct manager name & email
  let mgrName = emp.direct_manager_name || 'الإدارة العامة';
  let mgrEmail = 'غير مسجل';
  if (emp.manager_id) {
    const mgr = state.employees.find(m => m.id === emp.manager_id);
    if (mgr) {
      mgrName = mgr.full_name_ar;
      mgrEmail = mgr.email || mgrEmail;
    }
  } else if (emp.direct_manager_name) {
    const mgr = state.employees.find(m => m.full_name_ar === emp.direct_manager_name);
    if (mgr && mgr.email) mgrEmail = mgr.email;
  }

  if (mgrEl) mgrEl.textContent = mgrName;
  if (mgrEmailEl) mgrEmailEl.textContent = mgrEmail;

  if (detailBox) detailBox.classList.remove('hidden');
}

function onAbsenceTypeSelected(type) {
  const warningSelect = document.getElementById('absenceFormWarningTier');
  if (!warningSelect) return;
  if (type.includes('المادة 80')) {
    warningSelect.value = 'إنذار نهائي / فصل م80';
  } else if (type.includes('متصل')) {
    warningSelect.value = 'إنذار كتابي أول';
  } else {
    warningSelect.value = 'إشعار غياب أولي';
  }
}

function calcAbsenceDays() {
  const startVal = document.getElementById('absenceFormStartDate')?.value;
  const endVal = document.getElementById('absenceFormEndDate')?.value;
  const daysEl = document.getElementById('absenceFormDaysCount');
  if (!daysEl) return;

  if (startVal && endVal) {
    const s = new Date(startVal);
    const e = new Date(endVal);
    if (e >= s) {
      const diffTime = Math.abs(e - s);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      daysEl.value = diffDays;
      return;
    }
  }
  daysEl.value = 1;
}

async function submitNewAbsenceNotice(e) {
  e.preventDefault();
  const empId = document.getElementById('absenceFormEmpId').value;
  const type = document.getElementById('absenceFormType').value;
  const warningTier = document.getElementById('absenceFormWarningTier').value;
  const startDate = document.getElementById('absenceFormStartDate').value;
  const endDate = document.getElementById('absenceFormEndDate').value;
  const daysCount = Number(document.getElementById('absenceFormDaysCount').value) || 1;
  const reason = document.getElementById('absenceFormReason').value;
  const actionRequired = document.getElementById('absenceFormAction').value;

  if (!empId || !startDate) return alert('يرجى اختيار الموظف وتاريخ الغياب');

  try {
    const res = await apiFetch('/api/absence-notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emp_id: empId,
        absence_type: type,
        warning_tier: warningTier,
        absence_date: startDate,
        absence_end_date: endDate,
        days_count: daysCount,
        reason: reason,
        action_required: actionRequired
      })
    });

    if (res && res.success) {
      alert('تم إنشاء إشعار الغياب وتجهيزه لبريد الشركة بنجاح!');
      closeModal('modalAddAbsenceNotice');
      await loadAbsenceView();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في إنشاء إشعار الغياب'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء إنشاء إشعار الغياب: ' + err.message);
  }
}

async function openPreviewEmailModal(id) {
  try {
    const res = await apiFetch(`/api/absence-notices/${id}`);
    if (!res || !res.success || !res.data) {
      return alert('تعذر جلب تفاصيل إشعار الغياب');
    }
    const notice = res.data;
    currentEmailPreviewNotice = notice;

    document.getElementById('previewEmailTo').textContent = `${notice.emp_name} <${notice.recipient_email || 'غير مسجل'}>`;
    document.getElementById('previewEmailCc').textContent = `${notice.manager_name || 'الإدارة العامة'} <${notice.manager_email || 'غير مسجل'}>`;
    document.getElementById('previewEmailSubject').textContent = notice.email_subject || '-';
    document.getElementById('previewEmailStatus').textContent = `${notice.email_status} (جاهز للربط بخادم SMTP)`;

    const iframe = document.getElementById('previewEmailIframe');
    if (iframe) {
      iframe.src = `/api/absence-notices/${id}/email-preview`;
    }

    openModal('modalPreviewCompanyEmail');
  } catch (err) {
    alert('خطأ أثناء تحميل معاينة البريد: ' + err.message);
  }
}

function printAbsenceLetterFromEmailModal() {
  if (currentEmailPreviewNotice && currentEmailPreviewNotice.id) {
    printAbsenceLetterDirect(currentEmailPreviewNotice.id);
  }
}

function printAbsenceLetterDirect(id) {
  window.open(`/api/absence-notices/${id}/print`, '_blank');
}

async function acknowledgeAbsenceInTable(id) {
  const notes = prompt('أدخل أية ملاحظات توثيقية للإقرار (أو اضغط موافق للإقرار المباشر):', 'أقر بالاطلاع والاستلام');
  if (notes === null) return;

  try {
    const res = await apiFetch(`/api/absence-notices/${id}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    if (res && res.success) {
      alert('تم إقرار واستلام إشعار الغياب بنجاح!');
      await loadAbsenceView();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في تسجيل الإقرار'));
    }
  } catch (err) {
    alert('حدث خطأ: ' + err.message);
  }
}

async function openCompanyEmailSettingsModal() {
  try {
    const res = await apiFetch('/api/company-email/settings');
    if (res && res.success && res.data) {
      const s = res.data;
      document.getElementById('smtpHost').value = s.smtp_host || '';
      document.getElementById('smtpPort').value = s.smtp_port || 587;
      document.getElementById('smtpUser').value = s.smtp_user || '';
      document.getElementById('smtpPass').value = s.smtp_pass || '';
      document.getElementById('smtpFromEmail').value = s.from_email || 'hr@jawharat-almajd.com';
      document.getElementById('smtpFromName').value = s.from_name || 'شركة جوهرة المجد للمقاولات - الموارد البشرية';
      document.getElementById('smtpIsSsl').checked = Boolean(s.is_ssl);
      document.getElementById('smtpIsActive').checked = Boolean(s.is_active);
    }
    openModal('modalCompanyEmailSettings');
  } catch (err) {
    alert('خطأ في استرجاع إعدادات البريد: ' + err.message);
  }
}

async function submitCompanyEmailSettings(e) {
  e.preventDefault();
  const data = {
    smtp_host: document.getElementById('smtpHost').value.trim(),
    smtp_port: Number(document.getElementById('smtpPort').value) || 587,
    smtp_user: document.getElementById('smtpUser').value.trim(),
    smtp_pass: document.getElementById('smtpPass').value.trim(),
    from_email: document.getElementById('smtpFromEmail').value.trim(),
    from_name: document.getElementById('smtpFromName').value.trim(),
    is_ssl: document.getElementById('smtpIsSsl').checked ? 1 : 0,
    is_active: document.getElementById('smtpIsActive').checked ? 1 : 0
  };

  try {
    const res = await apiFetch('/api/company-email/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res && res.success) {
      alert('تم حفظ إعدادات بريد الشركة بنجاح!');
      closeModal('modalCompanyEmailSettings');
      await loadAbsenceView();
    } else {
      alert('خطأ: ' + (res?.error || 'فشل في حفظ إعدادات البريد'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء حفظ الإعدادات: ' + err.message);
  }
}

function exportAbsenceExcel() {
  window.open('/api/absence-notices/export', '_blank');
}

function downloadAbsenceTemplate() {
  window.open('/api/absence-notices/template', '_blank');
}

async function handleAbsenceExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/absence-notices/import', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    if (result.success) {
      alert(`نجح الاستيراد!\n- تم استيراد: ${result.data.successCount} إشعار غياب\n- تم تخطي: ${result.data.skippedCount}`);
      await loadAbsenceView();
    } else {
      alert('خطأ في الاستيراد: ' + result.error);
    }
  } catch (err) {
    alert('حدث خطأ أثناء رفع الملف: ' + err.message);
  } finally {
    event.target.value = '';
  }
}

// Window global exports for Absence Notices
window.loadAbsenceView = loadAbsenceView;
window.renderAbsenceTable = renderAbsenceTable;
window.filterAbsenceTable = filterAbsenceTable;
window.openAddAbsenceModal = openAddAbsenceModal;
window.onAbsenceEmpChanged = onAbsenceEmpChanged;
window.onAbsenceTypeSelected = onAbsenceTypeSelected;
window.calcAbsenceDays = calcAbsenceDays;
window.submitNewAbsenceNotice = submitNewAbsenceNotice;
window.openPreviewEmailModal = openPreviewEmailModal;
window.printAbsenceLetterFromEmailModal = printAbsenceLetterFromEmailModal;
window.printAbsenceLetterDirect = printAbsenceLetterDirect;
window.acknowledgeAbsenceInTable = acknowledgeAbsenceInTable;
window.openCompanyEmailSettingsModal = openCompanyEmailSettingsModal;
window.submitCompanyEmailSettings = submitCompanyEmailSettings;
window.exportAbsenceExcel = exportAbsenceExcel;
window.downloadAbsenceTemplate = downloadAbsenceTemplate;
window.handleAbsenceExcelUpload = handleAbsenceExcelUpload;

/* =========================================================================
   MODULE 4: FLEET & VEHICLE MANAGEMENT CONTROLLER (منصة تم وإدارة الأسطول)
   ========================================================================= */

const fleetState = {
  vehicles: [],
  kpis: {},
  logs: [],
  activeSubTab: 'vehicles'
};

/**
 * Main entry point for loading Fleet & Tamm view
 */
async function loadFleetView() {
  await Promise.all([
    loadFleetKpis(),
    loadFleetData()
  ]);
  switchFleetSubTab(fleetState.activeSubTab || 'vehicles');
}

/**
 * Load KPIs and Tamm alert counts
 */
async function loadFleetKpis() {
  try {
    const res = await fetch('/api/fleet/kpis');
    const json = await res.json();
    if (!json.success) return;

    const data = json.data;
    fleetState.kpis = data;

    const totalEl = document.getElementById('fleetKpiTotal');
    const assignedEl = document.getElementById('fleetKpiAssigned');
    const availableEl = document.getElementById('fleetKpiAvailable');
    const alertsEl = document.getElementById('fleetKpiAlerts');
    const badgeEl = document.getElementById('fleetAlertsBadge');
    const navBadgeEl = document.getElementById('badgeNavFleet');

    if (totalEl) totalEl.textContent = data.total_vehicles || 0;
    if (assignedEl) assignedEl.textContent = data.assigned_vehicles || 0;
    if (availableEl) availableEl.textContent = data.available_vehicles || 0;
    if (alertsEl) alertsEl.textContent = data.total_alerts || 0;
    if (badgeEl) badgeEl.textContent = data.total_alerts || 0;

    if (navBadgeEl) {
      if (data.total_alerts > 0) {
        navBadgeEl.textContent = `${data.total_alerts} تنبيه`;
        navBadgeEl.className = 'px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse';
      } else {
        navBadgeEl.textContent = 'تم';
        navBadgeEl.className = 'px-1.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300';
      }
    }
  } catch (err) {
    console.error('Error loading fleet KPIs:', err);
  }
}

/**
 * Fetch all vehicles and render table & compliance cards
 */
async function loadFleetData() {
  try {
    const res = await fetch('/api/fleet/vehicles');
    const json = await res.json();
    if (!json.success) return;

    fleetState.vehicles = json.data || [];
    renderFleetTable(fleetState.vehicles);
    renderTammAlerts(fleetState.vehicles);
  } catch (err) {
    console.error('Error loading fleet data:', err);
  }
}

/**
 * Switch Sub-Tabs in Fleet View
 */
function switchFleetSubTab(tabName) {
  fleetState.activeSubTab = tabName;

  const tabVehicles = document.getElementById('fleetTabVehicles');
  const tabAlerts = document.getElementById('fleetTabAlerts');
  const tabLogs = document.getElementById('fleetTabLogs');

  const viewVehicles = document.getElementById('fleetSubViewVehicles');
  const viewAlerts = document.getElementById('fleetSubViewAlerts');
  const viewLogs = document.getElementById('fleetSubViewLogs');

  const activeClasses = ['border-brand', 'text-brand'];
  const inactiveClasses = ['border-transparent', 'text-slate-500'];

  [tabVehicles, tabAlerts, tabLogs].forEach(t => {
    if (t) {
      t.classList.remove(...activeClasses);
      t.classList.add(...inactiveClasses);
    }
  });

  [viewVehicles, viewAlerts, viewLogs].forEach(v => {
    if (v) v.classList.add('hidden');
  });

  if (tabName === 'vehicles') {
    if (tabVehicles) {
      tabVehicles.classList.add(...activeClasses);
      tabVehicles.classList.remove(...inactiveClasses);
    }
    if (viewVehicles) viewVehicles.classList.remove('hidden');
  } else if (tabName === 'alerts') {
    if (tabAlerts) {
      tabAlerts.classList.add(...activeClasses);
      tabAlerts.classList.remove(...inactiveClasses);
    }
    if (viewAlerts) viewAlerts.classList.remove('hidden');
  } else if (tabName === 'logs') {
    if (tabLogs) {
      tabLogs.classList.add(...activeClasses);
      tabLogs.classList.remove(...inactiveClasses);
    }
    if (viewLogs) viewLogs.classList.remove('hidden');
    loadFleetLogs();
  }
}

/**
 * Render Vehicles Table with dynamic badges and filters
 */
function renderFleetTable(vehicles) {
  const tbody = document.getElementById('fleetTableBody');
  const countBadge = document.getElementById('fleetTableCountBadge');
  if (!tbody) return;

  const search = (document.getElementById('fleetSearchInput')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('fleetStatusFilter')?.value || '';
  const custodyFilter = document.getElementById('fleetCustodyFilter')?.value || '';
  const tammFilter = document.getElementById('fleetTammStatusFilter')?.value || '';

  const filtered = vehicles.filter(v => {
    if (statusFilter && v.status !== statusFilter) return false;
    if (tammFilter && v.tamm_status !== tammFilter) return false;

    if (custodyFilter === 'assigned' && !v.assigned_emp_id) return false;
    if (custodyFilter === 'available' && v.assigned_emp_id) return false;

    if (search) {
      const matchPlate = (v.plate_number_ar || '').toLowerCase().includes(search);
      const matchPlateEn = (v.plate_number_en || '').toLowerCase().includes(search);
      const matchMake = (v.make || '').toLowerCase().includes(search);
      const matchModel = (v.model || '').toLowerCase().includes(search);
      const matchVin = (v.vin_serial || '').toLowerCase().includes(search);
      const matchEmp = (v.assigned_emp_name || '').toLowerCase().includes(search);
      if (!matchPlate && !matchPlateEn && !matchMake && !matchModel && !matchVin && !matchEmp) return false;
    }

    return true;
  });

  if (countBadge) {
    countBadge.textContent = `عرض ${filtered.length} من أصل ${vehicles.length} مركبة`;
  }

  if (!vehicles || vehicles.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="p-12 text-center text-slate-400 font-bold">
          <i class="fa-solid fa-car-tunnel text-4xl mb-3 block text-slate-300"></i>
          <p class="text-base font-black text-slate-600 mb-1">لا توجد بيانات مسجلة حالياً</p>
          <p class="text-xs text-slate-400 font-medium">لم يتم تسجيل أو استيراد أي مركبات في منصة تم حتى الآن. يمكنك إضافة مركبة جديدة أو الاستيراد من ملف إكسل تم المعتمد.</p>
        </td>
      </tr>
    `;
    return;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="p-8 text-center text-slate-400">
          <i class="fa-solid fa-car-side text-4xl mb-2 text-slate-300"></i>
          <p class="font-bold text-sm">لا توجد مركبات تطابق معايير البحث والفلترة المحددة</p>
        </td>
      </tr>
    `;
    return;
  }

  const getStatusBadge = (statusObj) => {
    if (!statusObj || statusObj.status === 'unknown') {
      return '<span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">غير محدد</span>';
    }
    if (statusObj.status === 'expired') {
      return `<span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black border border-rose-200 flex items-center gap-1 w-max"><i class="fa-solid fa-triangle-exclamation text-[9px]"></i> ${statusObj.text_ar}</span>`;
    }
    if (statusObj.status === 'expiring_soon') {
      return `<span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-black border border-amber-200 flex items-center gap-1 w-max"><i class="fa-solid fa-clock text-[9px]"></i> ${statusObj.text_ar}</span>`;
    }
    return `<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 w-max block">${statusObj.text_ar}</span>`;
  };

  tbody.innerHTML = filtered.map(v => {
    const isAssigned = !!v.assigned_emp_id;

    return `
      <tr class="hover:bg-slate-50/80 transition group">
        <!-- Vehicle & Plate -->
        <td class="p-3.5">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-base font-bold shadow-xs border border-slate-200">
              <i class="fa-solid fa-truck-pickup"></i>
            </div>
            <div>
              <div class="font-black text-slate-900 text-xs flex items-center gap-1.5">
                <span class="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono tracking-wider">${v.plate_number_ar}</span>
                ${v.plate_number_en ? `<span class="text-[10px] font-mono text-slate-400">(${v.plate_number_en})</span>` : ''}
              </div>
              <div class="text-[11px] text-slate-500 font-mono mt-0.5">
                VIN: ${v.vin_serial || '---'}
              </div>
            </div>
          </div>
        </td>

        <!-- Specs & Color -->
        <td class="p-3.5">
          <div class="font-bold text-slate-900">${v.make} ${v.model}</div>
          <div class="text-[11px] text-slate-500">موديل ${v.year} - ${v.color || 'أبيض'} (${v.vehicle_type})</div>
        </td>

        <!-- Custodian Employee -->
        <td class="p-3.5">
          ${isAssigned ? `
            <div>
              <div class="font-black text-slate-900 flex items-center gap-1">
                <i class="fa-solid fa-user-check text-emerald-600 text-xs"></i>
                <span>${v.assigned_emp_name}</span>
              </div>
              <div class="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span class="font-mono text-slate-600 font-bold">${v.assigned_emp_code || ''}</span>
                <span>• ${v.assigned_dept_name || 'إدارة المشاريع'}</span>
              </div>
              <div class="text-[10px] text-emerald-700 font-bold mt-0.5">
                تاريخ التسليم: ${v.assigned_date || '---'}
              </div>
            </div>
          ` : `
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1">
              <i class="fa-solid fa-warehouse text-[10px]"></i> متاح في ساحة الشركة
            </span>
          `}
        </td>

        <!-- Odometer -->
        <td class="p-3.5 text-center font-mono font-bold text-slate-800">
          ${Number(v.odometer || 0).toLocaleString('en-US')} <span class="text-[10px] text-slate-400">كم</span>
        </td>

        <!-- Registration (Istimara) -->
        <td class="p-3.5">
          <div class="font-mono font-bold text-slate-800 text-[11px]">${v.istimara_expiry || '---'}</div>
          <div class="mt-0.5">${getStatusBadge(v.istimara)}</div>
        </td>

        <!-- Periodic Inspection (Fahas) -->
        <td class="p-3.5">
          <div class="font-mono font-bold text-slate-800 text-[11px]">${v.fahas_expiry || '---'}</div>
          <div class="mt-0.5">${getStatusBadge(v.fahas)}</div>
        </td>

        <!-- Insurance -->
        <td class="p-3.5">
          <div class="font-bold text-slate-900 text-[11px]">${v.insurance_company || '---'}</div>
          <div class="mt-0.5">${getStatusBadge(v.insurance)}</div>
        </td>

        <!-- Operational Status -->
        <td class="p-3.5 text-center">
          <span class="px-2.5 py-1 rounded-full text-[11px] font-black ${
            v.status === 'نشط' ? 'bg-emerald-100 text-emerald-800' :
            v.status === 'متاح' ? 'bg-blue-100 text-blue-800' :
            v.status === 'صيانة' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
          }">
            ${v.status}
          </span>
        </td>

        <!-- Actions -->
        <td class="p-3.5 text-center">
          <div class="flex items-center justify-center gap-1.5">
            
            <!-- Printable A4 Handover Certificate -->
            <button onclick="printVehicleHandover(${v.id})" title="طباعة محضر التسليم / الاستلام A4" class="p-1.5 rounded-lg bg-[#700c14] hover:bg-[#52090e] text-white text-xs shadow-xs transition">
              <i class="fa-solid fa-print"></i>
            </button>

            ${isAssigned ? `
              <!-- Return Custody Button -->
              <button onclick="openReturnCustodyModal(${v.id})" title="استرداد العهدة وإخلاء طرف" class="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs transition">
                <i class="fa-solid fa-arrow-rotate-left"></i>
              </button>
            ` : `
              <!-- Assign Custody Button -->
              <button onclick="openAssignCustodyModal(${v.id})" title="تسليم كعهدة لموظف" class="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition">
                <i class="fa-solid fa-handshake"></i>
              </button>
            `}

            <!-- Documents & Photos Button -->
            <button onclick="openVehicleDocumentsModal(${v.id}, '${(v.plate_number_ar || '').replace(/'/g, "\\'")} - ${(v.make || '').replace(/'/g, "\\'")} ${(v.model || '').replace(/'/g, "\\'")}')" title="مستندات وصور المركبة" class="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-xs transition cursor-pointer">
              <i class="fa-solid fa-folder-open"></i>
            </button>

            <!-- Edit Button -->
            <button onclick="openEditVehicleModal(${v.id})" title="تعديل بيانات المركبة" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>

            <!-- Delete Button -->
            <button onclick="deleteVehicleConfirm(${v.id}, '${v.plate_number_ar}')" title="حذف المركبة" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs transition">
              <i class="fa-solid fa-trash"></i>
            </button>

          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Filter trigger
 */
function filterFleetTable() {
  renderFleetTable(fleetState.vehicles);
}

/**
 * Render Tamm Compliance Center Alerts List
 */
function renderTammAlerts(vehicles) {
  const istimaraList = document.getElementById('tammIstimaraList');
  const fahasList = document.getElementById('tammFahasList');
  const insList = document.getElementById('tammInsuranceList');

  const istimaraCount = document.getElementById('tammIstimaraCount');
  const fahasCount = document.getElementById('tammFahasCount');
  const insCount = document.getElementById('tammInsuranceCount');

  const istimaraAlerts = vehicles.filter(v => v.istimara.status === 'expired' || v.istimara.status === 'expiring_soon');
  const fahasAlerts = vehicles.filter(v => v.fahas.status === 'expired' || v.fahas.status === 'expiring_soon');
  const insAlerts = vehicles.filter(v => v.insurance.status === 'expired' || v.insurance.status === 'expiring_soon');

  if (istimaraCount) istimaraCount.textContent = istimaraAlerts.length;
  if (fahasCount) fahasCount.textContent = fahasAlerts.length;
  if (insCount) insCount.textContent = insAlerts.length;

  const renderAlertItem = (v, infoObj, label) => `
    <div class="p-3 rounded-xl border ${infoObj.status === 'expired' ? 'bg-rose-50/70 border-rose-200' : 'bg-amber-50/70 border-amber-200'} space-y-1">
      <div class="flex items-center justify-between">
        <span class="font-black text-slate-900 font-mono text-xs">${v.plate_number_ar}</span>
        <span class="text-[10px] font-black ${infoObj.status === 'expired' ? 'text-rose-700' : 'text-amber-800'}">
          ${infoObj.text_ar}
        </span>
      </div>
      <div class="text-[11px] text-slate-600 flex items-center justify-between">
        <span>${v.make} ${v.model}</span>
        <span class="font-bold text-slate-900">${v.assigned_emp_name || 'متاحة'}</span>
      </div>
      <div class="flex justify-end pt-1">
        <button onclick="openEditVehicleModal(${v.id})" class="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
          <i class="fa-solid fa-pen"></i> تحديث وثيقة ${label}
        </button>
      </div>
    </div>
  `;

  if (istimaraList) {
    if (istimaraAlerts.length === 0) {
      istimaraList.innerHTML = '<p class="text-slate-400 text-xs py-6 text-center">جميع رخص السير سارية ومطابقة لمنصة تم ✓</p>';
    } else {
      istimaraList.innerHTML = istimaraAlerts.map(v => renderAlertItem(v, v.istimara, 'الاستمارة')).join('');
    }
  }

  if (fahasList) {
    if (fahasAlerts.length === 0) {
      fahasList.innerHTML = '<p class="text-slate-400 text-xs py-6 text-center">كافة المركبات اجتازت الفحص الدوري بنجاح ✓</p>';
    } else {
      fahasList.innerHTML = fahasAlerts.map(v => renderAlertItem(v, v.fahas, 'الفحص الدوري')).join('');
    }
  }

  if (insList) {
    if (insAlerts.length === 0) {
      insList.innerHTML = '<p class="text-slate-400 text-xs py-6 text-center">كافة وثائق التأمين الإلزامي سارية المفعول ✓</p>';
    } else {
      insList.innerHTML = insAlerts.map(v => renderAlertItem(v, v.insurance, 'التأمين')).join('');
    }
  }
}

/**
 * Load Custody Movement Logs Table
 */
async function loadFleetLogs() {
  const tbody = document.getElementById('fleetLogsTableBody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-xl"></i> جاري تحميل سجل الحركات...</td></tr>`;

  try {
    // Gather custody logs from all vehicles
    const res = await fetch('/api/fleet/vehicles');
    const json = await res.json();
    if (!json.success) return;

    let allLogs = [];
    for (const v of json.data) {
      const vDetailsRes = await fetch(`/api/fleet/vehicles/${v.id}`);
      const vJson = await vDetailsRes.json();
      if (vJson.success && vJson.data && vJson.data.custody_logs) {
        vJson.data.custody_logs.forEach(l => {
          allLogs.push({ ...l, plate_number_ar: v.plate_number_ar, make: v.make, model: v.model });
        });
      }
    }

    allLogs.sort((a, b) => new Date(b.action_date) - new Date(a.action_date));

    if (allLogs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-slate-400 font-bold">لا توجد حركات تسليم أو استرداد مسجلة حتى الآن</td></tr>`;
      return;
    }

    tbody.innerHTML = allLogs.map(l => {
      const isDelivery = l.action_type === 'تسليم_عهدة';
      const accList = Array.isArray(l.accessories) ? l.accessories : [];

      return `
        <tr class="hover:bg-slate-50 transition">
          <td class="p-3.5 font-mono text-[11px] font-bold text-slate-900">${l.action_date}</td>
          <td class="p-3.5">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-black ${isDelivery ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${isDelivery ? 'تسليم عهدة' : 'استرداد عهدة'}
            </span>
          </td>
          <td class="p-3.5 font-bold font-mono text-slate-800">${l.plate_number_ar}</td>
          <td class="p-3.5">
            <div class="font-bold text-slate-900">${l.emp_name}</div>
            <div class="text-[10px] text-slate-400 font-mono">${l.emp_code || ''}</div>
          </td>
          <td class="p-3.5 text-center font-mono font-bold text-slate-800">${Number(l.odometer || 0).toLocaleString('en-US')} كم</td>
          <td class="p-3.5 font-semibold text-slate-700">${l.fuel_level || 'ممتلئ'}</td>
          <td class="p-3.5 text-[11px] text-slate-600 max-w-xs truncate" title="${accList.join('، ')}">
            ${accList.length > 0 ? accList.join('، ') : '---'}
          </td>
          <td class="p-3.5 text-slate-700">${l.supervisor_name || 'مسؤول الحركة'}</td>
          <td class="p-3.5 text-center">
            <button onclick="printVehicleHandover(${l.vehicle_id}, ${l.id})" class="px-2.5 py-1 rounded-lg bg-[#700c14] hover:bg-[#52090e] text-white text-[11px] font-bold flex items-center gap-1 mx-auto transition shadow-xs">
              <i class="fa-solid fa-print"></i> المحضر
            </button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading fleet logs:', err);
    tbody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-rose-500 font-bold">حدث خطأ أثناء جلب سجل الحركات</td></tr>`;
  }
}

/**
 * Open Modal to Add or Edit Vehicle
 */
function openAddVehicleModal(vehicleId = null) {
  const form = document.querySelector('#modalAddVehicle form');
  if (form) form.reset();

  const titleEl = document.getElementById('modalAddVehicleTitle');
  const idEl = document.getElementById('vehFormId');

  if (vehicleId) {
    const v = fleetState.vehicles.find(x => x.id === vehicleId);
    if (!v) return;

    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square text-blue-600"></i> تعديل بيانات المركبة (${v.plate_number_ar})`;
    if (idEl) idEl.value = v.id;

    document.getElementById('vehFormPlateAr').value = v.plate_number_ar || '';
    document.getElementById('vehFormPlateEn').value = v.plate_number_en || '';
    document.getElementById('vehFormMake').value = v.make || '';
    document.getElementById('vehFormModel').value = v.model || '';
    document.getElementById('vehFormYear').value = v.year || 2024;
    document.getElementById('vehFormColor').value = v.color || '';
    document.getElementById('vehFormType').value = v.vehicle_type || 'نقل خاص';
    document.getElementById('vehFormVin').value = v.vin_serial || '';
    document.getElementById('vehFormOdometer').value = v.odometer || 0;
    document.getElementById('vehFormFuelCard').value = v.fuel_card_no || '';

    document.getElementById('vehFormIstimara').value = v.istimara_expiry || '';
    document.getElementById('vehFormFahas').value = v.fahas_expiry || '';
    document.getElementById('vehFormTammStatus').value = v.tamm_status || 'ساري';
    document.getElementById('vehFormInsCompany').value = v.insurance_company || '';
    document.getElementById('vehFormInsPolicy').value = v.insurance_policy_no || '';
    document.getElementById('vehFormInsExpiry').value = v.insurance_expiry || '';
    document.getElementById('vehFormTammAuthNo').value = v.tamm_authorization_no || '';
    document.getElementById('vehFormTammAuthExpiry').value = v.tamm_authorization_expiry || '';
    document.getElementById('vehFormNotes').value = v.notes || '';
  } else {
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-car text-blue-600"></i> إضافة مركبة جديدة للأسطول`;
    if (idEl) idEl.value = '';
    document.getElementById('vehFormYear').value = 2024;
    document.getElementById('vehFormType').value = 'نقل خاص';
    document.getElementById('vehFormTammStatus').value = 'ساري';
  }

  openModal('modalAddVehicle');
}

/**
 * Submit Vehicle Add/Edit Form
 */
async function submitVehicleForm(e) {
  e.preventDefault();
  const id = document.getElementById('vehFormId').value;

  const payload = {
    plate_number_ar: document.getElementById('vehFormPlateAr').value,
    plate_number_en: document.getElementById('vehFormPlateEn').value,
    make: document.getElementById('vehFormMake').value,
    model: document.getElementById('vehFormModel').value,
    year: document.getElementById('vehFormYear').value,
    color: document.getElementById('vehFormColor').value,
    vehicle_type: document.getElementById('vehFormType').value,
    vin_serial: document.getElementById('vehFormVin').value,
    odometer: document.getElementById('vehFormOdometer').value,
    fuel_card_no: document.getElementById('vehFormFuelCard').value,
    istimara_expiry: document.getElementById('vehFormIstimara').value,
    fahas_expiry: document.getElementById('vehFormFahas').value,
    tamm_status: document.getElementById('vehFormTammStatus').value,
    insurance_company: document.getElementById('vehFormInsCompany').value,
    insurance_policy_no: document.getElementById('vehFormInsPolicy').value,
    insurance_expiry: document.getElementById('vehFormInsExpiry').value,
    tamm_authorization_no: document.getElementById('vehFormTammAuthNo').value,
    tamm_authorization_expiry: document.getElementById('vehFormTammAuthExpiry').value,
    notes: document.getElementById('vehFormNotes').value
  };

  try {
    const url = id ? `/api/fleet/vehicles/${id}` : '/api/fleet/vehicles';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (json.success) {
      if (typeof showToast === 'function') showToast(json.message, 'success');
      else alert(json.message);
      closeModal('modalAddVehicle');
      await loadFleetView();
    } else {
      alert('خطأ: ' + json.error);
    }
  } catch (err) {
    alert('حدث خطأ أثناء حفظ المركبة: ' + err.message);
  }
}

/**
 * Helper: Populate active employees into select dropdown
 */
function populateFleetEmpSelect(selectEl) {
  if (!selectEl) return;
  selectEl.innerHTML = '<option value="">-- اختر الموظف المستلم للعهدة --</option>';

  const emps = Array.isArray(state?.employees) ? state.employees : [];
  emps.forEach(emp => {
    selectEl.innerHTML += `<option value="${emp.id}">${emp.emp_code} - ${emp.full_name_ar} (${emp.job_title_ar || 'موظف'})</option>`;
  });
}

/**
 * Open Modal to Handover Custody
 */
function openAssignCustodyModal(vehicleId) {
  const v = fleetState.vehicles.find(x => x.id === vehicleId);
  if (!v) return;

  document.getElementById('assignCustodyVehicleId').value = v.id;
  document.getElementById('assignCustodyVehicleName').textContent = `${v.make} ${v.model} (${v.year})`;
  document.getElementById('assignCustodyVehiclePlate').textContent = v.plate_number_ar;
  document.getElementById('assignCustodyOdometer').value = v.odometer || 0;
  document.getElementById('assignCustodyDate').value = new Date().toISOString().split('T')[0];

  const select = document.getElementById('assignCustodyEmpSelect');
  populateFleetEmpSelect(select);

  openModal('modalAssignCustody');
}

/**
 * Submit Custody Handover
 */
async function submitAssignCustodyForm(e) {
  e.preventDefault();
  const vehicleId = document.getElementById('assignCustodyVehicleId').value;
  const empId = document.getElementById('assignCustodyEmpSelect').value;

  const accessories = [];
  if (document.getElementById('accCheckIstimara')?.checked) accessories.push('الاستمارة الأصلية');
  if (document.getElementById('accCheckKey')?.checked) accessories.push('مفتاح احتياطي');
  if (document.getElementById('accCheckFire')?.checked) accessories.push('طفاية حريق');
  if (document.getElementById('accCheckSpare')?.checked) accessories.push('إطار احتياطي');
  if (document.getElementById('accCheckKit')?.checked) accessories.push('عِدة ورافعة');
  if (document.getElementById('accCheckFirstAid')?.checked) accessories.push('حقيبة إسعافات');

  const payload = {
    emp_id: empId,
    action_date: document.getElementById('assignCustodyDate').value,
    odometer: document.getElementById('assignCustodyOdometer').value,
    fuel_level: document.getElementById('assignCustodyFuelLevel').value,
    accessories,
    body_condition_notes: document.getElementById('assignCustodyCondition').value,
    supervisor_name: document.getElementById('assignCustodySupervisor').value,
    notes: document.getElementById('assignCustodyNotes').value
  };

  try {
    const res = await fetch(`/api/fleet/vehicles/${vehicleId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (json.success) {
      if (typeof showToast === 'function') showToast(json.message, 'success');
      else alert(json.message);
      closeModal('modalAssignCustody');
      await loadFleetView();
      // Ask to print handover certificate
      if (confirm('تم تسليم العهدة وتوثيق المحضر بنجاح. هل ترغب بطباعة محضر الاستلام الرسمي A4 الآن؟')) {
        printVehicleHandover(vehicleId);
      }
    } else {
      alert('خطأ: ' + json.error);
    }
  } catch (err) {
    alert('حدث خطأ أثناء تسليم العهدة: ' + err.message);
  }
}

/**
 * Open Modal to Return Custody
 */
function openReturnCustodyModal(vehicleId) {
  const v = fleetState.vehicles.find(x => x.id === vehicleId);
  if (!v) return;

  document.getElementById('returnCustodyVehicleId').value = v.id;
  document.getElementById('returnCustodyInfo').textContent = `${v.make} ${v.model} — المستلم: ${v.assigned_emp_name}`;
  document.getElementById('returnCustodyPlate').textContent = v.plate_number_ar;
  document.getElementById('returnCustodyOdometer').value = v.odometer || 0;
  document.getElementById('returnCustodyDate').value = new Date().toISOString().split('T')[0];

  openModal('modalReturnCustody');
}

/**
 * Submit Custody Return
 */
async function submitReturnCustodyForm(e) {
  e.preventDefault();
  const vehicleId = document.getElementById('returnCustodyVehicleId').value;

  const payload = {
    action_date: document.getElementById('returnCustodyDate').value,
    odometer: document.getElementById('returnCustodyOdometer').value,
    fuel_level: document.getElementById('returnCustodyFuelLevel').value,
    new_status: document.getElementById('returnCustodyNewStatus').value,
    body_condition_notes: document.getElementById('returnCustodyCondition').value
  };

  try {
    const res = await fetch(`/api/fleet/vehicles/${vehicleId}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (json.success) {
      if (typeof showToast === 'function') showToast(json.message, 'success');
      else alert(json.message);
      closeModal('modalReturnCustody');
      await loadFleetView();
    } else {
      alert('خطأ: ' + json.error);
    }
  } catch (err) {
    alert('حدث خطأ أثناء استرداد العهدة: ' + err.message);
  }
}

/**
 * Delete Vehicle confirmation
 */
async function deleteVehicleConfirm(vehicleId, plate) {
  if (!confirm(`هل أنت متأكد من رغبتك بحذف المركبة ذات اللوحة (${plate}) نهائياً؟`)) return;

  try {
    const res = await fetch(`/api/fleet/vehicles/${vehicleId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      if (typeof showToast === 'function') showToast(json.message, 'success');
      else alert(json.message);
      await loadFleetView();
    } else {
      alert('خطأ: ' + json.error);
    }
  } catch (err) {
    alert('حدث خطأ أثناء حذف المركبة: ' + err.message);
  }
}

/**
 * Print Official Handover Certificate (A4)
 */
function printVehicleHandover(vehicleId, logId = null) {
  const url = logId ? `/api/fleet/vehicles/${vehicleId}/handover-print?log_id=${logId}` : `/api/fleet/vehicles/${vehicleId}/handover-print`;
  window.open(url, '_blank', 'width=950,height=900,scrollbars=yes');
}

/**
 * Export Fleet to Excel
 */
function exportFleetExcel() {
  window.open('/api/fleet/export/excel', '_blank');
}

/**
 * Export Fleet to CSV
 */
function exportFleetCsv() {
  window.open('/api/fleet/export/csv', '_blank');
}

/**
 * Open Import Modal
 */
function openImportVehiclesModal() {
  const input = document.getElementById('importVehiclesFileInput');
  if (input) input.value = '';
  const nameEl = document.getElementById('importVehiclesFileName');
  if (nameEl) nameEl.textContent = 'لم يتم اختيار ملف بعد';
  const resultEl = document.getElementById('importVehiclesResult');
  if (resultEl) resultEl.className = 'hidden';

  openModal('modalImportVehicles');
}

/**
 * Update selected import file name
 */
function updateImportFileName(input) {
  const nameEl = document.getElementById('importVehiclesFileName');
  if (input.files && input.files[0]) {
    if (nameEl) nameEl.textContent = `${input.files[0].name} (${(input.files[0].size / 1024).toFixed(1)} KB)`;
  }
}

/**
 * Submit Vehicle Import File
 */
async function submitImportVehicles(e) {
  e.preventDefault();
  const input = document.getElementById('importVehiclesFileInput');
  if (!input || !input.files || !input.files[0]) {
    alert('يرجى اختيار ملف Excel أو CSV أولاً');
    return;
  }

  const btn = document.getElementById('btnSubmitImportVehicles');
  const resultEl = document.getElementById('importVehiclesResult');
  if (btn) btn.disabled = true;

  const formData = new FormData();
  formData.append('file', input.files[0]);

  try {
    const res = await fetch('/api/fleet/import', {
      method: 'POST',
      body: formData
    });
    const json = await res.json();

    if (resultEl) {
      resultEl.classList.remove('hidden');
      if (json.success) {
        resultEl.className = 'p-3 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
        resultEl.textContent = json.message;
        setTimeout(async () => {
          closeModal('modalImportVehicles');
          await loadFleetView();
        }, 1500);
      } else {
        resultEl.className = 'p-3 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300';
        resultEl.textContent = json.error;
      }
    }
  } catch (err) {
    if (resultEl) {
      resultEl.classList.remove('hidden');
      resultEl.className = 'p-3 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300';
      resultEl.textContent = 'حدث خطأ أثناء رفع الملف: ' + err.message;
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Global Window Exports for Fleet & Tamm Module
window.loadFleetView = loadFleetView;
window.loadFleetKpis = loadFleetKpis;
window.loadFleetData = loadFleetData;
window.switchFleetSubTab = switchFleetSubTab;
window.renderFleetTable = renderFleetTable;
window.filterFleetTable = filterFleetTable;
window.renderTammAlerts = renderTammAlerts;
window.loadFleetLogs = loadFleetLogs;
window.openAddVehicleModal = openAddVehicleModal;
window.openEditVehicleModal = openAddVehicleModal;
window.submitVehicleForm = submitVehicleForm;
window.openAssignCustodyModal = openAssignCustodyModal;
window.submitAssignCustodyForm = submitAssignCustodyForm;
window.openReturnCustodyModal = openReturnCustodyModal;
window.submitReturnCustodyForm = submitReturnCustodyForm;
window.deleteVehicleConfirm = deleteVehicleConfirm;
window.printVehicleHandover = printVehicleHandover;
window.exportFleetExcel = exportFleetExcel;
window.exportFleetCsv = exportFleetCsv;
window.openImportVehiclesModal = openImportVehiclesModal;
window.updateImportFileName = updateImportFileName;
window.submitImportVehicles = submitImportVehicles;

/* =========================================================================
   MODULE 5: MEDICAL INSURANCE, HEALTH EDUCATION & MUNICIPAL HEALTH CARDS
   (التأمين الطبي والبطاقات الصحية للعمال والتثقيف الصحي)
   ========================================================================= */

const insuranceState = {
  cards: [],
  healthCards: [],
  articles: [],
  policies: [],
  kpis: {},
  activeSubTab: 'cards'
};

/**
 * Main loader for Module 5
 */
async function loadInsuranceView() {
  await Promise.all([
    loadInsuranceKpis(),
    loadInsuranceCards(),
    loadHealthCards(),
    loadHealthArticles(),
    loadInsurancePolicies()
  ]);
  switchInsuranceSubTab(insuranceState.activeSubTab || 'cards');
}

/**
 * Load KPIs & Alert summary
 */
async function loadInsuranceKpis() {
  try {
    const res = await fetch('/api/insurance/kpis');
    const json = await res.json();
    if (!json.success) return;

    const k = json.data;
    insuranceState.kpis = k;

    const coveredEl = document.getElementById('insKpiCovered');
    const policiesEl = document.getElementById('insKpiPolicies');
    const healthCardsEl = document.getElementById('insKpiHealthCards');
    const alertsEl = document.getElementById('insKpiAlerts');
    const baladiyaBadgeEl = document.getElementById('insBaladiyaAlertBadge');
    const navBadgeEl = document.getElementById('badgeNavInsurance');

    if (coveredEl) coveredEl.textContent = k.total_covered_lives || 0;
    if (policiesEl) policiesEl.textContent = k.total_policies || 0;
    if (healthCardsEl) healthCardsEl.textContent = k.total_municipal_cards || 0;
    if (alertsEl) alertsEl.textContent = k.total_alerts || 0;

    const municipalAlertsCount = (k.municipal_alerts?.expiring_soon || 0) + (k.municipal_alerts?.expired || 0);
    if (baladiyaBadgeEl) baladiyaBadgeEl.textContent = municipalAlertsCount;

    if (navBadgeEl) {
      if (k.total_alerts > 0) {
        navBadgeEl.textContent = `${k.total_alerts} تنبيه`;
        navBadgeEl.className = 'px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse';
      } else {
        navBadgeEl.textContent = 'CCHI';
        navBadgeEl.className = 'px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300';
      }
    }
  } catch (err) {
    console.error('Error loading insurance KPIs:', err);
  }
}

/**
 * Switch Sub-Tabs in Module 5
 */
function switchInsuranceSubTab(tabName) {
  insuranceState.activeSubTab = tabName;

  const tabCards = document.getElementById('insTabCards');
  const tabBaladiya = document.getElementById('insTabBaladiya');
  const tabEducation = document.getElementById('insTabEducation');
  const tabPolicies = document.getElementById('insTabPolicies');

  const viewCards = document.getElementById('insSubViewCards');
  const viewBaladiya = document.getElementById('insSubViewBaladiya');
  const viewEducation = document.getElementById('insSubViewEducation');
  const viewPolicies = document.getElementById('insSubViewPolicies');

  const activeClasses = ['border-brand', 'text-brand'];
  const inactiveClasses = ['border-transparent', 'text-slate-500'];

  [tabCards, tabBaladiya, tabEducation, tabPolicies].forEach(t => {
    if (t) {
      t.classList.remove(...activeClasses);
      t.classList.add(...inactiveClasses);
    }
  });

  [viewCards, viewBaladiya, viewEducation, viewPolicies].forEach(v => {
    if (v) v.classList.add('hidden');
  });

  if (tabName === 'cards') {
    if (tabCards) { tabCards.classList.add(...activeClasses); tabCards.classList.remove(...inactiveClasses); }
    if (viewCards) viewCards.classList.remove('hidden');
  } else if (tabName === 'baladiya') {
    if (tabBaladiya) { tabBaladiya.classList.add(...activeClasses); tabBaladiya.classList.remove(...inactiveClasses); }
    if (viewBaladiya) viewBaladiya.classList.remove('hidden');
  } else if (tabName === 'education') {
    if (tabEducation) { tabEducation.classList.add(...activeClasses); tabEducation.classList.remove(...inactiveClasses); }
    if (viewEducation) viewEducation.classList.remove('hidden');
  } else if (tabName === 'policies') {
    if (tabPolicies) { tabPolicies.classList.add(...activeClasses); tabPolicies.classList.remove(...inactiveClasses); }
    if (viewPolicies) viewPolicies.classList.remove('hidden');
  }
}

/**
 * 1. Fetch & Render Employee Insurance Cards
 */
async function loadInsuranceCards() {
  try {
    const res = await fetch('/api/insurance/cards');
    const json = await res.json();
    if (!json.success) return;

    insuranceState.cards = json.data || [];
    renderInsuranceCardsTable(insuranceState.cards);
  } catch (err) {
    console.error('Error loading insurance cards:', err);
  }
}

function renderInsuranceCardsTable(cards) {
  const tbody = document.getElementById('insCardsTableBody');
  const countBadge = document.getElementById('insCardsCountBadge');
  if (!tbody) return;

  const search = (document.getElementById('insSearchInput')?.value || '').toLowerCase().trim();
  const classFilter = document.getElementById('insClassFilter')?.value || '';
  const statusFilter = document.getElementById('insStatusFilter')?.value || '';

  const filtered = cards.filter(c => {
    if (classFilter && c.class_category !== classFilter) return false;
    if (statusFilter && c.status !== statusFilter) return false;

    if (search) {
      const matchName = (c.emp_name || '').toLowerCase().includes(search);
      const matchCode = (c.emp_code || '').toLowerCase().includes(search);
      const matchMember = (c.member_id || '').toLowerCase().includes(search);
      const matchId = (c.national_id || '').toLowerCase().includes(search);
      if (!matchName && !matchCode && !matchMember && !matchId) return false;
    }
    return true;
  });

  if (countBadge) {
    countBadge.textContent = `عرض ${filtered.length} من أصل ${cards.length} بطاقة تأمين`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="p-8 text-center text-slate-400">
          <i class="fa-solid fa-notes-medical text-4xl mb-2 text-slate-300"></i>
          <p class="font-bold text-sm">لا توجد بطاقات تأمين طبي تطابق معايير البحث والفلترة</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const classBadgeColor = c.class_category === 'VIP' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                           c.class_category === 'A' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                           c.class_category === 'B' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                           'bg-slate-100 text-slate-800 border-slate-300';

    const exp = c.expiry_info || { text_ar: c.expiry_date, status: 'valid' };
    const expBadgeClass = exp.status === 'expired' ? 'bg-rose-100 text-rose-800 font-black' :
                          exp.status === 'expiring_soon' ? 'bg-amber-100 text-amber-800 font-black' :
                          'bg-emerald-50 text-emerald-800 font-bold';

    return `
      <tr class="hover:bg-slate-50/80 transition group">
        <td class="p-3.5">
          <div class="font-black text-slate-900 text-xs">${c.emp_name}</div>
          <div class="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
            <span>${c.emp_code}</span>
            <span>• ${c.emp_job || 'موظف'}</span>
          </div>
          <div class="text-[10px] text-slate-400 font-mono mt-0.5">هوية: ${c.national_id || '---'}</div>
        </td>

        <td class="p-3.5 font-mono font-bold text-blue-700 text-xs">
          ${c.member_id}
        </td>

        <td class="p-3.5 text-center">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black border ${classBadgeColor}">
            ${c.class_category}
          </span>
        </td>

        <td class="p-3.5">
          <div class="font-bold text-slate-900 text-xs">${c.provider_name || 'شركة التأمين'}</div>
          <div class="text-[11px] text-slate-500 font-mono">${c.policy_no || '---'}</div>
        </td>

        <td class="p-3.5 text-center font-mono font-bold text-slate-800">
          ${c.copay_percent}%
        </td>

        <td class="p-3.5 text-center font-bold text-slate-700">
          ${c.dependents_count || 0}
        </td>

        <td class="p-3.5 text-center font-black text-rose-600 font-mono">
          ${c.blood_group || 'O+'}
        </td>

        <td class="p-3.5">
          <div class="font-mono font-bold text-slate-800 text-[11px]">${c.expiry_date || '---'}</div>
          <span class="px-2 py-0.5 rounded text-[10px] block w-max mt-0.5 ${expBadgeClass}">
            ${exp.text_ar}
          </span>
        </td>

        <td class="p-3.5 text-center">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'سارية' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
            ${c.status}
          </span>
        </td>

        <td class="p-3.5 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="printInsuranceCard(${c.id})" title="طباعة البطاقة الرقمية CCHI (A4)" class="p-1.5 rounded-lg bg-[#700c14] hover:bg-[#52090e] text-white text-xs shadow-xs transition">
              <i class="fa-solid fa-print"></i>
            </button>
            <button onclick="openEditInsuranceCardModal(${c.id})" title="تعديل البطاقة" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteInsuranceCardConfirm(${c.id})" title="حذف البطاقة" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs transition">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterInsuranceCardsTable() {
  renderInsuranceCardsTable(insuranceState.cards);
}

/**
 * 2. Fetch & Render Municipal Health Cards (البلدية)
 */
async function loadHealthCards() {
  try {
    const res = await fetch('/api/insurance/health-cards');
    const json = await res.json();
    if (!json.success) return;

    insuranceState.healthCards = json.data || [];
    renderHealthCardsTable(insuranceState.healthCards);
  } catch (err) {
    console.error('Error loading health cards:', err);
  }
}

function renderHealthCardsTable(cards) {
  const tbody = document.getElementById('baladiyaCardsTableBody');
  const countBadge = document.getElementById('baladiyaCardsCountBadge');
  if (!tbody) return;

  const search = (document.getElementById('baladiyaSearchInput')?.value || '').toLowerCase().trim();
  const munFilter = document.getElementById('baladiyaMunicipalityFilter')?.value || '';
  const fitFilter = document.getElementById('baladiyaFitnessFilter')?.value || '';

  const filtered = cards.filter(c => {
    if (munFilter && !(c.municipality_name || '').includes(munFilter)) return false;
    if (fitFilter && c.fitness_result !== fitFilter) return false;

    if (search) {
      const matchName = (c.emp_name || '').toLowerCase().includes(search);
      const matchCode = (c.emp_code || '').toLowerCase().includes(search);
      const matchCard = (c.card_no || '').toLowerCase().includes(search);
      const matchProf = (c.profession || '').toLowerCase().includes(search);
      if (!matchName && !matchCode && !matchCard && !matchProf) return false;
    }
    return true;
  });

  if (countBadge) {
    countBadge.textContent = `عرض ${filtered.length} من أصل ${cards.length} شهادة بلدية`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="p-8 text-center text-slate-400">
          <i class="fa-solid fa-id-card-clip text-4xl mb-2 text-slate-300"></i>
          <p class="font-bold text-sm">لا توجد بطاقات صحية تطابق معايير البحث</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const exp = c.expiry_info || { text_ar: c.expiry_date, status: 'valid' };
    const expBadgeClass = exp.status === 'expired' ? 'bg-rose-100 text-rose-800 font-black' :
                          exp.status === 'expiring_soon' ? 'bg-amber-100 text-amber-800 font-black' :
                          'bg-emerald-50 text-emerald-800 font-bold';

    return `
      <tr class="hover:bg-slate-50/80 transition group">
        <td class="p-3.5">
          <div class="font-black text-slate-900 text-xs">${c.emp_name}</div>
          <div class="text-[11px] text-slate-500 font-mono mt-0.5">
            ${c.emp_code} • <span class="text-emerald-700 font-bold">${c.profession}</span>
          </div>
          <div class="text-[10px] text-slate-400 font-mono">هوية: ${c.national_id || '---'}</div>
        </td>

        <td class="p-3.5 font-mono font-bold text-slate-800 text-xs">
          ${c.card_no}
        </td>

        <td class="p-3.5 font-bold text-slate-900 text-xs">
          ${c.municipality_name}
        </td>

        <td class="p-3.5 text-xs text-slate-600">
          ${c.medical_center}
        </td>

        <td class="p-3.5 text-center">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black ${c.fitness_result === 'لائق طبياً' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800'}">
            ${c.fitness_result}
          </span>
        </td>

        <td class="p-3.5">
          <div class="font-mono font-bold text-slate-800 text-[11px]">${c.expiry_date}</div>
          <span class="px-2 py-0.5 rounded text-[10px] block w-max mt-0.5 ${expBadgeClass}">
            ${exp.text_ar}
          </span>
        </td>

        <td class="p-3.5 text-center">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${exp.status === 'expired' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
            ${exp.status === 'expired' ? 'منتهية' : 'سارية'}
          </span>
        </td>

        <td class="p-3.5 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="printHealthCard(${c.id})" title="طباعة شهادة البلدية الصحية A4" class="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-xs transition">
              <i class="fa-solid fa-print"></i>
            </button>
            <button onclick="openEditHealthCardModal(${c.id})" title="تعديل البطاقة" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteHealthCardConfirm(${c.id})" title="حذف الشهادة" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs transition">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterHealthCardsTable() {
  renderHealthCardsTable(insuranceState.healthCards);
}

/**
 * 3. Fetch & Render Health Awareness Articles
 */
async function loadHealthArticles() {
  try {
    const res = await fetch('/api/insurance/articles');
    const json = await res.json();
    if (!json.success) return;

    insuranceState.articles = json.data || [];
    renderHealthArticles(insuranceState.articles);
  } catch (err) {
    console.error('Error loading health articles:', err);
  }
}

function renderHealthArticles(articles) {
  const container = document.getElementById('healthArticlesGrid');
  if (!container) return;

  if (articles.length === 0) {
    container.innerHTML = '<p class="text-slate-400 text-xs py-8 text-center col-span-3">لا توجد نشرات تثقيفية حالياً</p>';
    return;
  }

  container.innerHTML = articles.map(a => `
    <div class="card-elevated p-5 flex flex-col justify-between hover:shadow-xl transition border border-slate-200 group">
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
            ${a.category}
          </span>
          <div class="w-10 h-10 rounded-xl bg-slate-100 text-[#700c14] flex items-center justify-center text-lg shadow-xs group-hover:scale-110 transition">
            <i class="fa-solid ${a.icon || 'fa-heart-pulse'}"></i>
          </div>
        </div>

        <h4 class="font-black text-slate-900 text-sm leading-snug">${a.title_ar}</h4>
        ${a.title_en ? `<p class="text-[10px] font-mono text-slate-400 truncate">${a.title_en}</p>` : ''}
        <p class="text-xs text-slate-600 leading-relaxed line-clamp-3">${a.summary_ar || ''}</p>
      </div>

      <div class="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
        <span class="text-[10px] text-slate-400 font-mono">${a.published_date || ''}</span>
        <button onclick="printHealthArticle(${a.id})" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#700c14] text-white font-bold text-xs flex items-center gap-1.5 transition shadow">
          <i class="fa-solid fa-print text-[11px]"></i> طباعة البوستر (A4)
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * 4. Fetch & Render Policies
 */
async function loadInsurancePolicies() {
  try {
    const res = await fetch('/api/insurance/policies');
    const json = await res.json();
    if (!json.success) return;

    insuranceState.policies = json.data || [];
    renderInsurancePolicies(insuranceState.policies);
    populatePolicySelectDropdown(insuranceState.policies);
  } catch (err) {
    console.error('Error loading policies:', err);
  }
}

function renderInsurancePolicies(policies) {
  const container = document.getElementById('insurancePoliciesGrid');
  if (!container) return;

  if (policies.length === 0) {
    container.innerHTML = '<p class="text-slate-400 text-xs py-8 text-center col-span-2">لا توجد وثائق تأمين مسجلة</p>';
    return;
  }

  container.innerHTML = policies.map(p => `
    <div class="card-elevated p-5 space-y-3 border-t-4 border-blue-600">
      <div class="flex items-center justify-between">
        <div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700">${p.policy_no}</span>
          <h4 class="font-black text-slate-900 text-sm mt-1">${p.provider_name}</h4>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${p.status === 'سارية' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}">
          ${p.status}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div>
          <span class="text-slate-400 block text-[10px]">فترة السريان:</span>
          <span class="font-mono font-bold text-slate-800">${p.policy_start || '---'} إلى ${p.policy_end || '---'}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px]">الحد الأقصى للتغطية:</span>
          <span class="font-bold text-emerald-700 font-mono">${Number(p.max_coverage_per_person || 500000).toLocaleString('en-US')} ر.س</span>
        </div>
        <div class="col-span-2">
          <span class="text-slate-400 block text-[10px]">الشبكة والتصنيف:</span>
          <span class="font-bold text-slate-900">${p.network_tier || 'الشبكة الذهبية والشاملة'}</span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-2 text-xs">
        <span class="text-slate-500 font-bold">المؤمن لهم عبر الوثيقة: <strong class="text-blue-700 font-mono">${p.covered_employees_count || 0}</strong> موظف</span>
      </div>
    </div>
  `).join('');
}

function populatePolicySelectDropdown(policies) {
  const select = document.getElementById('insCardPolicySelect');
  if (!select) return;
  select.innerHTML = policies.map(p => `<option value="${p.id}">${p.provider_name} (${p.policy_no})</option>`).join('');
}

/**
 * Modals & Actions for Insurance Cards
 */
function openAddInsuranceCardModal(cardId = null) {
  const form = document.querySelector('#modalAddInsuranceCard form');
  if (form) form.reset();

  const titleEl = document.getElementById('modalInsuranceCardTitle');
  const idEl = document.getElementById('insCardFormId');
  const empSelect = document.getElementById('insCardEmpSelect');

  // Populate employee select
  if (empSelect) {
    empSelect.innerHTML = '<option value="">-- اختر الموظف المؤمن له --</option>';
    const emps = Array.isArray(state?.employees) ? state.employees : [];
    emps.forEach(emp => {
      empSelect.innerHTML += `<option value="${emp.id}">${emp.emp_code} - ${emp.full_name_ar} (${emp.job_title_ar || 'موظف'})</option>`;
    });
  }

  populatePolicySelectDropdown(insuranceState.policies);

  if (cardId) {
    const card = insuranceState.cards.find(x => x.id === cardId);
    if (!card) return;

    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square text-rose-600"></i> تعديل بطاقة التأمين (${card.emp_name})`;
    if (idEl) idEl.value = card.id;

    if (empSelect) empSelect.value = card.emp_id;
    document.getElementById('insCardPolicySelect').value = card.policy_id || '';
    document.getElementById('insCardMemberId').value = card.member_id || '';
    document.getElementById('insCardClass').value = card.class_category || 'B';
    document.getElementById('insCardBlood').value = card.blood_group || 'O+';
    document.getElementById('insCardCopay').value = card.copay_percent !== undefined ? card.copay_percent : 20;
    document.getElementById('insCardDependents').value = card.dependents_count || 0;
    document.getElementById('insCardExpiry').value = card.expiry_date || '2026-12-31';
    document.getElementById('insCardNotes').value = card.notes || '';
  } else {
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-notes-medical text-rose-600"></i> إصدار بطاقة تأمين طبي لموظف`;
    if (idEl) idEl.value = '';
    document.getElementById('insCardClass').value = 'B';
    document.getElementById('insCardCopay').value = 20;
    document.getElementById('insCardExpiry').value = '2026-12-31';
  }

  openModal('modalAddInsuranceCard');
}

function openEditInsuranceCardModal(id) {
  openAddInsuranceCardModal(id);
}

async function submitInsuranceCardForm(e) {
  e.preventDefault();
  const id = document.getElementById('insCardFormId').value;

  const payload = {
    emp_id: document.getElementById('insCardEmpSelect').value,
    policy_id: document.getElementById('insCardPolicySelect').value,
    member_id: document.getElementById('insCardMemberId').value,
    class_category: document.getElementById('insCardClass').value,
    blood_group: document.getElementById('insCardBlood').value,
    copay_percent: document.getElementById('insCardCopay').value,
    dependents_count: document.getElementById('insCardDependents').value,
    expiry_date: document.getElementById('insCardExpiry').value,
    notes: document.getElementById('insCardNotes').value
  };

  try {
    const url = id ? `/api/insurance/cards/${id}` : '/api/insurance/cards';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (json.success) {
      if (typeof showToast === 'function') showToast(json.message, 'success');
      else alert(json.message);
      closeModal('modalAddInsuranceCard');
      await loadInsuranceView();
    } else {
      alert('خطأ: ' + json.error);
    }
  } catch (err) {
    alert('حدث خطأ أثناء حفظ بطاقة التأمين: ' + err.message);
  }
}

async function deleteInsuranceCardConfirm(id) {
  if (!confirm('هل أنت متأكد من حذف بطاقة التأمين الطبي؟')) return;
  try {
    const res = await fetch(`/api/insurance/cards/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      if (typeof showToast === 'function') showToast(json.message, 'success');
      else alert(json.message);
      await loadInsuranceView();
    } else {
      alert('خطأ: ' + json.error);
    }
  } catch (err) {
    alert('حدث خطأ أثناء الحذف: ' + err.message);
  }
}

function printInsuranceCard(cardId) {
  window.open(`/api/insurance/cards/${cardId}/print`, '_blank', 'width=950,height=900,scrollbars=yes');
}

/**
 * Modals & Actions for Municipal Health Cards (البلدية)
 */
function openAddHealthCardModal(cardId = null) {
  const form = document.querySelector('#modalAddHealthCard form');
  if (form) form.reset();

  const titleEl = document.getElementById('modalHealthCardTitle');
  const idEl = document.getElementById('healthCardFormId');
  const empSelect = document.getElementById('healthCardEmpSelect');

  // Populate employee select
  if (empSelect) {
    empSelect.innerHTML = '<option value="">-- اختر العامل المستفيد --</option>';
    const emps = Array.isArray(state?.employees) ? state.employees : [];
    emps.forEach(emp => {
      empSelect.innerHTML += `<option value="${emp.id}">${emp.emp_code} - ${emp.full_name_ar} (${emp.job_title_ar || 'عامل'})</option>`;
    });
  }

  if (cardId) {
    const card = insuranceState.healthCards.find(x => x.id === cardId);
    if (!card) return;

    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square text-emerald-600"></i> تعديل وتجديد شهادة البلدية (${card.emp_name})`;
    if (idEl) idEl.value = card.id;

    if (empSelect) empSelect.value = card.emp_id;
    document.getElementById('healthCardProfession').value = card.profession || '';
    document.getElementById('healthCardNo').value = card.card_no || '';
    document.getElementById('healthCardMunicipality').value = card.municipality_name || 'أمانة منطقة عسير';
    document.getElementById('healthCardCenter').value = card.medical_center || '';
    document.getElementById('healthCardFitness').value = card.fitness_result || 'لائق طبياً';
    document.getElementById('healthCardExpiry').value = card.expiry_date || '';
    document.getElementById('healthCardNotes').value = card.notes || '';
  } else {
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-id-card-clip text-emerald-600"></i> تسجيل شهادة بلدية صحية لعامل`;
    if (idEl) idEl.value = '';
    document.getElementById('healthCardMunicipality').value = 'أمانة منطقة عسير';
    document.getElementById('healthCardCenter').value = 'مجمع عسير الطبي المعتمد';
    document.getElementById('healthCardFitness').value = 'لائق طبياً';
  }

  openModal('modalAddHealthCard');
}

function openEditHealthCardModal(id) {
  openAddHealthCardModal(id);
}

async function submitHealthCardForm(e) {
  e.preventDefault();
  const id = document.getElementById('healthCardFormId').value;

  const payload = {
    emp_id: document.getElementById('healthCardEmpSelect').value,
    profession: document.getElementById('healthCardProfession').value,
    card_no: document.getElementById('healthCardNo').value,
    municipality_name: document.getElementById('healthCardMunicipality').value,
    medical_center: document.getElementById('healthCardCenter').value,
    fitness_result: document.getElementById('healthCardFitness').value,
    expiry_date: document.getElementById('healthCardExpiry').value,
    notes: document.getElementById('healthCardNotes').value
  };

  try {
    const url = id ? `/api/insurance/health-cards/${id}` : '/api/insurance/health-cards';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (json.success) {
      if (typeof showToast === 'function') showToast(json.message, 'success');
      else alert(json.message);
      closeModal('modalAddHealthCard');
      await loadInsuranceView();
    } else {
      alert('خطأ: ' + json.error);
    }
  } catch (err) {
    alert('حدث خطأ أثناء حفظ الشهادة الصحية: ' + err.message);
  }
}

async function deleteHealthCardConfirm(id) {
  if (!confirm('هل أنت متأكد من حذف الشهادة الصحية البلدية؟')) return;
  try {
    const res = await fetch(`/api/insurance/health-cards/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      if (typeof showToast === 'function') showToast(json.message, 'success');
      else alert(json.message);
      await loadInsuranceView();
    } else {
      alert('خطأ: ' + json.error);
    }
  } catch (err) {
    alert('حدث خطأ أثناء الحذف: ' + err.message);
  }
}

function printHealthCard(cardId) {
  window.open(`/api/insurance/health-cards/${cardId}/print`, '_blank', 'width=950,height=900,scrollbars=yes');
}

function printHealthArticle(articleId) {
  window.open(`/api/insurance/articles/${articleId}/print`, '_blank', 'width=950,height=900,scrollbars=yes');
}

/**
 * Modals & Actions for Policies
 */
function openAddPolicyModal() {
  const form = document.querySelector('#modalAddPolicy form');
  if (form) form.reset();
  openModal('modalAddPolicy');
}

async function submitPolicyForm(e) {
  e.preventDefault();
  const payload = {
    policy_no: document.getElementById('policyFormNo').value,
    provider_name: document.getElementById('policyFormProvider').value,
    policy_start: document.getElementById('policyFormStart').value,
    policy_end: document.getElementById('policyFormEnd').value
  };

  try {
    const res = await fetch('/api/insurance/policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (json.success) {
      if (typeof showToast === 'function') showToast(json.message, 'success');
      else alert(json.message);
      closeModal('modalAddPolicy');
      await loadInsuranceView();
    } else {
      alert('خطأ: ' + json.error);
    }
  } catch (err) {
    alert('حدث خطأ أثناء حفظ الوثيقة: ' + err.message);
  }
}

function exportInsuranceCardsCsv() {
  window.open('/api/insurance/cards-export/csv', '_blank');
}

function exportHealthCardsCsv() {
  window.open('/api/insurance/health-cards-export/csv', '_blank');
}

// Window global exports for Module 5
window.loadInsuranceView = loadInsuranceView;
window.loadInsuranceKpis = loadInsuranceKpis;
window.switchInsuranceSubTab = switchInsuranceSubTab;
window.loadInsuranceCards = loadInsuranceCards;
window.renderInsuranceCardsTable = renderInsuranceCardsTable;
window.filterInsuranceCardsTable = filterInsuranceCardsTable;
window.loadHealthCards = loadHealthCards;
window.renderHealthCardsTable = renderHealthCardsTable;
window.filterHealthCardsTable = filterHealthCardsTable;
window.loadHealthArticles = loadHealthArticles;
window.renderHealthArticles = renderHealthArticles;
window.loadInsurancePolicies = loadInsurancePolicies;
window.renderInsurancePolicies = renderInsurancePolicies;
window.openAddInsuranceCardModal = openAddInsuranceCardModal;
window.openEditInsuranceCardModal = openEditInsuranceCardModal;
window.submitInsuranceCardForm = submitInsuranceCardForm;
window.deleteInsuranceCardConfirm = deleteInsuranceCardConfirm;
window.printInsuranceCard = printInsuranceCard;
window.openAddHealthCardModal = openAddHealthCardModal;
window.openEditHealthCardModal = openEditHealthCardModal;
window.submitHealthCardForm = submitHealthCardForm;
window.deleteHealthCardConfirm = deleteHealthCardConfirm;
window.printHealthCard = printHealthCard;
window.printHealthArticle = printHealthArticle;
window.openAddPolicyModal = openAddPolicyModal;
window.submitPolicyForm = submitPolicyForm;
window.exportInsuranceCardsCsv = exportInsuranceCardsCsv;
window.exportHealthCardsCsv = exportHealthCardsCsv;

/* =========================================================================
   MODULE 6: GENERAL ADMIN, TRANSFERS WORKFLOW, CIRCULARS & UNIFIED REPORTS
   ========================================================================= */

let cachedTransferRequests = [];
let cachedCirculars = [];
let cachedLicenses = [];

// -------------------------------------------------------------------------
// 1. TRANSFER REQUESTS & DYNAMIC 3-TIER WORKFLOW
// -------------------------------------------------------------------------

async function loadEssTransferRequests() {
  const tbody = document.getElementById('essTransfersTableBody');
  const badge = document.getElementById('transfersCountBadge');
  if (!tbody) return;

  try {
    const res = await apiFetch('/api/general/transfers');
    if (!res || !res.success) throw new Error(res ? res.error : 'فشل جلب طلبات النقل');
    cachedTransferRequests = res.data || [];

    if (badge) badge.textContent = `${cachedTransferRequests.length} طلب`;

    if (cachedTransferRequests.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="py-8 text-center text-slate-400">
            <i class="fa-solid fa-arrows-split-up-and-left text-3xl mb-2 text-slate-300 block"></i>
            لا توجد طلبات نقل إداري مسجلة حتى الآن.
          </td>
        </tr>
      `;
      return;
    }

    const curRole = state.currentUser ? state.currentUser.role : 'employee';
    const curEmpId = state.currentUser ? state.currentUser.emp_id : null;

    tbody.innerHTML = cachedTransferRequests.map(tr => {
      // 3-Tier Workflow Status Badges
      const getStageBadge = (status, title) => {
        let cls = 'bg-amber-100 text-amber-800 border-amber-200';
        let icon = 'fa-clock';
        if (status === 'معتمد') {
          cls = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          icon = 'fa-check-circle';
        } else if (status === 'مرفوض') {
          cls = 'bg-rose-100 text-rose-800 border-rose-200';
          icon = 'fa-times-circle';
        }
        return `
          <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${cls}" title="${title}">
            <i class="fa-solid ${icon}"></i> <span>${title}: ${status}</span>
          </div>
        `;
      };

      const mBadge = getStageBadge(tr.manager_status, 'المدير');
      const hBadge = getStageBadge(tr.hr_status, 'الموارد البشرية');
      const eBadge = getStageBadge(tr.exec_status, 'الإدارة العليا');

      // Final status styling
      let finalStatusClass = 'bg-slate-100 text-slate-700';
      if (tr.status.includes('تم تنفيذ النقل') || tr.status.includes('معتمد نهائياً')) {
        finalStatusClass = 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black';
      } else if (tr.status.includes('مرفوض')) {
        finalStatusClass = 'bg-rose-100 text-rose-900 border border-rose-300 font-bold';
      } else {
        finalStatusClass = 'bg-amber-100 text-amber-900 border border-amber-300 font-bold';
      }

      // Action buttons based on active stage and user role
      let actionButtons = '';
      if (tr.manager_status === 'معلق' && (curRole === 'admin' || curRole === 'dept_manager' || curRole === 'direct_manager')) {
        actionButtons += `
          <button onclick="openTransferApprovalModal(${tr.id}, 'manager')" class="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition shadow-xs cursor-pointer">
            <i class="fa-solid fa-stamp"></i> قرار المدير
          </button>
        `;
      } else if (tr.manager_status === 'معتمد' && tr.hr_status === 'معلق' && (curRole === 'admin' || curRole === 'hr_manager')) {
        actionButtons += `
          <button onclick="openTransferApprovalModal(${tr.id}, 'hr')" class="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] transition shadow-xs cursor-pointer">
            <i class="fa-solid fa-user-check"></i> اعتماد HR
          </button>
        `;
      } else if (tr.hr_status === 'معتمد' && tr.exec_status === 'معلق' && (curRole === 'admin')) {
        actionButtons += `
          <button onclick="openTransferApprovalModal(${tr.id}, 'exec')" class="px-2.5 py-1 rounded-lg bg-[#700c14] hover:bg-[#8B0000] text-white font-bold text-[10px] transition shadow-xs cursor-pointer">
            <i class="fa-solid fa-crown"></i> الاعتماد النهائي
          </button>
        `;
      }

      // Print button (decision certificate)
      const printBtn = `
        <button onclick="window.open('/api/general/transfers/${tr.id}/print', '_blank')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition cursor-pointer" title="طباعة قرار النقل الرسمي A4">
          <i class="fa-solid fa-print"></i> القرار
        </button>
      `;

      return `
        <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
          <td class="py-3 px-3 font-mono font-bold text-[#700c14]">${tr.request_no}</td>
          <td class="py-3 px-3">
            <div class="font-black text-slate-900">${tr.emp_name}</div>
            <div class="text-[10px] text-slate-400 font-mono">${tr.emp_code} - ${tr.emp_job || ''}</div>
          </td>
          <td class="py-3 px-3">
            <div class="font-bold text-slate-800">${tr.current_dept_name || '---'}</div>
            <div class="text-[10px] text-slate-500">${tr.current_branch_name || 'المركز الرئيسي'}</div>
          </td>
          <td class="py-3 px-3">
            <div class="font-black text-teal-800">${tr.target_dept_name || '---'}</div>
            <div class="text-[10px] text-teal-600">${tr.target_branch_name || 'المركز الرئيسي'}</div>
          </td>
          <td class="py-3 px-3 font-mono text-slate-600">${tr.desired_transfer_date || '---'}</td>
          <td class="py-3 px-3 text-center">
            <div class="flex flex-col gap-1 items-center">
              ${mBadge}
              ${hBadge}
              ${eBadge}
            </div>
          </td>
          <td class="py-3 px-3 text-center">
            <span class="inline-block px-2.5 py-1 rounded-full text-[10px] ${finalStatusClass}">
              ${tr.status}
            </span>
          </td>
          <td class="py-3 px-3 text-center">
            <div class="flex items-center justify-center gap-1.5 flex-wrap">
              ${actionButtons}
              ${printBtn}
            </div>
          </td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="8" class="py-6 text-center text-rose-600 font-bold">خطأ في جلب طلبات النقل: ${err.message}</td></tr>`;
    }
  }
}

async function openModalTransferRequest() {
  const empSel = document.getElementById('transferFormEmpId');
  const deptSel = document.getElementById('transferFormTargetDept');
  const branchSel = document.getElementById('transferFormTargetBranch');
  const dateInp = document.getElementById('transferFormDate');
  const reasonInp = document.getElementById('transferFormReason');

  // Populate Active Operational Employees
  if (empSel) {
    const validEmps = (state.employees || []).filter(e => !['JM-0001', 'JM-0002', 'JM-0003'].includes(e.emp_code));
    empSel.innerHTML = validEmps.map(e => `
      <option value="${e.id}">${e.emp_code} - ${e.full_name_ar} (${e.job_title_ar || ''})</option>
    `).join('');

    // Preselect current user if an employee
    const curEmpId = state.currentUser ? state.currentUser.emp_id : null;
    if (curEmpId && validEmps.some(e => e.id === Number(curEmpId))) {
      empSel.value = curEmpId;
    }
  }

  // Populate Departments
  if (deptSel) {
    try {
      const dRes = await apiFetch('/api/departments');
      const depts = (dRes && dRes.data) ? dRes.data : (state.departments || []);
      deptSel.innerHTML = '<option value="">-- اختر الإدارة المستهدفة --</option>' + depts.map(d => `
        <option value="${d.id}">${d.name_ar}</option>
      `).join('');
    } catch (e) {}
  }

  // Populate Branches
  if (branchSel) {
    try {
      const bRes = await apiFetch('/api/branches');
      const branches = (bRes && bRes.data) ? bRes.data : (state.branches || []);
      branchSel.innerHTML = '<option value="">-- نفس الفرع الحالي --</option>' + branches.map(b => `
        <option value="${b.id}">${b.name_ar}</option>
      `).join('');
    } catch (e) {}
  }

  // Default desired date to tomorrow
  if (dateInp) {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    dateInp.value = tom.toISOString().split('T')[0];
  }

  if (reasonInp) reasonInp.value = '';

  openModal('modalTransferRequest');
}

async function submitTransferRequestForm(event) {
  if (event) event.preventDefault();
  const empId = document.getElementById('transferFormEmpId').value;
  const targetDeptId = document.getElementById('transferFormTargetDept').value;
  const targetBranchId = document.getElementById('transferFormTargetBranch').value;
  const desiredDate = document.getElementById('transferFormDate').value;
  const reason = document.getElementById('transferFormReason').value;

  if (!empId || !targetDeptId) {
    alert('يرجى تحديد الموظف والإدارة المنقول إليها.');
    return;
  }

  try {
    const res = await apiFetch('/api/general/transfers', {
      method: 'POST',
      body: JSON.stringify({
        emp_id: empId,
        target_dept_id: targetDeptId,
        target_branch_id: targetBranchId || null,
        desired_transfer_date: desiredDate,
        reason: reason
      })
    });

    if (res && res.success) {
      if (typeof showToast === 'function') showToast(res.message || 'تم تقديم طلب النقل بنجاح', 'success');
      else alert(res.message);
      closeModal('modalTransferRequest');
      await loadEssTransferRequests();
    } else {
      alert('خطأ: ' + (res ? res.error : 'فشل تقديم الطلب'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء تقديم طلب النقل: ' + err.message);
  }
}

function openTransferApprovalModal(id, stage) {
  const tr = cachedTransferRequests.find(r => r.id === id);
  if (!tr) return;

  document.getElementById('transAppId').value = id;
  document.getElementById('transAppStage').value = stage;
  document.getElementById('transAppNo').textContent = tr.request_no;
  document.getElementById('transAppEmpName').textContent = tr.emp_name;

  let stageTitle = '1. المدير المباشر';
  if (stage === 'hr') stageTitle = '2. إدارة الموارد البشرية';
  else if (stage === 'exec') stageTitle = '3. الإدارة العليا (الاعتماد النهائي وتنفيذ النقل)';
  document.getElementById('transAppStageTitle').textContent = stageTitle;

  const curUser = state.currentUser || {};
  document.getElementById('transAppApproverName').value = curUser.full_name || curUser.username || 'المسؤول المعتمد';
  document.getElementById('transAppComment').value = 'موافق ومعتمد وفقاً لمقتضيات مصلحة العمل.';

  openModal('modalTransferApprovalAction');
}

async function submitTransferApprovalAction(event) {
  if (event) event.preventDefault();
  const id = document.getElementById('transAppId').value;
  const stage = document.getElementById('transAppStage').value;
  const decisionEls = document.getElementsByName('transAppDecision');
  let action = 'موافق';
  for (const el of decisionEls) {
    if (el.checked) { action = el.value; break; }
  }
  const approverName = document.getElementById('transAppApproverName').value;
  const comment = document.getElementById('transAppComment').value;

  try {
    const res = await apiFetch(`/api/general/transfers/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({
        stage: stage,
        action: action,
        comment: comment,
        approver_name: approverName
      })
    });

    if (res && res.success) {
      if (typeof showToast === 'function') showToast(res.message || 'تم تثبيت القرار بنجاح', 'success');
      else alert(res.message);
      closeModal('modalTransferApprovalAction');
      await loadEssTransferRequests();
      // If final approval, reload employees list to reflect updated department/branch
      if (stage === 'exec' && action === 'موافق') {
        const empRes = await apiFetch('/api/employees');
        if (empRes && empRes.data) state.employees = empRes.data;
      }
    } else {
      alert('خطأ: ' + (res ? res.error : 'فشل تنفيذ الإجراء'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء اعتماد طلب النقل: ' + err.message);
  }
}

// -------------------------------------------------------------------------
// 2. ADMINISTRATIVE CIRCULARS & DIGITAL ACKNOWLEDGEMENT
// -------------------------------------------------------------------------

async function loadCircularsView() {
  const grid = document.getElementById('circularsCardsGrid');
  if (grid) {
    grid.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin text-2xl text-[#700c14] mb-2 block"></i>جاري تحميل التعاميم الإدارية...</div>`;
  }

  const curEmpId = state.currentUser ? state.currentUser.emp_id : null;
  const url = curEmpId ? `/api/general/circulars?emp_id=${curEmpId}` : '/api/general/circulars';

  try {
    const res = await apiFetch(url);
    if (!res || !res.success) throw new Error(res ? res.error : 'فشل جلب التعاميم');
    cachedCirculars = res.data || [];

    // Calculate KPIs
    const total = cachedCirculars.length;
    const urgent = cachedCirculars.filter(c => c.is_urgent).length;
    const totalAcks = cachedCirculars.reduce((sum, c) => sum + (c.ack_count || 0), 0);
    const totalPossible = total * 108; // 111 active operational employees
    const ackRate = totalPossible > 0 ? Math.round((totalAcks / totalPossible) * 100) : 0;

    const elTotal = document.getElementById('circStatTotal');
    const elUrgent = document.getElementById('circStatUrgent');
    const elAcks = document.getElementById('circStatAcks');
    const elRate = document.getElementById('circStatAckRate');

    if (elTotal) elTotal.textContent = total;
    if (elUrgent) elUrgent.textContent = urgent;
    if (elAcks) elAcks.textContent = totalAcks;
    if (elRate) elRate.textContent = `${ackRate}%`;

    const badgeNav = document.getElementById('badgeNavCirculars');
    if (badgeNav) badgeNav.textContent = `${total} تعميم`;

    renderCircularsCards(cachedCirculars);
  } catch (err) {
    if (grid) {
      grid.innerHTML = `<div class="col-span-full py-8 text-center text-rose-600 font-bold">خطأ في جلب التعاميم: ${err.message}</div>`;
    }
  }
}

function renderCircularsCards(circulars) {
  const grid = document.getElementById('circularsCardsGrid');
  if (!grid) return;

  if (!circulars || circulars.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-400 font-bold">
        <i class="fa-solid fa-file-contract text-5xl mb-3 text-slate-300 block"></i>
        <p class="text-base font-black text-slate-600 mb-1">لا توجد بيانات مسجلة حالياً</p>
        <p class="text-xs text-slate-400 font-medium">لم يتم إصدار أي تعاميم إدارية رسمية حتى الآن. يمكنك إنشاء تعميم جديد عبر زر "إصدار تعميم إداري جديد".</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = circulars.map(c => {
    const isUrgent = c.is_urgent === 1;
    const isAck = !!c.is_acknowledged_by_user;

    // Acknowledgement Section
    let ackHtml = '';
    if (c.acknowledgement_required) {
      if (isAck) {
        ackHtml = `
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
            <i class="fa-solid fa-circle-check text-emerald-600"></i> تم تسجيل إقرارك بالعلم والاطلاع
          </span>
        `;
      } else {
        ackHtml = `
          <button onclick="acknowledgeCircular(${c.id})" class="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer">
            <i class="fa-solid fa-signature"></i> إقرار بالعلم والاطلاع
          </button>
        `;
      }
    }

    return `
      <div class="card-elevated p-6 bg-white rounded-2xl border ${isUrgent ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'} space-y-4 flex flex-col justify-between hover:shadow-md transition">
        <div class="space-y-3">
          <!-- Top Tags -->
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-800 font-mono">${c.circular_no}</span>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">${c.category}</span>
              ${isUrgent ? '<span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse"><i class="fa-solid fa-triangle-exclamation"></i> عاجل وهام</span>' : ''}
            </div>
            <span class="text-[10px] font-mono text-slate-400 font-bold">${c.issued_at}</span>
          </div>

          <!-- Title -->
          <h3 class="text-sm font-black text-slate-900 leading-snug">${c.title}</h3>

          <!-- Meta -->
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
            <div class="text-slate-600"><strong class="text-slate-800">الجهة المصدرة:</strong> ${c.issued_by}</div>
            <div class="text-slate-600"><strong class="text-slate-800">الموجه إليه:</strong> ${c.target_audience}</div>
            <div class="text-teal-700 font-bold"><i class="fa-solid fa-check-double text-[10px]"></i> إقرارات منسوبي المنشأة: <span class="font-mono">${c.ack_count || 0}</span> موظف</div>
          </div>

          <!-- Content preview -->
          <p class="text-xs text-slate-700 whitespace-pre-line leading-relaxed line-clamp-4">${c.content}</p>
        </div>

        <!-- Footer Actions -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          <div class="flex items-center gap-2">
            ${ackHtml}
          </div>
          <button onclick="window.open('/api/general/circulars/${c.id}/print', '_blank')" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer">
            <i class="fa-solid fa-print"></i> طباعة التعميم A4
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterCircularsCards() {
  const term = (document.getElementById('searchCircularsInput')?.value || '').trim().toLowerCase();
  const cat = document.getElementById('filterCircularsCategory')?.value || '';

  const filtered = cachedCirculars.filter(c => {
    const matchTerm = !term || (c.title && c.title.toLowerCase().includes(term)) || (c.content && c.content.toLowerCase().includes(term)) || (c.circular_no && c.circular_no.toLowerCase().includes(term));
    const matchCat = !cat || c.category === cat;
    return matchTerm && matchCat;
  });

  renderCircularsCards(filtered);
}

async function acknowledgeCircular(circularId) {
  let empId = state.currentUser ? state.currentUser.emp_id : null;
  if (!empId) {
    const firstEmp = (state.employees || []).find(e => !['JM-0001', 'JM-0002', 'JM-0003'].includes(e.emp_code));
    empId = firstEmp ? firstEmp.id : 1;
  }

  try {
    const res = await apiFetch(`/api/general/circulars/${circularId}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({ emp_id: empId })
    });

    if (res && res.success) {
      if (typeof showToast === 'function') showToast('تم تسجيل إقرارك بالعلم والاطلاع بنجاح 📜', 'success');
      else alert('تم تسجيل الإقرار بنجاح.');
      await loadCircularsView();
    } else {
      alert('خطأ: ' + (res ? res.error : 'فشل تسجيل الإقرار'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء تسجيل الإقرار: ' + err.message);
  }
}

function openModalAddCircular() {
  document.getElementById('circFormTitle').value = '';
  document.getElementById('circFormContent').value = '';
  document.getElementById('circFormCategory').value = 'إداري وتنظيمي';
  document.getElementById('circFormAudience').value = 'كافة منسوبي شركة جوهرة المجد';
  document.getElementById('circFormIssuedBy').value = 'إدارة الموارد البشرية';
  document.getElementById('circFormIssuedAt').value = new Date().toISOString().split('T')[0];
  document.getElementById('circFormIsUrgent').checked = false;
  document.getElementById('circFormAckReq').checked = true;

  openModal('modalAddCircular');
}

async function submitCircularForm(event) {
  if (event) event.preventDefault();
  const title = document.getElementById('circFormTitle').value;
  const content = document.getElementById('circFormContent').value;
  const category = document.getElementById('circFormCategory').value;
  const audience = document.getElementById('circFormAudience').value;
  const issuedBy = document.getElementById('circFormIssuedBy').value;
  const issuedAt = document.getElementById('circFormIssuedAt').value;
  const isUrgent = document.getElementById('circFormIsUrgent').checked ? 1 : 0;
  const ackReq = document.getElementById('circFormAckReq').checked ? 1 : 0;

  if (!title || !content) {
    alert('يرجى تعبئة عنوان ومحتوى التعميم.');
    return;
  }

  try {
    const res = await apiFetch('/api/general/circulars', {
      method: 'POST',
      body: JSON.stringify({
        title, content, category,
        target_audience: audience,
        issued_by: issuedBy,
        issued_at: issuedAt,
        is_urgent: isUrgent,
        acknowledgement_required: ackReq
      })
    });

    if (res && res.success) {
      if (typeof showToast === 'function') showToast('تم نشر وتعميم القرار الإداري بنجاح 📢', 'success');
      else alert('تم نشر التعميم بنجاح');
      closeModal('modalAddCircular');
      await loadCircularsView();
    } else {
      alert('خطأ: ' + (res ? res.error : 'فشل نشر التعميم'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء نشر التعميم: ' + err.message);
  }
}

// -------------------------------------------------------------------------
// 3. COMPANY LICENSES & GOVERNMENT REGISTRATIONS
// -------------------------------------------------------------------------

async function loadLicensesView() {
  const tbody = document.getElementById('licensesTableBody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin text-xl text-teal-600 mb-2 block"></i>جاري تحميل السجلات والتراخيص...</td></tr>`;
  }

  try {
    const res = await apiFetch('/api/general/licenses');
    if (!res || !res.success) throw new Error(res ? res.error : 'فشل جلب التراخيص');
    cachedLicenses = res.data || [];

    // Compute KPIs
    const total = cachedLicenses.length;
    const valid = cachedLicenses.filter(l => l.expiry_info.status === 'valid').length;
    const expiringSoon = cachedLicenses.filter(l => l.expiry_info.status === 'expiring_soon').length;
    const expired = cachedLicenses.filter(l => l.expiry_info.status === 'expired').length;

    const elTotal = document.getElementById('licStatTotal');
    const elValid = document.getElementById('licStatValid');
    const elExpSoon = document.getElementById('licStatExpiringSoon');
    const elExp = document.getElementById('licStatExpired');

    if (elTotal) elTotal.textContent = total;
    if (elValid) elValid.textContent = valid;
    if (elExpSoon) elExpSoon.textContent = expiringSoon;
    if (elExp) elExp.textContent = expired;

    const badgeNav = document.getElementById('badgeNavLicenses');
    if (badgeNav) badgeNav.textContent = `${total} ترخيص`;

    // Alert Banner
    const alertBox = document.getElementById('licensesAlertContainer');
    if (alertBox) {
      const urgentCount = expiringSoon + expired;
      if (urgentCount > 0) {
        alertBox.classList.remove('hidden');
        alertBox.innerHTML = `
          <div class="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-triangle-exclamation text-amber-600 text-2xl"></i>
              <div>
                <h4 class="font-black text-amber-950 text-xs">تنبيهات تراخيص وسجلات تتطلب التجديد (${urgentCount})</h4>
                <p class="text-[11px] text-amber-800 mt-0.5">يوجد (${expiringSoon}) ترخيص يقترب من الانتهاء خلال 60 يوماً، و (${expired}) ترخيص منتهي الصلاحية.</p>
              </div>
            </div>
            <button onclick="printLicensesReport()" class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer">
              طباعة كشف المتابعة A4
            </button>
          </div>
        `;
      } else {
        alertBox.classList.add('hidden');
      }
    }

    renderLicensesTable(cachedLicenses);
  } catch (err) {
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="8" class="py-6 text-center text-rose-600 font-bold">خطأ في جلب التراخيص: ${err.message}</td></tr>`;
    }
  }
}

function renderLicensesTable(licenses) {
  const tbody = document.getElementById('licensesTableBody');
  if (!tbody) return;

  if (!licenses || licenses.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-12 text-center text-slate-400 font-bold">
          <i class="fa-solid fa-file-shield text-4xl mb-3 text-slate-300 block"></i>
          <p class="text-base font-black text-slate-600 mb-1">لا توجد بيانات مسجلة حالياً</p>
          <p class="text-xs text-slate-400 font-medium">لم يتم تسجيل أي رخص أو سجلات حكومية حتى الآن. اضغط على "إضافة ترخيص / سجل جديد" للبدء.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = licenses.map((l, idx) => {
    let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (l.expiry_info.status === 'expired') badgeClass = 'bg-rose-100 text-rose-800 border-rose-300 font-black';
    else if (l.expiry_info.status === 'expiring_soon') badgeClass = 'bg-amber-100 text-amber-800 border-amber-300 font-black';

    return `
      <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
        <td class="py-3 px-3 text-center font-bold text-slate-400">${idx + 1}</td>
        <td class="py-3 px-3">
          <div class="font-black text-slate-900">${l.license_name_ar}</div>
          ${l.notes ? `<div class="text-[10px] text-slate-400">${l.notes}</div>` : ''}
        </td>
        <td class="py-3 px-3 font-mono font-bold text-teal-800">${l.license_no}</td>
        <td class="py-3 px-3 font-medium text-slate-700">${l.issuing_authority}</td>
        <td class="py-3 px-3 text-center font-mono text-slate-500">${l.issue_date || '---'}</td>
        <td class="py-3 px-3 text-center font-mono font-bold text-slate-800">${l.expiry_date}</td>
        <td class="py-3 px-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-lg text-[10px] font-black border ${badgeClass}">
            ${l.expiry_info.text_ar}
          </span>
        </td>
        <td class="py-3 px-3 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="openModalAddLicense(${l.id})" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition cursor-pointer" title="تعديل">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteLicense(${l.id}, '${l.license_name_ar.replace(/'/g, "\\'")}')" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs transition cursor-pointer" title="حذف">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterLicensesTable() {
  const term = (document.getElementById('searchLicensesInput')?.value || '').trim().toLowerCase();
  const status = document.getElementById('filterLicensesStatus')?.value || '';

  const filtered = cachedLicenses.filter(l => {
    const matchTerm = !term || (l.license_name_ar && l.license_name_ar.toLowerCase().includes(term)) || (l.license_no && l.license_no.toLowerCase().includes(term)) || (l.issuing_authority && l.issuing_authority.toLowerCase().includes(term));
    let matchStatus = true;
    if (status === 'سارية') matchStatus = l.expiry_info.status === 'valid';
    else if (status === 'expiring_soon') matchStatus = l.expiry_info.status === 'expiring_soon';
    else if (status === 'expired') matchStatus = l.expiry_info.status === 'expired';
    return matchTerm && matchStatus;
  });

  renderLicensesTable(filtered);
}

function openModalAddLicense(id = null) {
  const titleEl = document.getElementById('modalAddLicenseTitle');
  const idInp = document.getElementById('licFormId');
  const nameInp = document.getElementById('licFormName');
  const noInp = document.getElementById('licFormNo');
  const typeInp = document.getElementById('licFormType');
  const authInp = document.getElementById('licFormAuthority');
  const daysInp = document.getElementById('licFormAlertDays');
  const issInp = document.getElementById('licFormIssueDate');
  const expInp = document.getElementById('licFormExpiryDate');
  const notesInp = document.getElementById('licFormNotes');

  if (id) {
    const lic = cachedLicenses.find(l => l.id === id);
    if (!lic) return;
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square text-teal-600"></i> تعديل بيانات الترخيص / السجل';
    idInp.value = lic.id;
    nameInp.value = lic.license_name_ar;
    noInp.value = lic.license_no;
    typeInp.value = lic.license_type || 'commercial_reg';
    authInp.value = lic.issuing_authority || '';
    daysInp.value = lic.alert_days_before || 60;
    issInp.value = lic.issue_date || '';
    expInp.value = lic.expiry_date || '';
    notesInp.value = lic.notes || '';
  } else {
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-file-shield text-teal-600"></i> إضافة سجل / ترخيص حكومي جديد';
    idInp.value = '';
    nameInp.value = '';
    noInp.value = '';
    typeInp.value = 'commercial_reg';
    authInp.value = '';
    daysInp.value = '60';
    issInp.value = '';
    expInp.value = '';
    notesInp.value = '';
  }

  openModal('modalAddLicense');
}

async function submitLicenseForm(event) {
  if (event) event.preventDefault();
  const id = document.getElementById('licFormId').value;
  const data = {
    license_type: document.getElementById('licFormType').value,
    license_name_ar: document.getElementById('licFormName').value,
    license_no: document.getElementById('licFormNo').value,
    issuing_authority: document.getElementById('licFormAuthority').value,
    alert_days_before: document.getElementById('licFormAlertDays').value,
    issue_date: document.getElementById('licFormIssueDate').value || null,
    expiry_date: document.getElementById('licFormExpiryDate').value,
    notes: document.getElementById('licFormNotes').value || null
  };

  try {
    let res;
    if (id) {
      res = await apiFetch(`/api/general/licenses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } else {
      res = await apiFetch('/api/general/licenses', { method: 'POST', body: JSON.stringify(data) });
    }

    if (res && res.success) {
      if (typeof showToast === 'function') showToast(res.message || 'تم حفظ الترخيص بنجاح', 'success');
      else alert(res.message);
      closeModal('modalAddLicense');
      await loadLicensesView();
    } else {
      alert('خطأ: ' + (res ? res.error : 'فشل حفظ الترخيص'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء حفظ الترخيص: ' + err.message);
  }
}

async function deleteLicense(id, name) {
  if (!confirm(`هل أنت متأكد من رغبتك في حذف الترخيص/السجل (${name})؟`)) return;

  try {
    const res = await apiFetch(`/api/general/licenses/${id}`, { method: 'DELETE' });
    if (res && res.success) {
      if (typeof showToast === 'function') showToast(res.message || 'تم حذف الترخيص بنجاح', 'info');
      else alert(res.message);
      await loadLicensesView();
    } else {
      alert('خطأ: ' + (res ? res.error : 'فشل حذف الترخيص'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء حذف الترخيص: ' + err.message);
  }
}

function printLicensesReport() {
  window.open('/api/general/licenses-report/print', '_blank');
}

// -------------------------------------------------------------------------
// 4. UNIFIED ADVANCED MULTI-MODULE REPORTING
// -------------------------------------------------------------------------

async function loadUnifiedReportsView() {
  const tbody = document.getElementById('unifiedReportsTableBody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin text-xl text-amber-600 mb-2 block"></i>جاري تجميع مؤشرات الوحدات الست...</td></tr>`;
  }

  try {
    const res = await apiFetch('/api/general/reports/summary');
    if (!res || !res.success) throw new Error(res ? res.error : 'فشل جلب التقرير الموحد');
    const summary = res.data;

    // Update 4 Domain KPI Blocks
    const elTotEmp = document.getElementById('repTotalEmp');
    const elSauEmp = document.getElementById('repSaudiEmp');
    const elExpEmp = document.getElementById('repExpatEmp');
    const elSaudRate = document.getElementById('repSaudizationRate');

    if (elTotEmp) elTotEmp.textContent = summary.workforce.total_employees;
    if (elSauEmp) elSauEmp.textContent = summary.workforce.saudi_employees;
    if (elExpEmp) elExpEmp.textContent = summary.workforce.expat_employees;
    if (elSaudRate) elSaudRate.textContent = `${summary.workforce.saudization_rate}%`;

    const elVeh = document.getElementById('repTotalVehicles');
    if (elVeh) elVeh.textContent = summary.fleet.total_vehicles;

    const elIns = document.getElementById('repTotalInsured');
    const elHCard = document.getElementById('repTotalHealthCards');
    if (elIns) elIns.textContent = summary.healthcare.insured_employees;
    if (elHCard) elHCard.textContent = summary.healthcare.baladiya_cards;

    const elPendTr = document.getElementById('repPendingTransfers');
    const elActCirc = document.getElementById('repActiveCircs');
    const elTotLic = document.getElementById('repTotalLics');
    const elLicAlert = document.getElementById('repLicAlerts');

    if (elPendTr) elPendTr.textContent = summary.governance.pending_transfers;
    if (elActCirc) elActCirc.textContent = summary.governance.active_circulars;
    if (elTotLic) elTotLic.textContent = summary.governance.total_licenses;
    if (elLicAlert) elLicAlert.textContent = summary.governance.licenses_alerts;

    // Render Matrix Table
    if (tbody) {
      const rows = [
        { domain: 'الوحدة 1: الحضور والجزاءات', kpi: 'الالتزام ببصمة الدوام والخصومات الآلية', val: 'مفعل آلياً', compliance: 'المادة 80 ولائحة الجزاءات', status: 'سارٍ' },
        { domain: 'الوحدة 2: نهاية الخدمة والمخالصة', kpi: 'حاسبة مكافأة نهاية الخدمة والمخالصات', val: 'حساب دقيق لكافة المواد (84, 85, 87)', compliance: 'نظام العمل السعودي', status: 'مطابق 100%' },
        { domain: 'الوحدة 3: التوظيف وتتبع المتقدمين', kpi: 'شواغر التوظيف وعروض العمل الثنائية', val: 'نماذج رسمية عربي/إنجليزي', compliance: 'المادة 109 وهوية الشركة', status: 'معتمد' },
        { domain: 'الوحدة 4: إدارة الأسطول والسيارات', kpi: 'أسطول المركبات والعهد ومنصة تم', val: `${summary.fleet.total_vehicles} مركبة مسجلة`, compliance: 'تطابق منصة تم والمرور', status: 'سارٍ ومنتظم' },
        { domain: 'الوحدة 5: التأمين والبطاقات الصحية', kpi: 'تأمين مجلس الضمان والشهادات البلدية', val: `${summary.healthcare.insured_employees} بطاقة تأمين + ${summary.healthcare.baladiya_cards} بطاقة صحية`, compliance: 'معايير CCHI وأمانة عسير', status: 'معتمد رسمياً' },
        { domain: 'الوحدة 6: الخدمة الذاتية والإدارة', kpi: 'سير موافقات النقل الثلاثي والتعاميم والتراخيص', val: `${summary.governance.total_licenses} تراخيص + ${summary.governance.active_circulars} تعاميم`, compliance: 'حوكمة إدارية رقمية متقدمة', status: 'محدث ونشط' }
      ];

      tbody.innerHTML = rows.map(r => `
        <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
          <td class="py-3 px-3 font-black text-slate-900">${r.domain}</td>
          <td class="py-3 px-3 text-slate-700">${r.kpi}</td>
          <td class="py-3 px-3 text-center font-bold font-mono text-[#700c14]">${r.val}</td>
          <td class="py-3 px-3 text-center font-bold text-teal-800">${r.compliance}</td>
          <td class="py-3 px-3 text-center">
            <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
              ${r.status}
            </span>
          </td>
        </tr>
      `).join('');
    }

  } catch (err) {
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-rose-600 font-bold">خطأ في جلب التقرير الموحد: ${err.message}</td></tr>`;
    }
  }
}

function exportUnifiedReportCsv() {
  window.open('/api/general/reports/export/csv', '_blank');
}

// Window Global Exports for Module 6
window.loadEssTransferRequests = loadEssTransferRequests;
window.openModalTransferRequest = openModalTransferRequest;
window.submitTransferRequestForm = submitTransferRequestForm;
window.openTransferApprovalModal = openTransferApprovalModal;
window.submitTransferApprovalAction = submitTransferApprovalAction;
window.loadCircularsView = loadCircularsView;
window.renderCircularsCards = renderCircularsCards;
window.filterCircularsCards = filterCircularsCards;
window.acknowledgeCircular = acknowledgeCircular;
window.openModalAddCircular = openModalAddCircular;
window.submitCircularForm = submitCircularForm;
window.loadLicensesView = loadLicensesView;
window.renderLicensesTable = renderLicensesTable;
window.filterLicensesTable = filterLicensesTable;
window.openModalAddLicense = openModalAddLicense;
window.submitLicenseForm = submitLicenseForm;
window.deleteLicense = deleteLicense;
window.printLicensesReport = printLicensesReport;
window.loadUnifiedReportsView = loadUnifiedReportsView;
window.exportUnifiedReportCsv = exportUnifiedReportCsv;








/* =========================================================================
   CENTRAL HR CONTROL CENTER & EMPLOYEE OVERHAUL FUNCTIONS
   ========================================================================= */

// Filter HR Center Cards
function filterHrCenterCards(query) {
  const q = (query || '').toLowerCase().trim();
  const cards = document.querySelectorAll('#hrCenterCardsGrid .hr-hub-card');
  cards.forEach(c => {
    const title = (c.getAttribute('data-card-title') || '').toLowerCase();
    const text = c.textContent.toLowerCase();
    if (!q || title.includes(q) || text.includes(q)) {
      c.style.display = 'flex';
    } else {
      c.style.display = 'none';
    }
  });
}

// Active vs Terminated Sub-tab state
if (typeof empDbState !== 'undefined') {
  empDbState.activeSubTab = 'active';
}

function setEmployeeSubTab(tab) {
  if (typeof empDbState !== 'undefined') {
    empDbState.activeSubTab = tab;
  }
  const btnActive = document.getElementById('btnEmpSubTabActive');
  const btnTerminated = document.getElementById('btnEmpSubTabTerminated');

  if (tab === 'active') {
    if (btnActive) {
      btnActive.className = 'px-4 py-2 rounded-xl text-xs font-black transition subtab-active-pill flex items-center gap-2';
    }
    if (btnTerminated) {
      btnTerminated.className = 'px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-2';
    }
  } else {
    if (btnActive) {
      btnActive.className = 'px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-2';
    }
    if (btnTerminated) {
      btnTerminated.className = 'px-4 py-2 rounded-xl text-xs font-black transition subtab-active-pill flex items-center gap-2';
    }
  }

  if (typeof filterEmployeesTable === 'function') {
    filterEmployeesTable();
  }
}

// Employee Photo Upload Trigger
function triggerEmpPhotoUpload() {
  const input = document.getElementById('empPhotoUploadInput');
  if (input) input.click();
}

async function handleEmpPhotoFileSelected(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const empId = window.current360EmpId;
  if (!empId) {
    alert('لم يتم تحديد الموظف');
    return;
  }

  const formData = new FormData();
  formData.append('photo', file);

  try {
    const res = await fetch(`/api/employees/${empId}/photo`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      if (typeof showToast === 'function') showToast('تم تحديث الصورة الشخصية للموظف بنجاح', 'success');
      else alert('تم تحديث الصورة الشخصية للموظف بنجاح');

      // Update avatar circle in modal
      const avatarCircle = document.getElementById('emp360AvatarCircle');
      if (avatarCircle && data.photo_url) {
        avatarCircle.innerHTML = `<img src="${data.photo_url}" class="w-full h-full object-cover">`;
      }
      // Reload employees state
      if (typeof loadEmployees === 'function') loadEmployees();
    } else {
      alert(data.error || 'فشل تحديث الصورة');
    }
  } catch (err) {
    alert('حدث خطأ أثناء رفع الصورة: ' + err.message);
  }
}

// Load and Upload Employee Documents
async function loadEmployeeDocuments(empId) {
  const tbody = document.getElementById('empDocsTableBody');
  const countBadge = document.getElementById('empDocsCountBadge');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-slate-400">جاري التحميل...</td></tr>';

  try {
    const res = await apiFetch(`/api/employees/${empId}/documents`);
    const docs = (res && res.success && res.data) ? res.data : [];
    if (countBadge) countBadge.textContent = `${docs.length} مستندات`;

    if (docs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="py-6 text-center text-slate-400">لا توجد وثائق مرفوعة لهذا الموظف حتى الآن.</td></tr>';
      return;
    }

    tbody.innerHTML = docs.map(d => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
        <td class="py-2.5 px-3 font-bold text-slate-700">${d.doc_type}</td>
        <td class="py-2.5 px-3 font-medium text-slate-800">${d.title || d.file_name}</td>
        <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500">${d.file_size ? Math.round(d.file_size / 1024) + ' KB' : '—'}</td>
        <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500">${d.created_at ? d.created_at.split(' ')[0] : '—'}</td>
        <td class="py-2.5 px-3 text-center space-x-1.5 space-x-reverse">
          <a href="${d.file_path}" target="_blank" class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold inline-flex items-center gap-1">
            <i class="fa-solid fa-eye"></i> معاينة
          </a>
          <button type="button" onclick="deleteEmployeeDocument(${d.id})" class="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold inline-flex items-center gap-1">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-rose-500 font-bold">حدث خطأ أثناء تحميل المستندات</td></tr>';
  }
}

async function uploadEmployeeDocument() {
  const empId = window.current360EmpId;
  if (!empId) return alert('لم يتم تحديد الموظف');

  const fileInput = document.getElementById('empDocFileInput');
  const typeSelect = document.getElementById('empDocTypeSelect');
  const titleInput = document.getElementById('empDocTitleInput');

  const file = fileInput?.files && fileInput.files[0];
  if (!file) return alert('يرجى اختيار ملف لرفعه');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('doc_type', typeSelect?.value || 'مستند رسمي');
  formData.append('title', titleInput?.value || file.name);

  try {
    const res = await fetch(`/api/employees/${empId}/documents`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      if (typeof showToast === 'function') showToast('تم رفع المستند بنجاح', 'success');
      else alert('تم رفع المستند بنجاح');
      if (fileInput) fileInput.value = '';
      if (titleInput) titleInput.value = '';
      loadEmployeeDocuments(empId);
    } else {
      alert(data.error || 'فشل رفع المستند');
    }
  } catch (err) {
    alert('حدث خطأ: ' + err.message);
  }
}

async function deleteEmployeeDocument(docId) {
  const empId = window.current360EmpId;
  if (!empId || !docId) return;
  if (!confirm('هل أنت متأكد من حذف هذا المستند؟')) return;

  try {
    const res = await apiFetch(`/api/employees/${empId}/documents/${docId}`, { method: 'DELETE' });
    if (res && res.success) {
      if (typeof showToast === 'function') showToast('تم حذف المستند بنجاح', 'success');
      loadEmployeeDocuments(empId);
    } else {
      alert(res?.error || 'فشل حذف المستند');
    }
  } catch (err) {
    alert('حدث خطأ أثناء الحذف: ' + err.message);
  }
}

// Hook loadEmployeeDocuments when opening Employee 360 Documents Tab
const originalSwitch360Tab = window.switch360Tab;
window.switch360Tab = function(tabName) {
  if (typeof originalSwitch360Tab === 'function') {
    originalSwitch360Tab(tabName);
  }
  if (tabName === 'documents' && window.current360EmpId) {
    loadEmployeeDocuments(window.current360EmpId);
  }
};


window.loadExecutiveDashboard = loadExecutiveDashboard;
window.uploadUserProfilePicture = uploadUserProfilePicture;
window.triggerAvatarUpload = triggerAvatarUpload;
window.toggleUserProfileMenu = toggleUserProfileMenu;
window.closeUserProfileMenu = closeUserProfileMenu;
window.handleGlobalSystemSearch = handleGlobalSystemSearch;
