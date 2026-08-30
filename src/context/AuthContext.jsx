import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  confirmPasswordReset,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase.js'
import { writeAccount } from '../lib/accountStore.js'
import { findLocation, DEFAULT_RADIUS_KM } from '../config/locations.js'
import { isAdminEmail } from '../config/admin.js'

const AuthContext = createContext(null)

// Firebase has no concept of an app role, and adding one properly needs custom
// claims set from a trusted server. Until this app has a backend the role lives
// in localStorage, keyed by uid -- fine for routing the UI, NOT a security
// boundary. See AUTH_SETUP.md.
const roleKey = (uid) => `tc:role:${uid}`
const nameKey = (uid) => `tc:name:${uid}`

function readRole(uid) {
  try {
    return localStorage.getItem(roleKey(uid)) || null
  } catch {
    return null
  }
}

function persist(uid, role, name) {
  try {
    if (role) localStorage.setItem(roleKey(uid), role)
    if (name) localStorage.setItem(nameKey(uid), name)
  } catch {
    /* private browsing */
  }
}

function readName(uid) {
  try {
    return localStorage.getItem(nameKey(uid)) || null
  } catch {
    return null
  }
}

// Demo mode has no Firebase to remember an account, so a signup used to vanish
// the moment it finished -- logging back in fell through to a stock name. Keep
// the demo signup keyed by email so the name you typed survives the round trip.
// Same caveat as the role above: localStorage, not a security boundary.
const demoKey = (email) => `tc:demo:${String(email).trim().toLowerCase()}`

function saveDemoAccount(email, { role, name }) {
  if (!email) return
  try {
    localStorage.setItem(demoKey(email), JSON.stringify({ role, name }))
  } catch {
    /* private browsing */
  }
}

function readDemoAccount(email) {
  if (!email) return null
  try {
    return JSON.parse(localStorage.getItem(demoKey(email)) || 'null')
  } catch {
    return null
  }
}

function toAppUser(fbUser, fallbackRole = 'customer') {
  const role = readRole(fbUser.uid) || fallbackRole
  const name =
    fbUser.displayName ||
    readName(fbUser.uid) ||
    (fbUser.phoneNumber ? fbUser.phoneNumber : fbUser.email?.split('@')[0]) ||
    'There'
  return {
    uid: fbUser.uid,
    role,
    name,
    // Convenience for the UI only -- see config/admin.js on why this is not a
    // security boundary.
    isAdmin: isAdminEmail(fbUser.email),
    email: fbUser.email || '',
    phone: fbUser.phoneNumber || '',
    photoURL: fbUser.photoURL || '',
    emailVerified: fbUser.emailVerified,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Start "loading" only when Firebase can actually restore a session.
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const confirmationRef = useRef(null)
  const recaptchaRef = useRef(null)

  useEffect(() => {
    if (!isFirebaseConfigured) return
    return onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser ? toAppUser(fbUser) : null)
      setLoading(false)
    })
  }, [])

  // --- demo fallback: keeps the app clickable before keys are pasted --------
  const demoLogin = ({ role, name, email, phone }) => {
    // Prefer what the person actually typed. Falling back to a stock business
    // name meant signing in as "narushi" greeted you as someone else entirely.
    const saved = readDemoAccount(email)
    const resolvedRole = role || saved?.role || 'customer'
    const resolvedName =
      name?.trim() ||
      saved?.name ||
      email?.split('@')[0] ||
      phone ||
      (resolvedRole === 'provider' ? 'Your Kitchen' : 'There')

    if (resolvedRole === 'provider' && saved?.area) {
      seedKitchen('demo', { name: resolvedName, area: saved.area })
    }

    setUser({
      uid: 'demo',
      role: resolvedRole,
      name: resolvedName,
      isAdmin: isAdminEmail(email),
      email: email || '',
      phone: phone || '',
      photoURL: '',
      emailVerified: true,
    })
    return resolvedRole
  }

  // --- email + password ----------------------------------------------------
  // Creates the account, then deliberately signs out so the user lands back on
  // the login screen, as requested.
  // A kitchen picks its area during signup, so seed its profile and first
  // service zone from that rather than leaving both blank.
  const seedKitchen = (uid, { name, area }) => {
    if (!uid || !area) return
    const place = findLocation(area)
    writeAccount(uid, 'kitchenProfile', {
      name: name || '',
      area,
      pincode: place?.pincode || '',
      lat: place?.lat ?? null,
      lng: place?.lng ?? null,
      radiusKm: DEFAULT_RADIUS_KM,
      owner: '',
      address: '',
      phone: '',
      fssai: '',
    })
    writeAccount(uid, 'zones', [area])
  }

  const signupWithEmail = async ({ name, email, password, role, area }) => {
    if (!isFirebaseConfigured) {
      // Mirror Firebase's behaviour so the caller handles a repeat signup the
      // same way in both modes.
      if (readDemoAccount(email)) {
        const e = new Error('That email already has an account.')
        e.code = 'auth/email-already-in-use'
        throw e
      }
      saveDemoAccount(email, { role, name, area })
      return { verificationSent: false }
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (name) await updateProfile(cred.user, { displayName: name })
    persist(cred.user.uid, role, name)
    if (role === 'provider') seedKitchen(cred.user.uid, { name, area })

    let verificationSent = false
    try {
      await sendEmailVerification(cred.user)
      verificationSent = true
    } catch {
      // Non-fatal: the account exists either way, so don't fail the signup.
    }

    await signOut(auth)
    return { verificationSent }
  }

  const loginWithEmail = async ({ email, password, role }) => {
    if (!isFirebaseConfigured) {
      // Honour the role the account signed up with, not the tab that happens to
      // be selected -- otherwise a provider lands on the customer side.
      const resolved = demoLogin({ role: readDemoAccount(email)?.role || role, email })
      return { role: resolved }
    }
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const resolved = readRole(cred.user.uid) || role
    persist(cred.user.uid, resolved, cred.user.displayName)
    setUser(toAppUser(cred.user, resolved))
    return { role: resolved }
  }

  // --- password reset ------------------------------------------------------
  //
  // Firebase mails a one-time code (its oobCode) inside a link. Point the
  // Authentication > Templates > Password reset "action URL" at
  // <your-domain>/reset-password and the link lands on our own screens, where
  // verifyResetCode/completeReset finish the job. Without that console setting
  // the mail still works, it just uses Firebase's own reset page.
  const resetPassword = async (email) => {
    if (!isFirebaseConfigured) {
      const e = new Error('Password reset needs Firebase configured.')
      e.code = 'auth/operation-not-supported-in-this-environment'
      throw e
    }
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    })
  }

  // Confirms the code is real and unexpired, and tells us whose account it is.
  const verifyResetCode = async (code) => {
    if (!isFirebaseConfigured) throw new Error('Password reset needs Firebase configured.')
    return verifyPasswordResetCode(auth, code)
  }

  const completeReset = async (code, newPassword) => {
    if (!isFirebaseConfigured) throw new Error('Password reset needs Firebase configured.')
    await confirmPasswordReset(auth, code, newPassword)
  }

  // --- Google --------------------------------------------------------------
  const loginWithGoogle = async (role) => {
    if (!isFirebaseConfigured) {
      demoLogin({ role, name: 'Google User', email: 'google.user@example.com' })
      return { role }
    }
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const cred = await signInWithPopup(auth, provider)
    const resolved = readRole(cred.user.uid) || role
    persist(cred.user.uid, resolved, cred.user.displayName)
    setUser(toAppUser(cred.user, resolved))
    return { role: resolved }
  }

  // --- phone / OTP ---------------------------------------------------------
  const clearRecaptcha = () => {
    if (recaptchaRef.current) {
      try {
        recaptchaRef.current.clear()
      } catch {
        /* already torn down */
      }
      recaptchaRef.current = null
    }
  }

  // `phone` must already be in E.164 form, e.g. +919876543210
  const sendOtp = async (phone, containerId = 'recaptcha-container') => {
    if (!isFirebaseConfigured) {
      confirmationRef.current = 'demo'
      return
    }
    // A verifier can only be solved once, so rebuild it for every send.
    clearRecaptcha()
    recaptchaRef.current = new RecaptchaVerifier(auth, containerId, { size: 'invisible' })
    try {
      confirmationRef.current = await signInWithPhoneNumber(auth, phone, recaptchaRef.current)
    } catch (err) {
      clearRecaptcha()
      throw err
    }
  }

  const verifyOtp = async (code, { role, name, phone } = {}) => {
    if (!isFirebaseConfigured) {
      if (code !== '123456') {
        const e = new Error('Demo mode: use OTP 123456')
        e.code = 'auth/invalid-verification-code'
        throw e
      }
      const resolved = demoLogin({ role, name, phone })
      return { role: resolved }
    }
    if (!confirmationRef.current) {
      const e = new Error('Request an OTP first.')
      e.code = 'auth/missing-phone-number'
      throw e
    }
    const cred = await confirmationRef.current.confirm(code)
    const resolved = readRole(cred.user.uid) || role
    persist(cred.user.uid, resolved, name || cred.user.displayName)
    if (name && !cred.user.displayName) {
      await updateProfile(cred.user, { displayName: name }).catch(() => {})
    }
    clearRecaptcha()
    confirmationRef.current = null
    setUser(toAppUser(cred.user, resolved))
    return { role: resolved }
  }

  const logout = async () => {
    clearRecaptcha()
    confirmationRef.current = null
    if (isFirebaseConfigured) await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        verifyResetCode,
        completeReset,
        login: demoLogin,
        signupWithEmail,
        loginWithEmail,
        loginWithGoogle,
        resetPassword,
        sendOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
