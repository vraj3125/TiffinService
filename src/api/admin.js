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

// `rejected` has always meant "changes requested" -- the kitchen fixes it and
// resubmits. Two states were missing either side of that: an application that is
// refused outright, and a kitchen that was approved and later has to come down.
export const STATUS = {
  draft: 'draft',
  submitted: 'submitted',
  approved: 'approved',
  rejected: 'rejected',
  declined: 'declined',
  suspended: 'suspended',
}

export const statusLabel = {
  draft: 'Not submitted',
  submitted: 'Awaiting review',
  approved: 'Approved',
  rejected: 'Changes requested',
  declined: 'Declined',
  suspended: 'Suspended',
}

// What an admin may do next, given where the application stands. Every action
// is reversible: reopening returns an application to the queue rather than
// destroying the record of why a decision was made.
export const ACTIONS = {
  [STATUS.submitted]: ['approve', 'changes', 'decline'],
  [STATUS.rejected]: ['approve', 'editNote', 'decline', 'reopen'],
  [STATUS.approved]: ['suspend'],
  [STATUS.declined]: ['reopen'],
  [STATUS.suspended]: ['reinstate', 'reopen'],
  [STATUS.draft]: [],
}

export const ACTION_META = {
  approve: { label: 'Approve kitchen', to: STATUS.approved, tone: 'primary', needsNote: false },
  changes: { label: 'Request changes', to: STATUS.rejected, tone: 'warning', needsNote: true },
  decline: { label: 'Decline application', to: STATUS.declined, tone: 'danger', needsNote: true, confirm: true },
  suspend: { label: 'Suspend kitchen', to: STATUS.suspended, tone: 'danger', needsNote: true, confirm: true },
  reinstate: { label: 'Reinstate kitchen', to: STATUS.approved, tone: 'primary', needsNote: false, confirm: true },
  reopen: { label: 'Reopen for review', to: STATUS.submitted, tone: 'secondary', needsNote: false },
  editNote: { label: 'Edit note', to: STATUS.rejected, tone: 'secondary', needsNote: true },
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
  await delay()
  // Newest submission first.
  return readAll().sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)))
}

export async function getApplication(uid) {
  await delay(120)
  return readAll().find((a) => a.uid === uid) || null
}

/**
 * Apply an admin action. Records what happened rather than overwriting it: a
 * verification trail is the point of the queue, so there is no delete.
 * @param {string} action one of ACTION_META
 */
export async function decideApplication(uid, action, reviewNote = '', by = 'Admin') {
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
  return updated
}
