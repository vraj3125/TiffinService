import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus, CreditCard, Smartphone, Wallet, Check } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { placeOrder } from '../../api/orders.js'
import { savedAddresses, paymentMethods } from '../../mockData.js'

const timeSlotsByMeal = {
  lunch: ['12:30 PM – 1:30 PM', '1:30 PM – 2:30 PM'],
  dinner: ['7:30 PM – 8:30 PM', '8:30 PM – 9:30 PM'],
}
const paymentIcons = { UPI: Smartphone, Card: CreditCard, Wallet: Wallet }

export default function CheckoutPage() {
  const { checkoutItem, clearCheckout } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [addressId, setAddressId] = useState(savedAddresses.find((a) => a.isDefault)?.id)
  const [slot, setSlot] = useState(timeSlotsByMeal[checkoutItem?.meal ?? 'lunch'][0])
  const [paymentId, setPaymentId] = useState(paymentMethods.find((p) => p.isDefault)?.id)
  const [placing, setPlacing] = useState(false)

  if (!checkoutItem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon={MapPin}
          title="No plan selected yet"
          description="Pick a provider and a subscription plan first."
          action={<Button onClick={() => navigate('/discover')}>Browse providers</Button>}
        />
      </div>
    )
  }

  const { provider, plan, meal } = checkoutItem
  const gst = Math.round(plan.price * 0.05)
  const total = plan.price + gst

  const handlePlace = async () => {
    setPlacing(true)
    await placeOrder({ providerId: provider.id, providerName: provider.name, planId: plan.id, amount: total, meal })
    setPlacing(false)
    showToast(`Order placed with ${provider.name}! Your ${meal} starts soon.`)
    clearCheckout()
    navigate('/orders')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-forest-700 mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold text-forest-700 mb-3">Delivery Address</h3>
            <div className="space-y-2">
              {savedAddresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                    addressId === addr.id ? 'border-terracotta-500 bg-terracotta-50' : 'border-gray-200'
                  }`}
                >
                  <input type="radio" checked={addressId === addr.id} onChange={() => setAddressId(addr.id)} className="mt-1 accent-terracotta-500" />
                  <div>
                    <p className="text-sm font-semibold text-forest-700">{addr.label}</p>
                    <p className="text-xs text-gray-500">{addr.line}, {addr.area} – {addr.pincode}</p>
                  </div>
                </label>
              ))}
              <button className="flex items-center gap-2 text-sm text-terracotta-600 font-semibold px-3 py-2">
                <Plus size={16} /> Add new address
              </button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-forest-700 mb-3">Delivery Time Slot ({meal})</h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlotsByMeal[meal].map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`text-sm px-3 py-2.5 rounded-xl border-2 transition-colors ${
                    slot === s ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-700 font-semibold' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-forest-700 mb-3">Payment Method</h3>
            <div className="space-y-2">
              {paymentMethods.map((pm) => {
                const Icon = paymentIcons[pm.type]
                return (
                  <label
                    key={pm.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                      paymentId === pm.id ? 'border-terracotta-500 bg-terracotta-50' : 'border-gray-200'
                    }`}
                  >
                    <input type="radio" checked={paymentId === pm.id} onChange={() => setPaymentId(pm.id)} className="accent-terracotta-500" />
                    <Icon size={18} className="text-forest-500" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-forest-700">{pm.type}</p>
                      <p className="text-xs text-gray-500">{pm.label}{pm.balance != null ? ` · ₹${pm.balance} available` : ''}</p>
                    </div>
                    {paymentId === pm.id && <Check size={16} className="text-terracotta-500" />}
                  </label>
                )
              })}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-5 sticky top-24">
            <h3 className="font-semibold text-forest-700 mb-3">Order Summary</h3>
            <div className="flex gap-3 mb-4 pb-4 border-b border-gray-100">
              <img src={provider.photos[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-sm text-forest-700">{provider.name}</p>
                <p className="text-xs text-gray-500">{provider.area}</p>
                <Badge tone="info" className="mt-1">{plan.type} · {meal}</Badge>
              </div>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>{plan.type} plan ({plan.duration})</span>
                <span>₹{plan.price}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes & delivery</span>
                <span>₹{gst}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-forest-700 text-lg pt-3 border-t border-gray-100 mb-5">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <Button className="w-full" size="lg" onClick={handlePlace} disabled={placing}>
              {placing ? 'Placing order…' : 'Place Order'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
