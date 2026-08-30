import { useEffect, useState } from 'react'
import { UtensilsCrossed, PauseCircle, CalendarClock, XCircle } from 'lucide-react'
import { PageHeader, StatCard, StatusPill, EmptyPanel, LocalDataNote, Panel } from '../../components/admin/AdminUI.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import { DonutChart } from '../../components/admin/Charts.jsx'
import { fetchAllSubscriptions, fetchSubscriptionMix } from '../../api/adminStats.js'

const LABEL = { active: 'Active', paused: 'Paused', expiring: 'Expiring', cancelled: 'Cancelled' }
const TONE = { active: 'success', paused: 'pending', expiring: 'warning', cancelled: 'neutral' }

export default function SubscriptionsPage() {
  const [rows, setRows] = useState(null)
  const [mix, setMix] = useState([])

  useEffect(() => {
    fetchAllSubscriptions().then(setRows)
    fetchSubscriptionMix().then(setMix)
  }, [])

  const list = rows || []
  const count = (s) => list.filter((r) => r.status === s).length

  return (
    <>
      <PageHeader
        title="Subscriptions"
        subtitle="Every plan running through this browser, across all kitchens."
        breadcrumb={[{ label: 'Admin', to: '/admin' }, { label: 'Subscriptions' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard icon={UtensilsCrossed} tone="success" value={count('active')} label="Active" />
        <StatCard icon={PauseCircle} tone="pending" value={count('paused')} label="Paused" />
        <StatCard icon={CalendarClock} tone="warning" value={count('expiring')} label="Expiring" />
        <StatCard icon={XCircle} tone="neutral" value={count('cancelled')} label="Cancelled" />
      </div>

      {mix.length > 0 && (
        <Panel className="p-6 mb-8">
          <h2 className="text-headline-md text-on-surface mb-1">Plan mix</h2>
          <p className="text-body-sm text-on-surface-variant mb-5">
            How subscriptions split across the plan types kitchens offer.
          </p>
          <DonutChart data={mix} />
        </Panel>
      )}

      <DataTable
        rows={list}
        loading={rows === null}
        searchKeys={['customer', 'providerName', 'planType']}
        searchPlaceholder="Search by customer, kitchen or plan"
        filters={[
          {
            key: 'status', label: 'All statuses',
            options: Object.entries(LABEL).map(([value, label]) => ({ value, label })),
            match: (r, v) => r.status === v,
          },
          {
            key: 'meal', label: 'All meals',
            options: [{ value: 'lunch', label: 'Lunch' }, { value: 'dinner', label: 'Dinner' }],
            match: (r, v) => r.meal === v,
          },
        ]}
        initialSort={{ key: 'startDate', dir: 'desc' }}
        columns={[
          { key: 'customer', header: 'Customer', sortable: true },
          { key: 'providerName', header: 'Kitchen', sortable: true },
          { key: 'planType', header: 'Plan', sortable: true },
          { key: 'meal', header: 'Meal', render: (r) => <span className="capitalize">{r.meal}</span> },
          { key: 'startDate', header: 'Start', sortable: true },
          { key: 'endDate', header: 'End', sortable: true },
          { key: 'daysLeft', header: 'Days left', align: 'right', sortable: true },
          {
            key: 'status', header: 'Status',
            render: (r) => <StatusPill tone={TONE[r.status] || 'neutral'}>{LABEL[r.status] || r.status}</StatusPill>,
          },
        ]}
        empty={
          <EmptyPanel
            icon={UtensilsCrossed}
            title="No subscriptions yet"
            description="A subscription is created when a customer completes checkout."
          />
        }
      />
      <LocalDataNote />
    </>
  )
}
