import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// The app stays usable before anyone pastes real keys: when the env vars are
// missing we skip Firebase entirely and AuthContext falls back to demo mode.
export const isFirebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId
)

let auth = null

// Resolves once persistence is actually configured. setPersistence is async: a
// sign-in that races ahead of it can be stored in memory only, which logs the
// user out on the next refresh. Every sign-in awaits this first.
let authReady = Promise.resolve()

if (isFirebaseConfigured) {
  const app = initializeApp(config)
  auth = getAuth(app)
  // Keep the session across reloads and tabs instead of only in memory.
  authReady = setPersistence(auth, browserLocalPersistence).catch((err) => {
    // Swallowing this used to hide the cause of surprise logouts. Say it out
    // loud -- it happens when the browser blocks site data.
    console.warn(
      '[auth] Persistent sessions unavailable, you will be signed out on refresh:',
      err?.code || err?.message || err
    )
  })
}

export { auth, authReady }

// Firebase error codes are not something a customer should ever read.
const messages = {
  'auth/email-already-in-use': 'That email already has an account. Try logging in instead.',
  'auth/invalid-email': 'That email address does not look right.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/user-not-found': 'No account found for that email. Sign up first.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
  'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
  'auth/popup-blocked': 'Your browser blocked the popup. Allow popups and try again.',
  'auth/account-exists-with-different-credential':
    'That email is already registered with a different sign-in method.',
  'auth/invalid-phone-number': 'Enter a valid 10-digit mobile number.',
  'auth/missing-phone-number': 'Enter your mobile number first.',
  'auth/quota-exceeded': 'SMS quota exceeded for today. Try again tomorrow.',
  'auth/invalid-verification-code': 'That OTP is incorrect. Check and try again.',
  'auth/code-expired': 'That OTP has expired. Request a new one.',
  'auth/operation-not-allowed':
    'This sign-in method is not enabled in the Firebase console yet.',
  'auth/unauthorized-domain': 'This domain is not authorised in the Firebase console.',
  'auth/network-request-failed': 'Network error. Check your connection and retry.',
}

export function authErrorMessage(error) {
  return messages[error?.code] || error?.message || 'Something went wrong. Please try again.'
}
