import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/format'
import type { SegmentIdentity } from '@/content/education/segments'
import type { TourLocation } from './types'

/**
 * Campus illustration with clickable location hotspots.
 * Flat, light, drawn in the site's navy line style. Subtle tilt on
 * pointer (desktop only), fully static under prefers-reduced-motion.
 */
export function CampusScene({
  locations,
  identity,
  activeId,
  visitedIds,
  onPick,
}: {
  locations: TourLocation[]
  identity: SegmentIdentity
  activeId?: string
  /** Ids already explored — shown as unlocked (green) without blocking the rest. */
  visitedIds?: string[]
  onPick: (loc: TourLocation) => void
}) {
  const reduce = useReducedMotion()

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-line bg-white">
      {/* ground */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[42%] bg-paper/70" />
      <div aria-hidden className="absolute inset-x-0 bottom-[42%] h-px bg-line" />

      {/* main building */}
      <div aria-hidden className="absolute left-[28%] top-[16%] h-[40%] w-[44%]">
        <div className="absolute inset-x-0 top-0 h-[18%] rounded-t-md bg-ink-950" />
        <div className="absolute inset-x-0 bottom-0 h-[84%] rounded-b-lg border border-line bg-white shadow-card">
          <div className="grid h-full grid-cols-4 grid-rows-3 gap-2.5 p-3.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className={cn('rounded-sm', identity.window)} />
            ))}
          </div>
        </div>
      </div>

      {/* side wings */}
      <div aria-hidden className="absolute left-[8%] top-[34%] h-[24%] w-[16%] rounded-lg border border-line bg-white shadow-card">
        <div className="grid h-full grid-cols-2 gap-2 p-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={cn('rounded-sm', identity.window)} />
          ))}
        </div>
      </div>
      <div aria-hidden className="absolute right-[8%] top-[36%] h-[22%] w-[16%] rounded-lg border border-line bg-white shadow-card">
        <div className="grid h-full grid-cols-2 gap-2 p-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={cn('rounded-sm', identity.window)} />
          ))}
        </div>
      </div>

      {/* path */}
      <div aria-hidden className="absolute bottom-0 left-[46%] h-[40%] w-[8%] rounded-t-full bg-paper" />

      {/* trees */}
      {[
        { left: '22%', bottom: '18%' },
        { left: '74%', bottom: '22%' },
        { left: '38%', bottom: '8%' },
      ].map((pos, i) => (
        <span key={i} aria-hidden className="absolute" style={pos}>
          <span className="block size-5 rounded-full bg-emerald-100" />
          <span className="mx-auto block h-2 w-1 bg-ink-200/40" />
        </span>
      ))}

      {/* hotspots */}
      {locations.map((loc, i) => {
        const active = loc.id === activeId
        const visited = visitedIds?.includes(loc.id) ?? false
        return (
          <motion.button
            key={loc.id}
            type="button"
            onClick={() => onPick(loc)}
            initial={reduce ? false : { opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 * i, duration: 0.35 }}
            className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 rounded-full"
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            aria-pressed={active}
            aria-label={`Explore ${loc.label}${visited ? ' (visited)' : ''}`}
          >
            <span className="relative flex size-8 items-center justify-center">
              {!reduce && !active && !visited && (
                <span aria-hidden className="absolute inline-flex size-full animate-pulse-ring rounded-full" />
              )}
              <span
                className={cn(
                  'relative flex size-7 items-center justify-center rounded-full text-[11px] font-bold transition group-hover:scale-110',
                  active
                    ? 'bg-ink-950 text-white'
                    : visited
                      ? 'border-2 border-emerald-600 bg-emerald-600 text-white'
                      : 'border-2 border-ink-950/25 bg-white text-ink-950 group-hover:border-ink-950',
                )}
              >
                {i + 1}
              </span>
            </span>
            <span
              className={cn(
                'mt-1.5 block whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm transition',
                active ? 'bg-ink-950 text-white' : 'bg-white text-ink-600 group-hover:text-ink-950',
              )}
            >
              {loc.label}
              {visited && !active && <span aria-hidden> ✓</span>}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
