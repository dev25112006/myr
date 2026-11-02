import { cn } from '@/lib/format'
import type { Status } from './types'

/**
 * Honesty labels. Every simulated dashboard on these pages wears
 * <DemoBadge/> so nobody mistakes sample data for a production screen.
 */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-flame-400/40 bg-flame-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-flame-600',
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-flame-500" />
      Demo data
    </span>
  )
}

/** live = shipped in MYR today · scope = configurable implementation scope. */
export function StatusChip({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]',
        status === 'live' ? 'bg-emerald-50 text-emerald-700' : 'bg-paper text-ink-500',
        className,
      )}
    >
      <span aria-hidden className={cn('size-1.5 rounded-full', status === 'live' ? 'bg-emerald-500' : 'bg-ink-300')} />
      {status === 'live' ? 'Live' : 'Scope'}
    </span>
  )
}

export function StatusLegend({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-500', className)}>
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
        Live — built and running in the MYR product
      </span>
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="size-1.5 rounded-full bg-ink-300" />
        Scope — configured per institution with MYR
      </span>
    </div>
  )
}
