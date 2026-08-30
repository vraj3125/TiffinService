import { useEffect, useState } from 'react'
import { ShoppingBag, IndianRupee, Users, Star, TrendingUp, ShieldAlert } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { fetchProviderStats } from '../../api/provider.js'
import { fetchMyReviews } from '../../api/reviews.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Link } from 'react-router-dom'
import { STATUS, getApplication } from '../../api/admin.js'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [reviews, setReviews] = useState([])
  const [application, setApplication] = useState(null)

  // This kitchen's own numbers -- a new provider sees zeros, not another
  // kitchen's revenue.
  useEffect(() => {
    if (!user) return
    fetchProviderStats(user.uid).then(setStats)
    fetchMyReviews(user.uid).then((r) => setReviews(r.slice(0, 3)))
    getApplication(user.uid).then(setApplication)
  }, [user])

  // A kitchen is not listed to customers until it has been approved, so say
  // where it stands rather than showing an empty dashboard with no explanation.
  const approved = application?.status === STATUS.approved
  const banner = approved
    ? null
    : application?.status === STATUS.submitted
      ? {
          tone: 'pending',
          title: 'Your kitchen is being verified',
          body: 'We review new kitchens within 24-48 hours. You can keep setting up your menu and plans in the meantime — customers will see you the moment you are approved.',
        }
      : application?.status === STATUS.rejected
        ? {
            tone: 'error',
            title: 'We need a change before approving',
            body: application.reviewNote || 'Open your Business Profile for details.',
          }
        : {
            tone: 'pending',
            title: 'Finish setting up to start taking orders',
            body: 'Add your business details, kitchen location and documents, then send them for verification. Customers cannot see your kitchen until it is approved.',
          }

  // A brand-new kitchen has a flat zero week; keep the divisor above zero so
  // the bar heights stay a number rather than NaN.
  const maxRevenue = Math.max(1, ...(stats?.weekRevenue ?? []))

  const cards = stats
    ? [
        { label: "Today's Orders", value: stats.todayOrders, icon: ShoppingBag, tone: 'terracotta' },
        { label: "Today's Revenue", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: IndianRupee, tone: 'leaf' },
        { label: 'Active Subscribers', value: stats.activeSubscribers, icon: Users, tone: 'mustard' },
        { label: 'Average Rating', value: stats.avgRating ? stats.avgRating.toFixed(1) : '—', icon: Star, tone: 'leaf' },
      ]
    : []

  const toneClasses = {
    terracotta: 'bg-terracotta/10 text-terracotta',
    mustard: 'bg-mustard/10 text-secondary',
    leaf: 'bg-leaf-success/10 text-leaf-success',
  }

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <h1 className="text-headline-lg text-on-surface mb-1">Welcome back, {user?.name}</h1>
      <p className="text-body-md text-on-surface-variant mb-8">Here's how your tiffin business is doing today.</p>

      {banner && (
        <div
          className={`mb-8 rounded-lg border p-6 flex flex-col sm:flex-row sm:items-center gap-4 ${
            banner.tone === 'error'
              ? 'border-error/40 bg-error-container/30'
              : 'border-mustard/40 bg-mustard/10'
          }`}
        >
          <ShieldAlert
            size={24}
            className={`shrink-0 ${banner.tone === 'error' ? 'text-error' : 'text-secondary'}`}
          />
          <div className="flex-1">
            <h2 className="text-label-lg text-on-surface mb-1">{banner.title}</h2>
            <p className="text-body-sm text-on-surface-variant">{banner.body}</p>
          </div>
          <Link
            to="/provider/verification"
            className="shrink-0 text-label-lg text-terracotta hover:underline whitespace-nowrap"
          >
            Open Business Profile
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-8">
        {!stats
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
          : cards.map((c) => (
              <Card key={c.label} className="p-6">
                <div className={`w-11 h-11 rounded-DEFAULT flex items-center justify-center mb-3 ${toneClasses[c.tone]}`}>
                  <c.icon size={20} />
                </div>
                <p className="text-headline-lg text-on-surface">{c.value}</p>
                <p className="text-body-sm text-on-surface-variant">{c.label}</p>
              </Card>
            ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-gutter">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-headline-md text-on-surface flex items-center gap-2"><TrendingUp size={18} className="text-terracotta" /> Revenue — Last 7 Days</h3>
            <span className="text-body-sm text-on-surface-variant">Total: ₹{stats?.weekRevenue.reduce((a, b) => a + b, 0).toLocaleString()}</span>
          </div>
          {stats ? (
            <div className="flex items-end justify-between gap-2 h-48">
              {stats.weekRevenue.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex items-end justify-center h-40">
                    <div
                      className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-terracotta to-mustard"
                      style={{ height: `${(v / maxRevenue) * 100}%` }}
                      title={`₹${v}`}
                    />
                  </div>
                  <span className="text-body-sm text-on-surface-variant">{stats.weekLabels[i]}</span>
                </div>
              ))}
            </div>
          ) : (
            <Skeleton className="h-48 w-full" />
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-headline-md text-on-surface mb-4">Recent Reviews</h3>
          {reviews.length === 0 && (
            <p className="text-body-sm text-on-surface-variant">
              No reviews yet. They appear here once customers rate their deliveries.
            </p>
          )}
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="pb-3 border-b border-surface-variant last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-label-lg text-on-surface">{r.customerName}</p>
                  <Badge tone="pending">{r.rating}★</Badge>
                </div>
                <p className="text-body-sm text-on-surface-variant line-clamp-2">{r.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <h3 className="text-headline-md text-on-surface mb-4">This Month</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-headline-md text-on-surface">₹{stats?.monthRevenue.toLocaleString() ?? '—'}</p>
            <p className="text-body-sm text-on-surface-variant">Revenue</p>
          </div>
          <div>
            <p className="text-headline-md text-on-surface">{stats?.monthOrders ?? '—'}</p>
            <p className="text-body-sm text-on-surface-variant">Orders delivered</p>
          </div>
          <div>
            <p className="text-headline-md text-on-surface">{stats?.activeSubscribers ?? '—'}</p>
            <p className="text-body-sm text-on-surface-variant">Active subscribers</p>
          </div>
          <div>
            <p className="text-headline-md text-on-surface">{stats?.avgRating ?? '—'}★</p>
            <p className="text-body-sm text-on-surface-variant">Average rating</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
