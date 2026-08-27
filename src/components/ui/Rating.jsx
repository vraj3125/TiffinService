import { Star } from 'lucide-react'

export default function Rating({ value, count, size = 14, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="inline-flex items-center gap-0.5 bg-forest-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
        {value?.toFixed(1)} <Star size={size - 3} fill="currentColor" strokeWidth={0} />
      </span>
      {count != null && <span className="text-xs text-gray-500">({count})</span>}
    </span>
  )
}
