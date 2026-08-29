import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, CheckCircle2, Compass, Calendar, Package, ArrowRight, Bike, Star } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import { ProviderCardSkeleton } from '../components/ui/Skeleton.jsx'
import { fetchFeaturedProviders } from '../api/providers.js'
import { AREAS } from '../mockData.js'

const steps = [
  { icon: Compass, title: '1. Search & Discover', desc: 'Enter your zip code to find highly-rated home chefs and artisanal kitchens operating in your local area.' },
  { icon: Calendar, title: '2. Choose Your Plan', desc: 'Select a meal plan that fits your schedule (daily, weekly or monthly). Easily pause or modify anytime.' },
  { icon: Package, title: '3. Enjoy Daily Tiffin', desc: 'Receive fresh, hot, and hygienic meals delivered directly to your doorstep just in time for lunch or dinner.' },
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
      <header className="relative pt-12 pb-section-gap px-6 sm:px-margin-desktop max-w-container-max mx-auto min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute top-40 left-10 w-72 h-72 bg-secondary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        </div>
        <div className="w-full max-w-5xl mx-auto text-center space-y-10 z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low border border-surface-variant text-terracotta text-label-md uppercase tracking-wider shadow-sm">
              <Package size={14} />
              Authentic Kitchens, Daily Delivery
            </div>
            <h1 className="font-display text-display-md sm:text-display-lg text-on-background max-w-4xl mx-auto leading-tight">
              Home-Style Tiffin,<br />
              <span className="text-terracotta">Delivered Near You</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Discover artisanal home kitchens in your neighborhood. Subscribe to healthy, fresh, and authentic daily meals prepared with love.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl max-w-3xl mx-auto ambient-shadow">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="relative flex-grow flex items-center bg-white rounded-DEFAULT px-4 h-14 border border-outline-variant focus-within:border-terracotta focus-within:ring-1 focus-within:ring-terracotta transition-all">
                <MapPin size={18} className="text-outline mr-3 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your area or pincode..."
                  className="w-full h-full bg-transparent border-none focus:ring-0 text-on-background text-body-md placeholder-outline p-0 outline-none"
                  list="areas"
                />
                <datalist id="areas">
                  {AREAS.map((a) => <option key={a} value={a} />)}
                </datalist>
              </div>
              <Button type="submit" size="lg" className="shrink-0">
                <Search size={18} /> Find Tiffins
              </Button>
            </form>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-on-surface-variant text-label-md opacity-80">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-leaf-success" /> No hidden fees</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-leaf-success" /> Flexible pausing</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-leaf-success" /> Authentic recipes</span>
          </div>
        </div>
      </header>

      {/* Featured providers */}
      <section className="py-section-gap px-6 sm:px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-headline-lg text-on-background mb-3">Featured Kitchens Near You</h2>
              <p className="text-body-md text-on-surface-variant">Handpicked home chefs highly rated by your neighbors.</p>
            </div>
            <button onClick={() => navigate('/discover')} className="hidden md:flex items-center gap-2 text-label-lg text-terracotta hover:text-primary transition-colors shrink-0">
              View all kitchens <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProviderCardSkeleton key={i} />)
              : featured.map((p) => (
                  <article
                    key={p.id}
                    onClick={() => navigate(`/providers/${p.id}`)}
                    className="bg-white rounded-lg border border-surface-variant ambient-shadow hover-lift overflow-hidden group flex flex-col h-full cursor-pointer"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <img src={p.photos[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-label-md text-on-background shadow-sm">
                        <Star size={14} className="text-mustard" fill="currentColor" strokeWidth={0} /> {p.rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="px-2 py-1 bg-surface-container text-terracotta rounded-full text-[10px] font-semibold uppercase tracking-wide">{p.cuisineTags[0]}</span>
                          {p.dietType === 'veg' && (
                            <span className="px-2 py-1 bg-leaf-success/10 text-leaf-success rounded-full text-[10px] font-semibold uppercase tracking-wide">Veg Only</span>
                          )}
                        </div>
                        <h3 className="text-headline-md text-on-background mb-1">{p.name}</h3>
                        <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-4">{p.tagline}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-variant">
                        <div className="text-label-lg text-on-background">From ₹{p.priceRange[0]}/meal</div>
                        <div className="flex items-center gap-1 text-body-sm text-outline">
                          <Bike size={14} /> {p.distance} km
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <button onClick={() => navigate('/discover')} className="inline-flex items-center gap-2 text-label-lg text-terracotta px-6 py-3 border border-terracotta rounded-full">
              View all kitchens <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-section-gap px-6 sm:px-margin-desktop bg-surface">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-headline-lg text-on-background mb-4">Simple, Daily Joy</h2>
            <p className="text-body-lg text-on-surface-variant">We've designed the process to be as comforting as the food itself. Setup your subscription once, and enjoy daily deliveries.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-outline-variant/30 -z-10" />
            {steps.map((s) => (
              <div key={s.title} className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6 ambient-shadow group-hover:bg-terracotta group-hover:text-white transition-colors duration-300 text-terracotta">
                  <s.icon size={36} />
                </div>
                <h3 className="text-headline-md text-on-background mb-3">{s.title}</h3>
                <p className="text-body-md text-on-surface-variant">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider CTA */}
      <section className="py-section-gap px-6 sm:px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-[1200px] mx-auto rounded-xl overflow-hidden relative ambient-shadow border border-surface-variant">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200')" }}
          />
          <div className="absolute inset-0 bg-on-background/70 mix-blend-multiply" />
          <div className="relative z-10 p-8 sm:p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <div className="max-w-xl">
              <h2 className="font-display text-display-md text-on-primary mb-4">Are you a home chef?</h2>
              <p className="text-body-lg text-surface-container-low">Turn your passion for cooking into a thriving local business. Join TiffinConnect to manage subscriptions, logistics, and reach hungry neighbors.</p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <Button
                as="a"
                href="/login?tab=signup&role=provider"
                size="lg"
                className="w-full md:w-auto !bg-white !text-terracotta hover:!bg-surface-container-low"
              >
                Join as Provider
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
