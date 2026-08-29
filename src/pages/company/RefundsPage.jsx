import LegalDoc from '../../components/layout/LegalDoc.jsx'
import { COMPANY } from '../../config/company.js'

const sections = [
  {
    id: 'principle',
    heading: 'The short version',
    body: [
      'If a meal did not arrive, arrived cold, arrived spoiled, or was not what the menu described, you get your money back for that meal. Report it within 24 hours and we will not ask you to photograph every grain of rice.',
      'Because tiffins are cooked to order each morning, we cannot refund a correctly delivered meal simply because plans changed. Skipping in advance is free, and that is what the cut-off is for.',
    ],
  },
  {
    id: 'skip-pause',
    heading: 'Skipping and pausing',
    body: [
      { list: [
        'Skip a single day before the kitchen cut-off (usually 9:00 PM the night before): free, and the day is added to the end of your plan.',
        'Pause a subscription for up to 21 consecutive days: free. Your plan resumes automatically on the date you choose.',
        'Skip after the cut-off: the meal is already being cooked, so it is charged. You may still ask us to redirect it to another address in the same area.',
      ] },
    ],
  },
  {
    id: 'cancelling',
    heading: 'Cancelling a plan',
    body: [
      'Cancel any time from Subscriptions in your account. Cancellation takes effect after the last meal you have already been billed for that is past its cut-off.',
      { list: [
        'Weekly plans: unused deliveries are refunded in full.',
        'Monthly and quarterly plans: unused deliveries are refunded at the equivalent weekly rate, since the discount applied to the longer commitment no longer holds.',
        'Joining offers and first-order discounts are deducted from the refund if you cancel within the first seven days.',
      ] },
    ],
  },
  {
    id: 'issues',
    heading: 'When something is wrong with a meal',
    body: [
      'Raise it from the order in your account, or call us. We aim to decide the same day.',
      { list: [
        'Never delivered, or delivered more than 90 minutes outside the window: full refund of that meal.',
        'Spoiled, undercooked, or containing a foreign object: full refund, and the kitchen is audited. Please keep the container if you can.',
        'Wrong item, missing dish, or a veg order containing non-veg: full refund of the meal and an immediate investigation.',
        'Quantity or taste below expectation: the first instance is refunded as credit; repeated reports against the same kitchen trigger a quality review.',
      ] },
    ],
  },
  {
    id: 'how-refunds-arrive',
    heading: 'How refunds reach you',
    body: [
      'Refunds go back to the original payment method. UPI and wallet refunds usually land within 24 hours; card and net-banking refunds take five to seven working days depending on your bank.',
      `${COMPANY.name} credit, if you choose it instead, is instant, never expires, and can be spent with any kitchen on the platform.`,
    ],
  },
  {
    id: 'gift-cards',
    heading: 'Gift cards',
    body: [
      'Gift cards are non-refundable and cannot be exchanged for cash, in line with RBI prepaid instrument rules. An unused card can be transferred to another recipient by writing to support.',
      'If a gift card was bought in error and has not been redeemed, contact us within 48 hours and we will cancel and refund it.',
    ],
  },
  {
    id: 'provider-payouts',
    heading: 'Effect on kitchen partners',
    body: [
      'Where a refund results from a kitchen issue -- a missed cook, a hygiene failure, a mislabelled dish -- the refund is deducted from that partner payout.',
      'Where the fault lies with delivery or with the platform, the kitchen is paid in full and we absorb the cost. Partners can dispute any deduction in their dashboard within seven days.',
    ],
  },
  {
    id: 'escalating',
    heading: 'If you disagree with a decision',
    body: [
      `Reply to the refund decision email and ask for a review, or write to ${COMPANY.grievanceEmail}. Our Grievance Officer, ${COMPANY.grievanceOfficer}, responds within 30 days.`,
      'You retain every right available to you under the Consumer Protection Act, 2019; nothing in this policy takes those away.',
    ],
  },
]

export default function RefundsPage() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Cancellation & Refunds"
      summary="Skipping, pausing, cancelling, and what happens when a tiffin does not turn up the way it should."
      updated="12 January 2026"
      sections={sections}
    />
  )
}
