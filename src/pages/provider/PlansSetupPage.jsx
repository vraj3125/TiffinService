import { useState } from 'react'
import { Plus, Trash2, MapPinned } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import { makePlansFor, AREAS } from '../../mockData.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function PlansSetupPage() {
  const [plans, setPlans] = useState(makePlansFor('p1'))
  const [zones, setZones] = useState(['Koramangala', 'BTM Layout', '560034'])
  const [zoneInput, setZoneInput] = useState('')
  const [newPlan, setNewPlan] = useState({ type: '', duration: '', price: '', mealsPerDay: 1, description: '' })
  const { showToast } = useToast()

  const addPlan = (e) => {
    e.preventDefault()
    if (!newPlan.type || !newPlan.price) return
    setPlans((p) => [...p, { id: `custom-${Date.now()}`, ...newPlan, price: Number(newPlan.price), mealsPerDay: Number(newPlan.mealsPerDay) }])
    setNewPlan({ type: '', duration: '', price: '', mealsPerDay: 1, description: '' })
    showToast('New plan created')
  }

  const removePlan = (id) => {
    setPlans((p) => p.filter((x) => x.id !== id))
    showToast('Plan removed')
  }

  const addZone = () => {
    if (!zoneInput.trim()) return
    setZones((z) => [...z, zoneInput.trim()])
    setZoneInput('')
  }

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <h1 className="text-headline-lg text-on-surface mb-1">Subscription Plans</h1>
      <p className="text-body-md text-on-surface-variant mb-8">Set pricing tiers and delivery zones customers can subscribe to.</p>

      <Card className="p-6 mb-6">
        <h3 className="text-headline-md text-on-surface mb-4">Current Plans</h3>
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
        <h3 className="text-headline-md text-on-surface mb-4 flex items-center gap-2"><MapPinned size={20} className="text-terracotta" /> Delivery Zones / Pincodes</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {zones.map((z) => (
            <Badge key={z} tone="info" className="pr-1">
              {z}
              <button onClick={() => setZones((zs) => zs.filter((x) => x !== z))} className="ml-1 text-terracotta/60 hover:text-error">×</button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            list="area-options"
            value={zoneInput}
            onChange={(e) => setZoneInput(e.target.value)}
            placeholder="Add area or pincode"
            className="flex-1 min-h-[56px] rounded-DEFAULT border border-outline-variant px-4 py-3 text-body-md focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta"
          />
          <datalist id="area-options">
            {AREAS.map((a) => <option key={a} value={a} />)}
          </datalist>
          <Button variant="secondary" onClick={addZone}>Add</Button>
        </div>
      </Card>
    </div>
  )
}
