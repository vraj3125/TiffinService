import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function AppLayout() {
  const { pathname } = useLocation()

  // Footer links live at the bottom of long pages, and React Router keeps the
  // scroll position across navigations -- without this you land halfway down the
  // Terms page. Hash jumps inside a page handle their own scrolling.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />
      <main className="flex-1 pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
