import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase.js'

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
  const demoLogin = ({ role, name, email }) => {
    setUser({
      uid: 'demo',
      role,
      name: name || (role === 'customer' ? 'Vraj Prajapati' : 'Maa Ka Swaad Tiffins'),
      email: email || '',
      phone: '',
      photoURL: '',
      emailVerified: true,
    })
  }

  // --- email + password ----------------------------------------------------
  // Creates the account, then deliberately signs out so the user lands back on
  // the login screen, as requested.
  const signupWithEmail = async ({ name, email, password, role }) => {
    if (!isFirebaseConfigured) {
      return { verificationSent: false }
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (name) await updateProfile(cred.user, { displayName: name })
    persist(cred.user.uid, role, name)

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
      demoLogin({ role, email })
      return { role }
    }
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const resolved = readRole(cred.user.uid) || role
    persist(cred.user.uid, resolved, cred.user.displayName)
    setUser(toAppUser(cred.user, resolved))
    return { role: resolved }
  }

  const resetPassword = async (email) => {
    if (!isFirebaseConfigured) return
    await sendPasswordResetEmail(auth, email)
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

  const verifyOtp = async (code, { role, name } = {}) => {
    if (!isFirebaseConfigured) {
      if (code !== '123456') {
        const e = new Error('Demo mode: use OTP 123456')
        e.code = 'auth/invalid-verification-code'
        throw e
      }
      demoLogin({ role, name: name || 'Mobile User' })
      return { role }
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
