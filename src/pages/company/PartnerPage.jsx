import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IndianRupee, CalendarRange, Users, LineChart, ArrowRight } from 'lucide-react'
import PageHero, { Section } from '../../components/layout/PageHero.jsx'
import Button from '../../components/ui/Button.jsx'
import { COMPANY } from '../../config/company.js'
import { securePath } from '../../lib/secureParams.js'

const COMMISSION = 0.12

const benefits = [
  { icon: IndianRupee, title: 'Flat 12% commission', body: 'No listing fee, no ad auction, no charge for being shown higher. What you price is what you are paid, minus one number you already know.' },
  { icon: CalendarRange, title: 'Cook to a known count', body: 'Subscriptions close the night before, so you shop and cook for an exact headcount instead of guessing and binning the difference.' },
  { icon: Users, title: 'Regulars, not one-offs', body: 'Subscriptions run by the week or the month, so you are building a regular round rather than chasing a fresh order every morning.' },
  { icon: LineChart, title: 'Weekly payouts', body: 'Every Tuesday for the week before, straight to your bank account, with a statement that reconciles to the paisa.' },
]

const steps = [
  ['Sign up', 'Business name, email, and the area you cook for. Two minutes.'],
  ['Verify', 'Upload your FSSAI registration, address proof and bank details. We check them in 24-48 hours.'],
  ['Build your menu', 'Set your weekly rotation, plan prices, delivery windows, daily capacity and your cut-off time.'],
  ['Go live', 'A field visit, then your listing opens to the neighbourhood. Most kitchens take their first subscription within a week.'],
]

export default function PartnerPage() {
  const [meals, setMeals] = useState(40)
  const [price, setPrice] = useState(90)

  const monthlyGross = meals * price * 26
  const monthlyNet = Math.round(monthlyGross * (1 - COMMISSION))
  const inr = (n) => n.toLocaleString('en-IN')

  return (
    <>
      <PageHero
        eyebrow="For kitchens"
        title="You already cook for forty people"
        subtitle="TiffinConnect handles the subscriptions, the payments, the pausing, the delivery and the chasing. You keep cooking, and keep 88% of what you charge."
      >
        <Button as={Link} to={securePath('/login', { tab: 'signup', role: 'provider' })} size="lg">
          List your kitchen <ArrowRight size={20} />
        </Button>
      </PageHero>

      <Section className="bg-surface-container-lowest">
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-lg border border-surface-variant bg-surface-container-low p-8">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-terracotta mb-5">
                <b.icon size={24} />
              </div>
              <h3 className="text-headline-md text-on-background mb-3">{b.title}</h3>
              <p className="text-body-md text-on-surface-variant">{b.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="What that comes to"
        lead="Move the sliders to your own numbers. Assumes 26 delivery days a month."
        className="bg-surface"
      >
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-8 rounded-lg border border-surface-variant bg-surface-container-lowest p-8">
            <div>
              <div className="flex justify-between mb-3">
                <label htmlFor="meals" className="text-label-lg text-on-background">Tiffins per day</label>
                <span className="text-label-lg text-terracotta">{meals}</span>
              </div>
              <input
                id="meals"
                type="range"
                min="10"
                max="150"
                step="5"
                value={meals}
                onChange={(e) => setMeals(Number(e.target.value))}
                className="w-full accent-terracotta"
              />
            </div>
            <div>
              <div className="flex justify-between mb-3">
                <label htmlFor="price" className="text-label-lg text-on-background">Price per tiffin</label>
                <span className="text-label-lg text-terracotta">&#8377;{price}</span>
              </div>
              <input
                id="price"
                type="range"
                min="50"
                max="250"
                step="5"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-terracotta"
              />
            </div>
          </div>

          <div className="rounded-lg bg-surface-container-low border border-surface-variant p-8">
            <div className="flex justify-between py-3 border-b border-outline-variant/60">
              <span className="text-body-md text-on-surface-variant">Monthly gross</span>
              <span className="text-body-md text-on-surface">&#8377;{inr(monthlyGross)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-outline-variant/60">
              <span className="text-body-md text-on-surface-variant">Platform commission (12%)</span>
              <span className="text-body-md text-on-surface">-&#8377;{inr(monthlyGross - monthlyNet)}</span>
            </div>
            <div className="flex justify-between pt-5">
              <span className="text-label-lg text-on-background">You receive</span>
              <span className="font-display text-headline-lg text-leaf-success">&#8377;{inr(monthlyNet)}</span>
            </div>
            <p className="text-body-sm text-on-surface-variant mt-4">
              Before your own ingredient and gas costs.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Getting listed" className="bg-surface-container-lowest">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(([title, body], i) => (
            <div key={title} className="rounded-lg border border-surface-variant p-6">
              <span className="font-display text-headline-lg text-outline-variant">0{i + 1}</span>
              <h3 className="text-headline-md text-on-background mt-2 mb-2">{title}</h3>
              <p className="text-body-sm text-on-surface-variant">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-surface-variant bg-surface-container-low p-10 text-center">
          <h2 className="text-headline-lg text-on-background mb-3">Questions before you commit?</h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
            Our onboarding team answers licence, pricing and capacity questions before you fill in
            anything.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button as={Link} to={securePath('/login', { tab: 'signup', role: 'provider' })} size="lg">
              Start signing up <ArrowRight size={20} />
            </Button>
            <Button as="a" href={`mailto:${COMPANY.partnersEmail}`} variant="secondary" size="lg">
              {COMPANY.partnersEmail}
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
