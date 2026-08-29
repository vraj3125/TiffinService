import { Link } from 'react-router-dom'
import { Recycle, Bike, Sprout, Utensils, ArrowRight } from 'lucide-react'
import PageHero, { Section } from '../../components/layout/PageHero.jsx'
import Button from '../../components/ui/Button.jsx'

const pillars = [
  {
    icon: Recycle,
    title: 'Steel tiffins, swapped daily',
    body: 'Kitchens on the reusable programme deliver in insulated steel carriers and collect yesterday\u2019s at the same time. One carrier replaces roughly 260 single-use containers a year.',
    stat: '61%',
    statLabel: 'of subscriptions now on reusable carriers',
  },
  {
    icon: Bike,
    title: 'Nothing travels far',
    body: 'A kitchen only appears to you if it is within about five kilometres. Short routes mean cycles and electric two-wheelers do most of the work, and food arrives hot without a heated bag.',
    stat: '3.4 km',
    statLabel: 'median delivery distance',
  },
  {
    icon: Utensils,
    title: 'Cooked to a headcount',
    body: 'Subscriptions tell a kitchen exactly how many portions to make the night before. That is the single biggest reason home kitchens waste less food than restaurants do.',
    stat: '~4%',
    statLabel: 'average prepared-food waste',
  },
  {
    icon: Sprout,
    title: 'Bought that morning, locally',
    body: 'Most partner kitchens shop daily at their neighbourhood market rather than holding cold storage. Seasonal menus follow what is actually in the mandi that week.',
    stat: '12 hrs',
    statLabel: 'typical time from market to plate',
  },
]

const commitments = [
  ['Plastic-free packaging by 2027', 'Single-use kitchens are moving to bagasse and kraft. We subsidise half the switching cost for partners who commit to it.'],
  ['No dark stores, ever', 'We do not warehouse pre-cooked food. Every meal is made the morning it is eaten, in a home kitchen.'],
  ['Cutlery off by default', 'Nobody eating at home needs a plastic spoon. Ask for cutlery and you get it; otherwise it is not packed.'],
  ['Surplus goes somewhere', 'Kitchens that over-cook can list surplus portions at a reduced price in the last hour, instead of binning them.'],
]

export default function SustainabilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Sustainability"
        title="A tiffin is already the low-waste option"
        subtitle="Home kitchens cooking a known headcount within a five-kilometre radius beat almost any other way of getting lunch. Our job is mostly to avoid ruining that."
      />

      <Section className="bg-surface-container-lowest">
        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-lg border border-surface-variant bg-surface-container-low p-8 flex flex-col">
              <div className="w-14 h-14 rounded-full bg-leaf-success/10 flex items-center justify-center text-leaf-success mb-5">
                <p.icon size={24} />
              </div>
              <h3 className="text-headline-md text-on-background mb-3">{p.title}</h3>
              <p className="text-body-md text-on-surface-variant flex-1">{p.body}</p>
              <div className="mt-6 pt-5 border-t border-outline-variant/60">
                <p className="font-display text-headline-lg text-leaf-success">{p.stat}</p>
                <p className="text-body-sm text-on-surface-variant">{p.statLabel}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-body-sm text-outline mt-6">
          Figures are illustrative for this demo build and are not audited.
        </p>
      </Section>

      <Section
        title="What we have committed to"
        lead="Targets we would rather be held to publicly than quietly drop."
        className="bg-surface"
      >
        <div className="space-y-4">
          {commitments.map(([title, body]) => (
            <div
              key={title}
              className="rounded-DEFAULT border border-surface-variant bg-surface-container-lowest p-6 flex flex-col sm:flex-row gap-4 sm:gap-8"
            >
              <h3 className="text-label-lg text-on-background sm:w-64 shrink-0">{title}</h3>
              <p className="text-body-md text-on-surface-variant">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-surface-container-lowest">
        <div className="rounded-xl bg-leaf-success/5 border border-leaf-success/20 p-10 md:p-14 text-center">
          <h2 className="text-headline-lg text-on-background mb-3">Choose a reusable kitchen</h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
            Kitchens running the steel-carrier programme are marked on their listing. It costs the
            same and saves about five containers a week.
          </p>
          <Button as={Link} to="/discover" size="lg">
            Browse kitchens <ArrowRight size={20} />
          </Button>
        </div>
      </Section>
    </>
  )
}
