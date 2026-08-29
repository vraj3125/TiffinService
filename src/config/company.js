// Every company detail the marketing, support and legal pages display lives here.
//
// These are PLACEHOLDERS for the demo -- the address, phone, FSSAI licence, CIN
// and social handles are invented and do not belong to a real business. Swap the
// whole object for your own details before this goes anywhere near production;
// nothing else in the app hardcodes them, so this file is the only edit needed.

export const COMPANY = {
  name: 'TiffinConnect',
  legalName: 'TiffinConnect Technologies Private Limited',
  tagline: 'Artisanal Home Kitchens, Delivered.',
  foundedYear: 2024,

  email: 'hello@tiffinconnect.in',
  supportEmail: 'support@tiffinconnect.in',
  partnersEmail: 'kitchens@tiffinconnect.in',
  careersEmail: 'careers@tiffinconnect.in',
  privacyEmail: 'privacy@tiffinconnect.in',
  grievanceEmail: 'grievance@tiffinconnect.in',

  phone: '+91 79 4000 1200',
  phoneHref: '+917940001200',
  supportHours: 'Mon–Sat, 8:00 AM – 10:00 PM IST',

  address: {
    line1: '4th Floor, Shivalik Shilp',
    line2: 'Iscon Cross Roads, Satellite',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pin: '380015',
    country: 'India',
  },

  // Statutory identifiers Indian food-delivery businesses are expected to show.
  fssai: '10024031000456',
  cin: 'U62099GJ2024PTC148820',
  gstin: '24AAJCT4821K1ZP',

  // Grievance officer is a compliance requirement under the IT Rules, 2021.
  grievanceOfficer: 'Ms. Ananya Deshpande',

  social: [
    { label: 'Instagram', href: 'https://instagram.com/tiffinconnect', icon: 'instagram' },
    { label: 'X', href: 'https://x.com/tiffinconnect', icon: 'twitter' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/tiffinconnect', icon: 'linkedin' },
    { label: 'YouTube', href: 'https://youtube.com/@tiffinconnect', icon: 'youtube' },
  ],
}

export const fullAddress = [
  COMPANY.address.line1,
  COMPANY.address.line2,
  `${COMPANY.address.city}, ${COMPANY.address.state} ${COMPANY.address.pin}`,
  COMPANY.address.country,
]
