import type { ReactNode } from 'react'
import { Reveal } from './motion'
import { CHAT_SUPPORT } from '@/components/layout/nav'
import { cn } from '@/lib/format'

/**
 * "Here to help 24/7" support block — copy varies per source page (props),
 * CTA links to the verified 3cx chat destination.
 */
export function SupportBlock({
  bullets,
  ctaLabel,
  ctaHref = CHAT_SUPPORT,
  image = '/assets/2024-08-Live-Support-Chat.png',
  tone = 'dark',
  heading = 'Here to help 24/7',
  className,
}: {
  bullets: ReactNode[]
  ctaLabel: string
  ctaHref?: string
  image?: string
  tone?: 'dark' | 'light'
  heading?: string
  className?: string
}) {
  const light = tone === 'light'
  return (
    <div
      className={cn(
        'grid items-center gap-10 rounded-[2rem] border p-6 sm:p-10 lg:grid-cols-2',
        light ? 'border-ink-900/10 bg-white' : 'border-line bg-ink-950/[0.04]',
        className,
      )}
    >
      <Reveal>
        <p className="eyebrow">Support</p>
        <h3 className={cn('mt-3 text-2xl font-bold sm:text-3xl', light ? 'text-ink-900' : 'text-ink-950')}>
          {heading}
        </h3>
        <ul className="mt-5 space-y-3">
          {bullets.map((b, i) => (
            <li key={i} className={cn('flex gap-3 text-sm leading-relaxed sm:text-base', light ? 'text-ink-600' : 'text-ink-300')}>
              <span className="mt-0.5 text-accent-600" aria-hidden>
                ✅
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md mt-7">
          {ctaLabel}
        </a>
      </Reveal>
      <Reveal delay={0.12} className="relative">
        <div className="absolute inset-0 rounded-full bg-accent-400/15 blur-3xl" aria-hidden />
        <img
          src={image}
          alt="Support block illustration"
          loading="lazy"
          className="relative mx-auto max-h-72 w-auto object-contain drop-shadow-[0_24px_48px_rgba(45,226,230,0.25)]"
        />
      </Reveal>
    </div>
  )
}
