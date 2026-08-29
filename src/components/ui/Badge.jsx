const tones = {
  veg: 'bg-leaf-success/10 text-leaf-success',
  nonveg: 'bg-terracotta/10 text-terracotta',
  verified: 'bg-surface-container-low text-terracotta border border-outline-variant/40',
  pending: 'bg-secondary-container/20 text-secondary',
  info: 'bg-surface-container text-terracotta',
  neutral: 'bg-surface-container-high text-on-surface-variant',
  danger: 'bg-error-container text-on-error-container',
  success: 'bg-leaf-success/10 text-leaf-success',
}

export default function Badge({ tone = 'neutral', className = '', children, icon: Icon }) {
  return (
    <span className={`inline-flex items-center gap-1 text-label-md px-2.5 py-1 rounded-full ${tones[tone]} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  )
}
