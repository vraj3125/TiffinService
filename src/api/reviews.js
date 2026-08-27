import { reviews as mockReviews } from '../mockData.js'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export async function fetchReviewsForProvider(providerId) {
  await delay()
  return mockReviews.filter((r) => r.providerId === providerId)
}

export async function fetchAllProviderReviews() {
  await delay()
  return [...mockReviews]
}
