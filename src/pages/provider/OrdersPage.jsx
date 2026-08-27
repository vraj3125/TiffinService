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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-forest-700 mb-1">Today's Orders</h1>
      <p className="text-gray-500 mb-6">{orders ? `${orders.length} orders today` : 'Loading…'}</p>

      {!orders ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No orders yet today" />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Instructions</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-forest-700">#{o.id}</td>
                  <td className="px-4 py-3">{o.customerName}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[180px]">{o.address}</td>
                  <td className="px-4 py-3 text-gray-500">
                    <span className="capitalize font-medium text-forest-600">{o.meal}: </span>
                    {o.items.join(', ')}
                  </td>
                  <td className="px-4 py-3 text-gray-400 italic">{o.instructions || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge tone={toneOf(o.status)}>{statuses.find((s) => s.value === o.status)?.label}</Badge>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
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
