import { Link } from 'react-router-dom'
import { BadgeCheck, ClipboardCheck, Thermometer, Siren, AlertTriangle } from 'lucide-react'
import PageHero, { Section } from '../../components/layout/PageHero.jsx'
import Button from '../../components/ui/Button.jsx'
import { COMPANY } from '../../config/company.js'

const gates = [
  {
    icon: BadgeCheck,
    title: 'Licence check, before anything',
    body: 'No kitchen takes an order until we have verified a valid FSSAI registration or licence against the address it cooks at. Expiring licences lock the listing automatically 14 days out.',
  },
  {
    icon: ClipboardCheck,
    title: 'Kitchen visit and photo audit',
    body: 'A first-time partner is visited before going live: storage, water source, gas safety, pest control, separate veg and non-veg boards. Re-audited every six months, and unannounced after any complaint.',
  },
  {
    icon: Thermometer,
    title: 'Cooked late, delivered fast',
    body: 'Kitchens cook to the morning headcount rather than in advance, and the five-kilometre radius keeps food out of the 5–60°C danger band. Median time from lid-on to doorstep is 34 minutes.',
  },
  {
    icon: Siren,
    title: 'One report starts a review',
    body: 'A single credible illness report pauses new subscriptions to that kitchen while we investigate. We would rather be wrong and apologise than wait for a pattern.',
  },
]

const checklist = [
  'Valid FSSAI registration displayed on the listing',
  'Potable water for cooking and washing, tested annually',
  'Separate chopping boards and utensils for veg and non-veg',
  'Refrigeration below 5°C with a visible thermometer',
  'Cooks free of open wounds, wearing hair covering and gloves for plating',
  'Pest control contract, with the last service date on file',
  'Tamper-evident lids and a batch label on every tiffin',
  'No reheating of unsold food for the next day, ever',
]

export default function FoodSafetyPage() {
  return (
    <>
      <PageHero
        eyebrow="Food safety"
        title="Someone else is cooking. Here is why that is safe."
        subtitle="Home kitchens are held to the same FSSAI standards as any commercial one. This is what we check, how often, and what happens when a kitchen falls short."
      />

      <Section className="bg-surface-container-lowest">
        <div className="grid md:grid-cols-2 gap-6">
          {gates.map((g) => (
            <div key={g.title} className="rounded-lg border border-surface-variant bg-surface-container-low p-8">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-terracotta mb-5">
                <g.icon size={24} />
              </div>
              <h3 className="text-headline-md text-on-background mb-3">{g.title}</h3>
              <p className="text-body-md text-on-surface-variant">{g.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="The audit checklist"
        lead="Every item is verified on site before a kitchen goes live, and re-verified twice a year."
        className="bg-surface"
      >
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
          {checklist.map((item) => (
            <div key={item} className="flex gap-3 items-start">
              <BadgeCheck size={20} className="text-leaf-success shrink-0 mt-0.5" />
              <span className="text-body-md text-on-surface-variant">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-surface-container-lowest">
        <div className="rounded-lg border border-mustard/40 bg-mustard/10 p-8 flex flex-col sm:flex-row gap-6 items-start">
          <AlertTriangle size={28} className="text-secondary shrink-0" />
          <div>
            <h2 className="text-headline-md text-on-background mb-3">Allergies: read this bit</h2>
            <p className="text-body-md text-on-surface-variant mb-3">
              Home kitchens are shared spaces. A veg-only kitchen may still handle nuts, dairy,
              gluten, sesame or mustard on the same surfaces. We cannot certify any meal as free from
              a given allergen, and we will not pretend otherwise.
            </p>
            <p className="text-body-md text-on-surface-variant">
              If your allergy is serious, message the kitchen from the listing before you subscribe
              and ask directly. Treat dietary labels as the cook&apos;s best effort, not a lab result.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="rounded-xl border border-surface-variant bg-surface-container-low p-10 md:p-14 text-center">
          <h2 className="text-headline-lg text-on-background mb-3">Report a food safety concern</h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
            Illness, a foreign object, spoiled food or anything you saw at a kitchen. Reports are
            reviewed the same day and you can stay anonymous to the kitchen.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button as={Link} to="/support" size="lg">
              Report an issue
            </Button>
            <Button as="a" href={`tel:${COMPANY.phoneHref}`} variant="secondary" size="lg">
              Call {COMPANY.phone}
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
