import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { UtensilsCrossed, Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { securePath } from '../../lib/secureParams.js'

const customerLinks = [
  { to: '/discover', label: 'Explore' },
  { to: '/orders', label: 'Subscriptions' },
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

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] sm:w-[calc(100%-64px)] lg:w-[calc(100%-128px)] max-w-container-max rounded-full bg-white/80 backdrop-blur-xl border border-surface-variant/50 shadow-xl shadow-terracotta/5 z-50">
        <div className="flex justify-between items-center px-5 sm:px-8 lg:px-12 py-3.5 w-full">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <UtensilsCrossed size={22} className="text-terracotta" />
            <span className="text-headline-md font-display font-bold text-terracotta tracking-tight">TiffinConnect</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-label-lg transition-colors ${
                    isActive ? 'text-terracotta font-bold border-b-2 border-terracotta pb-1' : 'text-on-surface-variant hover:text-terracotta'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-label-lg text-on-surface">
                  <User size={16} /> {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-label-lg text-on-surface-variant hover:text-terracotta transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-label-lg text-terracotta hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Link
                  to={securePath('/login', { tab: 'signup', role: 'provider' })}
                  className="bg-terracotta text-on-primary text-label-lg px-6 py-3 rounded-full hover:bg-primary transition-colors shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200"
                >
                  Join as Provider
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-terracotta" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed top-[88px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-container-max md:hidden bg-white/95 backdrop-blur-xl border border-surface-variant/50 shadow-xl shadow-terracotta/5 rounded-lg z-40 px-5 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-DEFAULT text-label-lg ${isActive ? 'bg-surface-container-low text-terracotta' : 'text-on-surface-variant'}`
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
              className="block w-full text-left px-3 py-2.5 rounded-DEFAULT text-label-lg text-terracotta"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex-1 text-center border border-terracotta text-terracotta text-label-lg px-4 py-2.5 rounded-full"
              >
                Sign In
              </Link>
              <Link
                to={securePath('/login', { tab: 'signup' })}
                onClick={() => setOpen(false)}
                className="flex-1 text-center bg-terracotta text-white text-label-lg px-4 py-2.5 rounded-full"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}
