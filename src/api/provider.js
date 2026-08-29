// A kitchen's own workspace: stats, menu, plans, holidays, documents.
//
// All of it is scoped to the signed-in provider and starts empty. A new kitchen
// sees zeros and blank forms, not another kitchen's numbers.
import { readAccount, writeAccount } from '../lib/accountStore.js'
import { DEFAULT_RADIUS_KM } from '../config/locations.js'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Blank week -- every day present so the editor has rows, but each meal null so
// it renders the "not set yet" state rather than an empty dish with 0 kcal.
export const emptyMenu = () =>
  DAYS.reduce((menu, day) => {
    menu[day] = { lunch: null, dinner: null }
    return menu
  }, {})

// The documents every kitchen has to supply, all unsubmitted to begin with.
const REQUIRED_DOCS = [
  { id: 'doc1', name: 'FSSAI License', status: 'missing' },
  { id: 'doc2', name: 'Kitchen Photos', status: 'missing' },
  { id: 'doc3', name: 'Owner ID Proof', status: 'missing' },
]

const EMPTY_STATS = {
  todayOrders: 0,
  todayRevenue: 0,
  weekRevenue: [0, 0, 0, 0, 0, 0, 0],
  weekLabels: WEEK_LABELS,
  activeSubscribers: 0,
  avgRating: 0,
  monthRevenue: 0,
  monthOrders: 0,
}

// Derived from this kitchen's own orders and reviews rather than stored, so the
// dashboard can never drift out of step with the lists it sits above.
export async function fetchProviderStats(uid) {
  await delay()
  const orders = readAccount(uid, 'kitchenOrders', [])
  const reviews = readAccount(uid, 'kitchenReviews', [])
  if (!orders.length && !reviews.length) return { ...EMPTY_STATS }

  const today = new Date().toISOString().slice(0, 10)
  const todays = orders.filter((o) => o.date === today)
  const revenueOf = (list) => list.reduce((sum, o) => sum + (o.amount || 0), 0)

  const weekRevenue = WEEK_LABELS.map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    return revenueOf(orders.filter((o) => o.date === key))
  })

  return {
    todayOrders: todays.length,
    todayRevenue: revenueOf(todays),
    weekRevenue,
    weekLabels: WEEK_LABELS,
    activeSubscribers: new Set(orders.map((o) => o.customerName)).size,
    avgRating: reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0,
    monthRevenue: revenueOf(orders),
    monthOrders: orders.length,
  }
}

export async function fetchHolidays(uid) {
  await delay()
  return readAccount(uid, 'holidays', [])
}

export async function saveHolidays(uid, holidays) {
  await delay(150)
  return writeAccount(uid, 'holidays', holidays)
}

export async function fetchVerificationDocs(uid) {
  await delay()
  return readAccount(uid, 'documents', REQUIRED_DOCS)
}

export async function saveVerificationDocs(uid, docs) {
  await delay(150)
  return writeAccount(uid, 'documents', docs)
}

export async function fetchMyMenu(uid) {
  await delay()
  return readAccount(uid, 'menu', emptyMenu())
}

export async function saveMyMenu(uid, menu) {
  await delay(150)
  return writeAccount(uid, 'menu', menu)
}

export async function fetchMyPlans(uid) {
  await delay()
  return readAccount(uid, 'plans', [])
}

export async function saveMyPlans(uid, plans) {
  await delay(150)
  return writeAccount(uid, 'plans', plans)
}

// --- kitchen branches ------------------------------------------------------
//
// A provider can cook from more than one place -- a second kitchen in another
// part of the city, say. Each branch has its own address and its own delivery
// radius, and a customer is covered if ANY branch reaches them.
//
// The area chosen at signup becomes the first branch, so an existing single-
// location account is migrated on first read rather than losing its location.

export const newBranch = (place, label = '') => ({
  id: `b${Date.now()}${Math.floor(Math.random() * 1000)}`,
  label: label || place?.name || 'Kitchen',
  area: place?.name || '',
  pincode: place?.pincode || '',
  address: '',
  lat: place?.lat ?? null,
  lng: place?.lng ?? null,
  radiusKm: DEFAULT_RADIUS_KM,
})

export async function fetchBranches(uid) {
  await delay()
  const stored = readAccount(uid, 'branches', null)
  if (stored) return stored

  // Migrate: promote the signup location to branch one.
  const profile = readAccount(uid, 'kitchenProfile', null)
  if (!profile?.area) return []
  const first = {
    ...newBranch(
      { name: profile.area, pincode: profile.pincode, lat: profile.lat, lng: profile.lng },
      'Main kitchen'
    ),
    address: profile.address || '',
    radiusKm: profile.radiusKm ?? DEFAULT_RADIUS_KM,
  }
  return writeAccount(uid, 'branches', [first])
}

export async function saveBranches(uid, branches) {
  await delay(150)
  return writeAccount(uid, 'branches', branches)
}

export async function fetchMyZones(uid) {
  await delay()
  return readAccount(uid, 'zones', [])
}

export async function saveMyZones(uid, zones) {
  await delay(150)
  return writeAccount(uid, 'zones', zones)
}

export async function fetchKitchenProfile(uid) {
  await delay()
  return readAccount(uid, 'kitchenProfile', {
    name: '', area: '', pincode: '', phone: '', fssai: '', owner: '', address: '',
  })
}

export async function saveKitchenProfile(uid, profile) {
  await delay(150)
  return writeAccount(uid, 'kitchenProfile', profile)
}
