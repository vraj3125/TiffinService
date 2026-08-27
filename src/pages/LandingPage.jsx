import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShieldCheck, CalendarClock, ChefHat, Star, MapPin, ArrowRight, Utensils, Truck } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import ProviderCard from '../components/ProviderCard.jsx'
import { ProviderCardSkeleton } from '../components/ui/Skeleton.jsx'
import { fetchFeaturedProviders } from '../api/providers.js'
import { AREAS } from '../mockData.js'

const steps = [
  { icon: Search, title: 'Search your area', desc: 'Enter your locality or pincode to see tiffin providers who deliver to you.' },
  { icon: Utensils, title: 'Pick a plan', desc: 'Browse weekly menus, compare prices, and choose daily, weekly or monthly plans.' },
  { icon: Truck, title: 'Get fed daily', desc: 'Hot, home-style meals delivered on time — pause or skip whenever you like.' },
]

const stats = [
  { label: 'Verified providers', value: '500+' },
  { label: 'Cities', value: '12' },
  { label: 'Meals delivered', value: '2M+' },
  { label: 'Avg. rating', value: '4.6★' },
]

export default function LandingPage() {
  const [query, setQuery] = useState('')
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchFeaturedProviders().then((data) => {
      setFeatured(data)
      setLoading(false)
    })
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/discover${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-mustard-50 via-cream-50 to-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-20 sm:pt-20 sm:pb-28 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white text-terracotta-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-soft mb-5">
              <ChefHat size={14} /> Home-cooked, not fast food
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-forest-700 leading-tight mb-4">
              Find Tiffin Services <span className="text-terracotta-500">Near You</span>
            </h1>
            <p className="text-forest-600/80 text-lg mb-8 max-w-lg">
              Daily home-style meals from verified local cooks in your neighbourhood. Subscribe once, eat well every day.
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl shadow-card max-w-xl">
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin size={18} className="text-terracotta-500 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter area, locality or pincode"
                  className="w-full py-2.5 text-sm focus:outline-none"
                  list="areas"
                />
                <datalist id="areas">
                  {AREAS.map((a) => <option key={a} value={a} />)}
                </datalist>
              </div>
              <Button type="submit" size="lg" className="shrink-0">
                <Search size={18} /> Search
              </Button>
            </form>
            <div className="flex flex-wrap gap-6 mt-10">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display font-bold text-2xl text-forest-700">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500" className="rounded-2xl shadow-card h-48 w-full object-cover translate-y-6" alt="Tiffin meal" />
              <img src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500" className="rounded-2xl shadow-card h-48 w-full object-cover" alt="Thali" />
              <img src="https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" className="rounded-2xl shadow-card h-48 w-full object-cover" alt="South Indian food" />
              <img src="https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500" className="rounded-2xl shadow-card h-48 w-full object-cover translate-y-6" alt="Home cooked food" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-700 text-center mb-2">How Tiffinly works</h2>
        <p className="text-center text-gray-500 mb-10">Three simple steps to home-style meals, every day</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <Card key={s.title} className="p-6 text-center relative">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-terracotta-50 flex items-center justify-center mb-4">
                <s.icon size={26} className="text-terracotta-500" />
              </div>
              <h3 className="font-display font-semibold text-forest-700 mb-2">{i + 1}. {s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured providers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-700 mb-1">Top-rated tiffin providers</h2>
            <p className="text-gray-500">Loved by customers across the city</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/discover')} className="hidden sm:inline-flex">
            View all <ArrowRight size={16} />
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProviderCardSkeleton key={i} />)
            : featured.map((p) => <ProviderCard key={p.id} provider={p} />)}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Button variant="outline" onClick={() => navigate('/discover')}>View all providers</Button>
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          <Card className="p-6 flex gap-4 items-start">
            <ShieldCheck size={28} className="text-forest-500 shrink-0" />
            <div>
              <h3 className="font-display font-semibold text-forest-700 mb-1">FSSAI Verified Kitchens</h3>
              <p className="text-sm text-gray-500">Every provider is background-checked and food-safety verified.</p>
            </div>
          </Card>
          <Card className="p-6 flex gap-4 items-start">
            <CalendarClock size={28} className="text-forest-500 shrink-0" />
            <div>
              <h3 className="font-display font-semibold text-forest-700 mb-1">Flexible Subscriptions</h3>
              <p className="text-sm text-gray-500">Pause, skip, or cancel meals anytime — no long-term lock-in.</p>
            </div>
          </Card>
          <Card className="p-6 flex gap-4 items-start">
            <Star size={28} className="text-forest-500 shrink-0" />
            <div>
              <h3 className="font-display font-semibold text-forest-700 mb-1">Rated by Real Customers</h3>
              <p className="text-sm text-gray-500">Transparent reviews and photos from people in your neighbourhood.</p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-forest-700 rounded-3xl px-6 sm:px-12 py-12 text-center relative overflow-hidden">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">Are you a home cook or tiffin service?</h2>
          <p className="text-cream-100/80 mb-8 max-w-xl mx-auto">Join Tiffinly and reach hundreds of customers in your area looking for daily home-cooked meals.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button as="a" href="/login?tab=signup&role=provider" variant="mustard" size="lg">Register as a Provider</Button>
            <Button as="a" href="/login?tab=signup&role=customer" variant="outline" size="lg" className="!text-white !border-white hover:!bg-white/10">
              Sign up as a Customer
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
