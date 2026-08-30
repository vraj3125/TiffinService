// Who can open the admin dashboard.
//
// Comma-separated emails in VITE_ADMIN_EMAILS, e.g.
//   VITE_ADMIN_EMAILS=you@example.com,ops@tiffinconnect.in
//
// IMPORTANT: this is a UI gate, not a security boundary. The check runs in the
// browser, so anyone reading the bundle can see the list and a determined user
// could render the screen. It is fine while approvals are a local workflow, but
// before this handles real applications the check has to move to the server --
// Firebase custom claims plus Firestore rules, so the DATA is protected rather
// than just the route.

const RAW = import.meta.env.VITE_ADMIN_EMAILS || ''

export const ADMIN_EMAILS = RAW.split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export const isAdminEmail = (email) =>
  Boolean(email) && ADMIN_EMAILS.includes(String(email).trim().toLowerCase())

// With no list configured nobody is an admin, so the dashboard stays shut
// rather than defaulting open.
export const adminConfigured = ADMIN_EMAILS.length > 0
