import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShieldCheck, MapPin, Clock, Star, Leaf, Drumstick, Check } from 'lucide-react'
import Badge from '../../components/ui/Badge.jsx'
import Rating from '../../components/ui/Rating.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import Tabs from '../../components/ui/Tabs.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { fetchProviderById, fetchMenuForProvider, fetchPlansForProvider } from '../../api/providers.js'
import { fetchReviewsForProvider } from '../../api/reviews.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const today = DAYS[(new Date().getDay() + 6) % 7]

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 h-64 sm:h-80">
        {provider.photos.concat(provider.photos).slice(0, 4).map((photo, i) => (
          <img key={i} src={photo} alt="" className="w-full h-full object-cover" />
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-700">{provider.name}</h1>
              {provider.verified && <Badge tone="verified" icon={ShieldCheck}>FSSAI Verified</Badge>}
              <Badge tone={provider.dietType === 'veg' ? 'veg' : 'nonveg'} icon={provider.dietType === 'veg' ? Leaf : Drumstick}>
                {provider.dietType === 'veg' ? 'Pure Veg' : 'Veg & Non-Veg'}
              </Badge>
            </div>
            <p className="text-gray-500 mb-2">{provider.tagline}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <Rating value={provider.rating} count={provider.reviewCount} />
              <span className="flex items-center gap-1"><MapPin size={14} /> {provider.kitchenAddress}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {provider.deliveryTime.join(' & ')}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={() => handleAction(plans[0])}>Try One-Time Order</Button>
            <Button onClick={() => handleAction(selectedPlan)}>Subscribe</Button>
          </div>
        </div>

        {/* Weekly menu */}
        <Card className="p-5 mb-8">
          <h2 className="font-display font-semibold text-lg text-forest-700 mb-4">Weekly Menu</h2>
          <Tabs
            tabs={DAYS.map((d) => ({ value: d, label: d.slice(0, 3) }))}
            active={activeDay}
            onChange={setActiveDay}
            className="mb-4"
          />
          <div className="flex gap-2 mb-4">
            {['lunch', 'dinner'].map((m) => (
              <button
                key={m}
                onClick={() => setMealTab(m)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-colors ${
                  mealTab === m ? 'bg-terracotta-500 text-white border-terracotta-500' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {menu?.[activeDay]?.[mealTab] ? (
            <div className="bg-cream-50 rounded-xl p-4">
              <ul className="space-y-1.5 mb-3">
                {menu[activeDay][mealTab].items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-forest-700">
                    <Check size={14} className="text-forest-500" /> {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Badge tone={menu[activeDay][mealTab].veg ? 'veg' : 'nonveg'}>
                  {menu[activeDay][mealTab].veg ? 'Veg' : 'Non-Veg'}
                </Badge>
                <Badge tone="neutral">{menu[activeDay][mealTab].calories} kcal</Badge>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Not served on this day.</p>
          )}
        </Card>

        {/* Plans */}
        <div className="mb-8">
          <h2 className="font-display font-semibold text-lg text-forest-700 mb-4">Subscription Plans</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`p-5 cursor-pointer border-2 transition-colors relative ${
                  selectedPlan?.id === plan.id ? 'border-terracotta-500' : 'border-transparent'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-4 bg-mustard-400 text-forest-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <p className="text-sm font-semibold text-gray-500">{plan.type}</p>
                <p className="font-display text-2xl font-bold text-forest-700 my-1">₹{plan.price}</p>
                <p className="text-xs text-gray-400 mb-3">{plan.duration} · {plan.mealsPerDay} meal/day</p>
                <p className="text-xs text-gray-500 mb-4">{plan.description}</p>
                <Button
                  size="sm"
                  variant={selectedPlan?.id === plan.id ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedPlan(plan)
                    handleAction(plan)
                  }}
                >
                  Choose Plan
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="font-display font-semibold text-lg text-forest-700 mb-4">
            Customer Reviews <span className="text-gray-400 font-normal">({reviews.length})</span>
          </h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400">No reviews yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-forest-700 text-sm">{r.customerName}</p>
                      <p className="text-xs text-gray-400">{r.date}</p>
                    </div>
                    <span className="flex items-center gap-1 text-mustard-600 font-bold text-sm">
                      {r.rating} <Star size={13} fill="currentColor" strokeWidth={0} />
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{r.comment}</p>
                  {r.photo && <img src={r.photo} alt="" className="w-full h-32 object-cover rounded-lg" />}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
