import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function AppLayout() {
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
