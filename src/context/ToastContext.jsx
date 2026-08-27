import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id))
    }, 3200)
  }, [])

  const dismiss = (id) => setToasts((t) => t.filter((toast) => toast.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-2 bg-forest-700 text-cream-50 shadow-card rounded-xl px-4 py-3 animate-[fadeIn_0.2s_ease-out]"
          >
            {t.type === 'success' ? (
              <CheckCircle2 size={18} className="text-mustard-300 mt-0.5 shrink-0" />
            ) : (
              <Info size={18} className="text-terracotta-300 mt-0.5 shrink-0" />
            )}
            <p className="text-sm flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-cream-100/70 hover:text-cream-50">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
