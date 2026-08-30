// Platform-wide figures for the admin dashboard.
//
// There is no backend, so there is nothing to query. What exists is every
// account's own namespace in this browser's localStorage (see
// lib/accountStore.js) plus the shared verification queue and the seeded
// catalogue. This module walks those and aggregates.
//
// THE IMPORTANT CAVEAT: this is BROWSER-LOCAL. It reports on accounts that have
// used this browser, not on the platform. A customer on their own phone is
// invisible here. Every screen using this says so. When a real backend arrives,
// replace the bodies of these functions with queries -- the signatures are
// already async and the shapes are already what the UI wants.
import { providers, reviews as catalogueReviews } from '../mockData.js'
import { listApplications, STATUS } from './admin.js'
import { ALL_LOCATIONS } from '../config/locations.js'

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms))

const ACCOUNT_KEY = /^tc:data:([^:]+):(.+)$/

const safeParse = (raw, fallback) => {
  try {
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

const readRaw = (key, fallback) => {
  try {
    return safeParse(localStorage.getItem(key), fallback)
  } catch {
    return fallback
  }
}

const readPlain = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Every account this browser knows about, with its stored collections.
 * Returns [{ uid, name, role, orders, subscriptions, addresses, profile, ... }]
 */
export function collectAccounts() {
  const byUid = new Map()

  let keys = []
  try {
    keys = Object.keys(localStorage)
  } catch {
    return []
  }

  for (const key of keys) {
    const match = ACCOUNT_KEY.exec(key)
    if (!match) continue
    const [, uid, name] = match
    if (!byUid.has(uid)) byUid.set(uid, { uid, collections: {} })
    byUid.get(uid).collections[name] = readRaw(key, null)
  }

  return [...byUid.values()].map(({ uid, collections }) => ({
    uid,
    name: readPlain(`tc:name:${uid}`) || collections.kitchenProfile?.name || 'Unnamed account',
    role: readPlain(`tc:role:${uid}`) || (collections.kitchenProfile ? 'provider' : 'customer'),
    orders: collections.orders || [],
    subscriptions: collections.subscriptions || [],
    addresses: collections.addresses || [],
    profile: collections.profile || {},
    kitchenProfile: collections.kitchenProfile || null,
    branches: collections.branches || [],
    kitchenOrders: collections.kitchenOrders || [],
    photos: collections.kitchenPhotos || [],
  }))
}

const today = () => new Date().toISOString().slice(0, 10)

const dayKeys = (count) =>
  Array.from({ length: count }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (count - 1 - i))
    return d.toISOString().slice(0, 10)
  })

const shortDay = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { weekday: 'short' })

export const sumAmount = (list) => list.reduce((t, o) => t + (Number(o.amount) || 0), 0)

/** Customers, with what they have actually done. */
export async function fetchCustomers() {
  await delay()
  return collectAccounts()
    .filter((a) => a.role === 'customer')
    .map((a) => {
      const active = a.subscriptions.filter((s) => s.status === 'active')
      const joined = [...a.orders].sort((x, y) => String(x.date).localeCompare(String(y.date)))[0]
      return {
        uid: a.uid,
        name: a.name,
        phone: a.profile?.phone || '',
        city: a.profile?.city || a.addresses[0]?.area || '',
        addresses: a.addresses.length,
        subscriptions: a.subscriptions,
        activeCount: active.length,
        kitchens: [...new Set(a.subscriptions.map((s) => s.providerName))],
        orders: a.orders.length,
        spend: sumAmount(a.orders),
        firstOrder: joined?.date || null,
        status: active.length ? 'active' : a.orders.length ? 'lapsed' : 'new',
      }
    })
    .sort((a, b) => b.orders - a.orders)
}

/** Every order across accounts, newest first, tagged with its customer. */
export async function fetchAllOrders() {
  await delay()
  return collectAccounts()
    .flatMap((a) => a.orders.map((o) => ({ ...o, customer: a.name, customerUid: a.uid })))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.id).localeCompare(String(a.id)))
}

export async function fetchAllSubscriptions() {
  await delay()
  return collectAccounts()
    .flatMap((a) => a.subscriptions.map((s) => ({ ...s, customer: a.name, customerUid: a.uid })))
    .sort((a, b) => String(b.startDate).localeCompare(String(a.startDate)))
}

/**
 * Payments are derived from orders -- one order, one payment. There is no
 * gateway, so nothing here is invented: the method is what the customer chose
 * at checkout, and cash on delivery counts as collected only once delivered.
 */
export async function fetchPayments() {
  const orders = await fetchAllOrders()
  return orders.map((o) => {
    const method = o.paymentMethod || 'UPI'
    const settled = method !== 'Cash' || o.status === 'delivered'
    return {
      id: o.id,
      customer: o.customer,
      kitchen: o.providerName,
      amount: o.amount,
      method,
      status: settled ? 'paid' : 'pending',
      date: o.date,
    }
  })
}

/** Catalogue kitchens joined with anything the local accounts have submitted. */
export async function fetchKitchenPerformance() {
  const [apps, orders] = await Promise.all([listApplications(), fetchAllOrders()])
  const accounts = collectAccounts().filter((a) => a.role === 'provider')

  const ordersByKitchen = orders.reduce((acc, o) => {
    const key = o.providerName
    if (!acc[key]) acc[key] = { count: 0, revenue: 0 }
    acc[key].count += 1
    acc[key].revenue += Number(o.amount) || 0
    return acc
  }, {})

  // Seeded catalogue kitchens.
  const catalogue = providers.map((p) => ({
    id: p.id,
    name: p.name,
    area: p.area,
    locations: 1,
    rating: p.rating,
    reviewCount: p.reviewCount,
    orders: ordersByKitchen[p.name]?.count || 0,
    revenue: ordersByKitchen[p.name]?.revenue || 0,
    status: p.verified ? STATUS.approved : STATUS.draft,
    source: 'catalogue',
  }))

  // Kitchens registered in this browser, which may not be in the catalogue.
  const registered = accounts.map((a) => {
    const app = apps.find((x) => x.uid === a.uid)
    return {
      id: a.uid,
      name: a.kitchenProfile?.name || a.name,
      area: a.branches[0]?.area || a.kitchenProfile?.area || '',
      locations: a.branches.length || (a.kitchenProfile?.area ? 1 : 0),
      rating: 0,
      reviewCount: 0,
      orders: a.kitchenOrders.length,
      revenue: sumAmount(a.kitchenOrders),
      status: app?.status || STATUS.draft,
      source: 'registered',
    }
  })

  return [...registered, ...catalogue].sort((a, b) => b.orders - a.orders || b.rating - a.rating)
}

/** Headline figures for the dashboard cards. */
export async function fetchPlatformStats() {
  const [apps, orders, subs, customers] = await Promise.all([
    listApplications(),
    fetchAllOrders(),
    fetchAllSubscriptions(),
    fetchCustomers(),
  ])

  const now = today()
  const todays = orders.filter((o) => o.date === now)
  const approved = apps.filter((a) => a.status === STATUS.approved).length
  const pending = apps.filter((a) => a.status === STATUS.submitted).length
  const changes = apps.filter((a) => a.status === STATUS.rejected).length

  // Platform rating comes from the catalogue's published reviews -- the only
  // reviews that exist across kitchens.
  const rating = catalogueReviews.length
    ? catalogueReviews.reduce((t, r) => t + r.rating, 0) / catalogueReviews.length
    : 0

  return {
    customers: customers.length,
    activeCustomers: customers.filter((c) => c.status === 'active').length,
    kitchensTotal: providers.length + apps.length,
    kitchensApproved: approved,
    kitchensPending: pending,
    kitchensChanges: changes,
    subscriptionsActive: subs.filter((s) => s.status === 'active').length,
    subscriptionsPaused: subs.filter((s) => s.status === 'paused').length,
    ordersToday: todays.length,
    ordersTotal: orders.length,
    revenueToday: sumAmount(todays),
    revenueTotal: sumAmount(orders),
    rating,
    ratingCount: catalogueReviews.length,
  }
}

/** Actionable items only -- never a fabricated alert. */
export async function fetchNeedsAttention() {
  const [apps, payments, orders] = await Promise.all([
    listApplications(),
    fetchPayments(),
    fetchAllOrders(),
  ])

  const items = [
    {
      id: 'pending',
      severity: 'serious',
      count: apps.filter((a) => a.status === STATUS.submitted).length,
      label: 'Kitchens awaiting verification',
      detail: 'Submitted applications that no one has reviewed yet.',
      to: '/admin/kitchens/pending',
    },
    {
      id: 'changes',
      severity: 'warning',
      count: apps.filter((a) => a.status === STATUS.rejected).length,
      label: 'Applications waiting on the kitchen',
      detail: 'Changes were requested and have not been resubmitted.',
      to: '/admin/kitchens/changes',
    },
    {
      id: 'payments',
      severity: 'warning',
      count: payments.filter((p) => p.status === 'pending').length,
      label: 'Payments not yet collected',
      detail: 'Cash on delivery orders that have not been delivered.',
      to: '/admin/payments',
    },
    {
      id: 'orders',
      severity: 'info',
      count: orders.filter((o) => o.status === 'upcoming').length,
      label: 'Orders still to go out',
      detail: 'Scheduled deliveries that are not yet on their way.',
      to: '/admin/orders',
    },
  ]

  return items.filter((i) => i.count > 0)
}

/** Orders and revenue for the last `days` days. */
export async function fetchDailySeries(days = 7) {
  const orders = await fetchAllOrders()
  return dayKeys(days).map((iso) => {
    const forDay = orders.filter((o) => o.date === iso)
    return { iso, label: shortDay(iso), orders: forDay.length, revenue: sumAmount(forDay) }
  })
}

/** How subscriptions split across plan types. */
export async function fetchSubscriptionMix() {
  const subs = await fetchAllSubscriptions()
  const counts = subs.reduce((acc, s) => {
    const key = s.planType || 'Other'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

export async function fetchSubscriptionStatusMix() {
  const subs = await fetchAllSubscriptions()
  const counts = subs.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1
    return acc
  }, {})
  return ['active', 'paused', 'expiring', 'cancelled']
    .map((label) => ({ label, value: counts[label] || 0 }))
    .filter((d) => d.value > 0)
}

/** Reviews across the catalogue, newest first, with the kitchen name attached. */
export async function fetchAllReviews() {
  await delay()
  const nameOf = (id) => providers.find((p) => p.id === id)?.name || 'Unknown kitchen'
  return [...catalogueReviews]
    .map((r) => ({ ...r, kitchen: nameOf(r.providerId) }))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
}

/** Coverage by area, built from the catalogue and any registered branches. */
export async function fetchLocationStats() {
  const accounts = collectAccounts().filter((a) => a.role === 'provider')
  const customers = await fetchCustomers()

  const rows = ALL_LOCATIONS.map((loc) => {
    const catalogueCount = providers.filter((p) => p.area === loc.name).length
    const registeredCount = accounts.filter((a) =>
      a.branches.some((b) => b.area === loc.name)
    ).length
    return {
      name: loc.name,
      pincode: loc.pincode,
      kitchens: catalogueCount + registeredCount,
      customers: customers.filter((c) => c.city === loc.name).length,
    }
  })

  return {
    total: ALL_LOCATIONS.length,
    covered: rows.filter((r) => r.kitchens > 0).length,
    rows: rows.sort((a, b) => b.kitchens - a.kitchens || a.name.localeCompare(b.name)),
  }
}
