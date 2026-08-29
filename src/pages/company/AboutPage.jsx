import { Link } from 'react-router-dom'
import { Heart, HandHeart, ShieldCheck, Sprout, ArrowRight } from 'lucide-react'
import PageHero, { Section } from '../../components/layout/PageHero.jsx'
import Button from '../../components/ui/Button.jsx'
import { COMPANY } from '../../config/company.js'
import { securePath } from '../../lib/secureParams.js'

const values = [
  {
    icon: Heart,
    title: 'Home food, not restaurant food',
    body: 'We are not trying to be a cloud kitchen. The whole point is the cook who makes forty tiffins the way she makes her own lunch -- less oil, more dal, and the sabzi that was cheapest at the market that morning.',
  },
  {
    icon: HandHeart,
    title: 'The kitchen keeps the margin',
    body: 'Our commission is a flat 12%. No paid ranking, no ads to bid on, no deep-discount campaigns funded out of a partner payout. A kitchen that cooks well should rise because it cooks well.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified, then trusted',
    body: 'Every kitchen is FSSAI-registered and audited before its first order goes out. After that we get out of the way -- we do not dictate menus, portion sizes or recipes.',
  },
  {
    icon: Sprout,
    title: 'Small radius, small footprint',
    body: 'We only match you with kitchens within about five kilometres. That keeps food hot, riders local, and the carbon cost of your lunch closer to a walk than a haul.',
  },
]

const timeline = [
  { year: '2024', title: 'A spreadsheet and eleven kitchens', body: 'Started in Satellite, Ahmedabad, coordinating tiffins over WhatsApp for hostel students who were tired of paying restaurant prices for weekday lunch.' },
  { year: '2025', title: 'Subscriptions, properly', body: 'Replaced the spreadsheet with real plans -- pause, skip, holiday calendars -- because the hardest part of a tiffin service was never the cooking, it was the scheduling.' },
  { year: '2026', title: 'Four cities, still hyperlocal', body: 'Ahmedabad, Pune, Indore and Jaipur. Same rule everywhere: a kitchen serves its own neighbourhood, and nothing travels more than five kilometres.' },
]

const stats = [
  { value: '1,240+', label: 'Home kitchens on the platform' },
  { value: '38,000', label: 'Tiffins delivered each week' },
  { value: '12%', label: 'Flat commission, no ad auctions' },
  { value: '4.6', label: 'Average kitchen rating' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`Since ${COMPANY.foundedYear}`}
        title="We started because hostel food was terrible"
        subtitle="TiffinConnect is a marketplace for home cooks who were already feeding their neighbourhood, and needed a way to do it without running the whole operation on WhatsApp."
      />

      <Section className="bg-surface-container-lowest">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-surface-variant bg-surface-container-low p-8 text-center">
              <p className="font-display text-headline-lg text-terracotta mb-2">{s.value}</p>
              <p className="text-body-sm text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-body-sm text-outline mt-6 text-center">
          Illustrative figures for this demo build -- no live data sits behind them.
        </p>
      </Section>

      <Section
        title="What we hold to"
        lead="Four decisions that shape most of the smaller ones."
        className="bg-surface"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((v) => (
            <div key={v.title} className="rounded-lg border border-surface-variant bg-surface-container-lowest p-8 ambient-shadow hover-lift">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-terracotta mb-5">
                <v.icon size={24} />
              </div>
              <h3 className="text-headline-md text-on-background mb-3">{v.title}</h3>
              <p className="text-body-md text-on-surface-variant">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How we got here" className="bg-surface-container-lowest">
        <ol className="relative border-l-2 border-outline-variant/50 ml-3 space-y-10">
          {timeline.map((t) => (
            <li key={t.year} className="pl-8 relative">
              <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-terracotta ring-4 ring-surface-container-lowest" />
              <p className="text-label-md uppercase tracking-[0.14em] text-terracotta mb-1">{t.year}</p>
              <h3 className="text-headline-md text-on-background mb-2">{t.title}</h3>
              <p className="text-body-md text-on-surface-variant max-w-2xl">{t.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-surface">
        <div className="rounded-xl border border-surface-variant bg-surface-container-low p-10 md:p-14 text-center">
          <h2 className="text-headline-lg text-on-background mb-3">Come cook with us, or come eat</h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
            Both sides of the marketplace start in the same place -- a kitchen in your neighbourhood
            that already makes food you would happily eat every day.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button as={Link} to="/discover" size="lg">
              Browse kitchens <ArrowRight size={20} />
            </Button>
            <Button
              as={Link}
              to={securePath('/login', { tab: 'signup', role: 'provider' })}
              variant="secondary"
              size="lg"
            >
              List your kitchen
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
