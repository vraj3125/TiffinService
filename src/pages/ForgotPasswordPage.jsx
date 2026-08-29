import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, KeyRound, Loader2, Mail, MailCheck } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { authErrorMessage } from '../lib/firebase.js'
import { COMPANY } from '../config/company.js'

const inputClass =
  'w-full min-h-[56px] rounded-DEFAULT border border-outline-variant bg-surface px-4 py-3 pl-12 text-body-md text-on-surface placeholder:text-outline focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all'

const RESEND_SECONDS = 45

export default function ForgotPasswordPage() {
  const [params] = useSearchParams()
  const { resetPassword, isFirebaseConfigured } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [email, setEmail] = useState(params.get('email') || '')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  const send = async (e) => {
    e?.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast('Enter the email address on your account', 'info')
      return
    }
    setBusy(true)
    try {
      await resetPassword(email)
      setSent(true)
      setSecondsLeft(RESEND_SECONDS)
    } catch (err) {
      showToast(authErrorMessage(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <main className="w-full max-w-[480px]">
        <div className="bg-surface-container-lowest rounded-xl ambient-shadow-lg border border-surface-variant p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-container flex items-center justify-center">
              {sent ? (
                <MailCheck size={32} className="text-leaf-success" />
              ) : (
                <KeyRound size={32} className="text-terracotta" />
              )}
            </div>
            <h1 className="text-headline-lg text-on-surface mb-2">
              {sent ? 'Check your inbox' : 'Reset your password'}
            </h1>
            <p className="text-body-sm text-on-surface-variant">
              {sent
                ? 'We sent a verification link to your email. Open it to choose a new password.'
                : 'Enter the email on your account and we will send you a verification link.'}
            </p>
          </div>

          {!isFirebaseConfigured && (
            <p className="mb-6 rounded-DEFAULT border border-outline-variant bg-surface-container-low p-4 text-body-sm text-on-surface-variant">
              Password reset sends a real email, so it needs the app connected to Firebase. Contact{' '}
              <a href={`mailto:${COMPANY.supportEmail}`} className="text-terracotta hover:underline">
                {COMPANY.supportEmail}
              </a>{' '}
              and we will reset it for you.
            </p>
          )}

          {sent ? (
            <div className="space-y-5">
              <div className="rounded-DEFAULT border border-outline-variant bg-surface-container-low p-5">
                <p className="text-body-sm text-on-surface-variant mb-1">Sent to</p>
                <p className="text-label-lg text-on-surface break-all">{email}</p>
              </div>

              <ol className="space-y-3 text-body-sm text-on-surface-variant">
                <li className="flex gap-3">
                  <span className="text-terracotta font-semibold shrink-0">1.</span>
                  Open the email from us — check spam if it is not there within a minute.
                </li>
                <li className="flex gap-3">
                  <span className="text-terracotta font-semibold shrink-0">2.</span>
                  Tap the verification link. It expires in an hour and works once.
                </li>
                <li className="flex gap-3">
                  <span className="text-terracotta font-semibold shrink-0">3.</span>
                  Choose a new password, confirm it, and log in.
                </li>
              </ol>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-on-surface-variant hover:text-terracotta text-label-md inline-flex items-center gap-1"
                >
                  <ArrowLeft size={16} /> Change email
                </button>
                <button
                  type="button"
                  onClick={send}
                  disabled={secondsLeft > 0 || busy}
                  className="text-terracotta hover:underline text-label-md disabled:text-on-surface-variant disabled:no-underline disabled:cursor-not-allowed"
                >
                  {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend link'}
                </button>
              </div>

              <Button className="w-full" size="lg" onClick={() => navigate('/login')}>
                Back to log in <ArrowRight size={20} />
              </Button>
            </div>
          ) : (
            <form onSubmit={send} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="block text-label-md text-on-surface-variant mb-2 ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={busy}>
                {busy ? (
                  <>Sending <Loader2 size={20} className="animate-spin" /></>
                ) : (
                  <>Send verification link <ArrowRight size={20} /></>
                )}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-body-sm text-on-surface-variant">
            Remembered it?{' '}
            <Link to="/login" className="text-terracotta hover:underline font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
