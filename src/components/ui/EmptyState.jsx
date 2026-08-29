export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 text-terracotta">
          <Icon size={28} />
        </div>
      )}
      <h3 className="text-headline-md text-on-surface mb-1">{title}</h3>
      {description && <p className="text-body-sm text-on-surface-variant max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
