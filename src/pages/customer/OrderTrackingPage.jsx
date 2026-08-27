import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, MessageCircle } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Stepper from '../../components/Stepper.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { fetchOrders } from '../../api/orders.js'

const steps = ['Order Placed', 'Being Prepared', 'Out for Delivery', 'Delivered']
const statusIndex = { upcoming: 0, preparing: 1, out_for_delivery: 2, delivered: 3 }

export default function OrderTrackingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    fetchOrders().then((all) => setOrder(all.find((o) => o.id === id) || all[0]))
  }, [id])

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const idx = statusIndex[order.status] ?? 2

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-forest-600">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="font-display text-2xl font-bold text-forest-700 mb-1">Track your order</h1>
      <p className="text-sm text-gray-500 mb-8">Order #{order.id} from {order.providerName}</p>

      <Card className="p-6 mb-6">
        <Stepper steps={steps} currentIndex={idx} />
      </Card>

      <Card className="p-5 mb-6">
        <h3 className="font-semibold text-forest-700 mb-3">Order details</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Meal: <span className="capitalize font-medium text-forest-700">{order.meal}</span></p>
          <p>Items: {order.items.join(', ')}</p>
          <p>Amount: <span className="font-medium text-forest-700">₹{order.amount}</span></p>
          <p>Estimated delivery: 12:45 PM – 1:15 PM</p>
        </div>
      </Card>

      <Card className="p-5 flex items-center justify-between">
        <div>
          <p className="font-semibold text-forest-700 text-sm">Need help with this order?</p>
          <p className="text-xs text-gray-500">Contact {order.providerName} directly</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline"><Phone size={14} /> Call</Button>
          <Button size="sm" variant="ghost"><MessageCircle size={14} /> Chat</Button>
        </div>
      </Card>
    </div>
  )
}
