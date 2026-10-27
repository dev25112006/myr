import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ModalShell } from '../ModalShell'
import { useAuth, usePopup } from '@/lib/stores'

/**
 * Login / Register popup — source: Elementor popup id 2975 (WooCommerce auth).
 * Accounts are verified by the server; passwords are never stored in the browser.
 */
export function LoginRegisterPopup() {
  const { setOpen } = usePopup()
  const { login, register } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')

  const onLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password) {
      setError('Please enter your username or email address and password.')
      return
    }
    setError('')
    try { await login(identifier.trim(), password); setDone(`Signed in as ${identifier.trim()}.`) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to sign in.') }
  }

  const onRegister = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 12) { setError('Use a password with at least 12 characters.'); return }
    setError('')
    try { await register(email.trim(), password); setDone(`Account created for ${email.trim()}.`) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to create account.') }
  }

  return (
    <ModalShell id="login" title={tab === 'login' ? 'Login' : 'Register'}>
      {done ? (
        <div>
          <p className="rounded-xl border border-accent-400/30 bg-accent-400/10 p-4 text-sm text-accent-600">
            {done}
          </p>
          <button
            type="button"
            data-modal-first
            onClick={() => setOpen(null)}
            className="btn btn-primary btn-md mt-5 w-full"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-full border border-line bg-ink-950/[0.04] p-1">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                type="button"
                data-modal-first={t === 'login' ? '' : undefined}
                onClick={() => {
                  setTab(t)
                  setError('')
                }}
                className={
                  tab === t
                    ? 'rounded-full bg-accent-400 px-4 py-2.5 text-sm font-semibold text-ink-950'
                    : 'rounded-full px-4 py-2.5 text-sm font-medium text-ink-300 hover:text-accent-600'
                }
              >
                {t === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-flame-500/40 bg-flame-500/10 px-3 py-2 text-sm text-flame-600">
              {error}
            </p>
          )}

          {tab === 'login' ? (
            <form onSubmit={onLogin} className="space-y-4" noValidate>
              <div>
                <label className="label" htmlFor="lg-user">
                  Username or email address <span className="text-flame-600">*</span>{' '}
                  <span className="text-[11px] font-normal text-ink-400">Required</span>
                </label>
                <input
                  id="lg-user"
                  className="input"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="label" htmlFor="lg-pass">
                  Password <span className="text-flame-600">*</span>{' '}
                  <span className="text-[11px] font-normal text-ink-400">Required</span>
                </label>
                <input
                  id="lg-pass"
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-ink-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 accent-[var(--color-accent-400)]"
                />
                Remember me
              </label>
              <button type="submit" className="btn btn-primary btn-md w-full">
                Log in
              </button>
              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/my-account/"
                  onClick={() => setOpen(null)}
                  className="text-ink-300 hover:text-accent-600"
                >
                  My account
                </Link>
                <Link
                  to="/my-account/lost-password/"
                  onClick={() => setOpen(null)}
                  className="text-ink-300 hover:text-accent-600"
                >
                  Lost your password?
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={onRegister} className="space-y-4" noValidate>
              <div>
                <label className="label" htmlFor="rg-email">
                  Email address <span className="text-flame-600">*</span>{' '}
                  <span className="text-[11px] font-normal text-ink-400">Required</span>
                </label>
                <input
                  id="rg-email"
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="label" htmlFor="rg-pass">Password <span className="text-flame-600">*</span></label>
                <input id="rg-pass" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={12} required />
              </div>
              <p className="text-xs leading-relaxed text-ink-400">
                Use at least 12 characters. Your password is stored as a one-way hash.
              </p>
              <p className="text-xs leading-relaxed text-ink-400">
                Your personal data will be used to support your experience throughout this website,
                to manage access to your account, and for other purposes described in our{' '}
                <Link
                  to="/privacy-policy/"
                  onClick={() => setOpen(null)}
                  className="text-accent-600 underline"
                >
                  privacy policy
                </Link>
                .
              </p>
              <button type="submit" className="btn btn-primary btn-md w-full">
                Register
              </button>
            </form>
          )}
          <p className="mt-4 text-center text-[11px] text-ink-400">
            Secure server-backed account access.
          </p>
        </>
      )}
    </ModalShell>
  )
}
