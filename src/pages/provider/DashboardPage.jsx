import { useEffect, useState } from 'react'
import { ShoppingBag, IndianRupee, Users, Star, TrendingUp } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { fetchProviderStats } from '../../api/provider.js'
import { fetchAllProviderReviews } from '../../api/reviews.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetchProviderStats().then(setStats)
    fetchAllProviderReviews().then((r) => setReviews(r.filter((x) => x.providerId === 'p1').slice(0, 3)))
  }, [])

  const maxRevenue = stats ? Math.max(...stats.weekRevenue) : 1

  const cards = stats
    ? [
        { label: "Today's Orders", value: stats.todayOrders, icon: ShoppingBag, tone: 'terracotta' },
        { label: "Today's Revenue", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: IndianRupee, tone: 'forest' },
        { label: 'Active Subscribers', value: stats.activeSubscribers, icon: Users, tone: 'mustard' },
        { label: 'Average Rating', value: stats.avgRating.toFixed(1), icon: Star, tone: 'forest' },
      ]
    : []

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-forest-700 mb-1">Welcome back, {user?.name}</h1>
      <p className="text-gray-500 mb-6">Here's how your tiffin business is doing today.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {!stats
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
          : cards.map((c) => (
              <Card key={c.label} className="p-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    c.tone === 'terracotta' ? 'bg-terracotta-50 text-terracotta-500' : c.tone === 'mustard' ? 'bg-mustard-50 text-mustard-600' : 'bg-forest-50 text-forest-500'
                  }`}
                >
                  <c.icon size={20} />
                </div>
                <p className="font-display text-2xl font-bold text-forest-700">{c.value}</p>
                <p className="text-xs text-gray-500">{c.label}</p>
              </Card>
            ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-forest-700 flex items-center gap-2"><TrendingUp size={18} /> Revenue — Last 7 Days</h3>
            <span className="text-xs text-gray-400">Total: ₹{stats?.weekRevenue.reduce((a, b) => a + b, 0).toLocaleString()}</span>
          </div>
          {stats ? (
            <div className="flex items-end justify-between gap-2 h-48">
              {stats.weekRevenue.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex items-end justify-center h-40">
                    <div
                      className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-terracotta-500 to-mustard-400"
                      style={{ height: `${(v / maxRevenue) * 100}%` }}
                      title={`₹${v}`}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{stats.weekLabels[i]}</span>
                </div>
              ))}
            </div>
          ) : (
            <Skeleton className="h-48 w-full" />
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-forest-700 mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-forest-700">{r.customerName}</p>
                  <Badge tone="pending">{r.rating}★</Badge>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{r.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-6">
        <h3 className="font-semibold text-forest-700 mb-4">This Month</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="font-display text-xl font-bold text-forest-700">₹{stats?.monthRevenue.toLocaleString() ?? '—'}</p>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-forest-700">{stats?.monthOrders ?? '—'}</p>
            <p className="text-xs text-gray-500">Orders delivered</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-forest-700">{stats?.activeSubscribers ?? '—'}</p>
            <p className="text-xs text-gray-500">Active subscribers</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-forest-700">{stats?.avgRating ?? '—'}★</p>
            <p className="text-xs text-gray-500">Average rating</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
