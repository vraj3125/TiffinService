// Per-account data, namespaced by uid.
//
// This app has no backend, so "your orders", "your menu" and so on live in
// localStorage under `tc:data:<uid>:<name>`. The point of the namespace is that
// a freshly created account starts genuinely empty instead of inheriting the
// seeded demo records every other account could see.
//
// Same caveat as the role in AuthContext: this is per-browser convenience, not
// a security boundary and not durable storage. Swap these three functions for
// real HTTP calls when there is a server to talk to.

const key = (uid, name) => `tc:data:${uid}:${name}`

export function readAccount(uid, name, fallback) {
  if (!uid) return fallback
  try {
    const raw = localStorage.getItem(key(uid, name))
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    // Corrupt JSON or private browsing -- behave like a new account.
    return fallback
  }
}

export function writeAccount(uid, name, value) {
  if (!uid) return value
  try {
    localStorage.setItem(key(uid, name), JSON.stringify(value))
  } catch {
    /* quota or private browsing -- the in-memory value still stands */
  }
  return value
}

export function updateAccount(uid, name, fallback, mutate) {
  return writeAccount(uid, name, mutate(readAccount(uid, name, fallback)))
}
