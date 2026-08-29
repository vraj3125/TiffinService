import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, MapPin, ChevronDown, X } from 'lucide-react'
import ProviderCard from '../../components/ProviderCard.jsx'
import { ProviderCardSkeleton } from '../../components/ui/Skeleton.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Button from '../../components/ui/Button.jsx'
import { Select } from '../../components/ui/Input.jsx'
import { fetchProviders } from '../../api/providers.js'
import { CUISINE_TAGS } from '../../mockData.js'
import LocationPicker from '../../components/ui/LocationPicker.jsx'
import { CITY } from '../../config/locations.js'

const defaultFilters = {
  area: '', cuisine: [], dietType: 'any', maxPrice: 250, deliveryTime: 'any', minRating: 0,
}

const quickChips = [
  { label: 'All', dietType: 'any', deliveryTime: 'any' },
  { label: 'Veg', dietType: 'veg' },
  { label: 'Non-Veg', dietType: 'both' },
  { label: 'Lunch', deliveryTime: 'lunch' },
  { label: 'Dinner', deliveryTime: 'dinner' },
  { label: 'Under ₹150/day', maxPrice: 150 },
]

export default function DiscoverPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState(defaultFilters)
  const [activeChip, setActiveChip] = useState('All')
  const [providersList, setProvidersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchProviders({ ...filters, query }).then((data) => {
      setProvidersList(data)
      setLoading(false)
    })
  }, [filters, query])

  const applyChip = (chip) => {
    setActiveChip(chip.label)
    setFilters({
      ...defaultFilters,
      dietType: chip.dietType ?? 'any',
      deliveryTime: chip.deliveryTime ?? 'any',
      maxPrice: chip.maxPrice ?? 250,
    })
  }

  const toggleCuisine = (tag) => {
    setFilters((f) => ({
      ...f,
      cuisine: f.cuisine.includes(tag) ? f.cuisine.filter((c) => c !== tag) : [...f.cuisine, tag],
    }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
    setActiveChip('All')
  }

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (filters.area) n++
    if (filters.cuisine.length) n += filters.cuisine.length
    if (filters.minRating) n++
    return n
  }, [filters])

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <header className="mb-gutter flex flex-col gap-6">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="font-display text-display-md sm:text-display-lg text-on-surface mb-2">Explore Providers</h1>
            <div className="flex items-center text-on-surface-variant gap-2 cursor-pointer hover:text-terracotta transition-colors group" onClick={() => setShowFilters(true)}>
              <MapPin size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-headline-md">
                {filters.area || `All of ${CITY.name}`}
              </span>
              <ChevronDown size={16} />
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cuisines, dishes..."
                className="w-full sm:w-80 h-14 pl-12 pr-4 rounded-full border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-terracotta focus:border-terracotta transition-shadow placeholder-on-surface-variant/60 text-body-md shadow-sm outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="h-14 px-6 rounded-full border-2 border-mustard text-secondary hover:bg-mustard/10 transition-colors flex items-center gap-2 text-label-lg shrink-0"
            >
              <SlidersHorizontal size={18} />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {quickChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => applyChip(chip)}
              className={`px-5 py-2 rounded-full text-label-md transition-colors border ${
                activeChip === chip.label
                  ? 'bg-terracotta text-on-primary border-terracotta shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant border-outline-variant/30'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </header>

      <p className="text-body-sm text-on-surface-variant mb-6">
        {loading ? 'Searching…' : `${providersList.length} tiffin providers found`}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {Array.from({ length: 6 }).map((_, i) => <ProviderCardSkeleton key={i} />)}
        </div>
      ) : providersList.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No providers match your filters"
          description="Try widening your search area or resetting filters."
          action={<Button variant="outline" onClick={resetFilters}>Reset filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {providersList.map((p) => <ProviderCard key={p.id} provider={p} />)}
        </div>
      )}

      {showFilters && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-on-background/50 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[420px] bg-surface-container-lowest p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-headline-md text-on-surface">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-on-surface-variant"><X size={22} /></button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-label-lg text-on-surface mb-2">Deliver to</h4>
                {/* Choosing an area also brings in kitchens from further out
                    whose own delivery radius still reaches it. */}
                <LocationPicker
                  id="discover-area"
                  value={filters.area}
                  placeholder={`Your area in ${CITY.name}`}
                  onSelect={(place) => setFilters({ ...filters, area: place.name })}
                  onClear={() => setFilters({ ...filters, area: '' })}
                />
                <p className="text-body-sm text-on-surface-variant mt-2">
                  Shows kitchens in your area, plus any nearby ones that deliver to it.
                </p>
              </div>

              <div>
                <h4 className="text-label-lg text-on-surface mb-2">Cuisine</h4>
                <div className="flex flex-wrap gap-2">
                  {CUISINE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleCuisine(tag)}
                      className={`px-4 py-1.5 rounded-full text-label-md border transition-colors ${
                        filters.cuisine.includes(tag)
                          ? 'bg-terracotta text-on-primary border-terracotta'
                          : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:border-terracotta/50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-label-lg text-on-surface mb-2">Diet type</h4>
                <div className="flex gap-2">
                  {[
                    { value: 'any', label: 'Any' },
                    { value: 'veg', label: 'Pure Veg' },
                    { value: 'both', label: 'Veg & Non-Veg' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFilters({ ...filters, dietType: opt.value })}
                      className={`px-4 py-1.5 rounded-full text-label-md border transition-colors ${
                        filters.dietType === opt.value
                          ? 'bg-leaf-success text-white border-leaf-success'
                          : 'bg-surface-container text-on-surface-variant border-outline-variant/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-label-lg text-on-surface mb-2">Delivery time</h4>
                <div className="flex gap-2">
                  {[
                    { value: 'any', label: 'Any' },
                    { value: 'lunch', label: 'Lunch' },
                    { value: 'dinner', label: 'Dinner' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFilters({ ...filters, deliveryTime: opt.value })}
                      className={`px-4 py-1.5 rounded-full text-label-md border transition-colors ${
                        filters.deliveryTime === opt.value
                          ? 'bg-mustard text-on-background border-mustard'
                          : 'bg-surface-container text-on-surface-variant border-outline-variant/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-label-lg text-on-surface mb-2">Max price per meal: ₹{filters.maxPrice}</h4>
                <input
                  type="range"
                  min="80"
                  max="250"
                  step="10"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full accent-terracotta"
                />
              </div>

              <div>
                <h4 className="text-label-lg text-on-surface mb-2">Minimum rating</h4>
                <div className="flex gap-2">
                  {[0, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setFilters({ ...filters, minRating: r })}
                      className={`px-4 py-1.5 rounded-full text-label-md border transition-colors ${
                        filters.minRating === r
                          ? 'bg-terracotta text-on-primary border-terracotta'
                          : 'bg-surface-container text-on-surface-variant border-outline-variant/30'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full">
                  Clear all filters
                </Button>
              )}
            </div>

            <Button className="w-full mt-8" onClick={() => setShowFilters(false)}>Show results</Button>
          </div>
        </div>
      )}
    </div>
  )
}
