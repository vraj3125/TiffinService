// Opaque query strings.
//
// Instead of /login?tab=signup&role=provider the app links to /login?d=<token>,
// where the token is the params object, JSON-encoded, masked with a keystream
// derived from a shared secret + a random nonce, then base64url'd. A fresh nonce
// per link means the same params never produce the same token twice, so the URL
// gives nothing away at a glance and cannot be pattern-matched from history.
//
// IMPORTANT: this is obfuscation, not confidentiality. The secret ships inside
// the JS bundle, so anyone willing to read the bundle can decode a token. Use it
// to keep navigation details out of plain sight -- never to carry anything that
// actually needs protecting (ids, prices, permissions). The server/Firebase rules
// remain the only real authority on what a user may do.

const SECRET = import.meta.env.VITE_URL_PARAM_SECRET || 'tiffinconnect-url-v1'

// Bumped if the token layout ever changes, so old links decode to null instead
// of silently producing garbage params.
const VERSION = 1

// Query key the token travels under. Short and meaningless on purpose.
export const PARAM_KEY = 'd'

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const secretBytes = encoder.encode(SECRET)

const toBase64Url = (bytes) => {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const fromBase64Url = (text) => {
  const normalized = text.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

// Symmetric: the keystream depends only on the nonce, the secret and the byte
// position, never on the data, so the same function both masks and unmasks.
const mask = (bytes, nonce) => {
  const out = new Uint8Array(bytes.length)
  let roll = nonce
  for (let i = 0; i < bytes.length; i += 1) {
    roll = (roll * 31 + secretBytes[i % secretBytes.length] + i) & 0xff
    out[i] = bytes[i] ^ roll
  }
  return out
}

const checksum = (bytes) => {
  let sum = 0
  for (const byte of bytes) sum = (sum + byte) & 0xff
  return sum
}

/**
 * Encode a params object into a single opaque token.
 * @param {Record<string, unknown>} params
 * @returns {string} base64url token, safe to drop straight into a query string
 */
export function encodeParams(params) {
  const plain = encoder.encode(JSON.stringify(params))
  const nonce = Math.floor(Math.random() * 256)
  const payload = mask(plain, nonce)

  const token = new Uint8Array(payload.length + 3)
  token[0] = VERSION
  token[1] = nonce
  token[2] = checksum(plain)
  token.set(payload, 3)
  return toBase64Url(token)
}

/**
 * Decode a token produced by encodeParams.
 * Returns {} for anything malformed, tampered with, or from an older version --
 * a bad link should quietly fall back to defaults, never throw at render time.
 * @param {string | null | undefined} token
 * @returns {Record<string, unknown>}
 */
export function decodeParams(token) {
  if (!token) return {}
  try {
    const bytes = fromBase64Url(token)
    if (bytes.length < 4 || bytes[0] !== VERSION) return {}

    const plain = mask(bytes.subarray(3), bytes[1])
    if (checksum(plain) !== bytes[2]) return {}

    const parsed = JSON.parse(decoder.decode(plain))
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

/**
 * Build a link with its params hidden behind a token.
 * securePath('/login', { tab: 'signup', role: 'provider' })
 *   -> '/login?d=AR2Yr9K3ge_1s4vQ'
 * @param {string} path
 * @param {Record<string, unknown>} [params]
 */
export function securePath(path, params) {
  if (!params || Object.keys(params).length === 0) return path
  return `${path}?${PARAM_KEY}=${encodeParams(params)}`
}
