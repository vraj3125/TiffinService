export default function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-surface-container-lowest rounded-lg border border-surface-variant ambient-shadow ${className}`} {...props}>
      {children}
    </div>
  )
}
