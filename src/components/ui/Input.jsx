export function Input({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-forest-700 mb-1">{label}</span>}
      <input
        className={`w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent ${className}`}
        {...props}
      />
    </label>
  )
}

export function Select({ label, className = '', children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-forest-700 mb-1">{label}</span>}
      <select
        className={`w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent bg-white ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-forest-700 mb-1">{label}</span>}
      <textarea
        className={`w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent ${className}`}
        {...props}
      />
    </label>
  )
}
