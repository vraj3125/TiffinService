import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShieldCheck, MapPin, Star, ShoppingBag, Check } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { fetchProviderById, fetchMenuForProvider, fetchPlansForProvider } from '../../api/providers.js'
import { fetchReviewsForProvider } from '../../api/reviews.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const today = DAYS[(new Date().getDay() + 6) % 7]
const tabs = ['Menu', 'Plans', 'Reviews']

export default function ProviderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { startCheckout } = useCart()
  const { showToast } = useToast()

  const [provider, setProvider] = useState(null)
  const [menu, setMenu] = useState(null)
  const [plans, setPlans] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Menu')
  const [activeDay, setActiveDay] = useState(today)
  const [mealTab, setMealTab] = useState('lunch')
  const [selectedPlan, setSelectedPlan] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchProviderById(id),
      fetchMenuForProvider(id),
      fetchPlansForProvider(id),
      fetchReviewsForProvider(id),
    ]).then(([p, m, pl, rv]) => {
      setProvider(p)
      setMenu(m)
      setPlans(pl)
      setReviews(rv)
      setSelectedPlan(pl.find((x) => x.popular) || pl[0])
      setLoading(false)
    })
  }, [id])

  const handleAction = (plan) => {
    if (!user) {
      showToast('Please log in as a customer to continue', 'info')
      navigate('/login')
      return
    }
    if (user.role !== 'customer') {
      showToast('Log in with a customer account to order', 'info')
      return
    }
    startCheckout(provider, plan, mealTab)
    navigate('/checkout')
  }

  if (loading || !provider) {
    return (
      <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop py-10 space-y-4">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  const dish = menu?.[activeDay]?.[mealTab]

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <div className="rounded-xl overflow-hidden mb-8 h-56 sm:h-80 relative shadow-lg">
        <img src={provider.photos[0]} alt={provider.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-4">
        <div className="flex-1">
          <h1 className="font-display text-headline-lg sm:text-display-md text-primary mb-2 flex items-center gap-4 flex-wrap">
            {provider.name}
            {provider.verified && (
              <span className="inline-flex items-center gap-1 bg-surface-container text-terracotta px-3 py-1 rounded-full text-label-md border border-outline-variant">
                <ShieldCheck size={16} /> FSSAI Verified
              </span>
            )}
          </h1>
          <p className="text-body-lg text-on-surface-variant flex items-center gap-6 mt-2 flex-wrap">
            <span className="flex items-center gap-1"><Star size={18} className="text-mustard" fill="currentColor" strokeWidth={0} /> {provider.rating} ({provider.reviewCount} Reviews)</span>
            <span className="flex items-center gap-1"><MapPin size={18} /> {provider.kitchenAddress}</span>
          </p>
          <div className="flex gap-2 mt-4 flex-wrap">
            {provider.cuisineTags.map((tag) => (
              <span key={tag} className="bg-surface-container-low text-terracotta px-4 py-1 rounded-full text-label-md">{tag}</span>
            ))}
            <span className={`px-4 py-1 rounded-full text-label-md ${provider.dietType === 'veg' ? 'bg-surface-container-low text-leaf-success' : 'bg-surface-container-low text-terracotta'}`}>
              {provider.dietType === 'veg' ? '100% Vegetarian' : 'Veg & Non-Veg'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mt-12">
        <div className="md:col-span-8">
          <div className="flex gap-8 border-b border-surface-variant mb-8 overflow-x-auto no-scrollbar">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`pb-4 text-headline-md whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === t ? 'text-terracotta border-terracotta' : 'text-on-surface-variant border-transparent hover:text-terracotta'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {activeTab === 'Menu' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2 overflow-x-auto pb-2 no-scrollbar">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setActiveDay(d)}
                    className={`flex-shrink-0 text-center px-4 py-2 rounded-xl transition-colors ${
                      activeDay === d ? 'bg-terracotta text-white ambient-shadow' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <div className="text-label-md opacity-80 uppercase tracking-wider">{d.slice(0, 3)}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                {['lunch', 'dinner'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMealTab(m)}
                    className={`px-4 py-1.5 rounded-full text-label-md capitalize border transition-colors ${
                      mealTab === m ? 'bg-terracotta text-white border-terracotta' : 'bg-surface-container text-on-surface-variant border-outline-variant/30'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {dish ? (
                <div className="bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row gap-6 border border-surface-variant ambient-shadow">
                  <div className="w-full md:w-1/3 rounded-DEFAULT overflow-hidden h-48 shrink-0">
                    <img src={provider.photos[1] || provider.photos[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full md:w-2/3 flex flex-col justify-center">
                    <h3 className="text-headline-lg text-on-background mb-3">{activeDay} {mealTab}</h3>
                    <ul className="space-y-1.5 mb-4">
                      {dish.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-body-md text-on-surface-variant">
                          <Check size={14} className="text-leaf-success shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-label-md ${dish.veg ? 'bg-leaf-success/10 text-leaf-success' : 'bg-terracotta/10 text-terracotta'}`}>
                        {dish.veg ? 'Veg' : 'Non-Veg'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-label-md bg-surface-container text-on-surface-variant">{dish.calories} kcal</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-headline-md text-terracotta">₹{provider.priceRange[0]} <span className="text-body-sm text-on-surface-variant">/ meal</span></span>
                      <Button onClick={() => handleAction(plans[0])}>Try This Meal</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-body-sm text-on-surface-variant">Not served on this day.</p>
              )}
            </div>
          )}

          {activeTab === 'Plans' && (
            <div className="grid sm:grid-cols-2 gap-5">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`bg-surface-container-lowest rounded-lg p-6 cursor-pointer border-2 transition-colors relative ambient-shadow ${
                    selectedPlan?.id === plan.id ? 'border-terracotta' : 'border-transparent'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2.5 left-4 bg-mustard text-on-background text-[10px] font-bold px-2 py-0.5 rounded-full">
                      MOST POPULAR
                    </span>
                  )}
                  <p className="text-label-md text-on-surface-variant">{plan.type}</p>
                  <p className="text-headline-lg text-terracotta my-1">₹{plan.price}</p>
                  <p className="text-body-sm text-on-surface-variant mb-3">{plan.duration} · {plan.mealsPerDay} meal/day</p>
                  <p className="text-body-sm text-on-surface-variant mb-4">{plan.description}</p>
                  <Button
                    size="sm"
                    variant={selectedPlan?.id === plan.id ? 'primary' : 'secondary'}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPlan(plan)
                      handleAction(plan)
                    }}
                  >
                    Choose Plan
                  </Button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div>
              {reviews.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant">No reviews yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-surface-container-lowest rounded-lg p-5 border border-surface-variant ambient-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-label-lg text-on-surface">{r.customerName}</p>
                          <p className="text-body-sm text-on-surface-variant">{r.date}</p>
                        </div>
                        <span className="flex items-center gap-1 text-mustard font-bold text-label-lg">
                          {r.rating} <Star size={14} fill="currentColor" strokeWidth={0} />
                        </span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant mb-2">{r.comment}</p>
                      {r.photo && <img src={r.photo} alt="" className="w-full h-32 object-cover rounded-lg" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-4 relative">
          <div className="sticky top-32 bg-surface-container-lowest border border-surface-variant rounded-lg p-6 ambient-shadow">
            <h2 className="text-headline-lg text-on-background mb-6 flex items-center gap-2">
              <ShoppingBag size={22} className="text-terracotta" /> Your Order
            </h2>
            {selectedPlan && (
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center border-b border-surface-variant pb-4">
                  <div>
                    <h4 className="text-label-lg text-on-background">{selectedPlan.type} Plan</h4>
                    <p className="text-body-sm text-on-surface-variant">{selectedPlan.duration} · {mealTab}</p>
                  </div>
                  <span className="text-label-lg">₹{selectedPlan.price}</span>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mb-6 pt-2">
              <span className="text-headline-md">Total</span>
              <span className="text-headline-md text-terracotta">₹{selectedPlan?.price ?? 0}</span>
            </div>
            <Button className="w-full" size="lg" onClick={() => handleAction(selectedPlan)}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
