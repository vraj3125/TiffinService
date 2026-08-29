import { useState } from 'react'
import { User, MapPin, Wallet, CreditCard, Plus, Pencil, Trash2 } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { savedAddresses, paymentMethods } from '../../mockData.js'

export default function ProfilePage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [addresses, setAddresses] = useState(savedAddresses)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState('+91 98765 43210')

  const wallet = paymentMethods.find((p) => p.type === 'Wallet')

  const removeAddress = (id) => {
    setAddresses((a) => a.filter((addr) => addr.id !== id))
    showToast('Address removed')
  }

  const saveProfile = (e) => {
    e.preventDefault()
    showToast('Profile updated successfully')
  }

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <h1 className="text-headline-lg text-on-surface mb-8">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-gutter">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-headline-md text-on-surface mb-4 flex items-center gap-2"><User size={20} className="text-terracotta" /> Personal Details</h3>
            <form onSubmit={saveProfile} className="grid sm:grid-cols-2 gap-4">
              <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email" value={user?.email || 'vraj@example.com'} disabled />
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="City" defaultValue="Bengaluru" />
              <div className="sm:col-span-2">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-headline-md text-on-surface flex items-center gap-2"><MapPin size={20} className="text-terracotta" /> Saved Addresses</h3>
              <Button size="sm" variant="ghost"><Plus size={14} /> Add</Button>
            </div>
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
            <p className="font-display text-display-md mb-3">₹{wallet?.balance ?? 0}</p>
            <Button variant="mustard" size="sm" className="w-full">Add Money</Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-headline-md text-on-surface flex items-center gap-2 mb-4"><CreditCard size={20} className="text-terracotta" /> Payment Methods</h3>
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <div key={pm.id} className="flex items-center justify-between p-4 rounded-DEFAULT border border-outline-variant text-body-sm">
                  <div>
                    <p className="text-label-lg text-on-surface">{pm.type}</p>
                    <p className="text-body-sm text-on-surface-variant">{pm.label}</p>
                  </div>
                  {pm.isDefault && <Badge tone="info">Default</Badge>}
                </div>
              ))}
            </div>
            <Button size="sm" variant="ghost" className="w-full mt-3"><Plus size={14} /> Add payment method</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
