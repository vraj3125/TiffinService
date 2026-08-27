import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PauseCircle, SkipForward, Calendar, PackageSearch } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Tabs from '../../components/ui/Tabs.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { fetchOrders, fetchSubscriptions } from '../../api/orders.js'
import { useToast } from '../../context/ToastContext.jsx'

const statusTone = {
  upcoming: 'info', delivered: 'success', out_for_delivery: 'pending', skipped: 'neutral', active: 'success', expiring: 'pending',
}
const statusLabel = {
  upcoming: 'Upcoming', delivered: 'Delivered', out_for_delivery: 'Out for delivery', skipped: 'Skipped', active: 'Active', expiring: 'Expiring soon',
}

export default function OrdersPage() {
  const [tab, setTab] = useState('subscriptions')
  const [orders, setOrders] = useState([])
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [skipModal, setSkipModal] = useState(null)
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([fetchOrders(), fetchSubscriptions()]).then(([o, s]) => {
      setOrders(o)
      setSubs(s)
      setLoading(false)
    })
  }, [])

  const handleSkip = (date) => {
    setSubs((prev) =>
      prev.map((s) => (s.id === skipModal.id ? { ...s, skippedDates: [...s.skippedDates, date] } : s))
    )
    showToast(`Meal skipped for ${date}. You won't be charged for that day.`)
    setSkipModal(null)
  }

  const handlePause = (sub) => {
    showToast(`Subscription with ${sub.providerName} paused. Resume anytime from this page.`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-forest-700 mb-6">My Orders & Subscriptions</h1>

      <Tabs
        tabs={[
          { value: 'subscriptions', label: 'Active Subscriptions' },
          { value: 'history', label: 'Order History' },
        ]}
        active={tab}
        onChange={setTab}
        className="mb-6"
      />

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : tab === 'subscriptions' ? (
        subs.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No active subscriptions"
            description="Subscribe to a tiffin provider to see it here."
            action={<Button onClick={() => navigate('/discover')}>Browse providers</Button>}
          />
        ) : (
          <div className="space-y-4">
            {subs.map((sub) => (
              <Card key={sub.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-forest-700">{sub.providerName}</p>
                    <p className="text-xs text-gray-500">{sub.planType} plan · {sub.meal} · {sub.startDate} to {sub.endDate}</p>
                  </div>
                  <Badge tone={statusTone[sub.status]}>{statusLabel[sub.status]}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                  <span>{sub.daysLeft} day(s) left</span>
                  {sub.skippedDates.length > 0 && (
                    <span>· {sub.skippedDates.length} meal(s) skipped: {sub.skippedDates.join(', ')}</span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => setSkipModal(sub)}>
                    <SkipForward size={14} /> Skip a meal
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handlePause(sub)}>
                    <PauseCircle size={14} /> Pause subscription
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : orders.length === 0 ? (
        <EmptyState icon={PackageSearch} title="No orders yet" />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-forest-700 text-sm">{o.providerName} <span className="text-gray-400 font-normal">· #{o.id}</span></p>
                <p className="text-xs text-gray-500">{o.date} · {o.meal} · {o.items.join(', ')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm text-forest-700">₹{o.amount}</span>
                <Badge tone={statusTone[o.status]}>{statusLabel[o.status]}</Badge>
                {(o.status === 'out_for_delivery' || o.status === 'upcoming') && (
                  <Button size="sm" variant="outline" onClick={() => navigate(`/orders/${o.id}/track`)}>
                    Track
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!skipModal}
        onClose={() => setSkipModal(null)}
        title={`Skip a meal — ${skipModal?.providerName ?? ''}`}
      >
        <p className="text-sm text-gray-500 mb-4">Pick a date to skip. You won't be charged for that day's meal.</p>
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={16} className="text-terracotta-500" />
          <input
            type="date"
            id="skip-date"
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full"
            min={new Date().toISOString().slice(0, 10)}
          />
        </div>
        <Button
          className="w-full mt-4"
          onClick={() => {
            const val = document.getElementById('skip-date').value
            if (val) handleSkip(val)
          }}
        >
          Confirm Skip
        </Button>
      </Modal>
    </div>
  )
}
