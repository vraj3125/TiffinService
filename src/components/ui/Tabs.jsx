export default function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 overflow-x-auto no-scrollbar border-b border-gray-200 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
            active === tab.value
              ? 'border-terracotta-500 text-terracotta-600'
              : 'border-transparent text-gray-500 hover:text-forest-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
