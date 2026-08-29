import LegalDoc from '../../components/layout/LegalDoc.jsx'
import { COMPANY, fullAddress } from '../../config/company.js'

const sections = [
  {
    id: 'scope',
    heading: 'Scope',
    body: [
      `This policy explains what ${COMPANY.legalName} collects when you use ${COMPANY.name}, why we collect it, and the choices you have. It covers our website, apps and support channels.`,
      'We follow the Digital Personal Data Protection Act, 2023. Where that Act uses the term "Data Principal", we simply say "you".',
    ],
  },
  {
    id: 'what-we-collect',
    heading: 'What we collect',
    body: [
      { list: [
        'Account details -- name, email, mobile number, and whether you signed up as a customer or a kitchen partner.',
        'Delivery details -- the addresses you save, delivery notes, and the area you search in.',
        'Order history -- what you subscribed to, from whom, when it was delivered, and any complaint you raised.',
        'Payment metadata -- the last four digits and status of a transaction. Full card and UPI credentials go to our payment gateway, never to our servers.',
        'Kitchen partner documents -- FSSAI licence, address proof and bank details, used solely for verification and payouts.',
        'Technical data -- device type, browser, IP address and app version, used to keep the service working and to spot fraud.',
      ] },
    ],
  },
  {
    id: 'why',
    heading: 'Why we use it',
    body: [
      'To take payment, get a hot tiffin to the right door, and let a provider know how many portions to cook. That is the bulk of it.',
      { list: [
        'Operating your subscription -- scheduling, pausing, billing and delivery.',
        'Safety and trust -- verifying kitchen licences, investigating hygiene complaints, preventing fraudulent refunds.',
        'Support -- answering the question you actually asked without making you repeat your order number.',
        'Improvement -- aggregate, de-identified analytics on which areas need more kitchens.',
        'Marketing -- only if you opt in, and every message carries an unsubscribe link.',
      ] },
    ],
  },
  {
    id: 'sharing',
    heading: 'Who we share it with',
    body: [
      'We do not sell your personal data. We share the minimum needed to complete what you asked for:',
      { list: [
        'The kitchen you ordered from receives your first name, delivery address, phone number and dietary notes -- for that order only.',
        'Delivery partners receive your address and a masked phone number that stops working after the delivery window.',
        'Payment gateways, SMS and email providers, and cloud hosting act as our processors under contract.',
        'Authorities, where we are legally compelled -- and we will tell you unless the law forbids it.',
      ] },
    ],
  },
  {
    id: 'retention',
    heading: 'How long we keep it',
    body: [
      'Order and invoice records are kept for eight years because tax law requires it. Support conversations are kept for two years.',
      'If you delete your account, we remove your profile, saved addresses and marketing preferences within 30 days, and retain only what statute obliges us to keep, in a restricted archive.',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    body: [
      { list: [
        'Access -- ask for a copy of the data we hold about you.',
        'Correction -- fix anything inaccurate, most of which you can edit yourself in your profile.',
        'Erasure -- ask us to delete your account and data.',
        'Withdraw consent -- turn off marketing or a permission at any time, without affecting service you have already paid for.',
        'Nominate -- name someone to exercise these rights if you are unable to.',
      ] },
      `Write to ${COMPANY.privacyEmail} and we will respond within 30 days. If you are not satisfied, you may complain to the Data Protection Board of India.`,
    ],
  },
  {
    id: 'security',
    heading: 'Security',
    body: [
      'Traffic is encrypted in transit with TLS. Partner documents are encrypted at rest and visible only to the verification team. Access to production data is role-based and logged.',
      'No system is perfect. If a breach is likely to affect you, we will notify you and the Data Protection Board without undue delay.',
    ],
  },
  {
    id: 'cookies',
    heading: 'Cookies and local storage',
    body: [
      'We use a small number of strictly necessary cookies to keep you signed in and to remember your cart between visits. These cannot be switched off without breaking the site.',
      'Analytics cookies are optional and are only set once you accept them. We do not run third-party advertising trackers.',
    ],
  },
  {
    id: 'children',
    heading: 'Children',
    body: [
      'The service is not intended for anyone under 18, and we do not knowingly create accounts for children. If you believe a child has registered, tell us and we will remove the account.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: [
      `Data protection queries: ${COMPANY.privacyEmail}.`,
      COMPANY.grievanceOfficer
        ? `Grievance Officer: ${COMPANY.grievanceOfficer}, ${COMPANY.grievanceEmail}.`
        : `Complaints and escalations: ${COMPANY.grievanceEmail}.`,
      `Post: ${fullAddress.join(', ')}.`,
    ],
  },
]

export default function PrivacyPage() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Privacy Policy"
      summary="What we collect, why we need it, and how to get it back or have it deleted."
      updated="12 January 2026"
      sections={sections}
    />
  )
}
