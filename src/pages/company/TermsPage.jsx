import LegalDoc from '../../components/layout/LegalDoc.jsx'
import { COMPANY } from '../../config/company.js'

const sections = [
  {
    id: 'about-these-terms',
    heading: 'About these terms',
    body: [
      `These terms govern your use of the ${COMPANY.name} website and apps. By creating an account, placing an order or listing a kitchen, you agree to them. If you do not agree, please stop using the service.`,
      `${COMPANY.legalName} is registered in ${COMPANY.address.city}, ${COMPANY.address.state}, India. We may update these terms; material changes will be emailed to registered users at least 14 days before they take effect.`,
    ],
  },
  {
    id: 'what-we-are',
    heading: 'What TiffinConnect is (and is not)',
    body: [
      'We are a marketplace. We connect you with independent home kitchens and tiffin providers in your area. We do not cook, and we are not the seller of the meals you buy.',
      'The provider you order from is responsible for preparing the food, its ingredients, its quality and its compliance with food safety law. We verify licences at onboarding and audit periodically, but we do not supervise day-to-day cooking.',
      { list: [
        'Menus, prices and portion sizes are set by each provider.',
        'Photographs are illustrative; plating varies day to day.',
        'Nutritional and allergen information is supplied by the provider and is not independently lab-tested.',
      ] },
    ],
  },
  {
    id: 'accounts',
    heading: 'Your account',
    body: [
      'You must be at least 18 years old to hold an account. Keep your login credentials to yourself -- you are responsible for activity under your account until you tell us it has been compromised.',
      'Give us accurate delivery details. We cannot refund a subscription meal delivered correctly to the address you supplied.',
      'We may suspend an account for repeated fraudulent refund claims, abuse of delivery partners or providers, or any use of the service that breaks the law.',
    ],
  },
  {
    id: 'subscriptions',
    heading: 'Subscriptions and deliveries',
    body: [
      'Most plans are recurring: you pick a plan, a start date and a delivery window, and meals arrive on each scheduled day until you pause or cancel.',
      { list: [
        'Changes to tomorrow\u2019s meal -- skip, pause or address change -- must be made before the provider\u2019s daily cut-off, shown on the plan.',
        'Providers publish holidays in advance; those days are not charged and extend your plan by one delivery.',
        'Delivery windows are targets, not guarantees. Weather, traffic and local restrictions can shift them.',
        'If nobody is available to receive a meal, the delivery partner waits five minutes, then leaves it at the door where it is safe to do so.',
      ] },
    ],
  },
  {
    id: 'payments',
    heading: 'Pricing and payments',
    body: [
      'Prices are in Indian Rupees and include GST where applicable. Delivery fees, packaging charges and any platform fee are itemised before you confirm an order.',
      'Subscription payments are collected up front for the plan period. Where you have authorised a recurring mandate, we charge it on the renewal date and notify you beforehand as required by RBI rules.',
      `Refunds and cancellations are covered by our Cancellation & Refund Policy, which forms part of these terms.`,
    ],
  },
  {
    id: 'providers',
    heading: 'Terms for kitchen partners',
    body: [
      'If you list a kitchen, you additionally confirm that you hold a valid FSSAI registration or licence for the address you cook at, and that you will keep it current.',
      { list: [
        'You set your own menu, prices and capacity. You are the seller of record for every order.',
        'Our commission and payout schedule are set out in your partner agreement and shown in your dashboard.',
        'You must honour published holidays and give at least 48 hours\u2019 notice for unplanned closures.',
        'Repeated hygiene complaints, licence lapses or misrepresented food (for example, non-veg served on a veg-only listing) will result in delisting.',
      ] },
    ],
  },
  {
    id: 'allergies',
    heading: 'Allergens and dietary claims',
    body: [
      'Home kitchens are shared spaces. Even a veg-only kitchen may handle nuts, dairy, gluten or mustard. We cannot guarantee any meal is free from a given allergen.',
      'If you have a serious allergy, contact the provider directly through the order screen before subscribing, and treat every dietary label as best-effort rather than certified.',
    ],
  },
  {
    id: 'liability',
    heading: 'Liability',
    body: [
      'Nothing here limits liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot be limited under Indian law.',
      'Subject to that, our liability for any claim connected to an order is limited to the amount you paid for the affected order or, for a subscription, the value of the affected deliveries.',
      'We are not liable for a provider\u2019s independent acts, but we will always help you pursue a complaint and will refund through the platform where a claim is upheld.',
    ],
  },
  {
    id: 'grievance',
    heading: 'Grievance redressal',
    body: [
      COMPANY.grievanceOfficer
        ? `Under the Consumer Protection (E-Commerce) Rules, 2020 and the IT Rules, 2021, our Grievance Officer is ${COMPANY.grievanceOfficer}, reachable at ${COMPANY.grievanceEmail}.`
        : `Complaints go to ${COMPANY.grievanceEmail} and are handled under the Consumer Protection (E-Commerce) Rules, 2020 and the IT Rules, 2021.`,
      'We acknowledge complaints within 48 hours and aim to resolve them within 30 days. These terms are governed by Indian law, and the courts at Vadodara, Gujarat have exclusive jurisdiction.',
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Terms of Service"
      summary="The agreement between you and TiffinConnect when you order a tiffin, run a kitchen, or simply browse."
      updated="12 January 2026"
      sections={sections}
    />
  )
}
