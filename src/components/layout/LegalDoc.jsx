import { useState } from 'react'
import PageHero from './PageHero.jsx'
import { COMPANY } from '../../config/company.js'

// Terms, Privacy and Refunds are the same shape -- a dated document plus a list
// of numbered sections -- so they share one renderer with a sticky section rail.
export default function LegalDoc({ eyebrow, title, summary, updated, sections }) {
  const [active, setActive] = useState(sections[0].id)

  const jumpTo = (id) => (e) => {
    e.preventDefault()
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={summary} />

      <div className="px-6 sm:px-margin-desktop py-16">
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-12">
          {/* Section rail -- long legal pages are unreadable without one. */}
          <nav className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-32">
              <p className="text-label-md uppercase tracking-[0.14em] text-on-surface-variant mb-4">
                On this page
              </p>
              <ul className="space-y-1 border-l border-outline-variant">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={jumpTo(s.id)}
                      className={`block -ml-px border-l-2 pl-4 py-1.5 text-body-sm transition-colors ${
                        active === s.id
                          ? 'border-terracotta text-terracotta font-semibold'
                          : 'border-transparent text-on-surface-variant hover:text-terracotta'
                      }`}
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <article className="flex-1 min-w-0">
            <p className="text-body-sm text-on-surface-variant mb-8">
              Last updated <span className="text-on-surface font-semibold">{updated}</span> · Applies
              to {COMPANY.legalName} and all {COMPANY.name} services.
            </p>


            <div className="space-y-12">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-32">
                  <h2 className="text-headline-md text-on-background mb-4">
                    <span className="text-terracotta mr-2">{i + 1}.</span>
                    {s.heading}
                  </h2>
                  <div className="space-y-4">
                    {s.body.map((block, j) =>
                      typeof block === 'string' ? (
                        <p key={j} className="text-body-md text-on-surface-variant">
                          {block}
                        </p>
                      ) : (
                        <ul key={j} className="space-y-2 pl-1">
                          {block.list.map((item) => (
                            <li
                              key={item}
                              className="text-body-md text-on-surface-variant flex gap-3"
                            >
                              <span className="text-terracotta mt-2 h-1.5 w-1.5 rounded-full bg-terracotta shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>
    </>
  )
}
