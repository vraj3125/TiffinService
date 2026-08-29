// Shared masthead for the standalone content pages the footer links to, so
// About / Careers / Terms and the rest all open the same way.
export default function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="px-6 sm:px-margin-desktop pt-12 pb-16 bg-surface-container-low border-b border-surface-variant">
      <div className="max-w-[840px] mx-auto text-center">
        {eyebrow && (
          <p className="text-label-md uppercase tracking-[0.18em] text-terracotta mb-4">{eyebrow}</p>
        )}
        <h1 className="font-display text-display-md text-on-background mb-5">{title}</h1>
        {subtitle && <p className="text-body-lg text-on-surface-variant">{subtitle}</p>}
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  )
}

export function Section({ title, lead, className = '', children }) {
  return (
    <section className={`py-20 px-6 sm:px-margin-desktop ${className}`}>
      <div className="max-w-[1100px] mx-auto">
        {title && (
          <div className="max-w-2xl mb-12">
            <h2 className="text-headline-lg text-on-background mb-3">{title}</h2>
            {lead && <p className="text-body-lg text-on-surface-variant">{lead}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
