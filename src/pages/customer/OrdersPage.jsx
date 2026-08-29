import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, PackageSearch, CheckCircle2, PauseCircle, PlayCircle, Calendar } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { fetchOrders, fetchSubscriptions, skipMeal, updateSubscription } from '../../api/orders.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const statusStyle = {
  upcoming: 'bg-surface-container-low text-terracotta border border-outline-variant/30',
  delivered: 'bg-surface-container-low text-leaf-success border border-leaf-success/20',
  out_for_delivery: 'bg-surface-container-low text-terracotta border border-outline-variant/30',
  skipped: 'bg-surface-container text-on-surface-variant border border-outline-variant/30',
}
const statusLabel = {
  upcoming: 'Upcoming', delivered: 'Delivered', out_for_delivery: 'Out for delivery', skipped: 'Skipped',
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [skipModal, setSkipModal] = useState(null)
  const { showToast } = useToast()
  const navigate = useNavigate()

  // Scoped to the signed-in account -- a new account has nothing here yet.
  useEffect(() => {
    if (!user) return
    let live = true
    setLoading(true)
    Promise.all([fetchOrders(user.uid), fetchSubscriptions(user.uid)]).then(([o, s]) => {
      if (!live) return
      setOrders(o)
      setSubs(s)
      setLoading(false)
    })
    return () => {
      live = false
    }
  }, [user])

  // Pausing now persists to the account instead of only raising a toast.
  const handlePauseToggle = async (sub) => {
    const paused = sub.status === 'paused'
    setSubs(await updateSubscription(user.uid, sub.id, { status: paused ? 'active' : 'paused' }))
    showToast(
      paused
        ? `Subscription with ${sub.providerName} resumed.`
        : `Subscription with ${sub.providerName} paused. Resume anytime from this page.`
    )
  }

  const handleSkip = async (date) => {
    const id = skipModal.id
    setSkipModal(null)
    setSubs(await skipMeal(user.uid, id, date))
    showToast(`Meal skipped for ${date}. You won't be charged for that day.`)
  }

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <header className="mb-12">
        <h1 className="font-display text-display-md text-on-surface mb-2">My Subscriptions</h1>
        <p className="text-body-lg text-on-surface-variant">Manage your active plans and upcoming deliveries.</p>
      </header>

      <section className="mb-section-gap">
        <h2 className="text-headline-lg mb-8 text-on-surface">Active Plans</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
          </div>
        ) : subs.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No active subscriptions"
            description="Subscribe to a tiffin provider to see it here."
            action={<Button onClick={() => navigate('/discover')}>Browse providers</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
            {subs.map((sub) => {
              const isSkippedForNext = sub.skippedDates.length > 0
              return (
                <article key={sub.id} className="bg-surface-container-lowest border border-surface-variant rounded-xl p-8 ambient-shadow relative overflow-hidden">
                  <div className="flex items-start justify-between mb-6 gap-3">
                    <div>
                      <h3 className="text-headline-md text-on-surface">{sub.providerName}</h3>
                      <p className="text-body-sm text-on-surface-variant">{sub.planType} plan · {sub.meal}</p>
                    </div>
                    <span className="bg-surface-container-low text-terracotta px-3 py-1 rounded-full text-label-md border border-outline-variant/30 shrink-0">
                      {sub.status === 'active' ? 'Active' : 'Expiring Soon'}
                    </span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-label-lg text-on-surface-variant">Days left</span>
                      <span className="text-label-lg text-on-surface">{sub.daysLeft}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-label-lg text-on-surface-variant">Plan window</span>
                      <span className="text-label-lg text-on-surface">{sub.startDate} → {sub.endDate}</span>
                    </div>
                    {sub.skippedDates.length > 0 && (
                      <div className="flex justify-between items-start mt-2 pt-2 border-t border-surface-variant/60">
                        <span className="text-label-lg text-on-surface-variant">Skipped</span>
                        <span className="text-label-lg text-on-surface text-right">{sub.skippedDates.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Button size="sm" variant="secondary" onClick={() => setSkipModal(sub)}>
                      <Calendar size={14} /> Skip a meal
                    </Button>
                    <button
                      onClick={() => handlePauseToggle(sub)}
                      className="flex items-center gap-1.5 text-body-sm text-on-surface-variant hover:text-terracotta transition-colors"
                    >
                      {sub.status === 'paused' ? (
                        <>
                          <PlayCircle size={16} /> Resume
                        </>
                      ) : (
                        <>
                          <PauseCircle size={16} /> Pause
                        </>
                      )}
                    </button>
                  </div>
                </article>
              )
            })}
            <article
              onClick={() => navigate('/discover')}
              className="bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container transition-colors duration-300 min-h-[280px]"
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm text-terracotta">
                <Plus size={28} />
              </div>
              <h3 className="text-headline-md text-on-surface mb-2">Find a New Kitchen</h3>
              <p className="text-body-sm text-on-surface-variant text-center max-w-[200px]">Explore artisanal makers delivering to your area.</p>
            </article>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-headline-lg mb-8 text-on-surface">Recent Deliveries</h2>
        {loading ? (
          <Skeleton className="h-56 w-full" />
        ) : orders.length === 0 ? (
          <EmptyState icon={PackageSearch} title="No orders yet" />
        ) : (
          <div className="bg-surface-container-lowest rounded-xl border border-surface-variant overflow-hidden ambient-shadow overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-surface-variant bg-surface-container-low">
                  <th className="py-4 px-6 text-label-lg text-on-surface-variant">Date</th>
                  <th className="py-4 px-6 text-label-lg text-on-surface-variant">Kitchen & Meal</th>
                  <th className="py-4 px-6 text-label-lg text-on-surface-variant">Status</th>
                  <th className="py-4 px-6 text-label-lg text-on-surface-variant text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-body-sm">
                {orders.map((o, i) => (
                  <tr key={o.id} className={`border-b border-surface-variant last:border-0 hover:bg-cream-bg transition-colors duration-200 ${i % 2 === 1 ? 'bg-secondary-container/5' : ''}`}>
                    <td className="py-5 px-6 text-on-surface">
                      <div className="text-label-lg">{o.date}</div>
                      <div className="text-on-surface-variant capitalize">{o.meal}</div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-label-lg text-on-surface">{o.providerName}</div>
                      <div className="text-on-surface-variant">
                        {o.items?.length ? o.items.join(', ') : `${o.planType} plan`}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-md ${statusStyle[o.status]}`}>
                        {o.status === 'delivered' && <CheckCircle2 size={14} />}
                        {o.status === 'skipped' && <PauseCircle size={14} />}
                        {statusLabel[o.status]}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      {o.status === 'out_for_delivery' || o.status === 'upcoming' ? (
                        <button onClick={() => navigate(`/orders/${o.id}/track`)} className="text-terracotta hover:text-primary text-label-lg transition-colors">Track</button>
                      ) : o.status === 'delivered' ? (
                        <button className="text-terracotta hover:text-primary text-label-lg transition-colors">Rate</button>
                      ) : (
                        <span className="text-on-surface-variant text-label-lg">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={!!skipModal}
        onClose={() => setSkipModal(null)}
        title={`Skip a meal — ${skipModal?.providerName ?? ''}`}
      >
        <p className="text-body-sm text-on-surface-variant mb-4">Pick a date to skip. You won't be charged for that day's meal.</p>
        <input
          type="date"
          id="skip-date"
          className="border border-outline-variant rounded-DEFAULT px-3.5 py-3 text-body-md w-full min-h-[56px] focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none"
          min={new Date().toISOString().slice(0, 10)}
        />
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
