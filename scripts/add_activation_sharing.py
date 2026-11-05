import os

# 1. Update public/index.html
index_path = r'C:\jawharat-hrms\public\index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    idx_content = f.read()

idx_norm = idx_content.replace('\r\n', '\n')

old_modal_inner = '''      <div class="space-y-1.5 text-xs">
        <label class="block font-bold text-slate-700">رابط التفعيل المباشر (أرسله للموظف):</label>
        <div class="flex gap-2">
          <input type="text" id="actNoticeLinkInput" readonly class="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-[11px] text-slate-800 font-bold select-all">
          <button type="button" onclick="copyActivationNoticeLink()" class="px-4 py-2 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl flex items-center gap-1.5 shadow transition active:scale-95">
            <i class="fa-solid fa-copy"></i>
            <span>نسخ</span>
          </button>
        </div>
      </div>

      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
        <p class="font-bold text-slate-800"><i class="fa-brands fa-whatsapp text-emerald-600 text-xs"></i> كيفية تفعيل الحساب:</p>
        <p>1. انسخ الرابط أعلاه وأرسله للموظف عبر البريد الرسمي أو الواتساب.</p>
        <p>2. يفتح الموظف الرابط ويقوم بإنشاء كلمة المرور الشخصية الخاصة به.</p>
        <p>3. يتم تفعيل الحساب فوراً وتلقائياً وتسجيل وقت التفعيل في سجل الرقابة.</p>
      </div>'''

new_modal_inner = '''      <div class="space-y-1.5 text-xs">
        <label class="block font-bold text-slate-700">رابط التفعيل المباشر (أرسله للموظف):</label>
        <div class="flex gap-2">
          <input type="text" id="actNoticeLinkInput" readonly class="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-[11px] text-slate-800 font-bold select-all">
          <button type="button" onclick="copyActivationNoticeLink()" class="px-4 py-2 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl flex items-center gap-1.5 shadow transition active:scale-95 whitespace-nowrap">
            <i class="fa-solid fa-copy"></i>
            <span>نسخ الرابط</span>
          </button>
        </div>
      </div>

      <!-- Quick Dispatch Channels (قنوات الإرسال المباشر للموظف) -->
      <div class="space-y-2 text-xs">
        <label class="block font-bold text-slate-700">طرق إيصال الرابط للموظف مباشرة بنقرة واحدة:</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <!-- WhatsApp -->
          <button type="button" onclick="shareActivationViaWhatsApp()" class="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95">
            <i class="fa-brands fa-whatsapp text-sm"></i>
            <span>إرسال واتساب</span>
          </button>

          <!-- Email -->
          <button type="button" onclick="shareActivationViaEmail()" class="px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95">
            <i class="fa-solid fa-envelope text-sm"></i>
            <span>إرسال إيميل</span>
          </button>

          <!-- Copy Full Message -->
          <button type="button" onclick="copyFullActivationMessage()" class="px-3 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95">
            <i class="fa-solid fa-paste text-sm"></i>
            <span>نسخ الرسالة كاملة</span>
          </button>
        </div>
      </div>

      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
        <p class="font-bold text-slate-800"><i class="fa-solid fa-circle-info text-brand text-xs"></i> خطوات استلام وتفعيل كلمة المرور:</p>
        <p>1. <strong>يصل الرابط للموظف:</strong> عبر رسالة واتساب، إيميل رسمي، أو رسالة SMS برقم هاتف الموظف المسجل.</p>
        <p>2. <strong>خطوة الموظف (صلاحية 24س):</strong> يضغط الموظف على الرابط ➔ يُنشئ كلمة المرور الشخصية ويؤكدها.</p>
        <p>3. <strong>التفعيل التلقائي:</strong> يتحول الحساب فوراً إلى "نشط" ويدخل الموظف للنظام بكلمة مروره الجديدة.</p>
      </div>'''

if old_modal_inner in idx_norm:
    idx_norm = idx_norm.replace(old_modal_inner, new_modal_inner, 1)
    print('1. Updated index.html modal with quick dispatch channels')
else:
    print('1. Could not find old_modal_inner')

# Also add link in login modal footer
old_login_btn = '''        <button type="submit" class="w-full py-3.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-black text-sm shadow-lg transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-arrow-right-to-bracket"></i>
          <span data-i18n="login_btn">دخول إلى النظام</span>
        </button>
      </form>'''

new_login_btn = '''        <button type="submit" class="w-full py-3.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-black text-sm shadow-lg transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-arrow-right-to-bracket"></i>
          <span data-i18n="login_btn">دخول إلى النظام</span>
        </button>
      </form>

      <div class="pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] text-slate-500">
        <span>لديك رابط تفعيل حساب جديد؟</span>
        <a href="/activate-account.html" class="font-bold text-brand hover:underline flex items-center gap-1">
          <i class="fa-solid fa-key text-[10px]"></i> بوابة تفعيل الحسابات (24س)
        </a>
      </div>'''

if old_login_btn in idx_norm:
    idx_norm = idx_norm.replace(old_login_btn, new_login_btn, 1)
    print('2. Added activation gate link to login modal')
else:
    print('2. Could not find old_login_btn')

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(idx_norm)

# 2. Update public/js/app.js
app_path = r'C:\jawharat-hrms\public\js\app.js'
with open(app_path, 'r', encoding='utf-8') as f:
    app_content = f.read()

app_norm = app_content.replace('\r\n', '\n')

old_act_funcs = '''function openActivationNoticeModal(data) {
  if (!data) return;
  const usernameEl = document.getElementById('actNoticeUsername');
  const nameEl = document.getElementById('actNoticeFullName');
  const expEl = document.getElementById('actNoticeExpires');
  const inputEl = document.getElementById('actNoticeLinkInput');

  if (usernameEl) usernameEl.textContent = data.username || '--';
  if (nameEl) nameEl.textContent = data.full_name || '--';
  if (expEl) expEl.textContent = data.activation_token_expires_at ? new Date(data.activation_token_expires_at).toLocaleString('ar-SA') : 'بعد 24 ساعة';
  
  const link = data.activation_link || `${window.location.origin}/activate-account.html?token=${data.activation_token || ''}`;
  if (inputEl) inputEl.value = link;

  openModal('modalUserActivationNotice');
}'''

new_act_funcs = '''let currentActivationNoticeData = null;

function openActivationNoticeModal(data) {
  if (!data) return;
  currentActivationNoticeData = data;
  const usernameEl = document.getElementById('actNoticeUsername');
  const nameEl = document.getElementById('actNoticeFullName');
  const expEl = document.getElementById('actNoticeExpires');
  const inputEl = document.getElementById('actNoticeLinkInput');

  if (usernameEl) usernameEl.textContent = data.username || '--';
  if (nameEl) nameEl.textContent = data.full_name || '--';
  if (expEl) expEl.textContent = data.activation_token_expires_at ? new Date(data.activation_token_expires_at).toLocaleString('ar-SA') : 'بعد 24 ساعة';
  
  const link = data.activation_link || `${window.location.origin}/activate-account.html?token=${data.activation_token || ''}`;
  if (inputEl) inputEl.value = link;

  openModal('modalUserActivationNotice');
}

function shareActivationViaWhatsApp() {
  if (!currentActivationNoticeData) return;
  const data = currentActivationNoticeData;
  const link = data.activation_link || `${window.location.origin}/activate-account.html?token=${data.activation_token || ''}`;
  
  let phone = '';
  if (data.emp_id) {
    const emp = (state.employees || []).find(e => Number(e.id) === Number(data.emp_id));
    if (emp && emp.phone) phone = emp.phone;
  }
  let cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('05')) {
    cleanPhone = '966' + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('5')) {
    cleanPhone = '966' + cleanPhone;
  }

  const msg = `السلام عليكم ورحمة الله وبركاته،\\nالأخ/الأخت: ${data.full_name}\\n\\nتم إنشاء حسابكم في نظام إدارة الموارد البشرية لـ *شركة جوهرة المجد*.\\n\\n👤 *اسم المستخدم:* ${data.username}\\n⏳ *مهلة التفعيل:* 24 ساعة فقط من وقت الإرسال.\\n\\nيرجى فتح الرابط التالي وتعيين كلمة المرور الخاصة بكم لتفعيل الحساب:\\n🔗 ${link}\\n\\nإدارة الموارد البشرية - شركة جوهرة المجد`;
  
  const url = cleanPhone ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function shareActivationViaEmail() {
  if (!currentActivationNoticeData) return;
  const data = currentActivationNoticeData;
  const link = data.activation_link || `${window.location.origin}/activate-account.html?token=${data.activation_token || ''}`;
  
  let email = data.email || '';
  if (!email && data.emp_id) {
    const emp = (state.employees || []).find(e => Number(e.id) === Number(data.emp_id));
    if (emp && emp.email) email = emp.email;
  }

  const subject = `دعوة تفعيل حسابك في نظام موارد بشرية شركة جوهرة المجد (${data.username})`;
  const body = `السلام عليكم ورحمة الله وبركاته،\\n\\nالأخ/الأخت: ${data.full_name}\\n\\nتم إنشاء حسابكم الرسمي في نظام الموارد البشرية لشركة جوهرة المجد للتجارة والمقاولات.\\n\\nاسم المستخدم: ${data.username}\\nمدة الصلاحية: 24 ساعة فقط\\n\\nيرجى الضغط على الرابط التالي لإنشاء كلمة المرور وتفعيل الحساب:\\n${link}\\n\\nمع تحيات إدارة الموارد البشرية - شركة جوهرة المجد`;

  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function copyFullActivationMessage() {
  if (!currentActivationNoticeData) return;
  const data = currentActivationNoticeData;
  const link = data.activation_link || `${window.location.origin}/activate-account.html?token=${data.activation_token || ''}`;

  const msg = `السلام عليكم ورحمة الله وبركاته،\\nالأخ/الأخت: ${data.full_name}\\n\\nتم إنشاء حسابكم في نظام إدارة الموارد البشرية لـ شركة جوهرة المجد.\\n\\n👤 اسم المستخدم: ${data.username}\\n⏳ مهلة التفعيل: 24 ساعة فقط\\n\\nيرجى فتح الرابط التالي وتعيين كلمة المرور الخاصة بكم لتفعيل الحساب:\\n🔗 ${link}\\n\\nإدارة الموارد البشرية - شركة جوهرة المجد`;

  navigator.clipboard.writeText(msg).then(() => {
    alert('✓ تم نسخ نص الدعوة والرسالة الرسمية كاملاً مع الرابط بنجاح.');
  }).catch(() => {
    prompt('انسخ نص الرسالة التالي:', msg);
  });
}'''

if old_act_funcs in app_norm:
    app_norm = app_norm.replace(old_act_funcs, new_act_funcs, 1)
    print('3. Added shareActivationViaWhatsApp, shareActivationViaEmail, copyFullActivationMessage')
else:
    print('3. Could not find old_act_funcs')

# Export new functions
exports_hook = 'window.copyActivationNoticeLink = copyActivationNoticeLink;'
exports_new = '''window.copyActivationNoticeLink = copyActivationNoticeLink;
window.shareActivationViaWhatsApp = shareActivationViaWhatsApp;
window.shareActivationViaEmail = shareActivationViaEmail;
window.copyFullActivationMessage = copyFullActivationMessage;'''

if exports_hook in app_norm:
    app_norm = app_norm.replace(exports_hook, exports_new, 1)
    print('4. Exported new sharing functions to window')
else:
    print('4. Could not find exports_hook')

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_norm)

print('Sharing enhancements applied successfully.')
