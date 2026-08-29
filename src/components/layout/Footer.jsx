import { UtensilsCrossed } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full mt-section-gap bg-surface-container-lowest border-t border-surface-variant">
      <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop py-16 sm:py-24 grid grid-cols-2 md:grid-cols-4 gap-gutter">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed size={20} className="text-terracotta" />
            <span className="text-headline-md font-display font-bold text-terracotta">TiffinConnect</span>
          </div>
          <p className="text-body-sm text-on-surface-variant">Artisanal Home Kitchens, Delivered.</p>
        </div>
        <div className="flex flex-col gap-3">
          <a className="text-body-sm text-on-surface-variant hover:text-terracotta hover:translate-x-1 transition-transform duration-200 cursor-pointer">Join as Provider</a>
          <a className="text-body-sm text-on-surface-variant hover:text-terracotta hover:translate-x-1 transition-transform duration-200 cursor-pointer">Sustainability</a>
        </div>
        <div className="flex flex-col gap-3">
          <a className="text-body-sm text-on-surface-variant hover:text-terracotta hover:translate-x-1 transition-transform duration-200 cursor-pointer">Gift Cards</a>
          <a className="text-body-sm text-on-surface-variant hover:text-terracotta hover:translate-x-1 transition-transform duration-200 cursor-pointer">Support</a>
        </div>
        <div className="flex flex-col gap-3">
          <a className="text-body-sm text-on-surface-variant hover:text-terracotta hover:translate-x-1 transition-transform duration-200 cursor-pointer">Terms of Service</a>
          <a className="text-body-sm text-on-surface-variant hover:text-terracotta hover:translate-x-1 transition-transform duration-200 cursor-pointer">Privacy Policy</a>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop py-6 border-t border-surface-variant flex justify-center md:justify-between items-center flex-col md:flex-row gap-2">
        <p className="text-body-sm text-on-surface-variant">© 2026 TiffinConnect. Artisanal Home Kitchens, Delivered. (Demo UI — no real data)</p>
      </div>
    </footer>
  )
}
