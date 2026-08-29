// Every company detail the site displays comes from here.
//
// Fill in what is true for you and LEAVE THE REST EMPTY. Anything blank is
// hidden rather than shown as a placeholder -- so an FSSAI licence, CIN or GSTIN
// you have not been issued yet simply does not appear. Never invent these:
// they are legally meaningful identifiers, and a wrong one on a live site is a
// real problem, not a cosmetic one.

export const COMPANY = {
  name: 'TiffinConnect',
  legalName: 'TiffinConnect',
  tagline: 'Home Kitchens of Vadodara, Delivered.',
  foundedYear: 2026,

  email: 'hello@tiffinconnect.in',
  supportEmail: 'support@tiffinconnect.in',
  partnersEmail: 'kitchens@tiffinconnect.in',
  privacyEmail: 'privacy@tiffinconnect.in',
  grievanceEmail: 'grievance@tiffinconnect.in',

  phone: '',
  phoneHref: '',
  supportHours: 'Mon–Sat, 9:00 AM – 8:00 PM IST',

  address: {
    line1: '',
    line2: '',
    city: 'Vadodara',
    state: 'Gujarat',
    pin: '',
    country: 'India',
  },

  // Statutory identifiers. Add each one only once it has actually been issued.
  fssai: '',
  cin: '',
  gstin: '',

  // Named contact for complaints, required once the service is trading.
  grievanceOfficer: '',

  social: [],
}

// Only the address lines that have been filled in.
export const fullAddress = [
  COMPANY.address.line1,
  COMPANY.address.line2,
  [COMPANY.address.city, COMPANY.address.state, COMPANY.address.pin].filter(Boolean).join(', '),
  COMPANY.address.country,
].filter(Boolean)

export const hasAddress = fullAddress.length > 1
