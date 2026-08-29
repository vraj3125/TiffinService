// Mock data-fetching layer. Every function returns a Promise so callers
// don't need to change when these are swapped for real HTTP requests.
import { providers, menus, makePlansFor, subscriptionPlans } from '../mockData.js'
import { DEFAULT_RADIUS_KM, distanceKm, findLocation } from '../config/locations.js'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

// A kitchen may cook from several places. Catalogue entries carry a single
// location; accounts created in the app carry a `branches` array. Treat both
// the same way so one code path covers them.
const branchesOf = (p) =>
  p.branches?.length
    ? p.branches
    : [{ area: p.area, pincode: p.pincode, lat: p.lat, lng: p.lng, radiusKm: p.radiusKm }]

export async function fetchProviders(filters = {}) {
  await delay()
  let list = [...providers]
  // Location filter. A kitchen matches if the customer is in the same area as
  // any of its branches, or falls inside any branch's delivery radius -- a
  // provider with a second kitchen across town covers both neighbourhoods.
  if (filters.area) {
    const here = findLocation(filters.area)

    const nearest = (p) => {
      if (!here) return null
      let best = null
      for (const b of branchesOf(p)) {
        if (b.lat == null) continue
        const d = distanceKm({ lat: b.lat, lng: b.lng }, here)
        if (d == null) continue
        if (!best || d < best.d) best = { d, radiusKm: b.radiusKm ?? DEFAULT_RADIUS_KM }
      }
      return best
    }

    list = list.filter((p) => {
      if (branchesOf(p).some((b) => b.area === filters.area)) return true
      const near = nearest(p)
      return Boolean(near && near.d <= near.radiusKm)
    })

    // Nearest branch first once a location is chosen.
    if (here) {
      list = list
        .map((p) => ({ ...p, distance: nearest(p)?.d ?? p.distance }))
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
