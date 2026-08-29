// Mock data-fetching layer. Every function returns a Promise so callers
// don't need to change when these are swapped for real HTTP requests.
import { providers, menus, makePlansFor, subscriptionPlans } from '../mockData.js'
import { DEFAULT_RADIUS_KM, distanceKm, findLocation } from '../config/locations.js'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export async function fetchProviders(filters = {}) {
  await delay()
  let list = [...providers]
  // Location filter: a kitchen matches if the customer is in the same area, or
  // if their address falls inside the radius that kitchen set for itself.
  if (filters.area) {
    const here = findLocation(filters.area)
    list = list.filter((p) => {
      if (p.area === filters.area) return true
      if (!here || p.lat == null) return false
      const d = distanceKm({ lat: p.lat, lng: p.lng }, here)
      return d != null && d <= (p.radiusKm ?? DEFAULT_RADIUS_KM)
    })
    // Show the nearest kitchens first once a location is chosen.
    if (here) {
      list = list
        .map((p) => ({ ...p, distance: distanceKm({ lat: p.lat, lng: p.lng }, here) ?? p.distance }))
        .sort((a, b) => a.distance - b.distance)
    }
  }
  if (filters.cuisine?.length) list = list.filter((p) => p.cuisineTags.some((c) => filters.cuisine.includes(c)))
  if (filters.dietType && filters.dietType !== 'any') {
    list = list.filter((p) => p.dietType === filters.dietType || p.dietType === 'both')
  }
  if (filters.maxPrice) list = list.filter((p) => p.priceRange[0] <= filters.maxPrice)
  if (filters.deliveryTime && filters.deliveryTime !== 'any') {
    list = list.filter((p) => p.deliveryTime.includes(filters.deliveryTime))
  }
  if (filters.minRating) list = list.filter((p) => p.rating >= filters.minRating)
  if (filters.query) {
    const q = filters.query.toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q) || p.pincode.includes(q))
  }
  return list
}

export async function fetchProviderById(id) {
  await delay()
  return providers.find((p) => p.id === id) || null
}

export async function fetchMenuForProvider(id) {
  await delay()
  return menus[id] || null
}

export async function fetchPlansForProvider(id) {
  await delay()
  return subscriptionPlans[id] || makePlansFor(id)
}

export async function fetchFeaturedProviders() {
  await delay(200)
  return [...providers].sort((a, b) => b.rating - a.rating).slice(0, 6)
}
