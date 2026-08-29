import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, MapPinned } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import LocationPicker from '../../components/ui/LocationPicker.jsx'
import { CITY, DEFAULT_RADIUS_KM, MAX_RADIUS_KM, distanceKm, findLocation } from '../../config/locations.js'
import {
  fetchBranches,
  fetchMyPlans,
  fetchMyZones,
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
  const [branches, setBranches] = useState([])
  const [newPlan, setNewPlan] = useState({ type: '', duration: '', price: '', mealsPerDay: 1, description: '' })
  const { showToast } = useToast()

  useEffect(() => {
    if (!user) return
    fetchMyPlans(user.uid).then(setPlans)
    fetchMyZones(user.uid).then(setZones)
    fetchBranches(user.uid).then(setBranches)
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

  // Radius is set per branch on the Business Profile screen. Here we only need
  // to know whether ANY branch already covers a given area, so the provider can
  // see which extra zones are actually doing work.
  const nearestBranch = (name) => {
    const place = findLocation(name)
    if (!place) return null
    let best = null
    for (const b of branches) {
      if (b.lat == null) continue
      const d = distanceKm({ lat: b.lat, lng: b.lng }, place)
      if (d == null) continue
      if (!best || d < best.distance) best = { branch: b, distance: d }
    }
    return best
  }

  const coveredByRadius = (name) => {
    const near = nearestBranch(name)
    return Boolean(near && near.distance <= (near.branch.radiusKm ?? DEFAULT_RADIUS_KM))
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

        {/* Branches and their radii are edited on Business Profile; showing them
            read-only here avoids two screens fighting over the same number. */}
        {branches.length > 0 ? (
          <div className="mb-6 rounded-DEFAULT border border-outline-variant bg-surface-container-low p-4">
            <p className="text-label-md text-on-surface-variant mb-2">
              Your kitchen{branches.length > 1 ? 's' : ''}
            </p>
            <ul className="space-y-1.5">
              {branches.map((b) => (
                <li key={b.id} className="text-body-sm text-on-surface">
                  <span className="text-label-lg">{b.label || b.area}</span>{' '}
                  <span className="text-on-surface-variant">
                    — {b.area}, delivers up to {b.radiusKm ?? DEFAULT_RADIUS_KM} km
                  </span>
                </li>
              ))}
            </ul>
            <Link to="/provider/verification" className="inline-block mt-3 text-label-lg text-terracotta hover:underline">
              Add a branch or change a radius
            </Link>
          </div>
        ) : (
          <div className="mb-6 rounded-DEFAULT border border-outline-variant bg-surface-container-low p-4">
            <p className="text-body-sm text-on-surface-variant">
              No kitchen location set yet.{' '}
              <Link to="/provider/verification" className="text-terracotta font-semibold hover:underline">
                Add one on your Business Profile
              </Link>{' '}
              so customers can find you.
            </p>
          </div>
        )}

        {zones.length === 0 && (
          <p className="text-body-sm text-on-surface-variant mb-4">
            No delivery areas yet. Add the localities you can reach.
          </p>
        )}
        <div className="flex flex-wrap gap-2 mb-5">
          {zones.map((z) => {
            const near = nearestBranch(z)
            const covered = coveredByRadius(z)
            return (
              <Badge key={z} tone={covered ? 'info' : 'pending'} className="pr-1">
                {z}
                {near ? ` · ${near.distance} km` : ''}
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

        {zones.some((z) => !coveredByRadius(z)) && (
          <p className="text-body-sm text-secondary mb-4">
            Areas in amber sit outside every branch radius. They are still served — listing an area
            here covers it explicitly — but widening a radius or adding a branch may be simpler.
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
