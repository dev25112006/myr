import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ModalShell } from '../ModalShell'
import { useAuth, usePopup } from '@/lib/stores'
import { HumanVerification, turnstileSiteKey } from '@/components/forms/HumanVerification'

const authTurnstileRequired = import.meta.env.VITE_AUTH_TURNSTILE_REQUIRED !== 'false'

type RegisterStep = 'enter' | 'otp' | 'verified'

/**
 * Login / Register popup — source: Elementor popup id 2975 (WooCommerce auth).
 * Accounts are verified by the server; passwords are never stored in the browser.
 * Registration requires email OTP verification when EMAIL_VERIFICATION_REQUIRED is set.
 */
export function LoginRegisterPopup() {
  const { setOpen } = usePopup()
  const { login, register, otpSend, otpVerify, otpResend } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')
  const [humanToken, setHumanToken] = useState('')
  const [registerStep, setRegisterStep] = useState<RegisterStep>('enter')
  const [otpSent, setOtpSent] = useState(false)
  const [otpBusy, setOtpBusy] = useState(false)
  const [otpExpiresAt, setOtpExpiresAt] = useState(0)

  const onLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password) {
      setError('Please enter your username or email address and password.')
      return
    }
    if (authTurnstileRequired && (!turnstileSiteKey || !humanToken)) { setError('Complete human verification before signing in.'); return }
    setError('')
    try { await login(identifier.trim(), password, humanToken); setDone(`Signed in as ${identifier.trim()}.`) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to sign in.') }
  }

  const handleSendOtp = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Please enter a valid email address.'); return }
    if (password.length < 12) { setError('Use a password with at least 12 characters.'); return }
    if (authTurnstileRequired && (!turnstileSiteKey || !humanToken)) { setError('Complete human verification before creating an account.'); return }
    setError(''); setOtpBusy(true)
    try {
      await otpSend(email.trim(), 'register')
      setOtpSent(true)
      setRegisterStep('otp')
      setOtpExpiresAt(Date.now() + 600000)
      setError('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to send verification code.')
    } finally {
      setOtpBusy(false)
    }
  }

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(otpCode)) { setError('Please enter a valid 6-digit code.'); return }
    setError('')
    try {
      await otpVerify(email.trim(), otpCode, 'register')
      setRegisterStep('verified')
      setError('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Verification failed.')
    }
  }

  const handleResendOtp = async () => {
    setOtpBusy(true)
    try {
      await otpResend(email.trim(), 'register')
      setOtpExpiresAt(Date.now() + 600000)
      setError('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to resend code.')
    } finally {
      setOtpBusy(false)
    }
  }

  const formatTimeLeft = (ms: number) => {
    const totalSeconds = Math.max(0, Math.ceil((ms - Date.now()) / 1000))
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const onRegister = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Please enter a valid email address.'); return }
    if (password.length < 12) { setError('Use a password with at least 12 characters.'); return }
    if (registerStep !== 'verified') { setError('Please verify your email with the OTP code before creating an account.'); return }
    if (authTurnstileRequired && (!turnstileSiteKey || !humanToken)) { setError('Complete human verification before creating an account.'); return }
    setError('')
    try { await register(email.trim(), password, humanToken, true); setDone(`Account created for ${email.trim()}. Email is verified.`) }
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
                  setHumanToken('')
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
                  Email address <span className="text-flame-600">*</span>{' '}
                  <span className="text-[11px] font-normal text-ink-400">Required</span>
                </label>
                <input
                  id="lg-user"
                  type="email"
                  className="input"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
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
              {authTurnstileRequired && <HumanVerification onVerified={setHumanToken} />}
              <button type="submit" className="btn btn-primary btn-md w-full" disabled={authTurnstileRequired && (!turnstileSiteKey || !humanToken)}>
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
            <>
              {registerStep === 'enter' ? (
                <form onSubmit={(e) => { e.preventDefault(); void handleSendOtp() }} className="space-y-4" noValidate>
                  <div>
                    <label className="label" htmlFor="rg-email">Email address <span className="text-flame-600">*</span>{' '}
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
                  {authTurnstileRequired && <HumanVerification onVerified={setHumanToken} />}
                  <button type="submit" className="btn btn-primary btn-md w-full" disabled={otpBusy || authTurnstileRequired && (!turnstileSiteKey || !humanToken)}>
                    {otpBusy ? 'Sending code…' : 'Send Verification Code'}
                  </button>
                  {otpSent && (
                    <p className="text-xs text-ink-400 text-center">A verification code will be sent to {email}.</p>
                  )}
                </form>
              ) : registerStep === 'otp' ? (
                <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
                  <div>
                    <label className="label" htmlFor="rg-otp">Verification Code <span className="text-flame-600">*</span></label>
                    <input
                      id="rg-otp"
                      type="text"
                      className="input text-center text-xl font-mono font-bold tracking-widest"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      autoComplete="one-time-code"
                      placeholder="000000"
                      required
                    />
                  </div>
                  <p className="text-xs text-ink-400">Code expires in <span className="font-semibold">{formatTimeLeft(otpExpiresAt)}</span></p>
                  <button type="submit" className="btn btn-primary btn-md w-full" disabled={otpBusy}>
                    {otpBusy ? 'Verifying…' : 'Verify Code'}
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={otpBusy}
                    className="mt-3 text-xs font-medium text-accent-600 hover:underline w-full"
                  >
                    {otpBusy ? '' : 'Did not receive the code? Resend'}
                  </button>
                  <p className="text-xs text-center text-ink-400 mt-3">
                    <button
                      type="button"
                      onClick={() => { setRegisterStep('enter'); setOtpSent(false) }}
                      className="text-accent-600 underline hover:text-accent-600/80"
                    >
                      Change email
                    </button>
                  </p>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-accent-400/30 bg-accent-400/10 p-4 text-sm text-accent-600">
                    Email verified successfully. Now create your account.
                  </div>
                  <form onSubmit={onRegister} className="space-y-4" noValidate>
                    <div>
                      <label className="label" htmlFor="rg-pass-final">Password <span className="text-flame-600">*</span></label>
                      <input id="rg-pass-final" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={12} required />
                    </div>
                    <p className="text-xs leading-relaxed text-ink-400">
                      Use at least 12 characters. Your password is stored as a one-way hash.
                    </p>
                    {authTurnstileRequired && <HumanVerification onVerified={setHumanToken} />}
                    <button type="submit" className="btn btn-primary btn-md w-full" disabled={authTurnstileRequired && (!turnstileSiteKey || !humanToken)}>
                      Create Account
                    </button>
                  </form>
                </div>
              )}
              <p className="mt-4 text-center text-[11px] text-ink-400">
                Secure server-backed account access.
              </p>
            </>
          )}
          <p className="mt-4 text-center text-[11px] text-ink-400">
            Secure server-backed account access.
          </p>
        </>
      )}
    </ModalShell>
  )
}
