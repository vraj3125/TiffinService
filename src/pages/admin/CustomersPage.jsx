import { useEffect, useState } from 'react'
import { Users, UserCheck, UserMinus } from 'lucide-react'
import { PageHeader, StatCard, StatusPill, EmptyPanel, LocalDataNote, inr } from '../../components/admin/AdminUI.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import { fetchCustomers } from '../../api/adminStats.js'

const TONE = { active: 'success', lapsed: 'neutral', new: 'info' }
const LABEL = { active: 'Active', lapsed: 'Lapsed', new: 'No orders yet' }

export default function CustomersPage() {
  const [rows, setRows] = useState(null)
  useEffect(() => { fetchCustomers().then(setRows) }, [])

  const list = rows || []
  const active = list.filter((c) => c.status === 'active').length

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Everyone who has created a customer account in this browser."
        breadcrumb={[{ label: 'Admin', to: '/admin' }, { label: 'Customers' }]}
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard icon={Users} tone="info" value={list.length} label="Total customers" />
        <StatCard icon={UserCheck} tone="success" value={active} label="With an active plan" />
        <StatCard
          icon={UserMinus} tone="neutral" value={list.length - active}
          label="Lapsed or never ordered"
        />
      </div>

      <DataTable
        rows={list}
        loading={rows === null}
        searchKeys={['name', 'phone', 'city']}
        searchPlaceholder="Search by name, phone or area"
        filters={[{
          key: 'status', label: 'All statuses',
          options: Object.entries(LABEL).map(([value, label]) => ({ value, label })),
          match: (r, v) => r.status === v,
        }]}
        initialSort={{ key: 'orders', dir: 'desc' }}
        columns={[
          {
            key: 'name', header: 'Customer', sortable: true,
            render: (r) => (
              <div>
                <p className="text-label-lg text-on-surface">{r.name}</p>
                <p className="text-body-sm text-on-surface-variant">{r.phone || 'No phone saved'}</p>
              </div>
            ),
          },
          { key: 'city', header: 'Area', sortable: true, render: (r) => r.city || '—' },
          {
            key: 'kitchens', header: 'Kitchen',
            render: (r) => (r.kitchens.length ? r.kitchens.join(', ') : '—'),
          },
          { key: 'activeCount', header: 'Active plans', align: 'right', sortable: true },
          { key: 'orders', header: 'Orders', align: 'right', sortable: true },
          { key: 'spend', header: 'Spend', align: 'right', sortable: true, render: (r) => inr(r.spend) },
          { key: 'firstOrder', header: 'First order', sortable: true, render: (r) => r.firstOrder || '—' },
          {
            key: 'status', header: 'Status',
            render: (r) => <StatusPill tone={TONE[r.status]}>{LABEL[r.status]}</StatusPill>,
          },
        ]}
        empty={
          <EmptyPanel
            icon={Users}
            title="No customer accounts yet"
            description="A customer appears here once they sign up in this browser."
          />
        }
      />
      <LocalDataNote />
    </>
  )
}
