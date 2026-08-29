import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Smartphone,
  Utensils,
} from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import GoogleIcon from '../components/ui/GoogleIcon.jsx'
import IndiaFlag from '../components/ui/IndiaFlag.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { authErrorMessage } from '../lib/firebase.js'
import { PARAM_KEY, decodeParams } from '../lib/secureParams.js'
import { CITY, VADODARA_AREAS, NEARBY_TOWNS } from '../config/locations.js'

const inputClass =
  'w-full min-h-[56px] rounded-DEFAULT border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface placeholder:text-outline focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all'

const RESEND_SECONDS = 30

// TiffinConnect operates in India only, so the dial code is fixed rather than
// being a free-text field -- that also removes the "+91 typed twice" mistake.
const DIAL_CODE = '+91'
const CC_DIGITS = '91'

export default function LoginPage() {
  const [params] = useSearchParams()
  // Intent arrives as one opaque token (?d=...) rather than readable tab/role
  // pairs -- see lib/secureParams.js. A missing or tampered token decodes to {},
  // which lands on the plain customer login.
  const intent = decodeParams(params.get(PARAM_KEY))
  const [mode, setMode] = useState(intent.tab === 'signup' ? 'signup' : 'login')
  const [role, setRole] = useState(intent.role === 'provider' ? 'provider' : 'customer')
  const [method, setMethod] = useState('email') // 'email' | 'phone'
  const [otpSent, setOtpSent] = useState(false)

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', area: '' })
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')

  // Set when a signup hits an email that already has an account.
  const [existingAccount, setExistingAccount] = useState(null)
  const [busy, setBusy] = useState(null) // 'email' | 'google' | 'otp' | 'verify'
  const [secondsLeft, setSecondsLeft] = useState(0)

  const {
    signupWithEmail,
    loginWithEmail,
    loginWithGoogle,
    sendOtp,
    verifyOtp,
    isFirebaseConfigured,
  } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const otpInputRef = useRef(null)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  // Resend cooldown so users cannot hammer the SMS quota.
  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  useEffect(() => {
    if (otpSent) otpInputRef.current?.focus()
  }, [otpSent])

  const landFor = (r) => (r === 'provider' ? '/provider/dashboard' : '/discover')

  const goToLoginTab = () => {
    setMode('login')
    setMethod('email')
    setForm((f) => ({ ...f, password: '', confirmPassword: '', name: '' }))
    navigate('/login', { replace: true })
  }

  // --- email + password ----------------------------------------------------
  const onSubmitEmail = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      showToast('Enter your email and password', 'info')
      return
    }
    if (mode === 'signup') {
      if (role === 'provider' && !form.area) {
        showToast('Choose the area your kitchen cooks in', 'info')
        return
      }
      if (form.password !== form.confirmPassword) {
        showToast('Passwords do not match', 'info')
        return
      }
      if (form.password.length < 6) {
        showToast('Password must be at least 6 characters', 'info')
        return
      }
    }

    setBusy('email')
    try {
      if (mode === 'signup') {
        const { verificationSent } = await signupWithEmail({
          name: form.name,
          email: form.email,
          password: form.password,
          role,
          area: role === 'provider' ? form.area : '',
        })
        // Account created but deliberately signed out -> back to the login tab.
        goToLoginTab()
        showToast(
          verificationSent
            ? 'Account created! We sent a verification link to your email. Please log in.'
            : 'Account created! Please log in to continue.'
        )
      } else {
        const { role: resolved } = await loginWithEmail({
          email: form.email,
          password: form.password,
          role,
        })
        showToast(`Welcome back! You are logged in as a ${resolved}.`)
        navigate(landFor(resolved))
      }
    } catch (err) {
      // Signing up with an address that already has an account is a wrong turn,
      // not an error -- offer the way out instead of a red toast.
      if (err?.code === 'auth/email-already-in-use') {
        setExistingAccount(form.email)
      } else {
        showToast(authErrorMessage(err), 'error')
      }
    } finally {
      setBusy(null)
    }
  }

  const switchToLogin = () => {
    setExistingAccount(null)
    setMode('login')
    setMethod('email')
    setForm((f) => ({ ...f, password: '', confirmPassword: '', name: '' }))
  }

  const onForgotPassword = () => {
    const q = form.email ? `?email=${encodeURIComponent(form.email)}` : ''
    navigate(`/forgot-password${q}`)
  }

  // --- Google --------------------------------------------------------------
  const onGoogle = async () => {
    setBusy('google')
    try {
      const { role: resolved } = await loginWithGoogle(role)
      showToast(`Signed in with Google as a ${resolved}.`)
      navigate(landFor(resolved))
    } catch (err) {
      showToast(authErrorMessage(err), 'error')
    } finally {
      setBusy(null)
    }
  }

  // --- phone / OTP ---------------------------------------------------------
  // People still paste "+91 98765 43210" out of habit, so absorb the prefix
  // instead of sending Firebase a malformed number.
  const localDigits = (raw) => {
    let d = raw.replace(/\D/g, '')
    d = d.replace(/^0+/, '') // trunk prefix, e.g. 09876543210
    // Only strip the country code when a full number remains, so a genuine
    // 10-digit number that happens to start with 91 survives.
    if (d.length > 10 && d.startsWith(CC_DIGITS)) d = d.slice(CC_DIGITS.length)
    return d.slice(0, 10)
  }

  const phoneDigits = localDigits(phone)
  const fullPhone = `${DIAL_CODE}${phoneDigits}`
  // Indian mobile numbers are 10 digits starting 6-9.
  const phoneValid = /^[6-9]\d{9}$/.test(phoneDigits)

  const onSendOtp = async (e) => {
    e?.preventDefault()
    if (!phoneValid) {
      showToast('Enter a 10-digit Indian mobile number', 'info')
      return
    }
    setBusy('otp')
    try {
      await sendOtp(fullPhone)
      setOtpSent(true)
      setOtp('')
      setSecondsLeft(RESEND_SECONDS)
      showToast(
        isFirebaseConfigured ? `OTP sent to ${fullPhone}` : 'Demo mode: use OTP 123456',
        'info'
      )
    } catch (err) {
      showToast(authErrorMessage(err), 'error')
    } finally {
      setBusy(null)
    }
  }

  const onVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length < 6) {
      showToast('Enter the 6-digit OTP', 'info')
      return
    }
    setBusy('verify')
    try {
      const { role: resolved } = await verifyOtp(otp, { role, name: form.name, phone: fullPhone })
      showToast(`Mobile verified. You are logged in as a ${resolved}.`)
      navigate(landFor(resolved))
    } catch (err) {
      showToast(authErrorMessage(err), 'error')
    } finally {
      setBusy(null)
    }
  }

  const resetPhoneFlow = () => {
    setOtpSent(false)
    setOtp('')
    setSecondsLeft(0)
  }

  const busyIcon = <Loader2 size={20} className="animate-spin" />

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-surface-container blur-[100px] opacity-60 z-0 hidden md:block" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-primary-fixed blur-[120px] opacity-20 z-0 hidden md:block" />

      <main className="w-full max-w-[480px] px-2 z-10 relative">
        <div className="bg-surface-container-lowest rounded-xl ambient-shadow-lg border border-surface-variant p-8 md:p-12 w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-container flex items-center justify-center">
              <Utensils size={32} className="text-terracotta" />
            </div>
            <h1 className="text-headline-lg text-on-surface mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-body-sm text-on-surface-variant">
              {!isFirebaseConfigured
                ? 'Demo mode — add Firebase keys to enable real accounts.'
                : mode === 'login'
                  ? 'Log in to order or manage your kitchen.'
                  : 'Sign up and we will take you to the login screen.'}
            </p>
          </div>

              <div className="flex bg-surface-variant rounded-full p-1 mb-6">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 rounded-full py-2.5 text-center text-label-md transition-all ${
                    mode === 'login'
                      ? 'bg-surface-container-lowest shadow-sm text-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 rounded-full py-2.5 text-center text-label-md transition-all ${
                    mode === 'signup'
                      ? 'bg-surface-container-lowest shadow-sm text-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-8">
                <button
                  onClick={() => setRole('customer')}
                  className={`py-2.5 rounded-full text-label-md border-2 transition-colors ${
                    role === 'customer'
                      ? 'border-terracotta bg-surface-container-low text-terracotta'
                      : 'border-outline-variant text-on-surface-variant'
                  }`}
                >
                  Customer
                </button>
                <button
                  onClick={() => setRole('provider')}
                  className={`py-2.5 rounded-full text-label-md border-2 transition-colors ${
                    role === 'provider'
                      ? 'border-leaf-success bg-leaf-success/10 text-leaf-success'
                      : 'border-outline-variant text-on-surface-variant'
                  }`}
                >
                  Service Provider
                </button>
              </div>

              {method === 'phone' ? (
                <div className="space-y-5">
                  <form onSubmit={onSendOtp} className="space-y-5">
                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-2 ml-1">
                        Mobile number
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 shrink-0 min-h-[56px] px-3 rounded-DEFAULT border border-outline-variant bg-surface-container-low">
                          <IndiaFlag />
                          <span className="text-body-md text-on-surface font-semibold">
                            {DIAL_CODE}
                          </span>
                        </div>
                        <div className="relative flex-1">
                          <Smartphone
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                          />
                          <input
                            value={phone}
                            onChange={(e) => setPhone(localDigits(e.target.value))}
                            disabled={otpSent}
                            inputMode="numeric"
                            autoComplete="tel-national"
                            placeholder="9876543210"
                            className={`${inputClass} pl-12 disabled:opacity-60`}
                          />
                        </div>
                      </div>
                      {!otpSent && (
                        <p className="text-body-sm text-on-surface-variant mt-2 ml-1">
                          {phoneValid ? (
                            <>
                              We will text a 6-digit code to{' '}
                              <span className="text-on-surface font-semibold">{fullPhone}</span>
                            </>
                          ) : (
                            'Enter your 10-digit number — no country code needed.'
                          )}
                        </p>
                      )}
                    </div>

                    {!otpSent && (
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={busy === 'otp' || !phoneValid}
                      >
                        {busy === 'otp' ? (
                          <>Sending OTP {busyIcon}</>
                        ) : (
                          <>
                            Send OTP <ArrowRight size={20} />
                          </>
                        )}
                      </Button>
                    )}
                  </form>

                  {/* OTP appears below the number rather than replacing the card,
                      so the number being verified stays on screen. */}
                  {otpSent && (
                    <form
                      onSubmit={onVerifyOtp}
                      className="space-y-4 rounded-DEFAULT border border-outline-variant bg-surface-container-low p-5"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-leaf-success shrink-0" />
                        <p className="text-label-md text-on-surface">
                          Code sent to <span className="font-semibold">{fullPhone}</span>
                        </p>
                      </div>

                      <input
                        ref={otpInputRef}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="000000"
                        className={`${inputClass} text-center text-headline-lg tracking-[0.5em] font-semibold`}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={busy === 'verify' || otp.length < 6}
                      >
                        {busy === 'verify' ? (
                          <>Verifying {busyIcon}</>
                        ) : (
                          <>
                            Verify and continue <ArrowRight size={20} />
                          </>
                        )}
                      </Button>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={resetPhoneFlow}
                          className="text-on-surface-variant hover:text-terracotta text-label-md inline-flex items-center gap-1"
                        >
                          <ArrowLeft size={16} /> Change number
                        </button>
                        <button
                          type="button"
                          onClick={onSendOtp}
                          disabled={secondsLeft > 0 || busy === 'otp'}
                          className="text-terracotta hover:underline text-label-md disabled:text-on-surface-variant disabled:no-underline disabled:cursor-not-allowed"
                        >
                          {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend OTP'}
                        </button>
                      </div>
                    </form>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      resetPhoneFlow()
                      setMethod('email')
                    }}
                    className="w-full text-on-surface-variant hover:text-terracotta text-label-md inline-flex items-center justify-center gap-1"
                  >
                    <ArrowLeft size={16} /> Use email instead
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmitEmail} className="space-y-5">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-2 ml-1">
                        {role === 'provider' ? 'Business / Kitchen Name' : 'Full Name'}
                      </label>
                      <input
                        value={form.name}
                        onChange={update('name')}
                        placeholder={
                          role === 'provider' ? 'e.g. Maa Ka Swaad Tiffins' : 'e.g. Vraj Prajapati'
                        }
                        className={inputClass}
                        required
                      />
                      {role === 'provider' && (
                        <p className="text-body-sm text-on-surface-variant mt-2 ml-1">
                          You can add your phone number, address, and documents from your profile
                          after signing up.
                        </p>
                      )}
                    </div>
                  )}

                  {/* A kitchen has to say where it cooks before it can be listed.
                      More delivery areas and a radius are set later, from the
                      Plans & Areas screen. */}
                  {mode === 'signup' && role === 'provider' && (
                    <div>
                      <label htmlFor="kitchen-area" className="block text-label-md text-on-surface-variant mb-2 ml-1">
                        Where does your kitchen cook?
                      </label>
                      <select
                        id="kitchen-area"
                        value={form.area}
                        onChange={update('area')}
                        className={inputClass}
                        required
                      >
                        <option value="">Select an area</option>
                        <optgroup label={`${CITY.name} city`}>
                          {VADODARA_AREAS.map((a) => (
                            <option key={a.name} value={a.name}>
                              {a.name} — {a.pincode}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label={`Around ${CITY.name}`}>
                          {NEARBY_TOWNS.map((a) => (
                            <option key={a.name} value={a.name}>
                              {a.name} — {a.pincode}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      <p className="text-body-sm text-on-surface-variant mt-2 ml-1">
                        We currently serve {CITY.name} and the towns around it. You can add more
                        delivery areas once your account is set up.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-label-md text-on-surface-variant mb-2 ml-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                      />
                      <input
                        type="email"
                        value={form.email}
                        onChange={update('email')}
                        autoComplete="email"
                        placeholder="you@example.com"
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-label-md text-on-surface-variant mb-2 ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                      />
                      <input
                        type="password"
                        value={form.password}
                        onChange={update('password')}
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                        placeholder="••••••••"
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-2 ml-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                        />
                        <input
                          type="password"
                          value={form.confirmPassword}
                          onChange={update('confirmPassword')}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          className={`${inputClass} pl-12`}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {mode === 'login' && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-terracotta hover:underline text-label-md"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={busy === 'email'}>
                    {busy === 'email' ? (
                      <>
                        {mode === 'login' ? 'Logging in' : 'Creating account'} {busyIcon}
                      </>
                    ) : (
                      <>
                        {mode === 'login'
                          ? 'Log In'
                          : `Create ${role === 'provider' ? 'Provider' : 'Customer'} Account`}{' '}
                        <ArrowRight size={20} />
                      </>
                    )}
                  </Button>
                </form>
              )}

              <div className="flex items-center gap-4 my-6">
                <div className="h-px flex-1 bg-outline-variant" />
                <span className="text-body-sm text-on-surface-variant">or continue with</span>
                <div className="h-px flex-1 bg-outline-variant" />
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full !text-on-surface !border-outline-variant hover:!bg-surface-container-low"
                  onClick={onGoogle}
                  disabled={busy === 'google'}
                >
                  {busy === 'google' ? busyIcon : <GoogleIcon />} Continue with Google
                </Button>

                {method === 'email' && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="w-full !text-on-surface !border-outline-variant hover:!bg-surface-container-low"
                    onClick={() => setMethod('phone')}
                  >
                    <Smartphone size={20} className="text-terracotta" /> Continue with mobile number
                  </Button>
                )}
              </div>

              <p className="mt-6 text-center text-body-sm text-on-surface-variant">
                {mode === 'login' ? (
                  <>
                    New to TiffinConnect?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="text-terracotta hover:underline font-semibold"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="text-terracotta hover:underline font-semibold"
                    >
                      Log in
                    </button>
                  </>
                )}
              </p>

          <p className="mt-6 text-center text-body-sm text-on-surface-variant max-w-[85%] mx-auto leading-relaxed">
            By continuing, you agree to TiffinConnect&apos;s{' '}
            <a className="text-terracotta hover:underline">Terms of Service</a> and{' '}
            <a className="text-terracotta hover:underline">Privacy Policy</a>.
          </p>
        </div>

        {/* Firebase renders the invisible reCAPTCHA challenge here. */}
        <div id="recaptcha-container" />

        <Modal
          open={Boolean(existingAccount)}
          onClose={() => setExistingAccount(null)}
          title="You already have an account"
          footer={
            <>
              <Button variant="ghost" onClick={() => setExistingAccount(null)}>
                Use another email
              </Button>
              <Button onClick={switchToLogin}>
                Log in instead <ArrowRight size={18} />
              </Button>
            </>
          }
        >
          <p className="text-body-md text-on-surface-variant mb-4">
            <span className="text-on-surface font-semibold">{existingAccount}</span> is already
            registered, so there is no need to sign up again.
          </p>
          <p className="text-body-md text-on-surface-variant">
            Log in with your password, or{' '}
            <button
              type="button"
              onClick={() => {
                setExistingAccount(null)
                navigate(`/forgot-password?email=${encodeURIComponent(existingAccount)}`)
              }}
              className="text-terracotta font-semibold hover:underline"
            >
              reset it
            </button>{' '}
            if you have forgotten it.
          </p>
        </Modal>
      </main>
    </div>
  )
}
