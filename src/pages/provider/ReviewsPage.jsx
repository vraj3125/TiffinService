import { useEffect, useState } from 'react'
import { Star, MessageSquareText } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { fetchAllProviderReviews } from '../../api/reviews.js'

export default function ProviderReviewsPage() {
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    fetchAllProviderReviews().then((r) => setReviews(r.filter((x) => x.providerId === 'p1')))
  }, [])

  const avg = reviews?.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-700">Customer Reviews</h1>
          <p className="text-gray-500 text-sm">See what your customers are saying about your tiffins.</p>
        </div>
        {avg && (
          <div className="flex items-center gap-2 bg-white rounded-2xl shadow-soft px-5 py-3">
            <span className="font-display text-2xl font-bold text-forest-700">{avg}</span>
            <div>
              <div className="flex text-mustard-400">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
              </div>
              <p className="text-xs text-gray-500">{reviews.length} reviews</p>
            </div>
          </div>
        )}
      </div>

      {!reviews ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState icon={MessageSquareText} title="No reviews yet" description="Once customers order from you, their reviews will show up here." />
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-forest-700">{r.customerName}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
                <span className="flex items-center gap-1 text-mustard-600 font-bold text-sm">
                  {r.rating} <Star size={13} fill="currentColor" strokeWidth={0} />
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{r.comment}</p>
              {r.photo && <img src={r.photo} alt="" className="w-32 h-24 object-cover rounded-lg" />}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
