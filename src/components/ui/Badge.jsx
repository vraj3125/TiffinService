const tones = {
  veg: 'bg-forest-50 text-forest-500 border border-forest-300',
  nonveg: 'bg-terracotta-50 text-terracotta-600 border border-terracotta-300',
  verified: 'bg-mustard-50 text-mustard-600 border border-mustard-300',
  pending: 'bg-yellow-50 text-yellow-700 border border-yellow-300',
  info: 'bg-forest-50 text-forest-600 border border-forest-200',
  neutral: 'bg-gray-100 text-gray-600 border border-gray-200',
  danger: 'bg-red-50 text-red-600 border border-red-200',
  success: 'bg-green-50 text-green-700 border border-green-200',
}

export default function Badge({ tone = 'neutral', className = '', children, icon: Icon }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${tones[tone]} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  )
}
