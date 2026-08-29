import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, ChevronDown, Send } from 'lucide-react'
import PageHero, { Section } from '../../components/layout/PageHero.jsx'
import Button from '../../components/ui/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { COMPANY, fullAddress } from '../../config/company.js'

const inputClass =
  'w-full min-h-[52px] rounded-DEFAULT border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface placeholder:text-outline focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all'

const TOPICS = ['An order or delivery', 'My subscription or billing', 'Food safety concern', 'Running a kitchen', 'Something else']

const faqs = [
  {
    group: 'Orders & delivery',
    items: [
      ['My tiffin has not arrived. What now?', 'Open the order and tap Track to see where the rider is. If the window has passed by more than 30 minutes, use Report an issue on the same screen -- late deliveries beyond 90 minutes are refunded automatically once confirmed.'],
      ['Can I change my delivery address for one day?', 'Yes, before the kitchen cut-off, as long as the new address is inside the same delivery radius. Open the order, tap the address, and pick or add another.'],
      ['Nobody will be home. What happens?', 'The rider waits five minutes, calls the masked number, then leaves the tiffin at the door if it is safe. Add a note on the order if you want it left with a neighbour or a guard.'],
    ],
  },
  {
    group: 'Subscriptions & billing',
    items: [
      ['How do I pause my plan?', 'Subscriptions, then Pause. Choose the dates and it resumes on its own. Pauses up to 21 days are free and the days are added to the end of your plan.'],
      ['Why was I charged for a meal I skipped?', 'Almost always because the skip landed after the kitchen cut-off, usually 9:00 PM the night before. The food was already being cooked. Write to us if you think the cut-off was displayed wrong.'],
      ['When does a refund land?', 'UPI and wallet within 24 hours; card and net banking in five to seven working days. TiffinConnect credit is instant if you would rather have that.'],
    ],
  },
  {
    group: 'Food & kitchens',
    items: [
      ['Is the food really cooked in a home?', 'Yes -- in a licensed home kitchen, verified against an FSSAI registration and audited before going live and every six months after. Read more on the food safety page.'],
      ['Can I ask for less oil or no garlic?', 'Add it as a dietary note when you subscribe. Most kitchens accommodate it; some cannot, and their listing says so.'],
      ['I have a nut allergy. Am I safe?', 'We cannot guarantee it. Home kitchens are shared spaces and cross-contact is possible even in veg-only kitchens. Message the kitchen directly before subscribing.'],
    ],
  },
]

export default function SupportPage() {
  const { showToast } = useToast()
  const [open, setOpen] = useState('0-0')
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], orderId: '', message: '' })

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.email || !form.message) {
      showToast('Add your email and a short description so we can help', 'info')
      return
    }
    // Support runs out of a mailbox rather than a ticketing system, so send the
    // message there instead of dropping it.
    const subject = encodeURIComponent(`${form.topic}${form.orderId ? ` - ${form.orderId}` : ''}`)
    const body = encodeURIComponent(
      [
        `Name: ${form.name || '(not given)'}`,
        `Email: ${form.email}`,
        `Order: ${form.orderId || '(none)'}`,
        '',
        form.message,
      ].join('\n')
    )
    window.location.href = `mailto:${COMPANY.supportEmail}?subject=${subject}&body=${body}`
    showToast('Opening your mail app so the team gets the full details.')
  }

  return (
    <>
      <PageHero
        eyebrow="Help centre"
        title="Support that can actually fix it"
        subtitle="Most answers are below. If yours is not, the team on chat and phone can refund, reschedule or escalate without passing you around."
      />

      <Section className="bg-surface-container-lowest">
        <div className="grid sm:grid-cols-3 gap-6">
          <a
            href={`tel:${COMPANY.phoneHref}`}
            className="rounded-lg border border-surface-variant bg-surface-container-low p-8 hover-lift block"
          >
            <Phone size={24} className="text-terracotta mb-4" />
            <h3 className="text-headline-md text-on-background mb-1">Call us</h3>
            <p className="text-body-md text-terracotta font-semibold">{COMPANY.phone}</p>
            <p className="text-body-sm text-on-surface-variant mt-2 inline-flex items-center gap-1.5">
              <Clock size={14} /> {COMPANY.supportHours}
            </p>
          </a>
          <a
            href={`mailto:${COMPANY.supportEmail}`}
            className="rounded-lg border border-surface-variant bg-surface-container-low p-8 hover-lift block"
          >
            <Mail size={24} className="text-terracotta mb-4" />
            <h3 className="text-headline-md text-on-background mb-1">Email us</h3>
            <p className="text-body-md text-terracotta font-semibold break-all">{COMPANY.supportEmail}</p>
            <p className="text-body-sm text-on-surface-variant mt-2">First reply within 4 hours</p>
          </a>
          <div className="rounded-lg border border-surface-variant bg-surface-container-low p-8">
            <MapPin size={24} className="text-terracotta mb-4" />
            <h3 className="text-headline-md text-on-background mb-1">Registered office</h3>
            <address className="not-italic text-body-sm text-on-surface-variant leading-relaxed">
              {fullAddress.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>
          </div>
        </div>
      </Section>

      <Section title="Frequently asked" className="bg-surface">
        <div className="space-y-10">
          {faqs.map((group, gi) => (
            <div key={group.group}>
              <h3 className="text-label-md uppercase tracking-[0.14em] text-terracotta mb-4">
                {group.group}
              </h3>
              <div className="space-y-3">
                {group.items.map(([q, a], ii) => {
                  const key = `${gi}-${ii}`
                  const expanded = open === key
                  return (
                    <div key={q} className="rounded-DEFAULT border border-surface-variant bg-surface-container-lowest overflow-hidden">
                      <button
                        onClick={() => setOpen(expanded ? null : key)}
                        aria-expanded={expanded}
                        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-surface-container-low transition-colors"
                      >
                        <span className="text-label-lg text-on-background">{q}</span>
                        <ChevronDown
                          size={20}
                          className={`text-on-surface-variant shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expanded && (
                        <p className="px-6 pb-5 text-body-md text-on-surface-variant">{a}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <p className="text-body-md text-on-surface-variant mt-10">
          See also{' '}
          <Link to="/refunds" className="text-terracotta font-semibold hover:underline">
            cancellations and refunds
          </Link>
          ,{' '}
          <Link to="/food-safety" className="text-terracotta font-semibold hover:underline">
            food safety
          </Link>{' '}
          and{' '}
          <Link to="/how-it-works" className="text-terracotta font-semibold hover:underline">
            how subscriptions work
          </Link>
          .
        </p>
      </Section>

      <Section className="bg-surface-container-lowest">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-headline-lg text-on-background mb-3">Still stuck? Write to us</h2>
          <p className="text-body-lg text-on-surface-variant mb-8">
            Include your order number if you have one -- it saves a round trip.
          </p>

          <form onSubmit={onSubmit} className="rounded-lg border border-surface-variant bg-surface-container-low p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="s-name" className="block text-label-md text-on-surface-variant mb-2">Your name</label>
                <input id="s-name" value={form.name} onChange={update('name')} className={inputClass} />
              </div>
              <div>
                <label htmlFor="s-email" className="block text-label-md text-on-surface-variant mb-2">Email</label>
                <input id="s-email" type="email" value={form.email} onChange={update('email')} className={inputClass} required />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="s-topic" className="block text-label-md text-on-surface-variant mb-2">What is it about?</label>
                <select id="s-topic" value={form.topic} onChange={update('topic')} className={inputClass}>
                  {TOPICS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="s-order" className="block text-label-md text-on-surface-variant mb-2">
                  Order number <span className="text-outline">(optional)</span>
                </label>
                <input id="s-order" value={form.orderId} onChange={update('orderId')} placeholder="TC-000000" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="s-msg" className="block text-label-md text-on-surface-variant mb-2">How can we help?</label>
              <textarea
                id="s-msg"
                value={form.message}
                onChange={update('message')}
                rows={5}
                placeholder="Tell us what happened."
                className={`${inputClass} resize-none`}
                required
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button type="submit" size="lg">
                <Send size={18} /> Send message
              </Button>
              <p className="text-body-sm text-on-surface-variant">
                Goes straight to {COMPANY.supportEmail}. We reply within 4 hours.
              </p>
            </div>
          </form>
        </div>
      </Section>
    </>
  )
}
