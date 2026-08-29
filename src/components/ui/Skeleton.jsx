export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-surface-variant rounded-lg ${className}`} />
}

export function ProviderCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-surface-variant overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}
