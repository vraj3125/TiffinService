import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BarChart3, Bell, ChevronDown, CreditCard, LayoutDashboard, MapPin, Menu,
  Package, Settings, Star, Store, User, Users, UtensilsCrossed, X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchNeedsAttention } from '../../api/adminStats.js'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  {
    label: 'Kitchens',
    icon: Store,
    children: [
      { to: '/admin/kitchens', label: 'All Kitchens', end: true },
      { to: '/admin/kitchens/pending', label: 'Pending Verification' },
      { to: '/admin/kitchens/approved', label: 'Approved Kitchens' },
      { to: '/admin/kitchens/changes', label: 'Changes Requested' },
    ],
  },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/orders', label: 'Orders', icon: Package },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: UtensilsCrossed },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/locations', label: 'Locations', icon: MapPin },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-DEFAULT text-label-lg transition-colors ${
    isActive
      ? 'bg-surface-container text-terracotta'
      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
  }`

export default function AdminLayout() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  // Verification is the main job here, so the Kitchens group starts expanded
  // rather than hiding the queues behind a click.
  const [kitchensOpen, setKitchensOpen] = useState(true)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    fetchNeedsAttention().then(setAlerts)
  }, [pathname])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const alertCount = alerts.reduce((t, a) => t + a.count, 0)
  const nowLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const sidebar = (
    <nav className="flex flex-col gap-1 p-4">
      {NAV.map((item) =>
        item.children ? (
          <div key={item.label}>
            <button
              onClick={() => setKitchensOpen((o) => !o)}
              aria-expanded={kitchensOpen}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-DEFAULT text-label-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            >
              <item.icon size={18} className="shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronDown size={16} className={`transition-transform ${kitchensOpen ? 'rotate-180' : ''}`} />
            </button>
            {kitchensOpen && (
              <div className="ml-4 mt-1 pl-4 border-l border-outline-variant/60 flex flex-col gap-0.5">
                {item.children.map((c) => (
                  <NavLink key={c.to} to={c.to} end={c.end} className={linkClass}>
                    <span className="text-body-sm">{c.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ) : (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            <item.icon size={18} className="shrink-0" />
            {item.label}
          </NavLink>
        )
      )}
    </nav>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop rail */}
        <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-surface-variant bg-surface-container-lowest min-h-screen sticky top-0">
          <Link to="/" className="flex items-center gap-2 px-6 h-16 border-b border-surface-variant shrink-0">
            <UtensilsCrossed size={20} className="text-terracotta" />
            <span className="text-headline-md font-display font-bold text-terracotta">TiffinConnect</span>
          </Link>
          <div className="overflow-y-auto flex-1">{sidebar}</div>
          <p className="px-6 py-4 text-body-sm text-outline border-t border-surface-variant">
            Admin console
          </p>
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-on-background/50" onClick={() => setOpen(false)} />
            <aside className="relative w-72 max-w-[80%] bg-surface-container-lowest h-full overflow-y-auto">
              <div className="flex items-center justify-between px-5 h-16 border-b border-surface-variant">
                <span className="text-headline-md font-display font-bold text-terracotta">TiffinConnect</span>
                <button onClick={() => setOpen(false)} className="p-1 text-on-surface-variant">
                  <X size={20} />
                </button>
              </div>
              {sidebar}
            </aside>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-4 sm:px-6 border-b border-surface-variant bg-surface-container-lowest/95 backdrop-blur">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2 text-on-surface-variant">
              <Menu size={20} />
            </button>
            <p className="hidden sm:block text-body-sm text-on-surface-variant flex-1">{nowLabel}</p>
            <div className="flex-1 sm:hidden" />

            <Link
              to="/admin"
              className="relative p-2 rounded-full text-on-surface-variant hover:text-terracotta hover:bg-surface-container-low transition-colors"
              aria-label={`${alertCount} items need attention`}
            >
              <Bell size={18} />
              {alertCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-error text-on-error text-[10px] font-semibold flex items-center justify-center">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </Link>

            <div className="flex items-center gap-2.5 pl-3 border-l border-surface-variant">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-terracotta shrink-0">
                <User size={16} />
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-label-lg text-on-surface">{user?.name || 'Admin'}</p>
                <p className="text-body-sm text-on-surface-variant">Administrator</p>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
