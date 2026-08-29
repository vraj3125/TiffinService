import { Check } from 'lucide-react'

export default function Stepper({ steps, currentIndex, stepMeta = [] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-4 bottom-8 w-0.5 bg-surface-variant" />
      <div
        className="absolute left-4 top-4 w-0.5 bg-terracotta transition-all"
        style={{ height: steps.length > 1 ? `${(currentIndex / (steps.length - 1)) * 100}%` : '0%' }}
      />
      <div className="flex flex-col gap-8">
        {steps.map((step, i) => {
          const done = i < currentIndex
          const active = i === currentIndex
          return (
            <div key={step} className="flex items-start gap-6 relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  done
                    ? 'bg-terracotta'
                    : active
                    ? 'bg-terracotta ring-4 ring-terracotta/20 shadow-lg shadow-terracotta/20'
                    : 'bg-surface-container-highest border-2 border-surface-variant'
                }`}
              >
                {(done || active) && <Check size={16} className="text-white" />}
              </div>
              <div className={`pt-1 ${!done && !active ? 'opacity-50' : ''}`}>
                <h3 className={`text-label-lg ${active ? 'text-terracotta' : 'text-on-background'}`}>{step}</h3>
                {stepMeta[i] && <p className="text-body-sm text-on-surface-variant mt-1">{stepMeta[i]}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
