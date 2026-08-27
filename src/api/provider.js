import { providerStats, holidays, verificationDocs } from '../mockData.js'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export async function fetchProviderStats() {
  await delay()
  return { ...providerStats }
}

export async function fetchHolidays() {
  await delay()
  return [...holidays]
}

export async function fetchVerificationDocs() {
  await delay()
  return [...verificationDocs]
}
