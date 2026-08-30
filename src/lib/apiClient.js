// Talking to the serverless API.
//
// VITE_USE_API=true switches the app onto the backend. Without it every call
// falls back to localStorage, so `npm run dev` keeps working with no MongoDB
// and no Vercel CLI. The fallback is explicit, never silent -- when the API is
// meant to be on and fails, the error surfaces.
import { auth, isFirebaseConfigured } from './firebase.js'

export const useApi = String(import.meta.env.VITE_USE_API).toLowerCase() === 'true'

const BASE = import.meta.env.VITE_API_BASE || ''

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function authHeader() {
  if (!isFirebaseConfigured || !auth?.currentUser) {
    throw new ApiError('Sign in first.', 401)
  }
  return { Authorization: `Bearer ${await auth.currentUser.getIdToken()}` }
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const headers = { ...(await authHeader()) }
  if (body) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Could not reach the server. Check your connection.', 0)
  }

  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    // An HTML error page usually means the function is not deployed.
    throw new ApiError(`Server returned an unexpected response (${res.status}).`, res.status)
  }

  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status)
  return data
}

export { ApiError }
