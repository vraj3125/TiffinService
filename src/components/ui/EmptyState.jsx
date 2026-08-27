export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-terracotta-50 flex items-center justify-center mb-4">
          <Icon size={28} className="text-terracotta-400" />
        </div>
      )}
      <h3 className="font-display font-semibold text-lg text-forest-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
