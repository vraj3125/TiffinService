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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-forest-700 mb-6">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold text-forest-700 mb-4 flex items-center gap-2"><User size={18} /> Personal Details</h3>
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

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-forest-700 flex items-center gap-2"><MapPin size={18} /> Saved Addresses</h3>
              <Button size="sm" variant="ghost"><Plus size={14} /> Add</Button>
            </div>
            <div className="space-y-2">
              {addresses.map((addr) => (
                <div key={addr.id} className="flex items-start justify-between gap-3 p-3 rounded-xl border border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-forest-700 flex items-center gap-2">
                      {addr.label} {addr.isDefault && <Badge tone="info">Default</Badge>}
                    </p>
                    <p className="text-xs text-gray-500">{addr.line}, {addr.area} – {addr.pincode}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-forest-600"><Pencil size={14} /></button>
                    <button onClick={() => removeAddress(addr.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 bg-forest-700 text-white">
            <h3 className="font-semibold flex items-center gap-2 mb-2"><Wallet size={18} /> Wallet Balance</h3>
            <p className="font-display text-3xl font-bold mb-3">₹{wallet?.balance ?? 0}</p>
            <Button variant="mustard" size="sm" className="w-full">Add Money</Button>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-forest-700 flex items-center gap-2 mb-4"><CreditCard size={18} /> Payment Methods</h3>
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <div key={pm.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 text-sm">
                  <div>
                    <p className="font-medium text-forest-700">{pm.type}</p>
                    <p className="text-xs text-gray-500">{pm.label}</p>
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
