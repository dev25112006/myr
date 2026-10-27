import { CountUp, Reveal } from './motion'
import { cn } from '@/lib/format'

export type Stat = { label: string; value: number; suffix?: string; decimals?: number }

/**
 * Animated stat counters. Labels come verbatim from source pages;
 * numeric targets only when they exist in the source (otherwise 0-fallback
 * with suffix — never invented).
 */
export function StatCounters({
  stats,
  tone = 'dark',
  className,
}: {
  stats: Stat[]
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4', className)}>
      {stats.map((s, i) => (
        <Reveal
          key={s.label}
          delay={i * 0.08}
          className={cn(
            'rounded-3xl border p-5 text-center sm:p-7',
            tone === 'light'
              ? 'border-ink-900/8 bg-white shadow-[0_24px_60px_-45px_rgb(2_6_23/0.5)]'
              : 'border-line bg-ink-950/[0.04]',
          )}
        >
          <div
            className={cn(
              'font-display text-4xl font-bold sm:text-5xl',
              tone === 'light' ? 'text-ink-900' : 'text-ink-950',
            )}
          >
            <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals} />
          </div>
          <div
            className={cn(
              'mt-2 text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm',
              tone === 'light' ? 'text-ink-500' : 'text-ink-400',
            )}
          >
            {s.label}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
