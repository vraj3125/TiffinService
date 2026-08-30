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

export { STATUS, statusLabel, ACTIONS, ACTION_META } from '../shared/verification.js'
import { STATUS, statusLabel, ACTIONS, ACTION_META } from '../shared/verification.js'
import { apiFetch, useApi } from '../lib/apiClient.js'

const KEY = 'tc:admin:applications'

// The queue stores file METADATA, never the bytes.
//
// Documents and photos are data URLs -- a PDF can be 1.5 MB and a submission
// carries three of them plus photos. Copying all of that into the shared queue
// duplicated several megabytes on top of the provider's own copy and blew the
// ~5 MB localStorage budget, so the write threw and the application never
// reached the admin at all.
//
// Instead the queue keeps the description of each file and the bytes are read
// back from the provider's own namespace when a reviewer opens the application.
// One copy, and it mirrors what a real backend does: the queue holds a
// reference, object storage holds the file.
const stripFiles = (documents = []) =>
  documents.map((d) => ({
    ...d,
    file: d.file ? { name: d.file.name, type: d.file.type, size: d.file.size } : null,
  }))

const stripPhotos = (photos = []) => photos.map((p) => ({ id: p.id, name: p.name }))

const accountRead = (uid, name, fallback) => {
  try {
    const raw = localStorage.getItem(`tc:data:${uid}:${name}`)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

const accountWrite = (uid, name, value) => {
  try {
    localStorage.setItem(`tc:data:${uid}:${name}`, JSON.stringify(value))
  } catch {
    /* the decision itself still stands */
  }
}

/** Put the file bytes back, reading them from the kitchen's own account. */
const hydrate = (entry) => {
  if (!entry) return entry
  const ownDocs = accountRead(entry.uid, 'documents', [])
  const ownPhotos = accountRead(entry.uid, 'kitchenPhotos', [])

  return {
    ...entry,
    documents: (entry.documents || []).map((d) => {
      const own = ownDocs.find((o) => o.id === d.id)
      return own?.file ? { ...d, file: own.file } : d
    }),
    photos: (entry.photos || []).map((p) => {
      const own = ownPhotos.find((o) => o.id === p.id)
      return own?.src ? { ...p, src: own.src } : p
    }),
  }
}

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

// `rejected` has always meant "changes requested" -- the kitchen fixes it and
// resubmits. Two states were missing either side of that: an application that is
// refused outright, and a kitchen that was approved and later has to come down.

// What an admin may do next, given where the application stands. Every action
// is reversible: reopening returns an application to the queue rather than
// destroying the record of why a decision was made.

export async function submitApplication(uid, payload) {
  if (useApi) {
    const { application } = await apiFetch('/applications', { method: 'POST', body: payload })
    return application
  }
  await delay()
  const list = readAll()
  const now = new Date().toISOString()
  const existing = list.find((a) => a.uid === uid)

  const entry = {
    ...(existing || {}),
    uid,
    ...payload,
    documents: stripFiles(payload.documents),
    photos: stripPhotos(payload.photos),
    status: STATUS.submitted,
    submittedAt: now,
    // A resubmission clears the previous decision but keeps the trail.
    decidedAt: null,
    reviewNote: '',
    history: [
      ...(existing?.history || []),
      {
        action: existing ? 'resubmit' : 'submit',
        label: existing ? 'Resubmitted by kitchen' : 'Submitted by kitchen',
        from: existing?.status || STATUS.draft,
        to: STATUS.submitted,
        note: '',
        at: now,
        by: 'Kitchen',
      },
    ],
  }

  writeAll(existing ? list.map((a) => (a.uid === uid ? entry : a)) : [...list, entry])
  return entry
}

export async function listApplications() {
  if (useApi) {
    const { applications } = await apiFetch('/applications')
    return applications
  }
  await delay()
  // The list does not need file bytes -- only the review screen does.
  return readAll().sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)))
}

export async function getApplication(uid) {
  if (useApi) {
    try {
      const { application } = await apiFetch(`/applications/${uid}`)
      return application
    } catch (err) {
      // No application yet is a normal state, not a failure.
      if (err.status === 404) return null
      throw err
    }
  }
  await delay(120)
  return hydrate(readAll().find((a) => a.uid === uid)) || null
}

/** The full record, with document and photo bytes, for the review screen. */
export async function getApplicationForReview(uid) {
  if (useApi) {
    try {
      const { application } = await apiFetch(`/applications/${uid}`)
      return application
    } catch (err) {
      if (err.status === 404) return null
      throw err
    }
  }
  await delay(120)
  return hydrate(readAll().find((a) => a.uid === uid)) || null
}

/**
 * Apply an admin action. Records what happened rather than overwriting it: a
 * verification trail is the point of the queue, so there is no delete.
 * @param {string} action one of ACTION_META
 */
export async function decideApplication(uid, action, reviewNote = '', by = 'Admin') {
  if (useApi) {
    const { application, docStatus } = await apiFetch(`/applications/${uid}`, {
      method: 'PATCH',
      body: { action, reviewNote },
    })
    // The kitchen's own document badges still live in their browser until step
    // 4 moves them too, so mirror the outcome when it is this browser.
    const ownDocs = accountRead(uid, 'documents', [])
    if (ownDocs.length) {
      accountWrite(uid, 'documents', ownDocs.map((d) => (d.file ? { ...d, status: docStatus } : d)))
    }
    return application
  }
  await delay()
  const meta = ACTION_META[action]
  if (!meta) throw new Error(`Unknown action: ${action}`)

  const list = readAll()
  const entry = list.find((a) => a.uid === uid)
  if (!entry) throw new Error('That application no longer exists.')

  if (meta.needsNote && !String(reviewNote).trim()) {
    throw new Error('This action needs a note explaining the decision.')
  }

  const allowed = ACTIONS[entry.status] || []
  if (!allowed.includes(action)) {
    throw new Error(`Cannot ${action} an application that is ${statusLabel[entry.status]}.`)
  }

  const now = new Date().toISOString()
  const updated = {
    ...entry,
    status: meta.to,
    reviewNote: meta.needsNote ? String(reviewNote).trim() : '',
    decidedAt: action === 'reopen' ? null : now,
    history: [
      ...(entry.history || []),
      { action, label: meta.label, from: entry.status, to: meta.to, note: String(reviewNote).trim(), at: now, by },
    ],
  }
  writeAll(list.map((a) => (a.uid === uid ? updated : a)))

  // Push the outcome onto the kitchen's own documents. Without this the admin
  // approved the application but the provider's badges stayed on "Pending",
  // because the decision only ever lived in the queue.
  const docStatus =
    meta.to === STATUS.approved ? 'verified' : meta.to === STATUS.submitted ? 'pending' : 'rejected'
  const ownDocs = accountRead(uid, 'documents', [])
  if (ownDocs.length) {
    accountWrite(uid, 'documents', ownDocs.map((d) => (d.file ? { ...d, status: docStatus } : d)))
  }

  return updated
}
