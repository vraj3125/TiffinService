// Reviews come from two places:
//  - the marketplace catalogue, when a customer is reading a kitchen's listing
//  - the signed-in kitchen's own account, which starts with none
import { reviews as catalogueReviews } from '../mockData.js'
import { readAccount } from '../lib/accountStore.js'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export async function fetchReviewsForProvider(providerId) {
  await delay()
  return catalogueReviews.filter((r) => r.providerId === providerId)
}

export async function fetchMyReviews(uid) {
  await delay()
  return readAccount(uid, 'kitchenReviews', [])
}
