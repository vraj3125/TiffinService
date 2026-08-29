import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { fetchProviderOrders } from '../../api/orders.js'
import { useToast } from '../../context/ToastContext.jsx'

const statuses = [
  { value: 'pending', label: 'Pending', tone: 'pending' },
  { value: 'preparing', label: 'Preparing', tone: 'info' },
  { value: 'out_for_delivery', label: 'Out for Delivery', tone: 'info' },
  { value: 'delivered', label: 'Delivered', tone: 'success' },
]
const toneOf = (v) => statuses.find((s) => s.value === v)?.tone ?? 'neutral'

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    fetchProviderOrders().then(setOrders)
  }, [])

  const updateStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    showToast(`Order #${id} marked as ${statuses.find((s) => s.value === status).label}`)
  }

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <h1 className="text-headline-lg text-on-surface mb-1">Today's Orders</h1>
      <p className="text-body-md text-on-surface-variant mb-8">{orders ? `${orders.length} orders today` : 'Loading…'}</p>

      {!orders ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No orders yet today" />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-body-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-on-surface-variant border-b border-surface-variant bg-surface-container-low">
                <th className="px-6 py-4 text-label-lg">Order</th>
                <th className="px-6 py-4 text-label-lg">Customer</th>
                <th className="px-6 py-4 text-label-lg">Address</th>
                <th className="px-6 py-4 text-label-lg">Items</th>
                <th className="px-6 py-4 text-label-lg">Instructions</th>
                <th className="px-6 py-4 text-label-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id} className={`border-b border-surface-variant last:border-0 ${i % 2 === 1 ? 'bg-secondary-container/5' : ''}`}>
                  <td className="px-6 py-4 text-label-lg text-on-surface">#{o.id}</td>
                  <td className="px-6 py-4 text-on-surface">{o.customerName}</td>
                  <td className="px-6 py-4 text-on-surface-variant max-w-[180px]">{o.address}</td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    <span className="capitalize font-semibold text-on-surface">{o.meal}: </span>
                    {o.items.join(', ')}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant italic">{o.instructions || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Badge tone={toneOf(o.status)}>{statuses.find((s) => s.value === o.status)?.label}</Badge>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="text-body-sm border border-outline-variant rounded-DEFAULT px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta"
                      >
                        {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
