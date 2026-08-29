import { Link } from 'react-router-dom'
import { Bike, ShieldCheck, Star } from 'lucide-react'
import Card from './ui/Card.jsx'

export default function ProviderCard({ provider }) {
  return (
    <Link to={`/providers/${provider.id}`}>
      <Card className="overflow-hidden hover-lift group flex flex-col h-full">
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={provider.photos[0]}
            alt={provider.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star size={14} className="text-mustard" fill="currentColor" strokeWidth={0} />
            <span className="text-label-md text-on-surface">{provider.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-headline-md text-on-surface leading-tight">{provider.name}</h3>
            {provider.verified && <ShieldCheck size={18} className="text-leaf-success shrink-0" />}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-on-surface-variant mb-4">
            {provider.cuisineTags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-label-md bg-surface-container px-2 py-1 rounded-md text-terracotta">{tag}</span>
            ))}
            <span className={`text-label-md px-2 py-1 rounded-md ${provider.dietType === 'veg' ? 'bg-leaf-success/10 text-leaf-success' : 'bg-terracotta/10 text-terracotta'}`}>
              {provider.dietType === 'veg' ? 'Veg Only' : 'Veg & Non-Veg'}
            </span>
          </div>
          <div className="mt-auto pt-4 border-t border-surface-variant flex justify-between items-end">
            <div>
              <p className="text-label-md text-on-surface-variant mb-1">Starting from</p>
              <p className="text-headline-md text-on-surface">
                ₹{provider.priceRange[0]}<span className="text-body-sm text-on-surface-variant">/day</span>
              </p>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
              <Bike size={14} />
              <span className="text-label-md">{provider.distance} km</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
