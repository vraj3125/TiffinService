import { Link } from 'react-router-dom'
import { Search, CalendarCheck, Bike, PauseCircle, Wallet, MessageSquareWarning, ArrowRight } from 'lucide-react'
import PageHero, { Section } from '../../components/layout/PageHero.jsx'
import Button from '../../components/ui/Button.jsx'

const steps = [
  {
    icon: Search,
    title: 'Find kitchens near you',
    body: 'Enter your area and we show only the kitchens that actually deliver to it -- usually within five kilometres. Filter by veg or non-veg, cuisine, price and rating.',
    detail: 'Every listing shows this week\u2019s menu, the delivery windows on offer, and how many people are already subscribed.',
  },
  {
    icon: CalendarCheck,
    title: 'Pick a plan and a window',
    body: 'Choose lunch, dinner or both, then weekly, monthly or quarterly. Set your delivery window and your start date, and pay once for the plan period.',
    detail: 'Longer plans cost less per meal. You are never locked in -- unused deliveries are refundable.',
  },
  {
    icon: Bike,
    title: 'Eat, and forget about it',
    body: 'Your tiffin arrives in your window, every scheduled day, from the same kitchen. No ordering, no deciding, no 11:40 AM panic.',
    detail: 'You get a notification when the rider picks up, and live tracking for the last leg.',
  },
]

const controls = [
  {
    icon: PauseCircle,
    title: 'Skip or pause, free',
    body: 'Going home for the weekend? Skip those days before 9:00 PM the night before and they are added to the end of your plan instead of being lost.',
  },
  {
    icon: Wallet,
    title: 'One payment, itemised',
    body: 'Meal price, delivery and GST are shown separately before you confirm. No surge, no fee that appears at the last screen.',
  },
  {
    icon: MessageSquareWarning,
    title: 'Something wrong? Refunded',
    body: 'Report a cold, late or wrong meal within 24 hours from the order screen. Upheld claims are refunded to the original payment method.',
  },
]

const faqs = [
  ['When do meals arrive?', 'Lunch windows run 12:00-1:30 PM and dinner 7:30-9:00 PM. You choose one when you subscribe, and it stays the same every day.'],
  ['Can I change my address mid-plan?', 'Yes, as long as the new address is still inside your kitchen\u2019s delivery radius. Change it before the daily cut-off and it applies from the next meal.'],
  ['What if my kitchen takes a holiday?', 'Providers publish holidays in advance. You are not charged for those days and your plan extends by the same number of deliveries.'],
  ['Do I need to return the containers?', 'Kitchens on the reusable steel programme swap your empty tiffin for the full one at the next delivery. Others use recyclable single-use packaging.'],
]

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Three steps, then lunch just happens"
        subtitle="Set a subscription up once and a home-cooked tiffin arrives every scheduled day. Here is exactly what that looks like."
      >
        <Button as={Link} to="/discover" size="lg">
          Find kitchens near me <ArrowRight size={20} />
        </Button>
      </PageHero>

      <Section className="bg-surface-container-lowest">
        <div className="space-y-6">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="flex flex-col md:flex-row gap-6 md:gap-10 rounded-lg border border-surface-variant bg-surface-container-low p-8 md:p-10"
            >
              <div className="shrink-0 flex md:flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-terracotta text-on-primary flex items-center justify-center">
                  <s.icon size={28} />
                </div>
                <span className="font-display text-headline-lg text-outline-variant">0{i + 1}</span>
              </div>
              <div>
                <h3 className="text-headline-md text-on-background mb-3">{s.title}</h3>
                <p className="text-body-lg text-on-surface-variant mb-3">{s.body}</p>
                <p className="text-body-sm text-outline">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="You stay in control"
        lead="A subscription should be easier to change than a restaurant order, not harder."
        className="bg-surface"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {controls.map((c) => (
            <div key={c.title} className="rounded-lg border border-surface-variant bg-surface-container-lowest p-8 ambient-shadow">
              <c.icon size={26} className="text-terracotta mb-4" />
              <h3 className="text-headline-md text-on-background mb-2">{c.title}</h3>
              <p className="text-body-md text-on-surface-variant">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Common questions" className="bg-surface-container-lowest">
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map(([q, a]) => (
            <div key={q} className="rounded-DEFAULT border border-surface-variant p-6">
              <h3 className="text-label-lg text-on-background mb-2">{q}</h3>
              <p className="text-body-md text-on-surface-variant">{a}</p>
            </div>
          ))}
        </div>
        <p className="text-body-md text-on-surface-variant mt-8">
          More in the{' '}
          <Link to="/support" className="text-terracotta font-semibold hover:underline">
            help centre
          </Link>
          , or read the{' '}
          <Link to="/refunds" className="text-terracotta font-semibold hover:underline">
            cancellation and refund policy
          </Link>
          .
        </p>
      </Section>
    </>
  )
}
