// Vadodara service area.
//
// TiffinConnect operates in Vadodara and the towns around it, so every place
// the app offers comes from this file. It is also the fallback for location
// search when no Google Places key is configured -- see lib/places.js.
//
// Coordinates are approximate locality centres, accurate enough to work out
// whether a kitchen's delivery radius reaches a customer.

export const CITY = {
  name: 'Vadodara',
  state: 'Gujarat',
  country: 'IN',
  centre: { lat: 22.3072, lng: 73.1812 },
  // Box used to restrict place suggestions to greater Vadodara. It must contain
  // every entry below, otherwise Google would reject a town the local fallback
  // happily offers -- Savli to the north and Karjan to the south are the edges.
  bounds: { south: 22.00, west: 72.90, north: 22.62, east: 73.50 },
}

export const VADODARA_AREAS = [
  { name: 'Alkapuri', pincode: '390007', lat: 22.3105, lng: 73.1732 },
  { name: 'Sayajigunj', pincode: '390005', lat: 22.3115, lng: 73.1836 },
  { name: 'Fatehgunj', pincode: '390002', lat: 22.3213, lng: 73.1869 },
  { name: 'Akota', pincode: '390020', lat: 22.2937, lng: 73.1701 },
  { name: 'Gotri', pincode: '390021', lat: 22.3162, lng: 73.1352 },
  { name: 'Vasna', pincode: '390015', lat: 22.3010, lng: 73.1435 },
  { name: 'Subhanpura', pincode: '390023', lat: 22.3283, lng: 73.1587 },
  { name: 'Nizampura', pincode: '390002', lat: 22.3388, lng: 73.1830 },
  { name: 'Karelibaug', pincode: '390018', lat: 22.3255, lng: 73.2107 },
  { name: 'Manjalpur', pincode: '390011', lat: 22.2731, lng: 73.1938 },
  { name: 'Makarpura', pincode: '390010', lat: 22.2542, lng: 73.1858 },
  { name: 'Tandalja', pincode: '390012', lat: 22.2925, lng: 73.1428 },
  { name: 'Harni', pincode: '390022', lat: 22.3411, lng: 73.2166 },
  { name: 'Sama', pincode: '390024', lat: 22.3437, lng: 73.1977 },
  { name: 'Chhani', pincode: '391740', lat: 22.3627, lng: 73.1727 },
  { name: 'Gorwa', pincode: '390016', lat: 22.3336, lng: 73.1541 },
  { name: 'Warasiya', pincode: '390006', lat: 22.3305, lng: 73.2033 },
  { name: 'Race Course', pincode: '390007', lat: 22.3078, lng: 73.1789 },
  { name: 'Dandia Bazar', pincode: '390001', lat: 22.3070, lng: 73.1969 },
  { name: 'Mandvi', pincode: '390001', lat: 22.2986, lng: 73.2043 },
  { name: 'Old Padra Road', pincode: '390015', lat: 22.2951, lng: 73.1585 },
  { name: 'New Alkapuri', pincode: '390007', lat: 22.3130, lng: 73.1660 },
  { name: 'Bhayli', pincode: '391410', lat: 22.2924, lng: 73.1093 },
  { name: 'Vadsar', pincode: '390010', lat: 22.2637, lng: 73.1712 },
  { name: 'Ajwa Road', pincode: '390019', lat: 22.3260, lng: 73.2400 },
  { name: 'Waghodia Road', pincode: '390019', lat: 22.3126, lng: 73.2371 },
  { name: 'Atladara', pincode: '390012', lat: 22.2792, lng: 73.1494 },
  { name: 'Diwalipura', pincode: '390007', lat: 22.3031, lng: 73.1607 },
  { name: 'Ellora Park', pincode: '390023', lat: 22.3232, lng: 73.1699 },
  { name: 'Chhani Jakat Naka', pincode: '390024', lat: 22.3512, lng: 73.1810 },
  { name: 'Sun Pharma Road', pincode: '390012', lat: 22.2867, lng: 73.1380 },
  { name: 'Kalali', pincode: '390012', lat: 22.2705, lng: 73.1533 },
  { name: 'Bapod', pincode: '390019', lat: 22.3283, lng: 73.2277 },
  { name: 'Undera', pincode: '390024', lat: 22.3593, lng: 73.1938 },
]

// Towns within reasonable delivery distance of the city.
export const NEARBY_TOWNS = [
  { name: 'Padra', pincode: '391440', lat: 22.2380, lng: 73.0800 },
  { name: 'Waghodia', pincode: '391760', lat: 22.3050, lng: 73.3550 },
  { name: 'Savli', pincode: '391770', lat: 22.5680, lng: 73.2100 },
  { name: 'Karjan', pincode: '391210', lat: 22.0530, lng: 73.1220 },
  { name: 'Dabhoi', pincode: '391110', lat: 22.1830, lng: 73.4300 },
  { name: 'Bajwa', pincode: '391310', lat: 22.3690, lng: 73.1300 },
  { name: 'Ranoli', pincode: '391350', lat: 22.4010, lng: 73.1250 },
  { name: 'Por', pincode: '391243', lat: 22.3860, lng: 73.0930 },
]

export const ALL_LOCATIONS = [...VADODARA_AREAS, ...NEARBY_TOWNS]

// Plain names, for the simple dropdowns.
export const AREA_NAMES = ALL_LOCATIONS.map((a) => a.name)

export const findLocation = (name) =>
  ALL_LOCATIONS.find((a) => a.name.toLowerCase() === String(name).trim().toLowerCase()) || null

// Straight-line distance in km. Good enough to decide whether a kitchen's
// delivery radius covers an address; it is not a road-network distance.
export function distanceKm(a, b) {
  if (!a || !b) return null
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 10) / 10
}

// Default distance a new kitchen is willing to deliver.
export const DEFAULT_RADIUS_KM = 5
export const MAX_RADIUS_KM = 25
