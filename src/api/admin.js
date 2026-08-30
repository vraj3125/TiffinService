// The verification queue.
//
// A provider's own data is namespaced by uid, which an admin cannot read. So on
// submission the application is copied into one shared registry that the admin
// screen reads, and the decision is written back to both the registry and the
// provider's account.
//
// With a real backend this is a `verification_requests` collection and the
// decision is a server-side write. Keeping the shape close to that now means
// the swap is mechanical.

const KEY = 'tc:admin:applications'

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

const writeAll = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    throw new Error('Storage is full. Remove some uploaded documents and try again.')
  }
  return list
}

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms))

export const STATUS = {
  draft: 'draft',
  submitted: 'submitted',
  approved: 'approved',
  rejected: 'rejected',
}

export const statusLabel = {
  draft: 'Not submitted',
  submitted: 'Awaiting review',
  approved: 'Approved',
  rejected: 'Changes requested',
}

export async function submitApplication(uid, payload) {
  await delay()
  const list = readAll()
  const now = new Date().toISOString()
  const existing = list.find((a) => a.uid === uid)

  const entry = {
    ...(existing || {}),
    uid,
    ...payload,
    status: STATUS.submitted,
    submittedAt: now,
    // A resubmission clears the previous decision.
    decidedAt: null,
    reviewNote: '',
  }

  writeAll(existing ? list.map((a) => (a.uid === uid ? entry : a)) : [...list, entry])
  return entry
}

export async function listApplications() {
  await delay()
  // Newest submission first.
  return readAll().sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)))
}

export async function getApplication(uid) {
  await delay(120)
  return readAll().find((a) => a.uid === uid) || null
}

export async function decideApplication(uid, decision, reviewNote = '') {
  await delay()
  const list = readAll()
  const entry = list.find((a) => a.uid === uid)
  if (!entry) throw new Error('That application no longer exists.')

  const updated = {
    ...entry,
    status: decision,
    reviewNote,
    decidedAt: new Date().toISOString(),
  }
  writeAll(list.map((a) => (a.uid === uid ? updated : a)))
  return updated
}
