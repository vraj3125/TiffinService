import { useState } from 'react'
import { Gift, Mail, CalendarClock, ArrowRight } from 'lucide-react'
import PageHero, { Section } from '../../components/layout/PageHero.jsx'
import Button from '../../components/ui/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { COMPANY } from '../../config/company.js'

const AMOUNTS = [500, 1000, 2500, 5000]

const inputClass =
  'w-full min-h-[52px] rounded-DEFAULT border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface placeholder:text-outline focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all'

const howItWorks = [
  { icon: Gift, title: 'Pick an amount', body: 'From 500 to 5,000 rupees, or any custom value in between. A week of lunches runs about 900.' },
  { icon: Mail, title: 'We email the code', body: 'It reaches the recipient on the date you choose, with your message. Send it to yourself if you would rather hand it over in person.' },
  { icon: CalendarClock, title: 'They pick a kitchen', body: 'The balance sits in their account and works with any kitchen on the platform, across as many orders as they like.' },
]

export default function GiftCardsPage() {
  const { showToast } = useToast()
  const [amount, setAmount] = useState(1000)
  const [custom, setCustom] = useState('')
  const [form, setForm] = useState({ to: '', email: '', from: '', message: '' })

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const value = custom ? Number(custom) || 0 : amount

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.email || value < 100) {
      showToast('Add a recipient email and an amount of at least 100 rupees', 'info')
      return
    }
    // No payment gateway is wired up in this build, so say so plainly rather
    // than pretending a card was issued.
    showToast('Demo build -- gift cards are not live yet, so nothing was charged.', 'info')
  }

  return (
    <>
      <PageHero
        eyebrow="Gift cards"
        title="Give someone a month of not cooking"
        subtitle="Useful for a student in a new city, a parent recovering from surgery, or anyone whose kitchen is currently a suitcase. Redeemable at every kitchen on TiffinConnect."
      />

      <Section className="bg-surface-container-lowest">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
          <div>
            <h2 className="text-headline-lg text-on-background mb-8">How it works</h2>
            <div className="space-y-6">
              {howItWorks.map((s, i) => (
                <div key={s.title} className="flex gap-5">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-surface-container flex items-center justify-center text-terracotta">
                    <s.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-label-lg text-on-background mb-1">
                      {i + 1}. {s.title}
                    </h3>
                    <p className="text-body-md text-on-surface-variant">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-DEFAULT border border-surface-variant bg-surface-container-low p-6">
              <h3 className="text-label-lg text-on-background mb-3">The fine print</h3>
              <ul className="space-y-2 text-body-sm text-on-surface-variant">
                <li>Valid for 12 months from the date of issue.</li>
                <li>Can be spent across multiple orders and multiple kitchens.</li>
                <li>Non-refundable and not exchangeable for cash, per RBI prepaid rules.</li>
                <li>If an order costs more than the balance, the difference is paid normally.</li>
              </ul>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-lg border border-surface-variant bg-surface-container-low p-8 ambient-shadow"
          >
            <h2 className="text-headline-md text-on-background mb-6">Buy a gift card</h2>

            <label className="block text-label-md text-on-surface-variant mb-2">Amount</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    setAmount(a)
                    setCustom('')
                  }}
                  className={`py-2.5 rounded-full text-label-md border-2 transition-colors ${
                    !custom && amount === a
                      ? 'border-terracotta bg-surface-container-lowest text-terracotta'
                      : 'border-outline-variant text-on-surface-variant hover:border-terracotta'
                  }`}
                >
                  &#8377;{a}
                </button>
              ))}
            </div>
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/\D/g, '').slice(0, 5))}
              inputMode="numeric"
              placeholder="Or enter a custom amount"
              className={`${inputClass} mb-5`}
            />

            <div className="space-y-4">
              <input value={form.to} onChange={update('to')} placeholder="Recipient's name" className={inputClass} />
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="Recipient's email"
                className={inputClass}
                required
              />
              <input value={form.from} onChange={update('from')} placeholder="Your name" className={inputClass} />
              <textarea
                value={form.message}
                onChange={update('message')}
                rows={3}
                maxLength={200}
                placeholder="A short message (optional)"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-outline-variant">
              <span className="text-body-sm text-on-surface-variant">Total</span>
              <span className="text-headline-md text-on-background">&#8377;{value.toLocaleString('en-IN')}</span>
            </div>

            <Button type="submit" size="lg" className="w-full mt-5">
              Continue to payment <ArrowRight size={20} />
            </Button>
            <p className="text-body-sm text-outline text-center mt-3">
              Demo build -- no payment is taken and no card is issued.
            </p>
          </form>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="rounded-DEFAULT border border-surface-variant bg-surface-container-lowest p-8 text-center">
          <p className="text-body-md text-on-surface-variant">
            Buying for a team or a hostel?{' '}
            <a href={`mailto:${COMPANY.email}`} className="text-terracotta font-semibold hover:underline">
              {COMPANY.email}
            </a>{' '}
            handles bulk orders of 20 cards or more.
          </p>
        </div>
      </Section>
    </>
  )
}
