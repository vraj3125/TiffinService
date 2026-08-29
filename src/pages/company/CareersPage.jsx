import { useState } from 'react'
import { MapPin, Clock, ChevronDown, Mail } from 'lucide-react'
import PageHero, { Section } from '../../components/layout/PageHero.jsx'
import Button from '../../components/ui/Button.jsx'
import { COMPANY } from '../../config/company.js'

const roles = [
  {
    id: 'kitchen-ops-ahm',
    title: 'Kitchen Onboarding Associate',
    team: 'Operations',
    location: 'Ahmedabad',
    type: 'Full-time',
    about: 'Visit home kitchens, verify licences and hygiene, and get new partners live. You will be on a scooter more than at a desk.',
    looking: [
      'Two years in food service, quick-commerce ops or field sales',
      'Fluent Gujarati and Hindi; enough English to write an audit note',
      'A two-wheeler and a licence',
      'Comfortable telling a warm, welcoming cook that their storage is not up to standard',
    ],
  },
  {
    id: 'frontend-eng',
    title: 'Frontend Engineer',
    team: 'Engineering',
    location: 'Ahmedabad or remote (India)',
    type: 'Full-time',
    about: 'Own the customer and partner web apps. React, Vite, Tailwind, Firebase. Small team, so you will ship, support and decide.',
    looking: [
      'Three or more years writing production React',
      'Care about the boring parts -- loading states, empty states, error copy',
      'Able to reason about accessibility without being asked twice',
      'Bonus: you have built something people paid money through',
    ],
  },
  {
    id: 'support-lead',
    title: 'Customer Support Lead',
    team: 'Support',
    location: 'Ahmedabad',
    type: 'Full-time',
    about: 'Run the support desk across chat, email and phone. Set the tone: fast, plain-spoken, and empowered to refund without escalation.',
    looking: [
      'Three or more years in support, at least one leading a small team',
      'Written English and Hindi that reads like a person, not a template',
      'Instinct for which complaints are a pattern and which are a bad day',
    ],
  },
  {
    id: 'city-launch-pune',
    title: 'City Launch Manager',
    team: 'Growth',
    location: 'Pune',
    type: 'Full-time',
    about: 'Take a new neighbourhood from zero to a hundred kitchens: recruit cooks, seed demand, and figure out what does not transfer from Ahmedabad.',
    looking: [
      'Four or more years in marketplace or field growth roles',
      'Have launched a market, or been early on one and seen what broke',
      'Happy owning a number and reporting it honestly when it is bad',
    ],
  },
]

export default function CareersPage() {
  const [open, setOpen] = useState(null)

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Small team, unusually direct work"
        subtitle="Most of what we do involves standing in someone's kitchen or on someone's doorstep. If you like feedback loops measured in hours rather than quarters, this is that."
      />

      <Section className="bg-surface-container-lowest">
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {[
            ['Health cover from day one', 'For you, a partner and two dependents. No waiting period.'],
            ['Lunch, obviously', 'A funded TiffinConnect subscription from a kitchen you pick.'],
            ['Four-day fortnight', 'Every second Friday off, company-wide. Not a rota.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-surface-variant bg-surface-container-low p-6">
              <h3 className="text-label-lg text-on-background mb-2">{title}</h3>
              <p className="text-body-sm text-on-surface-variant">{body}</p>
            </div>
          ))}
        </div>

        <h2 className="text-headline-lg text-on-background mb-6">Open roles</h2>
        <div className="space-y-4">
          {roles.map((r) => {
            const expanded = open === r.id
            return (
              <div key={r.id} className="rounded-lg border border-surface-variant bg-surface-container-low overflow-hidden">
                <button
                  onClick={() => setOpen(expanded ? null : r.id)}
                  aria-expanded={expanded}
                  className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-surface-container transition-colors"
                >
                  <div>
                    <p className="text-label-md uppercase tracking-[0.14em] text-terracotta mb-2">{r.team}</p>
                    <h3 className="text-headline-md text-on-background mb-2">{r.title}</h3>
                    <div className="flex flex-wrap gap-4 text-body-sm text-on-surface-variant">
                      <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {r.location}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {r.type}</span>
                    </div>
                  </div>
                  <ChevronDown
                    size={22}
                    className={`text-on-surface-variant shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {expanded && (
                  <div className="px-6 pb-6 border-t border-outline-variant/50 pt-5">
                    <p className="text-body-md text-on-surface-variant mb-5">{r.about}</p>
                    <h4 className="text-label-lg text-on-background mb-3">What we are looking for</h4>
                    <ul className="space-y-2 mb-6">
                      {r.looking.map((l) => (
                        <li key={l} className="text-body-md text-on-surface-variant flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-terracotta shrink-0" />
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      as="a"
                      href={`mailto:${COMPANY.careersEmail}?subject=${encodeURIComponent(`Application: ${r.title}`)}`}
                    >
                      <Mail size={18} /> Apply for this role
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest p-10 md:p-14 text-center">
          <h2 className="text-headline-lg text-on-background mb-3">Nothing fits?</h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
            Write to us anyway. Tell us what you would want to work on here and what you have built
            before. We read everything and reply either way.
          </p>
          <Button as="a" href={`mailto:${COMPANY.careersEmail}`} size="lg">
            <Mail size={20} /> {COMPANY.careersEmail}
          </Button>
          <p className="text-body-sm text-outline mt-6">
            Demo build -- these roles are illustrative and the mailbox is not monitored.
          </p>
        </div>
      </Section>
    </>
  )
}
