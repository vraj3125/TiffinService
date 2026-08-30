import { useEffect, useState } from 'react'
import { Store, TrendingUp, Users } from 'lucide-react'
import { PageHeader, Panel, LocalDataNote, EmptyPanel, inr } from '../../components/admin/AdminUI.jsx'
import { BarChart, LineChart, DonutChart, RankBars } from '../../components/admin/Charts.jsx'
import {
  fetchDailySeries, fetchKitchenPerformance, fetchSubscriptionMix,
  fetchSubscriptionStatusMix, fetchAllOrders, fetchCustomers,
} from '../../api/adminStats.js'

const RANGES = [7, 14, 30]

export default function AnalyticsPage() {
  const [days, setDays] = useState(7)
  const [series, setSeries] = useState([])
  const [planMix, setPlanMix] = useState([])
  const [statusMix, setStatusMix] = useState([])
  const [kitchens, setKitchens] = useState([])
  const [customerGrowth, setCustomerGrowth] = useState([])

  useEffect(() => { fetchDailySeries(days).then(setSeries) }, [days])

  useEffect(() => {
    fetchSubscriptionMix().then(setPlanMix)
    fetchSubscriptionStatusMix().then(setStatusMix)
    fetchKitchenPerformance().then(setKitchens)
    // "New customers" is derived from the date of each customer's first order --
    // the only join date that exists without a backend.
    Promise.all([fetchCustomers(), fetchAllOrders()]).then(([customers]) => {
      const byDate = customers.reduce((acc, c) => {
        if (!c.firstOrder) return acc
        acc[c.firstOrder] = (acc[c.firstOrder] || 0) + 1
        return acc
      }, {})
      setCustomerGrowth(
        Object.entries(byDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([iso, value]) => ({ label: iso.slice(5), value }))
      )
    })
  }, [])

  const ranked = kitchens.filter((k) => k.orders > 0 || k.rating > 0)

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Built from the orders, subscriptions and reviews this browser can see."
        breadcrumb={[{ label: 'Admin', to: '/admin' }, { label: 'Analytics' }]}
        actions={
          <div className="flex rounded-full border border-outline-variant p-0.5">
            {RANGES.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3.5 py-1.5 rounded-full text-label-md transition-colors ${
                  days === d ? 'bg-terracotta text-on-primary' : 'text-on-surface-variant hover:text-terracotta'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Panel className="p-6">
          <h2 className="text-headline-md text-on-surface mb-1">Order volume</h2>
          <p className="text-body-sm text-on-surface-variant mb-6">Orders placed per day</p>
          <LineChart data={series} valueKey="orders" height={210} />
        </Panel>

        <Panel className="p-6">
          <h2 className="text-headline-md text-on-surface mb-1">Revenue</h2>
          <p className="text-body-sm text-on-surface-variant mb-6">Order value per day</p>
          <BarChart data={series} valueKey="revenue" height={210} format={inr} />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Panel className="p-6">
          <h2 className="text-headline-md text-on-surface mb-1">Subscriptions by plan</h2>
          <p className="text-body-sm text-on-surface-variant mb-6">Which plan lengths customers pick</p>
          <DonutChart data={planMix} />
        </Panel>

        <Panel className="p-6">
          <h2 className="text-headline-md text-on-surface mb-1">Subscriptions by status</h2>
          <p className="text-body-sm text-on-surface-variant mb-6">Active, paused, expiring, cancelled</p>
          <DonutChart data={statusMix} />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Panel className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Users size={18} className="text-terracotta" />
            <h2 className="text-headline-md text-on-surface">Customer growth</h2>
          </div>
          <p className="text-body-sm text-on-surface-variant mb-6">
            New customers, dated by their first order
          </p>
          {customerGrowth.length === 0 ? (
            <EmptyPanel
              icon={Users}
              title="No customer history yet"
              description="A customer is counted from the day of their first order."
            />
          ) : (
            <BarChart data={customerGrowth} height={190} />
          )}
        </Panel>

        <Panel className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Store size={18} className="text-terracotta" />
            <h2 className="text-headline-md text-on-surface">Popular kitchens</h2>
          </div>
          <p className="text-body-sm text-on-surface-variant mb-6">Ranked by orders placed</p>
          <RankBars
            data={ranked.slice(0, 8).map((k) => ({ label: k.name, value: k.orders }))}
          />
        </Panel>
      </div>

      <Panel className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={18} className="text-terracotta" />
          <h2 className="text-headline-md text-on-surface">Revenue by kitchen</h2>
        </div>
        <p className="text-body-sm text-on-surface-variant mb-6">Total order value per kitchen</p>
        <RankBars
          data={ranked.filter((k) => k.revenue > 0).slice(0, 8).map((k) => ({ label: k.name, value: k.revenue }))}
          format={inr}
        />
      </Panel>

      <LocalDataNote what="Every figure on this page" />
    </>
  )
}
