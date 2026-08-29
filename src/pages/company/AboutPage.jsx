import { Link } from 'react-router-dom'
import { Heart, HandHeart, ShieldCheck, Sprout, ArrowRight } from 'lucide-react'
import PageHero, { Section } from '../../components/layout/PageHero.jsx'
import Button from '../../components/ui/Button.jsx'
import { COMPANY } from '../../config/company.js'
import { CITY, DEFAULT_RADIUS_KM } from '../../config/locations.js'
import { securePath } from '../../lib/secureParams.js'

const values = [
  {
    icon: Heart,
    title: 'Home food, not restaurant food',
    body: 'We are not a cloud kitchen. The whole point is the cook who makes thirty tiffins the way she makes her own lunch — less oil, more dal, and whatever was freshest at the market that morning.',
  },
  {
    icon: HandHeart,
    title: 'The kitchen keeps the margin',
    body: 'Our commission is a flat 12%. No listing fee, no paid ranking, no ads to bid on, and no discount campaign funded out of a cook\u2019s payout. A kitchen that cooks well should rise because it cooks well.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified before the first order',
    body: 'Every kitchen shows us a valid FSSAI registration and passes a hygiene check before it can take a subscription. After that we stay out of the way — we do not dictate menus, portions or recipes.',
  },
  {
    icon: Sprout,
    title: 'Your own neighbourhood',
    body: `Kitchens set how far they will deliver, usually about ${DEFAULT_RADIUS_KM} km. Short routes keep food hot without a heated bag and keep the rider local.`,
  },
]

const facts = [
  { value: CITY.name, label: 'The one city we serve' },
  { value: '12%', label: 'Flat commission, no ad auctions' },
  { value: `${DEFAULT_RADIUS_KM} km`, label: 'Typical delivery radius' },
  { value: 'FSSAI', label: 'Verified before a kitchen goes live' },
]

const plan = [
  {
    title: 'Where we are',
    body: 'Opening in Vadodara with a small group of home kitchens across Alkapuri, Gotri, Karelibaug, Akota and Manjalpur. Small on purpose — we would rather every early subscriber get a good tiffin than fill a map.',
  },
  {
    title: 'What we are working on',
    body: 'Getting the everyday things right first: an honest delivery window, a skip that actually works before the cut-off, and a refund that does not need three emails.',
  },
  {
    title: 'What comes next',
    body: 'More of Vadodara, then the towns around it — Padra, Waghodia, Bajwa, Savli. We will add a new area only once there is a kitchen in it that we would order from ourselves.',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`${CITY.name}, ${CITY.state}`}
        title="Good home food should not be hard to find"
        subtitle="TiffinConnect is a marketplace for Vadodara's home cooks — people already feeding their neighbourhood, who needed a way to run it without a notebook and a WhatsApp group."
      />

      <Section className="bg-surface-container-lowest">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facts.map((f) => (
            <div key={f.label} className="rounded-lg border border-surface-variant bg-surface-container-low p-8 text-center">
              <p className="font-display text-headline-lg text-terracotta mb-2">{f.value}</p>
              <p className="text-body-sm text-on-surface-variant">{f.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Why we started"
        lead="Anyone who has moved to a new city for work or a course knows the problem."
        className="bg-surface"
      >
        <div className="max-w-3xl space-y-5">
          <p className="text-body-lg text-on-surface-variant">
            Eating out every day is expensive and, by the second week, exhausting. Cooking after a
            nine-hour shift is worse. The answer in Gujarat has always been the same one: a tiffin
            from someone nearby who cooks properly.
          </p>
          <p className="text-body-lg text-on-surface-variant">
            That part already works. What does not work is everything around it — finding a cook
            with space, agreeing a price over the phone, remembering to tell her you are away on
            Thursday, and settling up at the end of the month. Those are the bits we built.
          </p>
          <p className="text-body-lg text-on-surface-variant">
            We are new, and deliberately small. Every kitchen on the platform has been visited. If
            something goes wrong with your tiffin, the person who answers is someone who can fix it.
          </p>
        </div>
      </Section>

      <Section title="Where this is going" className="bg-surface-container-lowest">
        <div className="grid md:grid-cols-3 gap-6">
          {plan.map((p) => (
            <div key={p.title} className="rounded-lg border border-surface-variant bg-surface-container-low p-8">
              <h3 className="text-headline-md text-on-background mb-3">{p.title}</h3>
              <p className="text-body-md text-on-surface-variant">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="What we hold to" className="bg-surface">
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

      <Section className="bg-surface-container-lowest">
        <div className="rounded-xl border border-surface-variant bg-surface-container-low p-10 md:p-14 text-center">
          <h2 className="text-headline-lg text-on-background mb-3">Cook with us, or eat with us</h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
            If you already cook for a few people in your area, we would like to hear from you. If you
            are just hungry, there are kitchens taking subscriptions now.
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
          <p className="text-body-sm text-on-surface-variant mt-6">
            Questions? <a href={`mailto:${COMPANY.email}`} className="text-terracotta hover:underline">{COMPANY.email}</a>
          </p>
        </div>
      </Section>
    </>
  )
}
