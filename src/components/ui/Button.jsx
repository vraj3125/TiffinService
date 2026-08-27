const variants = {
  primary: 'bg-terracotta-500 text-white hover:bg-terracotta-600 shadow-soft',
  secondary: 'bg-forest-500 text-white hover:bg-forest-600 shadow-soft',
  outline: 'border-2 border-terracotta-500 text-terracotta-500 hover:bg-terracotta-50',
  ghost: 'text-forest-600 hover:bg-forest-50',
  mustard: 'bg-mustard-400 text-forest-700 hover:bg-mustard-500 shadow-soft',
  danger: 'bg-red-500 text-white hover:bg-red-600',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
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
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
