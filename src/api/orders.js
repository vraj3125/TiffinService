// Orders and subscriptions, scoped to one account.
//
// A new account has none of either. Records appear only from what that account
// actually does -- placing an order, pausing a plan -- so two accounts never
// see each other's data.
import { readAccount, updateAccount } from '../lib/accountStore.js'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

const today = () => new Date().toISOString().slice(0, 10)

const addDays = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

// Plans carry their length as text ("7 days", "26 days"), which is also what a
// provider types when defining their own -- so read it from there rather than
// keeping a lookup table that silently misses custom plan names.
const planDays = (plan) => {
  const n = parseInt(String(plan?.duration ?? ''), 10)
  return Number.isFinite(n) && n > 0 ? n : 7
}

export async function fetchOrders(uid) {
  await delay()
  return readAccount(uid, 'orders', [])
}

export async function fetchSubscriptions(uid) {
  await delay()
  return readAccount(uid, 'subscriptions', [])
}

export async function fetchProviderOrders(uid) {
  await delay()
  return readAccount(uid, 'kitchenOrders', [])
}

export async function placeOrder(uid, { provider, plan, meal, amount, items = [], paymentMethod = 'UPI' }) {
  await delay(500)
  const stamp = Date.now()
  const days = planDays(plan)

  const order = {
    id: `ORD${String(stamp).slice(-6)}`,
    providerId: provider.id,
    providerName: provider.name,
    date: today(),
    meal,
    status: 'upcoming',
    planType: plan.type,
    // Recorded so the payments view reports what was actually chosen rather
    // than assuming one method.
    paymentMethod,
    items,
    amount,
  }

  const subscription = {
    id: `SUB${String(stamp).slice(-6)}`,
    providerId: provider.id,
    providerName: provider.name,
    planType: plan.type,
    meal,
    startDate: today(),
    endDate: addDays(days),
    daysLeft: days,
    status: 'active',
    skippedDates: [],
    pausedUntil: null,
  }

  updateAccount(uid, 'orders', [], (list) => [order, ...list])
  updateAccount(uid, 'subscriptions', [], (list) => [subscription, ...list])
  return { order, subscription }
}

export async function updateSubscription(uid, id, patch) {
  await delay(200)
  return updateAccount(uid, 'subscriptions', [], (list) =>
    list.map((s) => (s.id === id ? { ...s, ...patch } : s))
  )
}

export async function skipMeal(uid, id, date) {
  await delay(200)
  return updateAccount(uid, 'subscriptions', [], (list) =>
    list.map((s) =>
      s.id === id && !s.skippedDates.includes(date)
        ? { ...s, skippedDates: [...s.skippedDates, date] }
        : s
    )
  )
}
