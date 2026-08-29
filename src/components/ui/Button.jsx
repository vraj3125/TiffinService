const variants = {
  primary: 'bg-terracotta text-on-primary hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-terracotta/20 shadow-sm',
  secondary: 'bg-surface-container-lowest text-terracotta border border-terracotta hover:bg-surface-container-low',
  outline: 'border-2 border-mustard text-secondary hover:bg-mustard/10',
  ghost: 'text-on-surface-variant hover:text-terracotta hover:bg-surface-container-low',
  mustard: 'bg-mustard text-on-background hover:bg-mustard/90 shadow-sm',
  danger: 'bg-error text-on-error hover:bg-error/90',
}

const sizes = {
  sm: 'px-4 py-2 text-label-md',
  md: 'px-6 py-2.5 text-label-lg',
  lg: 'px-8 py-4 text-label-lg',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
