// Verifying who is calling.
//
// The browser sends its Firebase ID token; we verify it here with the Admin
// SDK. This is the point where the admin check stops being a UI convenience and
// becomes a real boundary -- the client cannot forge a verified token.
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

function app() {
  if (getApps().length) return getApps()[0]

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT is not configured')

  // Accept either raw JSON or base64, since dashboards mangle newlines.
  const json = raw.trim().startsWith('{')
    ? raw
    : Buffer.from(raw, 'base64').toString('utf8')

  return initializeApp({ credential: cert(JSON.parse(json)) })
}

/** Verified caller, or null. */
export async function getCaller(req) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null

  try {
    const decoded = await getAuth(app()).verifyIdToken(token)
    return {
      uid: decoded.uid,
      email: (decoded.email || '').toLowerCase(),
      // A custom claim is the real answer; the env list is the interim one until
      // claims are set (step 3).
      isAdmin: decoded.admin === true || adminEmails.includes((decoded.email || '').toLowerCase()),
    }
  } catch {
    return null
  }
}

export function send(res, status, body) {
  res.status(status).json(body)
}

/** Wraps a handler so every route reports errors the same way. */
export function route(handler) {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (err) {
      console.error('[api]', req.method, req.url, err)
      send(res, 500, { error: err.message || 'Something went wrong' })
    }
  }
}
