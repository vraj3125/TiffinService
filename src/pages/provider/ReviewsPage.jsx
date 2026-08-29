import { useEffect, useState } from 'react'
import { Star, MessageSquareText } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { fetchMyReviews } from '../../api/reviews.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProviderReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    if (!user) return
    fetchMyReviews(user.uid).then(setReviews)
  }, [user])

  const avg = reviews?.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-headline-lg text-on-surface">Customer Reviews</h1>
          <p className="text-body-md text-on-surface-variant">See what your customers are saying about your tiffins.</p>
        </div>
        {avg && (
          <div className="flex items-center gap-2 bg-surface-container-lowest rounded-lg ambient-shadow px-5 py-3">
            <span className="text-headline-lg text-on-surface">{avg}</span>
            <div>
              <div className="flex text-mustard">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
              </div>
              <p className="text-body-sm text-on-surface-variant">{reviews.length} reviews</p>
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
            <Card key={r.id} className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-label-lg text-on-surface">{r.customerName}</p>
                  <p className="text-body-sm text-on-surface-variant">{r.date}</p>
                </div>
                <span className="flex items-center gap-1 text-mustard font-bold text-label-lg">
                  {r.rating} <Star size={14} fill="currentColor" strokeWidth={0} />
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant mb-3">{r.comment}</p>
              {r.photo && <img src={r.photo} alt="" className="w-32 h-24 object-cover rounded-lg" />}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
