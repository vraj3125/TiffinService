import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

// Shared furniture for the admin screens: page headers, stat tiles, section
// frames, status pills and a skeleton. Kept in one file because each piece is a
// few lines and they are always used together.

export function PageHeader({ title, subtitle, breadcrumb = [], actions }) {
  return (
    <header className="mb-6">
      {breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-2 text-body-sm text-on-surface-variant">
          {breadcrumb.map((c, i) => (
            <span key={c.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={13} className="text-outline-variant" />}
              {c.to ? (
                <Link to={c.to} className="hover:text-terracotta transition-colors">{c.label}</Link>
              ) : (
                <span className="text-on-surface">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface">{title}</h1>
          {subtitle && <p className="text-body-md text-on-surface-variant mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}

export function Section({ title, description, action, className = '', children }) {
  return (
    <section className={`mb-8 ${className}`}>
      {(title || action) && (
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            {title && <h2 className="text-headline-md text-on-surface">{title}</h2>}
            {description && <p className="text-body-sm text-on-surface-variant mt-0.5">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Panel({ className = '', children }) {
  return (
    <div className={`rounded-lg border border-surface-variant bg-surface-container-lowest ${className}`}>
      {children}
    </div>
  )
}

// Status colours are reserved and never reused as chart series.
const STATUS_TONES = {
  success: 'bg-leaf-success/10 text-leaf-success',
  pending: 'bg-secondary-container/25 text-secondary',
  warning: 'bg-mustard/15 text-secondary',
  error: 'bg-error-container text-on-error-container',
  info: 'bg-tertiary-container/15 text-tertiary',
  neutral: 'bg-surface-container-high text-on-surface-variant',
}

export function StatusPill({ tone = 'neutral', icon: Icon, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-label-md px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_TONES[tone] || STATUS_TONES.neutral}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  )
}

export function StatCard({ icon: Icon, label, value, hint, tone = 'neutral', to }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className={`w-10 h-10 rounded-DEFAULT flex items-center justify-center ${STATUS_TONES[tone] || STATUS_TONES.neutral}`}>
          <Icon size={18} />
        </div>
        {to && <ChevronRight size={16} className="text-outline-variant mt-2" />}
      </div>
      <p className="font-display text-[32px] leading-none text-on-surface mb-1.5 tabular-nums">{value}</p>
      <p className="text-label-lg text-on-surface-variant">{label}</p>
      {hint && <p className="text-body-sm text-outline mt-1">{hint}</p>}
    </>
  )

  const shell =
    'rounded-lg border border-surface-variant bg-surface-container-lowest p-5 transition-colors'

  return to ? (
    <Link to={to} className={`${shell} block hover:border-terracotta/50`}>{body}</Link>
  ) : (
    <div className={shell}>{body}</div>
  )
}

export function EmptyPanel({ icon: Icon, title, description, action }) {
  return (
    <div className="rounded-lg border border-dashed border-outline-variant bg-surface-container-low/50 py-14 px-6 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mx-auto mb-4">
          <Icon size={22} />
        </div>
      )}
      <h3 className="text-headline-md text-on-surface mb-1">{title}</h3>
      {description && (
        <p className="text-body-sm text-on-surface-variant max-w-md mx-auto">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function RowSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 rounded-DEFAULT bg-surface-container-low animate-pulse" />
      ))}
    </div>
  )
}

export function CardSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-32 rounded-lg bg-surface-container-low animate-pulse" />
      ))}
    </div>
  )
}

// A note the reader needs: these numbers describe this browser, not a server.
export function LocalDataNote({ what = 'These figures' }) {
  return (
    <p className="text-body-sm text-outline mt-3">
      {what} come from accounts that have used this browser. There is no backend yet,
      so activity from other devices is not included.
    </p>
  )
}

export const inr = (n) => `₹${Math.round(Number(n) || 0).toLocaleString('en-IN')}`
