import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, ArrowRight, Bell, IndianRupee, Info, Package, ShieldAlert,
  ShoppingBag, Star, Store, Users, UtensilsCrossed,
} from 'lucide-react'
import {
  PageHeader, Panel, Section, StatCard, StatusPill, EmptyPanel, CardSkeleton,
  RowSkeleton, LocalDataNote, inr,
} from '../../components/admin/AdminUI.jsx'
import { BarChart, DonutChart } from '../../components/admin/Charts.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  fetchAllOrders, fetchAllReviews, fetchDailySeries, fetchKitchenPerformance,
  fetchNeedsAttention, fetchPlatformStats, fetchSubscriptionMix,
} from '../../api/adminStats.js'
import { STATUS, statusLabel } from '../../api/admin.js'

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

const SEVERITY = {
  serious: { tone: 'error', icon: ShieldAlert, dot: 'bg-error' },
  warning: { tone: 'warning', icon: AlertTriangle, dot: 'bg-mustard' },
  info: { tone: 'info', icon: Info, dot: 'bg-tertiary' },
}

const ORDER_TONE = {
  delivered: 'success',
  out_for_delivery: 'info',
  preparing: 'pending',
  upcoming: 'pending',
  skipped: 'neutral',
}
const ORDER_LABEL = {
  delivered: 'Delivered', out_for_delivery: 'Out for delivery',
  preparing: 'Preparing', upcoming: 'Pending', skipped: 'Skipped',
}

const KITCHEN_TONE = {
  [STATUS.approved]: 'success',
  [STATUS.submitted]: 'pending',
  [STATUS.rejected]: 'warning',
  [STATUS.draft]: 'neutral',
}

export default function AdminHomePage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [alerts, setAlerts] = useState(null)
  const [series, setSeries] = useState([])
  const [mix, setMix] = useState([])
  const [kitchens, setKitchens] = useState([])
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetchPlatformStats().then(setStats)
    fetchNeedsAttention().then(setAlerts)
    fetchDailySeries(7).then(setSeries)
    fetchSubscriptionMix().then(setMix)
    fetchKitchenPerformance().then((k) => setKitchens(k.slice(0, 6)))
    fetchAllOrders().then((o) => setOrders(o.slice(0, 6)))
    fetchAllReviews().then((r) => setReviews(r.slice(0, 4)))
  }, [])

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${user?.name?.split(' ')[0] || 'Admin'} 👋`}
        subtitle="Here's what's happening with TiffinConnect today."
      />

      {!stats ? (
        <CardSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-8">
          <StatCard
            icon={Users} tone="info" to="/admin/customers"
            value={stats.customers} label="Customers"
            hint={stats.customers ? `${stats.activeCustomers} with an active plan` : 'No accounts yet'}
          />
          <StatCard
            icon={Store} tone="success" to="/admin/kitchens"
            value={stats.kitchensTotal} label="Kitchens"
            hint={`${stats.kitchensApproved} approved · ${stats.kitchensPending} pending`}
          />
          <StatCard
            icon={UtensilsCrossed} tone="pending" to="/admin/subscriptions"
            value={stats.subscriptionsActive} label="Active subscriptions"
            hint={stats.subscriptionsPaused ? `${stats.subscriptionsPaused} paused` : 'None paused'}
          />
          <StatCard
            icon={ShoppingBag} tone="neutral" to="/admin/orders"
            value={stats.ordersToday} label="Orders today"
            hint={`${stats.ordersTotal} all time`}
          />
          <StatCard
            icon={IndianRupee} tone="success" to="/admin/payments"
            value={inr(stats.revenueToday)} label="Revenue today"
            hint={`${inr(stats.revenueTotal)} all time`}
          />
          <StatCard
            icon={Star} tone="warning" to="/admin/reviews"
            value={stats.rating ? stats.rating.toFixed(1) : '—'} label="Average rating"
            hint={stats.ratingCount ? `Across ${stats.ratingCount} reviews` : 'No reviews yet'}
          />
        </div>
      )}

      {/* Charts and the attention panel share a row: the trend on the left,
          what to act on beside it. */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Panel className="lg:col-span-2 p-6">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="text-headline-md text-on-surface">Orders &amp; revenue</h2>
              <p className="text-body-sm text-on-surface-variant mt-0.5">Last 7 days</p>
            </div>
            <Link to="/admin/analytics" className="text-label-lg text-terracotta hover:underline">
              Full analytics
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-label-md uppercase tracking-[0.08em] text-on-surface-variant mb-4">
                Orders per day
              </p>
              <BarChart data={series} valueKey="orders" height={170} />
            </div>
            <div>
              <p className="text-label-md uppercase tracking-[0.08em] text-on-surface-variant mb-4">
                Revenue per day
              </p>
              <BarChart data={series} valueKey="revenue" height={170} format={inr} />
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={18} className="text-terracotta" />
            <h2 className="text-headline-md text-on-surface">Needs attention</h2>
          </div>
          <p className="text-body-sm text-on-surface-variant mb-5">
            Only real, unresolved items appear here.
          </p>

          {alerts === null ? (
            <RowSkeleton rows={3} />
          ) : alerts.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-leaf-success/10 text-leaf-success flex items-center justify-center mx-auto mb-3">
                <Star size={20} />
              </div>
              <p className="text-label-lg text-on-surface">Nothing outstanding</p>
              <p className="text-body-sm text-on-surface-variant mt-1">
                No pending verifications, uncollected payments or undelivered orders.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {alerts.map((a) => {
                const s = SEVERITY[a.severity] || SEVERITY.info
                return (
                  <li key={a.id}>
                    <Link
                      to={a.to}
                      className="flex items-start gap-3 p-3 -mx-1 rounded-DEFAULT hover:bg-surface-container-low transition-colors group"
                    >
                      <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${s.dot}`} />
                      <span className="flex-1 min-w-0">
                        <span className="flex items-baseline gap-2">
                          <span className="text-headline-md text-on-surface tabular-nums">{a.count}</span>
                          <span className="text-label-lg text-on-surface">{a.label}</span>
                        </span>
                        <span className="block text-body-sm text-on-surface-variant mt-0.5">
                          {a.detail}
                        </span>
                      </span>
                      <ArrowRight size={15} className="text-outline-variant group-hover:text-terracotta shrink-0 mt-1.5 transition-colors" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}

          <div className="mt-6 pt-5 border-t border-surface-variant">
            <p className="text-label-md uppercase tracking-[0.08em] text-on-surface-variant mb-4">
              Subscriptions by plan
            </p>
            <DonutChart data={mix} size={140} thickness={22} />
          </div>
        </Panel>
      </div>

      <Section
        title="Kitchen performance"
        description="Ranked by orders placed through this browser, then rating."
        action={<Link to="/admin/kitchens" className="text-label-lg text-terracotta hover:underline">All kitchens</Link>}
      >
        <DataTable
          rows={kitchens}
          columns={[
            {
              key: 'name', header: 'Kitchen', sortable: true,
              render: (r) => (
                <div>
                  <p className="text-label-lg text-on-surface">{r.name}</p>
                  <p className="text-body-sm text-on-surface-variant">{r.area || 'No area set'}</p>
                </div>
              ),
            },
            { key: 'locations', header: 'Locations', align: 'right', sortable: true },
            { key: 'orders', header: 'Orders', align: 'right', sortable: true },
            {
              key: 'revenue', header: 'Revenue', align: 'right', sortable: true,
              render: (r) => inr(r.revenue),
            },
            {
              key: 'rating', header: 'Rating', align: 'right', sortable: true,
              render: (r) => (r.rating ? r.rating.toFixed(1) : '—'),
            },
            {
              key: 'status', header: 'Status',
              render: (r) => (
                <StatusPill tone={KITCHEN_TONE[r.status] || 'neutral'}>
                  {statusLabel[r.status] || 'Listed'}
                </StatusPill>
              ),
            },
          ]}
          empty={<EmptyPanel icon={Store} title="No kitchens yet" description="Kitchens appear once they register or are seeded into the catalogue." />}
        />
        <LocalDataNote what="Order and revenue columns" />
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Recent orders"
          action={<Link to="/admin/orders" className="text-label-lg text-terracotta hover:underline">View all</Link>}
        >
          {orders.length === 0 ? (
            <EmptyPanel
              icon={Package}
              title="No orders yet"
              description="Orders show up here as soon as a customer subscribes to a kitchen."
            />
          ) : (
            <Panel className="divide-y divide-surface-variant">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="text-label-lg text-on-surface">{o.id}</p>
                    <p className="text-body-sm text-on-surface-variant truncate">
                      {o.customer} · {o.providerName}
                    </p>
                    <p className="text-body-sm text-outline capitalize">
                      {o.meal} · {o.date}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-label-lg text-on-surface tabular-nums mb-1.5">{inr(o.amount)}</p>
                    <StatusPill tone={ORDER_TONE[o.status] || 'neutral'}>
                      {ORDER_LABEL[o.status] || o.status}
                    </StatusPill>
                  </div>
                </div>
              ))}
            </Panel>
          )}
        </Section>

        <Section
          title="Recent reviews"
          action={<Link to="/admin/reviews" className="text-label-lg text-terracotta hover:underline">View all reviews</Link>}
        >
          {reviews.length === 0 ? (
            <EmptyPanel icon={Star} title="No reviews yet" />
          ) : (
            <Panel className="divide-y divide-surface-variant">
              {reviews.map((r) => (
                <div key={r.id} className="p-4">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span className="inline-flex items-center gap-1 text-label-lg text-on-surface">
                      <Star size={14} className="text-mustard" fill="currentColor" strokeWidth={0} />
                      {r.rating.toFixed(1)}
                    </span>
                    <span className="text-body-sm text-outline">{r.date}</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-1.5">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                  <p className="text-body-sm text-on-surface">
                    {r.kitchen} <span className="text-outline">· {r.customerName}</span>
                  </p>
                </div>
              ))}
            </Panel>
          )}
        </Section>
      </div>
    </>
  )
}
