// Customer profile data: addresses, payment preference, wallet.
// Everything here is scoped to one account and starts empty.
import { readAccount, writeAccount, updateAccount } from '../lib/accountStore.js'

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms))

// Payment rails are available to everyone -- they are not saved instruments, so
// a brand-new account can still check out without adding anything first.
export const PAYMENT_OPTIONS = [
  { id: 'upi', type: 'UPI', label: 'UPI', hint: 'Pay from any UPI app' },
  { id: 'card', type: 'Card', label: 'Credit / Debit card', hint: 'Visa, Mastercard, RuPay' },
  { id: 'cod', type: 'Cash', label: 'Cash on delivery', hint: 'Pay the rider directly' },
]

export async function fetchAddresses(uid) {
  await delay()
  return readAccount(uid, 'addresses', [])
}

export async function addAddress(uid, address) {
  await delay()
  const entry = { id: `a${Date.now()}`, ...address }
  return updateAccount(uid, 'addresses', [], (list) => [
    // First address added becomes the default; later ones only if asked.
    ...list.map((a) => (entry.isDefault ? { ...a, isDefault: false } : a)),
    { ...entry, isDefault: entry.isDefault || list.length === 0 },
  ])
}

export async function removeAddress(uid, id) {
  await delay()
  return updateAccount(uid, 'addresses', [], (list) => {
    const next = list.filter((a) => a.id !== id)
    // Never leave a list with no default.
    if (next.length && !next.some((a) => a.isDefault)) next[0] = { ...next[0], isDefault: true }
    return next
  })
}

export async function fetchProfile(uid) {
  await delay()
  return readAccount(uid, 'profile', { phone: '', city: '' })
}

export async function saveProfile(uid, profile) {
  await delay()
  return writeAccount(uid, 'profile', profile)
}

export async function fetchWallet(uid) {
  await delay()
  return readAccount(uid, 'wallet', { balance: 0 })
}
