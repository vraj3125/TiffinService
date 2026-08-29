import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ImagePlus, Leaf, Drumstick, X } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Tabs from '../../components/ui/Tabs.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { Input, Textarea, Select } from '../../components/ui/Input.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { fetchMyMenu, saveMyMenu } from '../../api/provider.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function MenuManagementPage() {
  const { user } = useAuth()
  const [menu, setMenu] = useState(null)
  const [activeDay, setActiveDay] = useState(DAYS[0])
  const [editing, setEditing] = useState(null) // { meal: 'lunch'|'dinner', dish }
  const [form, setForm] = useState({ items: [], description: '', veg: true, calories: '' })
  const [itemInput, setItemInput] = useState('')
  const { showToast } = useToast()

  // This kitchen's own menu. A new provider gets a blank week to fill in.
  useEffect(() => {
    if (!user) return
    fetchMyMenu(user.uid).then(setMenu)
  }, [user])

  const openEditor = (meal) => {
    // A day that has not been filled in yet has no dish, so start from blanks.
    const dish = menu[activeDay]?.[meal]
    setForm({
      items: dish?.items ?? [],
      description: '',
      veg: dish?.veg ?? true,
      calories: dish?.calories ?? '',
    })
    setItemInput('')
    setEditing({ meal })
  }

  const addItem = () => {
    const value = itemInput.trim()
    if (!value || form.items.includes(value)) return
    setForm((f) => ({ ...f, items: [...f.items, value] }))
    setItemInput('')
  }

  const removeItem = (item) => {
    setForm((f) => ({ ...f, items: f.items.filter((i) => i !== item) }))
  }

  const saveDish = () => {
    if (form.items.length === 0) {
      showToast('Add at least one item to this meal', 'info')
      return
    }
    const next = {
      ...menu,
      [activeDay]: {
        ...menu[activeDay],
        [editing.meal]: {
          items: form.items,
          veg: form.veg,
          calories: Number(form.calories) || 0,
        },
      },
    }
    setMenu(next)
    saveMyMenu(user.uid, next)
    showToast(`${editing.meal === 'lunch' ? 'Lunch' : 'Dinner'} menu updated for ${activeDay}`)
    setEditing(null)
  }

  if (!menu) {
    return (
      <div className="max-w-container-max mx-auto px-6 py-10">
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-headline-lg text-on-surface">Menu Management</h1>
          <p className="text-body-md text-on-surface-variant">Build your weekly menu — customers see this on your profile.</p>
        </div>
      </div>

      <Card className="p-6">
        <Tabs
          tabs={DAYS.map((d) => ({ value: d, label: d.slice(0, 3) }))}
          active={activeDay}
          onChange={setActiveDay}
          className="mb-6"
        />

        <div className="grid sm:grid-cols-2 gap-5">
          {['lunch', 'dinner'].map((meal) => {
            const dish = menu[activeDay]?.[meal]
            return (
              <div key={meal} className="rounded-DEFAULT border border-outline-variant p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-label-lg text-on-surface capitalize">{meal}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => openEditor(meal)} className="p-1.5 text-on-surface-variant hover:text-terracotta">
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => {
                        const next = { ...menu, [activeDay]: { ...menu[activeDay], [meal]: null } }
                        setMenu(next)
                        saveMyMenu(user.uid, next)
                        showToast(`${meal} removed for ${activeDay}`)
                      }}
                      className="p-1.5 text-on-surface-variant hover:text-error"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {dish ? (
                  <>
                    <ul className="text-body-sm text-on-surface-variant mb-3 space-y-1">
                      {dish.items.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                    <div className="flex gap-2">
                      <Badge tone={dish.veg ? 'veg' : 'nonveg'} icon={dish.veg ? Leaf : Drumstick}>
                        {dish.veg ? 'Veg' : 'Non-Veg'}
                      </Badge>
                      <Badge tone="neutral">{dish.calories} kcal</Badge>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setForm({ items: [], description: '', veg: true, calories: '' })
                      setItemInput('')
                      setEditing({ meal })
                    }}
                    className="flex flex-col items-center justify-center gap-2 text-on-surface-variant border-2 border-dashed border-outline-variant rounded-DEFAULT py-6 w-full hover:border-terracotta/50 hover:text-terracotta"
                  >
                    <Plus size={20} /> Add {meal} menu
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={`Edit ${editing?.meal ?? ''} — ${activeDay}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveDish}>Save Menu</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center border-2 border-dashed border-outline-variant rounded-DEFAULT h-28 text-on-surface-variant gap-2 cursor-pointer hover:border-terracotta/50 hover:text-terracotta">
            <ImagePlus size={20} /> Upload dish photo
          </div>
          <div>
            <span className="block text-label-md text-on-surface-variant mb-2 ml-1">Dish items</span>
            <div className="flex gap-2">
              <input
                value={itemInput}
                onChange={(e) => setItemInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addItem()
                  }
                }}
                placeholder="e.g. Rajma"
                className="flex-1 min-h-[56px] rounded-DEFAULT border border-outline-variant px-4 py-3 text-body-md focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta"
              />
              <Button type="button" variant="secondary" onClick={addItem}>
                <Plus size={16} /> Add
              </Button>
            </div>
            {form.items.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.items.map((item) => (
                  <Badge key={item} tone="info" className="pr-1">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem(item)}
                      className="ml-1 text-terracotta/60 hover:text-error"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Textarea
            label="Description"
            placeholder="Short note about this meal (optional)"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" value={form.veg ? 'veg' : 'nonveg'} onChange={(e) => setForm({ ...form, veg: e.target.value === 'veg' })}>
              <option value="veg">Veg</option>
              <option value="nonveg">Non-Veg</option>
            </Select>
            <Input
              label="Calories (approx.)"
              type="number"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
