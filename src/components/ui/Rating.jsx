import { Star } from 'lucide-react'

export default function Rating({ value, count, size = 14, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="inline-flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm text-label-md text-on-surface">
        <Star size={size} className="text-mustard" fill="currentColor" strokeWidth={0} /> {value?.toFixed(1)}
      </span>
      {count != null && <span className="text-body-sm text-on-surface-variant">({count})</span>}
    </span>
  )
}
