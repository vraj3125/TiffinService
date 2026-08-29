import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus, CreditCard, QrCode, Wallet, CheckCircle2, ReceiptText, Clock, Home, Briefcase, ArrowRight, Sun, Moon } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { placeOrder } from '../../api/orders.js'
import { PAYMENT_OPTIONS, addAddress, fetchAddresses } from '../../api/account.js'
import { useAuth } from '../../context/AuthContext.jsx'

const timeSlotsByMeal = {
  lunch: ['12:30 PM – 1:30 PM', '1:30 PM – 2:30 PM'],
  dinner: ['7:30 PM – 8:30 PM', '8:30 PM – 9:30 PM'],
}
const paymentIcons = { UPI: QrCode, Card: CreditCard, Cash: Wallet }
const addressIcons = { Home, Work: Briefcase }

const addressFieldClass =
  'w-full min-h-[48px] rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2.5 text-body-sm text-on-surface placeholder:text-outline focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none'

const blankAddress = { label: 'Home', line: '', area: '', pincode: '' }

export default function CheckoutPage() {
  const { checkoutItem, clearCheckout } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const { user } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [addressId, setAddressId] = useState(null)
  const [draft, setDraft] = useState(null)
  const [slot, setSlot] = useState(timeSlotsByMeal[checkoutItem?.meal ?? 'lunch'][0])
  const [paymentId, setPaymentId] = useState(PAYMENT_OPTIONS[0].id)
  const [placing, setPlacing] = useState(false)

  // Addresses belong to the account, so a new customer arrives here with none
  // and adds their first one inline rather than hitting a dead end.
  useEffect(() => {
    if (!user) return
    fetchAddresses(user.uid).then((list) => {
      setAddresses(list)
      setAddressId(list.find((a) => a.isDefault)?.id ?? list[0]?.id ?? null)
      if (!list.length) setDraft(blankAddress)
    })
  }, [user])

  const saveDraft = async (e) => {
    e.preventDefault()
    if (!draft.line.trim() || !draft.area.trim() || !/^\d{6}$/.test(draft.pincode)) {
      showToast('Add a street, an area and a 6-digit pincode', 'info')
      return
    }
    const list = await addAddress(user.uid, draft)
    setAddresses(list)
    setAddressId(list[list.length - 1].id)
    setDraft(null)
    showToast('Address saved')
  }

  if (!checkoutItem) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
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
    if (!addressId) {
      showToast('Add a delivery address first', 'info')
      return
    }
    setPlacing(true)
    // Recorded against this account, so it shows up in their orders and nobody
    // else's.
    await placeOrder(user.uid, { provider, plan, meal, amount: total })
    setPlacing(false)
    showToast(`Order placed with ${provider.name}! Your ${meal} starts soon.`)
    clearCheckout()
    navigate('/orders')
  }

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-leaf-success mb-4">
          <CheckCircle2 size={18} />
          <span className="text-label-md">Secure Checkout</span>
        </div>
        <h1 className="text-headline-lg text-on-surface">Checkout</h1>
        <p className="text-body-md text-on-surface-variant mt-2">Almost there! Please review your details to complete the order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-7 flex flex-col gap-12">
          <section className="bg-surface-container-lowest rounded-lg p-8 ambient-shadow border border-surface-variant/50">
            <h2 className="text-headline-md mb-6 flex items-center gap-3">
              <ReceiptText size={22} className="text-terracotta" /> Order Summary
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-48 h-32 rounded-DEFAULT overflow-hidden relative shrink-0">
                <img src={provider.photos[0]} alt={provider.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-headline-md text-on-surface">{plan.type} Plan</h3>
                    <span className="text-headline-md text-terracotta shrink-0">₹{plan.price}</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mb-4">Provided by <span className="font-semibold text-primary">{provider.name}</span></p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-surface-container text-terracotta px-4 py-1.5 rounded-full text-label-md border border-outline-variant/30">{plan.duration} · {meal}</span>
                  <span className={`px-4 py-1.5 rounded-full text-label-md ${provider.dietType === 'veg' ? 'bg-leaf-success/10 text-leaf-success' : 'bg-terracotta/10 text-terracotta'}`}>
                    {provider.dietType === 'veg' ? 'Vegetarian' : 'Veg & Non-Veg'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-md flex items-center gap-3">
                <MapPin size={22} className="text-terracotta" /> Delivery Address
              </h2>
              <button
                type="button"
                onClick={() => setDraft(draft ? null : blankAddress)}
                className="text-terracotta text-label-lg hover:underline flex items-center gap-1"
              >
                <Plus size={18} /> Add New
              </button>
            </div>

            {draft && (
              <form
                onSubmit={saveDraft}
                className="mb-6 rounded-lg border border-outline-variant bg-surface-container-low p-6 space-y-4"
              >
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setDraft({ ...draft, label })}
                      className={`px-4 py-2 rounded-full text-label-md border-2 transition-colors ${
                        draft.label === label
                          ? 'border-terracotta text-terracotta bg-surface-container-lowest'
                          : 'border-outline-variant text-on-surface-variant'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input
                  value={draft.line}
                  onChange={(e) => setDraft({ ...draft, line: e.target.value })}
                  placeholder="Flat / house no., building, street"
                  className={addressFieldClass}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    value={draft.area}
                    onChange={(e) => setDraft({ ...draft, area: e.target.value })}
                    placeholder="Area / locality"
                    className={addressFieldClass}
                  />
                  <input
                    value={draft.pincode}
                    onChange={(e) =>
                      setDraft({ ...draft, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })
                    }
                    inputMode="numeric"
                    placeholder="Pincode"
                    className={addressFieldClass}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" size="sm">Save address</Button>
                  {addresses.length > 0 && (
                    <Button type="button" size="sm" variant="ghost" onClick={() => setDraft(null)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}

            {addresses.length === 0 && !draft && (
              <p className="text-body-sm text-on-surface-variant mb-6">
                No saved addresses yet. Add one to continue.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => {
                const Icon = addressIcons[addr.label] ?? Home
                const selected = addressId === addr.id
                return (
                  <div
                    key={addr.id}
                    onClick={() => setAddressId(addr.id)}
                    className={`relative rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                      selected
                        ? 'bg-surface-container-low border-2 border-terracotta'
                        : 'bg-surface-container-lowest border border-outline-variant hover:border-terracotta/50 hover:shadow-lg hover:shadow-terracotta/5'
                    }`}
                  >
                    {selected && <div className="absolute top-4 right-4 text-terracotta"><CheckCircle2 size={20} /></div>}
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={20} className="text-on-surface-variant" />
                      <h4 className="text-label-lg text-on-surface">{addr.label}</h4>
                    </div>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      {addr.line}<br />
                      {addr.area} – {addr.pincode}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <h2 className="text-headline-md mb-6 flex items-center gap-3">
              <Clock size={22} className="text-terracotta" /> Preferred Delivery Window
            </h2>
            <div className="flex flex-wrap gap-4">
              {timeSlotsByMeal[meal].map((s, i) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`px-6 py-4 rounded-full border text-body-md transition-all duration-200 flex items-center gap-2 ${
                    slot === s
                      ? 'bg-terracotta text-on-primary border-terracotta shadow-md shadow-terracotta/20'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-terracotta/50'
                  }`}
                >
                  {meal === 'lunch' ? <Sun size={18} /> : <Moon size={18} />}
                  {i === 0 ? meal[0].toUpperCase() + meal.slice(1) : ''} ({s})
                </button>
              ))}
            </div>
            <p className="text-body-sm text-on-surface-variant mt-4 ml-2">Meals are delivered fresh daily within your chosen window.</p>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32 flex flex-col gap-8">
            <section className="bg-surface-container-lowest rounded-lg p-8 ambient-shadow border border-surface-variant/50">
              <h2 className="text-headline-md mb-6 flex items-center gap-3">
                <Wallet size={22} className="text-terracotta" /> Payment Method
              </h2>
              <div className="flex flex-col gap-4">
                {PAYMENT_OPTIONS.map((pm) => {
                  const Icon = paymentIcons[pm.type]
                  const selected = paymentId === pm.id
                  return (
                    <label key={pm.id} className="cursor-pointer group">
                      <input type="radio" checked={selected} onChange={() => setPaymentId(pm.id)} className="sr-only" />
                      <div
                        className={`p-5 rounded-DEFAULT border transition-all duration-200 flex items-center gap-4 ${
                          selected ? 'border-terracotta bg-surface-container-low' : 'border-outline-variant bg-surface group-hover:border-terracotta/50'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all ${selected ? 'border-[6px] border-terracotta' : 'border-outline-variant'}`} />
                        <Icon size={26} className="text-slate-neutral" />
                        <div className="flex-grow">
                          <h4 className="text-label-lg text-on-surface">{pm.label}</h4>
                          <p className="text-body-sm text-on-surface-variant">{pm.hint}</p>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </section>

            <section className="bg-surface-container-lowest rounded-lg p-8 ambient-shadow border border-surface-variant/50">
              <h2 className="text-headline-md mb-6">Price Details</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-body-md text-on-surface-variant">
                  <span>{plan.type} Plan ({plan.duration})</span>
                  <span>₹{plan.price}</span>
                </div>
                <div className="flex justify-between items-center text-body-md text-on-surface-variant">
                  <span>Delivery Fee</span>
                  <span className="text-leaf-success">Free</span>
                </div>
                <div className="flex justify-between items-center text-body-md text-on-surface-variant">
                  <span>Taxes & Fees</span>
                  <span>₹{gst}</span>
                </div>
              </div>
              <div className="border-t border-surface-variant pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-headline-md text-on-surface">Total</span>
                  <span className="font-display text-[36px] font-bold text-terracotta">₹{total}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handlePlace} disabled={placing}>
                {placing ? 'Placing order…' : 'Place Order Securely'} <ArrowRight size={18} />
              </Button>
              <p className="text-center text-body-sm text-on-surface-variant mt-4">
                By placing your order, you agree to our <a className="underline hover:text-terracotta">Terms of Service</a> and <a className="underline hover:text-terracotta">Privacy Policy</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
