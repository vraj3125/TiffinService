export function Input({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-label-md text-on-surface-variant mb-2 ml-1">{label}</span>}
      <input
        className={`w-full min-h-[56px] rounded-DEFAULT border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface placeholder:text-outline focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all ${className}`}
        {...props}
      />
    </label>
  )
}

export function Select({ label, className = '', children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-label-md text-on-surface-variant mb-2 ml-1">{label}</span>}
      <select
        className={`w-full min-h-[56px] rounded-DEFAULT border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all ${className}`}
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
      {label && <span className="block text-label-md text-on-surface-variant mb-2 ml-1">{label}</span>}
      <textarea
        className={`w-full rounded-DEFAULT border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface placeholder:text-outline focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all ${className}`}
        {...props}
      />
    </label>
  )
}
