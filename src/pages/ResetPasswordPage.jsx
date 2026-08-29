import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Loader2, Lock, ShieldAlert, ShieldCheck } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { authErrorMessage } from '../lib/firebase.js'

const inputClass =
  'w-full min-h-[56px] rounded-DEFAULT border border-outline-variant bg-surface px-4 py-3 pl-12 text-body-md text-on-surface placeholder:text-outline focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all'

// Where the user lands from the verification link in their email. The one-time
// code Firebase puts in that link is what proves they own the address, so this
// page verifies it before showing the password fields rather than trusting it.
export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const { verifyResetCode, completeReset } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const code = params.get('oobCode') || ''
  const [status, setStatus] = useState('checking') // checking | ready | invalid | done
  const [accountEmail, setAccountEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!code) {
      setStatus('invalid')
      return
    }
    let live = true
    verifyResetCode(code)
      .then((email) => {
        if (!live) return
        setAccountEmail(email)
        setStatus('ready')
      })
      .catch(() => live && setStatus('invalid'))
    return () => {
      live = false
    }
  }, [code, verifyResetCode])

  // Send them on to the login screen shortly after success.
  useEffect(() => {
    if (status !== 'done') return
    const t = setTimeout(() => navigate('/login', { replace: true }), 2500)
    return () => clearTimeout(t)
  }, [status, navigate])

  const submit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'info')
      return
    }
    if (password !== confirm) {
      showToast('Passwords do not match', 'info')
      return
    }
    setBusy(true)
    try {
      await completeReset(code, password)
      setStatus('done')
      showToast('Password changed. You can log in now.')
    } catch (err) {
      showToast(authErrorMessage(err), 'error')
      setBusy(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <main className="w-full max-w-[480px]">
        <div className="bg-surface-container-lowest rounded-xl ambient-shadow-lg border border-surface-variant p-8 md:p-12">
          {status === 'checking' && (
            <div className="text-center py-8">
              <Loader2 size={32} className="text-terracotta animate-spin mx-auto mb-4" />
              <p className="text-body-md text-on-surface-variant">Checking your link…</p>
            </div>
          )}

          {status === 'invalid' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error-container flex items-center justify-center">
                <ShieldAlert size={32} className="text-on-error-container" />
              </div>
              <h1 className="text-headline-lg text-on-surface mb-2">This link has expired</h1>
              <p className="text-body-sm text-on-surface-variant mb-8">
                Reset links work once and last an hour. Ask for a fresh one and it will arrive in a
                moment.
              </p>
              <Button as={Link} to="/forgot-password" className="w-full" size="lg">
                Send a new link <ArrowRight size={20} />
              </Button>
            </div>
          )}

          {status === 'done' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-leaf-success/10 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-leaf-success" />
              </div>
              <h1 className="text-headline-lg text-on-surface mb-2">Password changed</h1>
              <p className="text-body-sm text-on-surface-variant mb-8">
                Taking you to the login screen…
              </p>
              <Button as={Link} to="/login" className="w-full" size="lg">
                Log in now <ArrowRight size={20} />
              </Button>
            </div>
          )}

          {status === 'ready' && (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-container flex items-center justify-center">
                  <ShieldCheck size={32} className="text-leaf-success" />
                </div>
                <h1 className="text-headline-lg text-on-surface mb-2">Choose a new password</h1>
                <p className="text-body-sm text-on-surface-variant">
                  Verified for{' '}
                  <span className="text-on-surface font-semibold break-all">{accountEmail}</span>
                </p>
              </div>

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label htmlFor="new-password" className="block text-label-md text-on-surface-variant mb-2 ml-1">
                    New password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-label-md text-on-surface-variant mb-2 ml-1">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      autoComplete="new-password"
                      placeholder="Type it again"
                      className={inputClass}
                      required
                    />
                  </div>
                  {confirm && password !== confirm && (
                    <p className="text-body-sm text-error mt-2 ml-1">Passwords do not match yet.</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={busy}>
                  {busy ? (
                    <>Saving <Loader2 size={20} className="animate-spin" /></>
                  ) : (
                    <>Set new password <ArrowRight size={20} /></>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
