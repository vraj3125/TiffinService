// The verification state machine, shared by the browser and the API.
//
// Both sides enforce it: the client to show the right buttons, the server
// because a client can be bypassed. Keeping one definition means the two can
// never disagree about what is allowed.

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
