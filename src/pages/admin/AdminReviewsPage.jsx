import { useEffect, useMemo, useState } from 'react'
import { Star, MessageSquareText } from 'lucide-react'
import { PageHeader, StatCard, EmptyPanel, Panel, RowSkeleton } from '../../components/admin/AdminUI.jsx'
import { fetchAllReviews } from '../../api/adminStats.js'

const Stars = ({ value }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={13}
        className={i < Math.round(value) ? 'text-mustard' : 'text-outline-variant'}
        fill="currentColor"
        strokeWidth={0}
      />
    ))}
  </span>
)

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(null)
  const [kitchen, setKitchen] = useState('')
  const [minRating, setMinRating] = useState('')

  useEffect(() => { fetchAllReviews().then(setReviews) }, [])

  const all = reviews || []
  const average = all.length ? all.reduce((t, r) => t + r.rating, 0) / all.length : 0

  const distribution = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: all.filter((r) => Math.round(r.rating) === star).length,
      })),
    [all]
  )

  const kitchens = useMemo(() => [...new Set(all.map((r) => r.kitchen))].sort(), [all])

  const shown = all.filter(
    (r) => (!kitchen || r.kitchen === kitchen) && (!minRating || r.rating >= Number(minRating))
  )

  const control =
    'min-h-[42px] rounded-DEFAULT border border-outline-variant bg-surface-container-lowest px-3 text-body-sm text-on-surface focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none'

  return (
    <>
      <PageHeader
        title="Reviews"
        subtitle="Published reviews across every kitchen in the catalogue."
        breadcrumb={[{ label: 'Admin', to: '/admin' }, { label: 'Reviews' }]}
      />

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-1">
          <StatCard
            icon={Star} tone="warning"
            value={average ? average.toFixed(1) : '—'} label="Average rating"
            hint={`${all.length} reviews`}
          />
          <StatCard
            icon={MessageSquareText} tone="info"
            value={kitchens.length} label="Kitchens reviewed"
          />
        </div>

        <Panel className="lg:col-span-2 p-6">
          <h2 className="text-headline-md text-on-surface mb-5">Rating distribution</h2>
          {all.length === 0 ? (
            <p className="text-body-sm text-outline">Nothing to break down yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {distribution.map((d) => (
                <li key={d.star} className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-body-sm text-on-surface-variant w-10 shrink-0">
                    {d.star}
                    <Star size={11} className="text-mustard" fill="currentColor" strokeWidth={0} />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full rounded-full bg-mustard transition-[width] duration-500"
                      style={{ width: `${all.length ? (d.count / all.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-body-sm text-on-surface tabular-nums w-8 text-right shrink-0">
                    {d.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <select value={kitchen} onChange={(e) => setKitchen(e.target.value)} className={control}>
          <option value="">All kitchens</option>
          {kitchens.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <select value={minRating} onChange={(e) => setMinRating(e.target.value)} className={control}>
          <option value="">Any rating</option>
          {[5, 4, 3, 2].map((r) => <option key={r} value={r}>{r} stars and up</option>)}
        </select>
      </div>

      {reviews === null ? (
        <RowSkeleton />
      ) : shown.length === 0 ? (
        <EmptyPanel
          icon={MessageSquareText}
          title="No reviews match"
          description="Try clearing the kitchen or rating filter."
        />
      ) : (
        <Panel className="divide-y divide-surface-variant">
          {shown.map((r) => (
            <article key={r.id} className="p-5 flex flex-col sm:flex-row gap-4">
              {r.photo && (
                <img
                  src={r.photo}
                  alt=""
                  className="w-full sm:w-24 h-24 object-cover rounded-DEFAULT border border-outline-variant shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                  <Stars value={r.rating} />
                  <span className="text-label-lg text-on-surface">{r.rating.toFixed(1)}</span>
                  <span className="text-body-sm text-outline">· {r.date}</span>
                </div>
                <p className="text-body-md text-on-surface-variant mb-2">&ldquo;{r.comment}&rdquo;</p>
                <p className="text-body-sm text-on-surface">
                  {r.kitchen} <span className="text-outline">· {r.customerName}</span>
                </p>
              </div>
            </article>
          ))}
        </Panel>
      )}
    </>
  )
}
