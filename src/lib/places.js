// Location suggestions, restricted to Vadodara.
//
// Three interchangeable sources, chosen with VITE_PLACES_PROVIDER:
//
//   photon (default) - komoot's public Photon API over OpenStreetMap data.
//                      No key, no signup, no billing. Built for search-as-you-
//                      type. Komoot asks that usage stays reasonable and gives
//                      no availability guarantee, so we always keep the local
//                      fallback below. OSM data is ODbL: the attribution shown
//                      in LocationPicker is a licence requirement, not decoration.
//   google           - Places Autocomplete. Richer results for shops and
//                      societies, but needs a key and an active billing account.
//   local            - the curated locality list only. No network at all.
//
// Whichever is chosen, results are constrained to the greater-Vadodara box in
// config/locations.js, and every path falls back to the local list on failure so
// the field is never dead.
import { ALL_LOCATIONS, CITY, findLocation } from '../config/locations.js'

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

const PROVIDER = (import.meta.env.VITE_PLACES_PROVIDER || 'photon').toLowerCase()

// Google silently needs a key; fall back rather than firing keyless requests.
export const activeProvider = PROVIDER === 'google' && !GOOGLE_KEY ? 'photon' : PROVIDER

export const attribution =
  activeProvider === 'photon'
    ? 'Locations © OpenStreetMap contributors'
    : activeProvider === 'google'
      ? 'Locations by Google'
      : ''

const { south, west, north, east } = CITY.bounds

const insideVadodara = (lat, lng) =>
  lat >= south && lat <= north && lng >= west && lng <= east

// ---------------------------------------------------------------- local list

const localMatches = (query) => {
  const q = query.trim().toLowerCase()
  const list = q
    ? ALL_LOCATIONS.filter((a) => a.name.toLowerCase().includes(q) || a.pincode.includes(q))
    : ALL_LOCATIONS
  return list.slice(0, 8).map((a) => ({
    id: `local:${a.name}`,
    name: a.name,
    description: `${a.name}, ${CITY.name} ${a.pincode}`,
    lat: a.lat,
    lng: a.lng,
    pincode: a.pincode,
    source: 'local',
  }))
}

// -------------------------------------------------------------------- photon

async function photonSearch(query) {
  const url = new URL('https://photon.komoot.io/api/')
  url.searchParams.set('q', query)
  url.searchParams.set('limit', '10')
  url.searchParams.set('lang', 'en')
  // bbox is minLon,minLat,maxLon,maxLat -- hard-limits results to the city.
  url.searchParams.set('bbox', `${west},${south},${east},${north}`)
  // Bias ranking towards the city centre within that box.
  url.searchParams.set('lat', String(CITY.centre.lat))
  url.searchParams.set('lon', String(CITY.centre.lng))

  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`photon-${res.status}`)
  const data = await res.json()

  return (data.features || [])
    .map((f) => {
      const [lng, lat] = f.geometry?.coordinates ?? []
      const p = f.properties || {}
      const name = p.name || p.street || p.district || p.city
      if (!name || lat == null || !insideVadodara(lat, lng)) return null
      const context = [p.district, p.city || p.county, p.postcode].filter(Boolean)
      return {
        id: `photon:${p.osm_type}${p.osm_id}`,
        name,
        description: [name, ...context.filter((c) => c !== name)].join(', '),
        lat,
        lng,
        pincode: p.postcode || '',
        source: 'photon',
      }
    })
    .filter(Boolean)
    .slice(0, 8)
}

// -------------------------------------------------------------------- google

let googleLoader = null

function loadGoogleMaps() {
  if (!GOOGLE_KEY) return Promise.reject(new Error('no-key'))
  if (window.google?.maps?.places) return Promise.resolve(window.google.maps)
  if (googleLoader) return googleLoader

  googleLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places&region=IN`
    script.async = true
    script.defer = true
    script.onload = () =>
      window.google?.maps?.places
        ? resolve(window.google.maps)
        : reject(new Error('places-unavailable'))
    script.onerror = () => {
      googleLoader = null
      reject(new Error('maps-load-failed'))
    }
    document.head.appendChild(script)
  })
  return googleLoader
}

async function googleSearch(query) {
  const maps = await loadGoogleMaps()
  const service = new maps.places.AutocompleteService()

  const predictions = await new Promise((resolve, reject) => {
    service.getPlacePredictions(
      {
        input: query || CITY.name,
        componentRestrictions: { country: CITY.country },
        locationRestriction: new maps.LatLngBounds(
          new maps.LatLng(south, west),
          new maps.LatLng(north, east)
        ),
        types: ['geocode'],
      },
      (res, status) =>
        status === maps.places.PlacesServiceStatus.OK ||
        status === maps.places.PlacesServiceStatus.ZERO_RESULTS
          ? resolve(res || [])
          : reject(new Error(status))
    )
  })

  return predictions.slice(0, 8).map((p) => ({
    id: `google:${p.place_id}`,
    name: p.structured_formatting?.main_text || p.description,
    description: p.description,
    placeId: p.place_id,
    source: 'google',
  }))
}

// ---------------------------------------------------------------------- api

/**
 * Suggest places inside the Vadodara service area.
 * Always resolves; a failing provider degrades to the curated list.
 */
export async function suggestLocations(query) {
  const q = query.trim()
  if (activeProvider === 'local' || q.length < 2) return localMatches(q)

  try {
    const hits = activeProvider === 'google' ? await googleSearch(q) : await photonSearch(q)
    // An empty remote answer for a real query usually means the place is not in
    // OSM; offer whatever the curated list knows rather than nothing.
    return hits.length ? hits : localMatches(q)
  } catch {
    return localMatches(q)
  }
}

/** Turn a chosen suggestion into coordinates. */
export async function resolveLocation(suggestion) {
  if (!suggestion) return null
  if (suggestion.lat != null && suggestion.lng != null) return suggestion

  const known = findLocation(suggestion.name)
  if (known) return { ...suggestion, lat: known.lat, lng: known.lng, pincode: known.pincode }

  // Only Google predictions arrive without coordinates.
  try {
    const maps = await loadGoogleMaps()
    const { results } = await new maps.Geocoder().geocode({ placeId: suggestion.placeId })
    const hit = results?.[0]
    if (!hit) return suggestion
    const pin = hit.address_components?.find((c) => c.types.includes('postal_code'))?.long_name
    return {
      ...suggestion,
      lat: hit.geometry.location.lat(),
      lng: hit.geometry.location.lng(),
      pincode: pin || suggestion.pincode || '',
    }
  } catch {
    return suggestion
  }
}
