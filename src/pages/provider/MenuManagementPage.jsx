import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ImagePlus, Leaf, Drumstick, X } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Tabs from '../../components/ui/Tabs.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { Input, Textarea, Select } from '../../components/ui/Input.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { fetchMenuForProvider } from '../../api/providers.js'
import { useToast } from '../../context/ToastContext.jsx'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function MenuManagementPage() {
  const [menu, setMenu] = useState(null)
  const [activeDay, setActiveDay] = useState(DAYS[0])
  const [editing, setEditing] = useState(null) // { meal: 'lunch'|'dinner', dish }
  const [form, setForm] = useState({ items: [], description: '', veg: true, calories: '' })
  const [itemInput, setItemInput] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    fetchMenuForProvider('p1').then(setMenu)
  }, [])

  const openEditor = (meal) => {
    const dish = menu[activeDay][meal]
    setForm({
      items: dish.items,
      description: '',
      veg: dish.veg,
      calories: dish.calories,
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
    setMenu((prev) => ({
      ...prev,
      [activeDay]: {
        ...prev[activeDay],
        [editing.meal]: {
          items: form.items,
          veg: form.veg,
          calories: Number(form.calories) || 0,
        },
      },
    }))
    showToast(`${editing.meal === 'lunch' ? 'Lunch' : 'Dinner'} menu updated for ${activeDay}`)
    setEditing(null)
  }

  if (!menu) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-700">Menu Management</h1>
          <p className="text-gray-500 text-sm">Build your weekly menu — customers see this on your profile.</p>
        </div>
      </div>

      <Card className="p-5">
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
              <div key={meal} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-forest-700 capitalize">{meal}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => openEditor(meal)} className="p-1.5 text-gray-400 hover:text-forest-600">
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setMenu((prev) => ({ ...prev, [activeDay]: { ...prev[activeDay], [meal]: null } }))
                        showToast(`${meal} removed for ${activeDay}`)
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {dish ? (
                  <>
                    <ul className="text-sm text-gray-600 mb-3 space-y-1">
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
                    className="flex flex-col items-center justify-center gap-2 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl py-6 w-full hover:border-terracotta-300 hover:text-terracotta-500"
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
          <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-28 text-gray-400 gap-2 cursor-pointer hover:border-terracotta-300 hover:text-terracotta-500">
            <ImagePlus size={20} /> Upload dish photo
          </div>
          <div>
            <span className="block text-sm font-medium text-forest-700 mb-1">Dish items</span>
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
                className="flex-1 rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent"
              />
              <Button type="button" variant="outline" onClick={addItem}>
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
                      className="ml-1 text-forest-400 hover:text-red-500"
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
