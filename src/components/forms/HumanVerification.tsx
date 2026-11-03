import { useEffect, useRef } from 'react'

export const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || ''

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  remove: (id: string) => void
}

export function HumanVerification({ onVerified }: { onVerified: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const onVerifiedRef = useRef(onVerified)
  onVerifiedRef.current = onVerified

  useEffect(() => {
    if (!turnstileSiteKey || !containerRef.current) return
    const getTurnstile = () => (window as Window & { turnstile?: Turnstile }).turnstile
    let active = true
    const renderWidget = () => {
      const api = getTurnstile()
      if (!active || !api || !containerRef.current || widgetId.current) return
      widgetId.current = api.render(containerRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token: string) => onVerifiedRef.current(token),
        'expired-callback': () => onVerifiedRef.current(''),
        'error-callback': () => onVerifiedRef.current(''),
      })
    }

    let script = document.getElementById('myr-turnstile-script') as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = 'myr-turnstile-script'
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.addEventListener('load', renderWidget, { once: true })
      document.head.append(script)
    } else if (getTurnstile()) renderWidget()
    else script.addEventListener('load', renderWidget, { once: true })

    return () => {
      active = false
      const api = getTurnstile()
      if (api && widgetId.current) api.remove(widgetId.current)
      widgetId.current = null
    }
  }, [])

  return <div>{turnstileSiteKey ? <div ref={containerRef} aria-label="Human verification" /> : <p className="text-xs text-amber-800">Human verification is unavailable until site keys are configured.</p>}</div>
}
