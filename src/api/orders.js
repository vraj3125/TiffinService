import { orders as mockOrders, subscriptions as mockSubs, providerOrders as mockProviderOrders } from '../mockData.js'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export async function fetchOrders() {
  await delay()
  return [...mockOrders]
}

export async function fetchSubscriptions() {
  await delay()
  return [...mockSubs]
}

export async function fetchProviderOrders() {
  await delay()
  return [...mockProviderOrders]
}

export async function placeOrder(payload) {
  await delay(500)
  return { id: `ORD${Math.floor(1000 + Math.random() * 9000)}`, status: 'upcoming', ...payload }
}
