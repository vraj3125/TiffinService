import { useEffect, useState } from 'react'
import { Plus, Trash2, MapPinned } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import LocationPicker from '../../components/ui/LocationPicker.jsx'
import { CITY, DEFAULT_RADIUS_KM, MAX_RADIUS_KM, distanceKm, findLocation } from '../../config/locations.js'
import {
  fetchKitchenProfile,
  fetchMyPlans,
  fetchMyZones,
  saveKitchenProfile,
  saveMyPlans,
  saveMyZones,
} from '../../api/provider.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function PlansSetupPage() {
  const { user } = useAuth()
  // Plans and delivery zones belong to this kitchen, and a new one has neither.
  const [plans, setPlans] = useState([])
  const [zones, setZones] = useState([])
  const [profile, setProfile] = useState(null)
  const [newPlan, setNewPlan] = useState({ type: '', duration: '', price: '', mealsPerDay: 1, description: '' })
  const { showToast } = useToast()

  useEffect(() => {
    if (!user) return
    fetchMyPlans(user.uid).then(setPlans)
    fetchMyZones(user.uid).then(setZones)
    fetchKitchenProfile(user.uid).then(setProfile)
  }, [user])

  const commitPlans = (next) => {
    setPlans(next)
    saveMyPlans(user.uid, next)
  }

  const commitZones = (next) => {
    setZones(next)
    saveMyZones(user.uid, next)
  }

  const addPlan = (e) => {
    e.preventDefault()
    if (!newPlan.type || !newPlan.price) return
    commitPlans([
      ...plans,
      {
        id: `custom-${Date.now()}`,
        ...newPlan,
        price: Number(newPlan.price),
        mealsPerDay: Number(newPlan.mealsPerDay),
      },
    ])
    setNewPlan({ type: '', duration: '', price: '', mealsPerDay: 1, description: '' })
    showToast('New plan created')
  }

  const removePlan = (id) => {
    commitPlans(plans.filter((x) => x.id !== id))
    showToast('Plan removed')
  }

  const addZone = (place) => {
    if (!place?.name || zones.includes(place.name)) return
    commitZones([...zones, place.name])
    showToast(`${place.name} added to your delivery areas`)
  }

  const setRadius = (radiusKm) => {
    const next = { ...profile, radiusKm }
    setProfile(next)
    saveKitchenProfile(user.uid, next)
  }

  // Distance from the kitchen to each area it has taken on, so a provider can
  // see when a zone sits outside the radius they set.
  const base = profile?.lat != null ? { lat: profile.lat, lng: profile.lng } : null
  const zoneDistance = (name) => {
    const place = findLocation(name)
    return base && place ? distanceKm(base, place) : null
  }

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <h1 className="text-headline-lg text-on-surface mb-1">Subscription Plans</h1>
      <p className="text-body-md text-on-surface-variant mb-8">Set pricing tiers and delivery zones customers can subscribe to.</p>

      <Card className="p-6 mb-6">
        <h3 className="text-headline-md text-on-surface mb-4">Current Plans</h3>
        {plans.length === 0 && (
          <p className="text-body-sm text-on-surface-variant mb-6">
            No plans yet. Add your first one below so customers can subscribe.
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-DEFAULT border border-outline-variant p-4 relative">
              <button onClick={() => removePlan(plan.id)} className="absolute top-3 right-3 text-on-surface-variant/50 hover:text-error">
                <Trash2 size={15} />
              </button>
              <p className="text-label-lg text-on-surface">{plan.type}</p>
              <p className="text-headline-md text-terracotta">₹{plan.price}</p>
              <p className="text-body-sm text-on-surface-variant">{plan.duration} · {plan.mealsPerDay} meal/day</p>
            </div>
          ))}
        </div>

        <form onSubmit={addPlan} className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-surface-variant">
          <Input label="Plan name" placeholder="e.g. Bi-Weekly" value={newPlan.type} onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })} />
          <Input label="Duration" placeholder="e.g. 14 days" value={newPlan.duration} onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })} />
          <Input label="Price (₹)" type="number" value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })} />
          <Select label="Meals per day" value={newPlan.mealsPerDay} onChange={(e) => setNewPlan({ ...newPlan, mealsPerDay: e.target.value })}>
            <option value={1}>1 (Lunch or Dinner)</option>
            <option value={2}>2 (Lunch + Dinner)</option>
          </Select>
          <div className="sm:col-span-2">
            <Button type="submit"><Plus size={16} /> Add Plan</Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-headline-md text-on-surface mb-1 flex items-center gap-2">
          <MapPinned size={20} className="text-terracotta" /> Delivery Areas
        </h3>
        <p className="text-body-sm text-on-surface-variant mb-5">
          Customers only see your kitchen if their address falls inside these areas or within your
          radius. We serve {CITY.name} and the towns around it.
        </p>

        {profile?.area && (
          <div className="mb-5 rounded-DEFAULT border border-outline-variant bg-surface-container-low p-4">
            <p className="text-label-md text-on-surface-variant mb-1">Your kitchen is in</p>
            <p className="text-label-lg text-on-surface">
              {profile.area}
              {profile.pincode ? ` — ${profile.pincode}` : ''}
            </p>
          </div>
        )}

        {/* How far the kitchen is willing to travel. */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label htmlFor="radius" className="text-label-lg text-on-surface">
              How far will you deliver?
            </label>
            <span className="text-label-lg text-terracotta">
              {profile?.radiusKm ?? DEFAULT_RADIUS_KM} km
            </span>
          </div>
          <input
            id="radius"
            type="range"
            min="1"
            max={MAX_RADIUS_KM}
            step="1"
            value={profile?.radiusKm ?? DEFAULT_RADIUS_KM}
            onChange={(e) => setRadius(Number(e.target.value))}
            disabled={!profile}
            className="w-full accent-terracotta"
          />
          <p className="text-body-sm text-on-surface-variant mt-2">
            Straight-line distance from your kitchen. Customers further out will not see you.
          </p>
        </div>

        {zones.length === 0 && (
          <p className="text-body-sm text-on-surface-variant mb-4">
            No delivery areas yet. Add the localities you can reach.
          </p>
        )}
        <div className="flex flex-wrap gap-2 mb-5">
          {zones.map((z) => {
            const d = zoneDistance(z)
            const outside = d != null && d > (profile?.radiusKm ?? DEFAULT_RADIUS_KM)
            return (
              <Badge key={z} tone={outside ? 'pending' : 'info'} className="pr-1">
                {z}
                {d != null ? ` · ${d} km` : ''}
                <button
                  onClick={() => commitZones(zones.filter((x) => x !== z))}
                  aria-label={`Remove ${z}`}
                  className="ml-1 text-terracotta/60 hover:text-error"
                >
                  ×
                </button>
              </Badge>
            )
          })}
        </div>

        {zones.some((z) => {
          const d = zoneDistance(z)
          return d != null && d > (profile?.radiusKm ?? DEFAULT_RADIUS_KM)
        }) && (
          <p className="text-body-sm text-secondary mb-4">
            Areas marked in amber are further away than your radius. Widen the radius above or
            remove them.
          </p>
        )}

        <LocationPicker
          id="add-zone"
          label="Add another area"
          placeholder={`Search an area in ${CITY.name}`}
          onSelect={addZone}
        />
      </Card>
    </div>
  )
}
