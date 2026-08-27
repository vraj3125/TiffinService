import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { UtensilsCrossed, Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const customerLinks = [
  { to: '/discover', label: 'Discover' },
  { to: '/orders', label: 'My Orders' },
  { to: '/profile', label: 'Profile' },
]

const providerLinks = [
  { to: '/provider/dashboard', label: 'Dashboard' },
  { to: '/provider/menu', label: 'Menu' },
  { to: '/provider/orders', label: 'Orders' },
  { to: '/provider/plans', label: 'Plans' },
  { to: '/provider/holidays', label: 'Holidays' },
  { to: '/provider/reviews', label: 'Reviews' },
  { to: '/provider/verification', label: 'Profile' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const links = user?.role === 'provider' ? providerLinks : user?.role === 'customer' ? customerLinks : []

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur border-b border-mustard-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-terracotta-500 flex items-center justify-center">
            <UtensilsCrossed size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-forest-700">Tiffinly</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? 'bg-terracotta-50 text-terracotta-600' : 'text-forest-600 hover:bg-forest-50'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm font-medium text-forest-700">
                <User size={16} /> {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-terracotta-600"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-forest-700 hover:text-terracotta-600">
                Log in
              </Link>
              <Link
                to="/login?tab=signup"
                className="bg-terracotta-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-terracotta-600 shadow-soft"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-forest-700" onClick={() => setOpen((o) => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-mustard-100 bg-cream-50 px-4 py-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-terracotta-50 text-terracotta-600' : 'text-forest-600'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <button
              onClick={() => {
                setOpen(false)
                handleLogout()
              }}
              className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-terracotta-600"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex-1 text-center border border-terracotta-500 text-terracotta-600 text-sm font-semibold px-4 py-2 rounded-full"
              >
                Log in
              </Link>
              <Link
                to="/login?tab=signup"
                onClick={() => setOpen(false)}
                className="flex-1 text-center bg-terracotta-500 text-white text-sm font-semibold px-4 py-2 rounded-full"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
