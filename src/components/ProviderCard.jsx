import { Link } from 'react-router-dom'
import { MapPin, ShieldCheck, Clock } from 'lucide-react'
import Badge from './ui/Badge.jsx'
import Rating from './ui/Rating.jsx'
import Card from './ui/Card.jsx'

export default function ProviderCard({ provider }) {
  return (
    <Link to={`/providers/${provider.id}`}>
      <Card className="overflow-hidden hover:-translate-y-0.5 hover:shadow-card transition-all h-full flex flex-col">
        <div className="relative h-40 w-full overflow-hidden">
          <img src={provider.photos[0]} alt={provider.name} className="w-full h-full object-cover" loading="lazy" />
          {provider.verified && (
            <Badge tone="verified" icon={ShieldCheck} className="absolute top-2 left-2 bg-white/95">
              FSSAI Verified
            </Badge>
          )}
          <Badge tone={provider.dietType === 'veg' ? 'veg' : 'nonveg'} className="absolute top-2 right-2 bg-white/95">
            {provider.dietType === 'veg' ? 'Pure Veg' : 'Veg & Non-Veg'}
          </Badge>
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-forest-700 leading-tight">{provider.name}</h3>
            <Rating value={provider.rating} />
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">{provider.tagline}</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {provider.cuisineTags.slice(0, 3).map((tag) => (
              <Badge key={tag} tone="info">{tag}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1"><MapPin size={13} /> {provider.area} · {provider.distance} km</span>
            <span className="flex items-center gap-1"><Clock size={13} /> {provider.deliveryTime.join(' & ')}</span>
          </div>
          <p className="font-semibold text-forest-700 text-sm">₹{provider.priceRange[0]}–₹{provider.priceRange[1]} <span className="font-normal text-gray-400">/ meal</span></p>
        </div>
      </Card>
    </Link>
  )
}
