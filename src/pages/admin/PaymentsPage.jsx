import { useEffect, useState } from 'react'
import { IndianRupee, CheckCircle2, Clock, CreditCard } from 'lucide-react'
import { PageHeader, StatCard, StatusPill, EmptyPanel, Panel, inr } from '../../components/admin/AdminUI.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import { RankBars } from '../../components/admin/Charts.jsx'
import { fetchPayments } from '../../api/adminStats.js'

const TONE = { paid: 'success', pending: 'pending' }
const LABEL = { paid: 'Collected', pending: 'Awaiting delivery' }

export default function PaymentsPage() {
  const [rows, setRows] = useState(null)
  useEffect(() => { fetchPayments().then(setRows) }, [])

  const list = rows || []
  const paid = list.filter((p) => p.status === 'paid')
  const pending = list.filter((p) => p.status === 'pending')

  const byMethod = ['UPI', 'Card', 'Cash']
    .map((m) => ({ label: m, value: list.filter((p) => p.method === m).length }))
    .filter((d) => d.value > 0)

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="One payment per order, using the method the customer chose at checkout."
        breadcrumb={[{ label: 'Admin', to: '/admin' }, { label: 'Payments' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard
          icon={IndianRupee} tone="success"
          value={inr(list.reduce((t, p) => t + p.amount, 0))} label="Total value"
        />
        <StatCard
          icon={CheckCircle2} tone="success"
          value={inr(paid.reduce((t, p) => t + p.amount, 0))}
          label="Collected" hint={`${paid.length} payments`}
        />
        <StatCard
          icon={Clock} tone="pending"
          value={inr(pending.reduce((t, p) => t + p.amount, 0))}
          label="Not yet collected" hint="Cash on delivery, undelivered"
        />
        <StatCard icon={CreditCard} tone="neutral" value={list.length} label="Transactions" />
      </div>

      {/* No gateway is connected, so failures and refunds have no source. Say so
          rather than showing a fabricated zero as if it had been measured. */}
      <Panel className="p-5 mb-8">
        <p className="text-body-sm text-on-surface-variant">
          <span className="text-on-surface font-semibold">
            Failed payments and refunds are not tracked.
          </span>{' '}
          No payment gateway is connected, so there is no source for them. Collection status is
          inferred: everything except cash on delivery settles at checkout, and cash settles on
          delivery.
        </p>
      </Panel>

      {byMethod.length > 0 && (
        <Panel className="p-6 mb-8">
          <h2 className="text-headline-md text-on-surface mb-5">Payments by method</h2>
          <RankBars data={byMethod} />
        </Panel>
      )}

      <DataTable
        rows={list}
        loading={rows === null}
        searchKeys={['id', 'customer', 'kitchen']}
        searchPlaceholder="Search by transaction, customer or kitchen"
        filters={[
          {
            key: 'method', label: 'All methods',
            options: [
              { value: 'UPI', label: 'UPI' },
              { value: 'Card', label: 'Card' },
              { value: 'Cash', label: 'Cash on delivery' },
            ],
            match: (r, v) => r.method === v,
          },
          {
            key: 'status', label: 'All statuses',
            options: Object.entries(LABEL).map(([value, label]) => ({ value, label })),
            match: (r, v) => r.status === v,
          },
        ]}
        initialSort={{ key: 'date', dir: 'desc' }}
        columns={[
          { key: 'id', header: 'Transaction', sortable: true,
            render: (r) => <span className="text-label-lg text-on-surface">{r.id}</span> },
          { key: 'customer', header: 'Customer', sortable: true },
          { key: 'kitchen', header: 'Kitchen', sortable: true },
          { key: 'amount', header: 'Amount', align: 'right', sortable: true, render: (r) => inr(r.amount) },
          { key: 'method', header: 'Method' },
          {
            key: 'status', header: 'Status',
            render: (r) => <StatusPill tone={TONE[r.status]}>{LABEL[r.status]}</StatusPill>,
          },
          { key: 'date', header: 'Date', sortable: true },
        ]}
        empty={
          <EmptyPanel
            icon={CreditCard}
            title="No payments yet"
            description="A payment record is created with every order."
          />
        }
      />
    </>
  )
}
