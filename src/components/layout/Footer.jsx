import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  UtensilsCrossed,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ArrowRight,
  BadgeCheck,
  Clock,
} from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'
import { COMPANY, fullAddress } from '../../config/company.js'
import { securePath } from '../../lib/secureParams.js'

const socialIcons = { instagram: Instagram, twitter: Twitter, linkedin: Linkedin, youtube: Youtube }

// Every entry here resolves to a real route or a real mailto/tel -- if you add a
// link, add its page in App.jsx at the same time.
const columns = [
  {
    heading: 'Discover',
    links: [
      { label: 'Browse kitchens', to: '/discover' },
      { label: 'How it works', to: '/how-it-works' },
      { label: 'Gift cards', to: '/gift-cards' },
      { label: 'Food safety', to: '/food-safety' },
    ],
  },
  {
    heading: 'For kitchens',
    links: [
      { label: 'Join as provider', to: securePath('/login', { tab: 'signup', role: 'provider' }) },
      { label: 'Why partner with us', to: '/partner' },
      { label: 'Sustainability', to: '/sustainability' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Help centre', to: '/support' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms of service', to: '/terms' },
      { label: 'Privacy policy', to: '/privacy' },
      { label: 'Cancellation & refunds', to: '/refunds' },
    ],
  },
]

// Only identifiers that have been filled in are shown at all.
const statutory = [
  COMPANY.fssai && `FSSAI Lic. ${COMPANY.fssai}`,
  COMPANY.cin && `CIN ${COMPANY.cin}`,
  COMPANY.gstin && `GSTIN ${COMPANY.gstin}`,
].filter(Boolean)

const linkClass =
  'text-body-sm text-on-surface-variant hover:text-terracotta transition-colors duration-200 w-fit'

export default function Footer() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')

  // There is no mailing-list backend, so the subscribe button opens the
  // visitor's mail app addressed to us. It genuinely reaches someone, which a
  // form that silently swallows the address would not.
  const onSubscribe = (e) => {
    e.preventDefault()
    if (!email.includes('@')) {
      showToast('Enter a valid email address', 'info')
      return
    }
    const subject = encodeURIComponent('Subscribe me to the weekly menu email')
    const body = encodeURIComponent(`Please add ${email} to the weekly menu list.`)
    window.location.href = `mailto:${COMPANY.email}?subject=${subject}&body=${body}`
    showToast('Opening your mail app to confirm the subscription.')
    setEmail('')
  }

  return (
    <footer className="w-full mt-section-gap bg-surface-container-lowest border-t border-surface-variant">
      <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop py-16">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-gutter gap-y-12">
          {/* Brand + contact */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <UtensilsCrossed size={20} className="text-terracotta" />
              <span className="text-headline-md font-display font-bold text-terracotta">
                {COMPANY.name}
              </span>
            </Link>
            <p className="text-body-sm text-on-surface-variant mb-6 max-w-xs">{COMPANY.tagline}</p>

            <ul className="space-y-3">
              {COMPANY.phone && (
                <li>
                  <a href={`tel:${COMPANY.phoneHref}`} className={`${linkClass} flex items-center gap-2.5`}>
                    <Phone size={15} className="text-terracotta shrink-0" /> {COMPANY.phone}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${COMPANY.supportEmail}`} className={`${linkClass} flex items-center gap-2.5`}>
                  <Mail size={15} className="text-terracotta shrink-0" /> {COMPANY.supportEmail}
                </a>
              </li>
              <li className="flex gap-2.5 text-body-sm text-on-surface-variant">
                <MapPin size={15} className="text-terracotta shrink-0 mt-1" />
                <address className="not-italic leading-relaxed">
                  {fullAddress.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </address>
              </li>
              <li className="flex gap-2.5 text-body-sm text-on-surface-variant">
                <Clock size={15} className="text-terracotta shrink-0 mt-0.5" />
                <span>{COMPANY.supportHours}</span>
              </li>
            </ul>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-label-md uppercase tracking-[0.14em] text-on-surface mb-4">
                {col.heading}
              </h2>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-14 pt-10 border-t border-surface-variant flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-md">
            <h2 className="text-headline-md text-on-background mb-1">This week&apos;s menus</h2>
            <p className="text-body-sm text-on-surface-variant">
              One email each Sunday with new kitchens in your area and what they are cooking.
            </p>
          </div>
          <form onSubmit={onSubscribe} className="flex gap-2 w-full lg:w-auto">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 lg:w-72 min-h-[48px] rounded-full border border-outline-variant bg-surface px-5 text-body-sm text-on-surface placeholder:text-outline focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all"
            />
            <button
              type="submit"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-terracotta text-on-primary px-6 text-label-lg font-semibold hover:bg-primary transition-colors"
            >
              Subscribe <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Statutory strip -- only the identifiers that have actually been issued. */}
      {(statutory.length > 0 || COMPANY.social.length > 0) && (
        <div className="border-t border-surface-variant bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-body-sm text-on-surface-variant">
              {statutory.map((entry, i) => (
                <span key={entry} className="inline-flex items-center gap-1.5">
                  {i === 0 && <BadgeCheck size={15} className="text-leaf-success" />}
                  {entry}
                </span>
              ))}
            </div>
            {COMPANY.social.length > 0 && (
              <ul className="flex items-center gap-2">
                {COMPANY.social.map((s) => {
                  const Icon = socialIcons[s.icon]
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${COMPANY.name} on ${s.label}`}
                        className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-terracotta hover:border-terracotta transition-colors"
                      >
                        <Icon size={16} />
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-surface-variant">
        <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <p className="text-body-sm text-on-surface-variant">
            &copy; {new Date().getFullYear()} {COMPANY.legalName}. {COMPANY.tagline}
          </p>
          <p className="text-body-sm text-on-surface-variant">
            Made in Vadodara, Gujarat.
          </p>
        </div>
      </div>
    </footer>
  )
}
