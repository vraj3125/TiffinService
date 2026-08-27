import { UtensilsCrossed } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-forest-700 text-cream-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-terracotta-500 flex items-center justify-center">
              <UtensilsCrossed size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">Tiffinly</span>
          </div>
          <p className="text-sm text-cream-100/70">Home-style tiffin, delivered daily by verified local cooks.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm">Customers</h4>
          <ul className="space-y-2 text-sm text-cream-100/70">
            <li>Find a tiffin provider</li>
            <li>How it works</li>
            <li>Subscription plans</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm">Providers</h4>
          <ul className="space-y-2 text-sm text-cream-100/70">
            <li>Sell on Tiffinly</li>
            <li>Provider dashboard</li>
            <li>Get verified</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-cream-100/70">
            <li>About us</li>
            <li>Support</li>
            <li>Terms &amp; Privacy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-cream-100/50">
        © 2026 Tiffinly. All rights reserved. (Demo UI — no real data)
      </div>
    </footer>
  )
}
