import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Phone, MapPinned, Star } from 'lucide-react'
import Stepper from '../../components/Stepper.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { fetchOrders } from '../../api/orders.js'

const steps = ['Order Placed', 'Being Prepared', 'Out for Delivery', 'Delivered']
const stepMeta = ['Payment confirmed', 'Kitchen has started cooking', 'On the way to you', 'Estimated soon']
const statusIndex = { upcoming: 0, preparing: 1, out_for_delivery: 2, delivered: 3 }

export default function OrderTrackingPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    fetchOrders().then((all) => setOrder(all.find((o) => o.id === id) || all[0]))
  }, [id])

  if (!order) {
    return (
      <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop py-10">
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const idx = statusIndex[order.status] ?? 2

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      <div className="lg:col-span-5 flex flex-col gap-12">
        <header>
          <h1 className="text-headline-lg text-on-background mb-2">Order Tracking</h1>
          <p className="text-body-md text-on-surface-variant">Order #{order.id} · {order.providerName}</p>
        </header>

        <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-variant/50 ambient-shadow-lg">
          <Stepper steps={steps} currentIndex={idx} stepMeta={stepMeta} />
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 border border-surface-variant/50 ambient-shadow-lg flex items-center gap-6">
          <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 border-surface-variant bg-surface-container flex items-center justify-center text-terracotta font-display font-bold text-headline-md">
            RP
          </div>
          <div className="flex-grow">
            <h4 className="text-label-lg text-on-background">Raj Patel</h4>
            <p className="text-body-sm text-on-surface-variant flex items-center gap-1">Delivery Partner · 4.9 <Star size={12} className="text-mustard" fill="currentColor" strokeWidth={0} /></p>
            <p className="text-label-md text-secondary mt-1">Honda Activa · MH-12-AB-3456</p>
          </div>
          <button className="w-12 h-12 rounded-full border border-outline flex items-center justify-center text-terracotta hover:bg-surface-container transition-colors shrink-0">
            <Phone size={18} />
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-5 border border-surface-variant/50 ambient-shadow-lg text-body-sm text-on-surface-variant">
          <p>Meal: <span className="capitalize font-medium text-on-surface">{order.meal}</span></p>
          <p>Items: {order.items.join(', ')}</p>
          <p>Amount: <span className="font-medium text-on-surface">₹{order.amount}</span></p>
        </div>
      </div>

      <div className="lg:col-span-7 min-h-[320px] lg:min-h-[500px] rounded-xl overflow-hidden border border-surface-variant/50 ambient-shadow-lg relative bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #9d4300 1px, transparent 1px), radial-gradient(circle at 70% 60%, #eab308 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg flex items-center gap-3">
          <MapPinned size={22} className="text-terracotta shrink-0" />
          <div>
            <p className="text-label-md text-on-surface-variant">Delivering to</p>
            <p className="text-label-lg text-on-background">402, Lotus Apartments, Bandra W</p>
          </div>
        </div>
      </div>
    </div>
  )
}
