import { useEffect, useState } from 'react'
import { User, MapPin, Wallet, CreditCard, Plus, Pencil, Trash2 } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import {
  PAYMENT_OPTIONS,
  addAddress,
  fetchAddresses,
  fetchProfile,
  fetchWallet,
  removeAddress as removeAddressApi,
  saveProfile,
} from '../../api/account.js'

const blankAddress = { label: 'Home', line: '', area: '', pincode: '' }

const addressFieldClass =
  'w-full min-h-[48px] rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2.5 text-body-sm text-on-surface placeholder:text-outline focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none'

export default function ProfilePage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [addresses, setAddresses] = useState([])
  const [draft, setDraft] = useState(null)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [wallet, setWallet] = useState({ balance: 0 })

  // Nothing here is shared between accounts -- a new profile starts blank.
  useEffect(() => {
    if (!user) return
    setName(user.name || '')
    fetchAddresses(user.uid).then(setAddresses)
    fetchWallet(user.uid).then(setWallet)
    fetchProfile(user.uid).then((p) => {
      setPhone(p.phone || user.phone || '')
      setCity(p.city || '')
    })
  }, [user])

  const removeAddress = async (id) => {
    setAddresses(await removeAddressApi(user.uid, id))
    showToast('Address removed')
  }

  const saveDraft = async (e) => {
    e.preventDefault()
    if (!draft.line.trim() || !draft.area.trim() || !/^\d{6}$/.test(draft.pincode)) {
      showToast('Add a street, an area and a 6-digit pincode', 'info')
      return
    }
    setAddresses(await addAddress(user.uid, draft))
    setDraft(null)
    showToast('Address saved')
  }

  const submitProfile = async (e) => {
    e.preventDefault()
    await saveProfile(user.uid, { phone, city })
    showToast('Profile updated successfully')
  }

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <h1 className="text-headline-lg text-on-surface mb-8">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-gutter">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-headline-md text-on-surface mb-4 flex items-center gap-2"><User size={20} className="text-terracotta" /> Personal Details</h3>
            <form onSubmit={submitProfile} className="grid sm:grid-cols-2 gap-4">
              <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email" value={user?.email || ''} disabled />
              <Input
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
              <Input
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Vadodara"
              />
              <div className="sm:col-span-2">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-headline-md text-on-surface flex items-center gap-2"><MapPin size={20} className="text-terracotta" /> Saved Addresses</h3>
              <Button size="sm" variant="ghost" onClick={() => setDraft(draft ? null : blankAddress)}>
                <Plus size={14} /> Add
              </Button>
            </div>

            {draft && (
              <form onSubmit={saveDraft} className="mb-4 rounded-DEFAULT border border-outline-variant bg-surface-container-low p-4 space-y-3">
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setDraft({ ...draft, label })}
                      className={`px-3 py-1.5 rounded-full text-label-md border-2 transition-colors ${
                        draft.label === label
                          ? 'border-terracotta text-terracotta bg-surface-container-lowest'
                          : 'border-outline-variant text-on-surface-variant'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input
                  value={draft.line}
                  onChange={(e) => setDraft({ ...draft, line: e.target.value })}
                  placeholder="Flat / house no., building, street"
                  className={addressFieldClass}
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    value={draft.area}
                    onChange={(e) => setDraft({ ...draft, area: e.target.value })}
                    placeholder="Area / locality"
                    className={addressFieldClass}
                  />
                  <input
                    value={draft.pincode}
                    onChange={(e) => setDraft({ ...draft, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    inputMode="numeric"
                    placeholder="Pincode"
                    className={addressFieldClass}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Save</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
                </div>
              </form>
            )}

            {addresses.length === 0 && !draft ? (
              <EmptyState
                icon={MapPin}
                title="No saved addresses"
                description="Add one so checkout knows where to deliver."
                action={<Button size="sm" onClick={() => setDraft(blankAddress)}>Add address</Button>}
              />
            ) : null}

            <div className="space-y-2">
              {addresses.map((addr) => (
                <div key={addr.id} className="flex items-start justify-between gap-3 p-4 rounded-DEFAULT border border-outline-variant">
                  <div>
                    <p className="text-label-lg text-on-surface flex items-center gap-2">
                      {addr.label} {addr.isDefault && <Badge tone="info">Default</Badge>}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">{addr.line}, {addr.area} – {addr.pincode}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-on-surface-variant hover:text-terracotta"><Pencil size={14} /></button>
                    <button onClick={() => removeAddress(addr.id)} className="p-1.5 text-on-surface-variant hover:text-error"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-terracotta text-white border-none">
            <h3 className="text-label-lg flex items-center gap-2 mb-2"><Wallet size={18} /> Wallet Balance</h3>
            <p className="font-display text-display-md mb-3">₹{wallet.balance}</p>
            <Button variant="mustard" size="sm" className="w-full">Add Money</Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-headline-md text-on-surface flex items-center gap-2 mb-4"><CreditCard size={20} className="text-terracotta" /> Payment Methods</h3>
            <p className="text-body-sm text-on-surface-variant mb-3">
              Nothing saved yet. You can pay by any of these at checkout.
            </p>
            <div className="space-y-2">
              {PAYMENT_OPTIONS.map((pm) => (
                <div key={pm.id} className="flex items-center justify-between p-4 rounded-DEFAULT border border-outline-variant text-body-sm">
                  <div>
                    <p className="text-label-lg text-on-surface">{pm.label}</p>
                    <p className="text-body-sm text-on-surface-variant">{pm.hint}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
