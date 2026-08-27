import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import ProviderCard from '../../components/ProviderCard.jsx'
import { ProviderCardSkeleton } from '../../components/ui/Skeleton.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Button from '../../components/ui/Button.jsx'
import { Select } from '../../components/ui/Input.jsx'
import { fetchProviders } from '../../api/providers.js'
import { AREAS, CUISINE_TAGS } from '../../mockData.js'

const defaultFilters = {
  area: '', cuisine: [], dietType: 'any', maxPrice: 250, deliveryTime: 'any', minRating: 0,
}

export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState(defaultFilters)
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

  const toggleCuisine = (tag) => {
    setFilters((f) => ({
      ...f,
      cuisine: f.cuisine.includes(tag) ? f.cuisine.filter((c) => c !== tag) : [...f.cuisine, tag],
    }))
  }

  const resetFilters = () => setFilters(defaultFilters)

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (filters.area) n++
    if (filters.cuisine.length) n += filters.cuisine.length
    if (filters.dietType !== 'any') n++
    if (filters.deliveryTime !== 'any') n++
    if (filters.minRating) n++
    if (filters.maxPrice < 250) n++
    return n
  }, [filters])

  const FiltersPanel = (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-forest-700 mb-2">Area</h4>
        <Select value={filters.area} onChange={(e) => setFilters({ ...filters, area: e.target.value })}>
          <option value="">All areas</option>
          {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
        </Select>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-forest-700 mb-2">Cuisine</h4>
        <div className="flex flex-wrap gap-2">
          {CUISINE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleCuisine(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filters.cuisine.includes(tag)
                  ? 'bg-terracotta-500 text-white border-terracotta-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-terracotta-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-forest-700 mb-2">Diet type</h4>
        <div className="flex gap-2">
          {[
            { value: 'any', label: 'Any' },
            { value: 'veg', label: 'Pure Veg' },
            { value: 'both', label: 'Veg & Non-Veg' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilters({ ...filters, dietType: opt.value })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filters.dietType === opt.value
                  ? 'bg-forest-500 text-white border-forest-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-forest-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-forest-700 mb-2">Delivery time</h4>
        <div className="flex gap-2">
          {[
            { value: 'any', label: 'Any' },
            { value: 'lunch', label: 'Lunch' },
            { value: 'dinner', label: 'Dinner' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilters({ ...filters, deliveryTime: opt.value })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filters.deliveryTime === opt.value
                  ? 'bg-mustard-400 text-forest-700 border-mustard-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-mustard-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-forest-700 mb-2">Max price per meal: ₹{filters.maxPrice}</h4>
        <input
          type="range"
          min="80"
          max="250"
          step="10"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-terracotta-500"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-forest-700 mb-2">Minimum rating</h4>
        <div className="flex gap-2">
          {[0, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setFilters({ ...filters, minRating: r })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filters.minRating === r
                  ? 'bg-forest-500 text-white border-forest-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-forest-300'
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
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white rounded-full shadow-soft px-4 py-2.5 flex-1">
          <Search size={18} className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by provider, area or pincode"
            className="w-full text-sm focus:outline-none"
          />
        </div>
        <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(true)}>
          <SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 bg-white rounded-2xl shadow-soft p-5">
            <h3 className="font-display font-semibold text-forest-700 mb-4">Filters</h3>
            {FiltersPanel}
          </div>
        </aside>

        <div>
          <p className="text-sm text-gray-500 mb-4">
            {loading ? 'Searching…' : `${providersList.length} tiffin providers found`}
          </p>
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {providersList.map((p) => <ProviderCard key={p.id} provider={p} />)}
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-forest-700/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-forest-700">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X size={20} /></button>
            </div>
            {FiltersPanel}
            <Button className="w-full mt-6" onClick={() => setShowFilters(false)}>Show results</Button>
          </div>
        </div>
      )}
    </div>
  )
}
