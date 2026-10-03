# مواصفات واجهات الربط البرمجي والتكامل (API & Integration Specification)
## شركة "جوهرة المجد" - نظام الموارد البشرية المتكامل

---

### 1. نظرة عامة على واجهات البرمجة (REST API Overview)

توفر منصة "جوهرة المجد" مجموعة متكاملة من واجهات RESTful APIs المبنية وفق معايير بروتوكول HTTP/1.1 و HTTP/2، وتعتمد نسق تبادل البيانات JSON بصورة قياسية، مع دعم تصدير واستيراد البيانات بصيغ CSV القياسية وملفات SIF البنكية.

- **مسار الأساس (Base URL)**: `http://localhost:3000/api`
- **التشفير المعتمد**: UTF-8 بكافة الترويسات والاستجابات لدعم اللغة العربية بدقة تامة.
- **صيغة الترويسة الأساسية**: `Content-Type: application/json; charset=utf-8`

---

### 2. واجهات شؤون الموظفين (Employees APIs)

#### 2.1 استرجاع قائمة الموظفين
- **المسار**: `GET /api/employees`
- **معاملات الاستعلام (Query Parameters)**:
  - `department_id` (اختياري): رقم معرف القسم.
  - `is_saudi` (اختياري): `1` للسعوديين، `0` للمقيمين.
  - `status` (اختياري): `نشط`، `في إجازة`، `مستقيل`.
  - `search` (اختياري): نص للبحث بالاسم أو الرقم الوظيفي أو الهوية.
- **نموذج الاستجابة (Response Schema)**:
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": 1,
      "emp_code": "JM-1001",
      "full_name_ar": "خالد سعد الشهراني",
      "national_id": "1084928172",
      "nationality": "سعودي",
      "is_saudi": 1,
      "job_title_ar": "مدير الموارد البشرية والعمليات الإدارية",
      "basic_salary": 16000,
      "housing_allowance": 4000,
      "transport_allowance": 1500,
      "iban": "SA5580000201608010011001",
      "department_name_ar": "الموارد البشرية والخدمات المشتركة"
    }
  ]
}
```

#### 2.2 إضافة موظف جديد
- **المسار**: `POST /api/employees`
- **جسم الطلب (Request Body)**:
```json
{
  "emp_code": "JM-1016",
  "full_name_ar": "سلطان عبدالعزيز الغامدي",
  "full_name_en": "Sultan Abdulaziz Al-Ghamdi",
  "national_id": "1099887766",
  "nationality": "سعودي",
  "gender": "M",
  "email": "sultan.ghamdi@jalmajd.com",
  "phone": "0559988112",
  "department_id": 2,
  "job_title_ar": "مستشار قانوني",
  "basic_salary": 14000,
  "housing_allowance": 3500,
  "transport_allowance": 1200,
  "other_allowance": 0,
  "bank_name": "مصرف الراجحي",
  "iban": "SA448000020160801009999"
}
```

#### 2.3 تنبيهات انتهاء الوثائق الرسمية
- **المسار**: `GET /api/employees/alerts/expiry`
- **الوصف**: يعيد قائمة بالوثائق المنتهية أو التي تقترب من الانتهاء خلال 60 يوماً مصنفة حسب مستوى الخطورة (حرجة `critical`، أو تحذير `warning`).

---

### 3. مواصفات التكامل مع أجهزة البصمة البيومترية (ZKTeco Biometric Integration)

يدعم النظام وسيلتين رئيسيتين للتكامل مع أجهزة البصمة البيومترية الشائعة (ZKTeco SilkBio, SpeedFace, ProFace):

#### 3.1 الاستقبال المباشر عبر بروتوكول Push SDK / ADMS
تعمل محطة البصمة الحيوية المثبتة في مقر الشركة بمول سيتي بارك في أبها كعميل (Client) يدفع سجلات الحضور فور حدوثها إلى خادم النظام.

- **المسار**: `POST /api/biometrics/push`
- **جسم الطلب القياسي من محطة البصمة**:
```json
{
  "device_code": "ZK-BIO-MAIN-01",
  "device_name": "جهاز البوابة الرئيسية (ZK-MAIN)",
  "punches": [
    {
      "emp_id": 1,
      "punch_time": "2026-09-30 07:54:12",
      "punch_type": "CHECK_IN",
      "verification_method": "FINGERPRINT",
      "latitude": 18.2164,
      "longitude": 42.5053
    }
  ]
}
```

#### 3.2 تسجيل الحضور الذكي الجغرافي (Mobile / Web GPS Geofencing)
يسمح للموظف بتسجيل الحضور عبر هاتفه أو حاسوبه الشخصي مع التحقق البرمجي التلقائي من تواجده ضمن النطاق الجغرافي المسموح به (دائرة قطرها 300 متر حول مول سيتي بارك بأبها):
- **معادلة هافرسين لحساب المسافة الدائرية**:
  $$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
- يتم تخزين المسافة الفعلية، وحالة النطاق الجغرافي `is_within_geofence: 1`.

---

### 4. مواصفات ملف نظام حماية الأجور (WPS SIF Specification)

يتوافق مولد حماية الأجور في النظام مع معايير البنك المركزي السعودي (SAMA) ومنصة **مدد (Mudad)** ومصرف الراجحي. يتم توليد ملف نصي مشفر بصيغة `SIF` (Standard Interchange Format) برقم مرجعي لكل مسير.

#### 4.1 سجل الترويسة (Salary Control Record - SCR)
```
SCR,Employer_CR,Bank_Code,Creation_Date,Creation_Time,Company_Name,Payer_Account,Value_Date,Total_Salaries,Total_Records,Currency
```
- **مثال تطبيقي من النظام**:
```text
SCR,5850029384,RJHI,20260930,0830,Jawharat Al-Majd Co,SA4480000392608010049283,20260928,168750.00,15,SAR
```

#### 4.2 سجلات تفاصيل الموظفين (Employee Detail Record - EDR)
```
EDR,Bank_Code,IBAN,Employee_Name,National_ID,Basic_Salary,Housing_Allowance,Other_Earnings,Deductions,Net_Salary,Reference
```
- **مثال تطبيقي من مسير شهر سبتمبر 2026**:
```text
EDR,RJHI,SA5580000201608010011001,خالد سعد الشهراني,1084928172,16000.00,4000.00,2500.00,1950.00,20550.00,JM2026090001
EDR,RJHI,SA4580000201608010011005,طارق محمود المنصوري,2491827364,12000.00,3000.00,2900.00,0.00,17900.00,JM2026090005
```

---

### 5. مواصفات استخراج خطابات التعريف الموثقة بباركود QR

تتيح واجهة `GET /api/requests/salary-letter/:empId?destination=...` توليد حمولة بيانات مشفرة للتحقق الفوري من صحة الخطاب:
```json
{
  "ref": "JM-CERT-2026-0001842",
  "company": "Jawharat Al-Majd Trading & Services Co.",
  "cr": "5850029384",
  "emp_code": "JM-1001",
  "national_id": "1084928172",
  "gross_salary": 22500,
  "issue_date": "2026-09-30",
  "status": "AUTHENTIC_VERIFIED"
}
```
يتم تضمين هذه الحمولة داخل رمز استجابة سريعة (QR Code) على رأس وتذييل الخطاب الرسمي للتحقق المباشر من خلال كاميرا الهاتف أو أجهزة المسح لدى البنوك والجهات الرسمية.
