import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UtensilsCrossed, User, Store } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import { Input } from '../components/ui/Input.jsx'
import Card from '../components/ui/Card.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function LoginPage() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('tab') === 'signup' ? 'signup' : 'login')
  const [role, setRole] = useState(params.get('role') === 'provider' ? 'provider' : 'customer')
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    login({ role, name: form.name, email: form.email })
    showToast(`Welcome${form.name ? `, ${form.name}` : ''}! You're logged in as a ${role}.`)
    navigate(role === 'provider' ? '/provider/dashboard' : '/discover')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-mustard-50 to-cream-50">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-terracotta-500 flex items-center justify-center mb-3">
            <UtensilsCrossed size={22} className="text-white" />
          </div>
          <h1 className="font-display text-xl font-bold text-forest-700">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">This is a demo — no real account is created.</p>
        </div>

        <div className="flex bg-cream-100 rounded-full p-1 mb-5">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-white shadow-soft text-terracotta-600' : 'text-gray-500'}`}
          >
            Log in
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'signup' ? 'bg-white shadow-soft text-terracotta-600' : 'text-gray-500'}`}
          >
            Sign up
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => setRole('customer')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
              role === 'customer' ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-600' : 'border-gray-200 text-gray-500'
            }`}
          >
            <User size={16} /> Customer
          </button>
          <button
            onClick={() => setRole('provider')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
              role === 'provider' ? 'border-forest-500 bg-forest-50 text-forest-600' : 'border-gray-200 text-gray-500'
            }`}
          >
            <Store size={16} /> Provider
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Input
              label={role === 'provider' ? 'Business / Owner name' : 'Full name'}
              placeholder={role === 'provider' ? 'e.g. Maa Ka Swaad Tiffins' : 'e.g. Vraj Prajapati'}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          {mode === 'signup' && (
            <Input
              label="Phone number"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          )}
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" size="lg">
            {mode === 'login' ? 'Log in' : `Create ${role} account`}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          By continuing, you agree to Tiffinly's Terms & Privacy Policy.
        </p>
      </Card>
    </div>
  )
}
