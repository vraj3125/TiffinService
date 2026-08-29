export default function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex gap-8 overflow-x-auto no-scrollbar border-b border-surface-variant ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`pb-4 text-headline-md whitespace-nowrap border-b-2 transition-colors ${
            active === tab.value
              ? 'border-terracotta text-terracotta'
              : 'border-transparent text-on-surface-variant hover:text-terracotta'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
