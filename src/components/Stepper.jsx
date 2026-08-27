import { Check } from 'lucide-react'

export default function Stepper({ steps, currentIndex }) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const done = i < currentIndex
        const active = i === currentIndex
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 transition-colors ${
                  done
                    ? 'bg-forest-500 text-white'
                    : active
                    ? 'bg-terracotta-500 text-white ring-4 ring-terracotta-100'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {done ? <Check size={18} /> : i + 1}
              </div>
              <span className={`text-xs font-medium text-center max-w-[5.5rem] ${active ? 'text-terracotta-600' : done ? 'text-forest-600' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-1 rounded-full mb-6 ${done ? 'bg-forest-500' : 'bg-gray-100'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
