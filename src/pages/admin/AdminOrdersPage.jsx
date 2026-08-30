import { useEffect, useState } from 'react'
import { Package, Truck, CheckCircle2 } from 'lucide-react'
import { PageHeader, StatCard, StatusPill, EmptyPanel, LocalDataNote, inr } from '../../components/admin/AdminUI.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import { fetchAllOrders } from '../../api/adminStats.js'

// The statuses the app already supports -- nothing invented.
const LABEL = {
  upcoming: 'Pending', preparing: 'Preparing',
  out_for_delivery: 'Out for delivery', delivered: 'Delivered', skipped: 'Skipped',
}
const TONE = {
  upcoming: 'pending', preparing: 'pending',
  out_for_delivery: 'info', delivered: 'success', skipped: 'neutral',
}

export default function AdminOrdersPage() {
  const [rows, setRows] = useState(null)
  useEffect(() => { fetchAllOrders().then(setRows) }, [])

  const list = rows || []
  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Every order placed through this browser, newest first."
        breadcrumb={[{ label: 'Admin', to: '/admin' }, { label: 'Orders' }]}
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard icon={Package} tone="neutral" value={list.length} label="Total orders" />
        <StatCard
          icon={Truck} tone="pending"
          value={list.filter((o) => o.status === 'upcoming' || o.status === 'preparing').length}
          label="Still to go out"
        />
        <StatCard
          icon={CheckCircle2} tone="success"
          value={list.filter((o) => o.date === today).length} label="Placed today"
        />
      </div>

      <DataTable
        rows={list}
        loading={rows === null}
        searchKeys={['id', 'customer', 'providerName']}
        searchPlaceholder="Search by order, customer or kitchen"
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
        initialSort={{ key: 'date', dir: 'desc' }}
        columns={[
          { key: 'id', header: 'Order ID', sortable: true,
            render: (r) => <span className="text-label-lg text-on-surface">{r.id}</span> },
          { key: 'customer', header: 'Customer', sortable: true },
          { key: 'providerName', header: 'Kitchen', sortable: true },
          { key: 'meal', header: 'Meal', render: (r) => <span className="capitalize">{r.meal}</span> },
          { key: 'planType', header: 'Plan', render: (r) => r.planType || '—' },
          { key: 'amount', header: 'Amount', align: 'right', sortable: true, render: (r) => inr(r.amount) },
          {
            key: 'status', header: 'Status',
            render: (r) => <StatusPill tone={TONE[r.status] || 'neutral'}>{LABEL[r.status] || r.status}</StatusPill>,
          },
          { key: 'date', header: 'Date', sortable: true },
        ]}
        empty={
          <EmptyPanel
            icon={Package}
            title="No orders yet"
            description="Orders appear here as soon as a customer subscribes to a kitchen."
          />
        }
      />
      <LocalDataNote />
    </>
  )
}
