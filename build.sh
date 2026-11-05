#!/usr/bin/env bash
# =========================================================================
# نظام موارد بشرية شركة جوهرة المجد - Jawharat Al-Majd HRMS
# POSIX Automated Production Build & Deployment Script (Linux/Unix/macOS/VPS)
# =========================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
GOLD='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GOLD}=================================================================${NC}"
echo -e "${GOLD}   نظام موارد بشرية شركة جوهرة المجد - Jawharat Al-Majd HRMS   ${NC}"
echo -e "${GOLD}   سكريبت البناء والتثبيت التلقائي للأنظمة الأخرى (POS/Linux/Unix)${NC}"
echo -e "${GOLD}=================================================================${NC}"
echo ""

# 1. Check Node.js installation & version (Must be >= 22 for node:sqlite)
echo -e "${BLUE}[1/5] التحقق من بيئة Node.js ونظام التشغيل...${NC}"
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}خطأ: Node.js غير مثبت على هذا النظام!${NC}"
    echo "يرجى تثبيت Node.js الإصدار 22 أو أحدث عبر الأمر:"
    echo "curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
echo "الإصدار الحالي لـ Node.js: $(node -v)"
if [ "$NODE_VER" -lt 22 ]; then
    echo -e "${RED}تحذير حرج: يتطلب النظام Node.js إصدار 22 أو أعلى لدعم محرك قاعدة البيانات node:sqlite المدمج.${NC}"
    echo "إصدارك الحالي هو: $(node -v). يرجى الترقية إلى v22+ لتجنب أخطاء التشغيل."
fi

# 2. Check npm
if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}خطأ: مدير الحزم npm غير متوفر.${NC}"
    exit 1
fi

# 3. Install production dependencies
echo ""
echo -e "${BLUE}[2/5] تثبيت حزم التبعات والاعتماديات (Dependencies)...${NC}"
npm install --omit=dev --no-audit

# 4. Ensure directories and permissions
echo ""
echo -e "${BLUE}[3/5] إنشاء وتأمين مجلدات التخزين وقاعدة البيانات...${NC}"
mkdir -p server/database uploads public/assets
chmod -R 755 server/database uploads public 2>/dev/null || true

# 5. Initialize and verify database & migrations
echo ""
echo -e "${BLUE}[4/5] تهيئة وتدقيق سلامة قاعدة البيانات والبيانات الرسمية...${NC}"
node -e "
const db = require('./server/database/db');
console.log('✓ قاعدة البيانات جاهزة ومحدثة.');
const vCount = db.get('SELECT COUNT(*) as c FROM vehicles')?.c || 0;
const lCount = db.get('SELECT COUNT(*) as c FROM company_licenses')?.c || 0;
const uCount = db.get('SELECT COUNT(*) as c FROM users')?.c || 0;
console.log('✓ أسطول المركبات:', vCount, 'مركبة معتمدة');
console.log('✓ السجلات والتراخيص:', lCount, 'وثيقة رسمية');
console.log('✓ حسابات المشرفين:', uCount, 'حساب نشط (مدير النظام)');
"

# 6. Finalizing
echo ""
echo -e "${GREEN}=================================================================${NC}"
echo -e "${GREEN}  ✓ تم البناء والتهيئة بنجاح لنظام الموارد البشرية (شركة جوهرة المجد)  ${NC}"
echo -e "${GREEN}=================================================================${NC}"
echo ""
echo "خيارات تشغيل النظام على هذا الجهاز / الخادم:"
echo "1) تشغيل مباشر في وضع الإنتاج:"
echo "   npm start"
echo ""
echo "2) تشغيل مستمر كخدمة في الخلفية (عبر PM2):"
echo "   npm install -g pm2"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save && pm2 startup"
echo ""
echo "3) تشغيل عبر حاويات Docker:"
echo "   docker-compose up -d"
echo ""
