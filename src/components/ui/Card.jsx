export default function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white rounded-2xl shadow-soft ${className}`} {...props}>
      {children}
    </div>
  )
}
