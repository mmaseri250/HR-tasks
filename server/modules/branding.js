/**
 * Central Branding & Corporate Identity Module
 * Single Source of Truth for Jawharat Al-Majd Company metadata and official assets
 */

const fs = require('fs');
const path = require('path');

let cachedLogoBase64 = '';

function getCompanyLogoBase64() {
  if (cachedLogoBase64) return cachedLogoBase64;
  const candidatePaths = [
    path.join(__dirname, '..', '..', 'public', 'assets', 'logo.png'),
    path.join(__dirname, '..', '..', 'public', 'images', 'logo.png'),
    path.join(__dirname, '..', '..', 'لوجو.png')
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const buf = fs.readFileSync(p);
        cachedLogoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
        return cachedLogoBase64;
      } catch (e) {
        console.error('Failed to read logo at', p, e.message);
      }
    }
  }
  return '';
}

const BRANDING = {
  companyNameAr: 'شركة جوهرة المجد للمقاولات والتجارة',
  companyNameEn: 'Jawharat Al-Majd Contracting & Trading Co.',
  commercialRegister: '5850024190',
  vatNumber: '310123456700003',
  chamberOfCommerce: '5850024190',
  headquartersAr: 'المملكة العربية السعودية - المنطقة الجنوبية',
  getLogoBase64: getCompanyLogoBase64,
  get logoBase64() {
    return getCompanyLogoBase64();
  }
};

module.exports = BRANDING;
