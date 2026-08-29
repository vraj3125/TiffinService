import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-on-background/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest w-full sm:max-w-lg sm:rounded-lg rounded-t-lg border border-surface-variant ambient-shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-variant sticky top-0 bg-surface-container-lowest">
          <h3 className="text-headline-md text-on-surface">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="px-6 py-5 border-t border-surface-variant flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
