import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/format'
import { CampusScene } from './CampusScene'
import { MissionRunner } from './MissionRunner'
import { SimDashboard } from './SimDashboard'
import { StatusChip } from './DemoBadge'
import { useTour, type TourPhase } from './useTour'
import { SEGMENTS, type SegmentId } from '@/content/education/segments'

const PHASES: { id: TourPhase; label: string }[] = [
  { id: 'intro', label: 'Welcome' },
  { id: 'campus', label: 'Campus' },
  { id: 'roles', label: 'Roles' },
  { id: 'missions', label: 'Missions' },
  { id: 'summary', label: 'Summary' },
]

/**
 * Virtual Campus tour — optional, never forced.
 * Skip, pause, restart and exit are always one click away. Esc closes,
 * focus is trapped while open and goes back to the opener on exit.
 * Progress lives in this browser only.
 */
export function TourShell({ segment }: { segment: SegmentId }) {
  const tour = useTour()
  const { state, config } = tour
  const identity = SEGMENTS[segment].identity
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!state.open) return
    openerRef.current = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        tour.close()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      } else if (!panel.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    requestAnimationFrame(() => panel?.querySelector<HTMLElement>('button, [href], input, select')?.focus())
    return () => {
      document.removeEventListener('keydown', onKey, true)
      openerRef.current?.focus?.()
    }
  }, [state.open, tour])

  if (!state.open) return null

  const activeLocation = config.locations.find((l) => l.id === state.activeLocation) ?? null
  const activeRole = config.roles.find((r) => r.id === state.activeRole) ?? null
  const runMission = config.missions.find((m) => m.id === state.runMission) ?? null

  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col bg-paper" role="dialog" aria-modal="true" aria-label={`${config.title} — demo tour`}>
      {/* toolbar */}
      <header className="flex flex-wrap items-center gap-3 border-b border-line bg-white px-4 py-3 sm:px-6">
        <p className="text-sm font-bold text-ink-950">{config.title}</p>
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Tour progress">
          {PHASES.map((p, i) => {
            const active = state.phase === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => tour.setPhase(p.id)}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'rounded-full px-3 py-1.5 text-[11px] font-semibold transition',
                  active ? 'bg-ink-950 text-white' : 'text-ink-400 hover:bg-paper hover:text-ink-900',
                )}
              >
                {i + 1}. {p.label}
              </button>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-full bg-flame-400/10 px-3 py-1.5 text-xs font-bold text-flame-600" aria-live="polite">
            {tour.xp} / {tour.totalXp} XP
          </span>
          <span className="hidden rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink-500 sm:inline">
            {state.badges.length} badge{state.badges.length === 1 ? '' : 's'}
          </span>
          <button type="button" onClick={() => tour.setPaused(!state.paused)} className="btn btn-ghost-dark btn-sm">
            {state.paused ? 'Resume' : 'Pause'}
          </button>
          <button type="button" onClick={tour.reset} className="btn btn-ghost-dark btn-sm">
            Restart
          </button>
          <button type="button" onClick={tour.close} className="btn btn-primary btn-sm">
            Skip and exit
          </button>
        </div>
      </header>

      {/* body */}
      <div ref={panelRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6" aria-live="polite">
        <div className="mx-auto max-w-5xl">
          {state.paused && (
            <p className="mb-4 rounded-xl border border-line bg-white px-4 py-3 text-center text-sm text-ink-500">
              Paused. Nothing is lost. Resume when you are ready, or exit anytime.
            </p>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={state.phase + (activeLocation?.id ?? '') + (activeRole?.id ?? '') + (runMission?.id ?? '')}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {state.phase === 'intro' && <IntroPhase />}
              {state.phase === 'campus' && <CampusPhase identity={identity} />}
              {state.phase === 'roles' && <RolesPhase />}
              {state.phase === 'missions' && <MissionsPhase />}
              {state.phase === 'summary' && <SummaryPhase onExit={tour.close} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* footer nav */}
      <footer className="flex items-center justify-between border-t border-line bg-white px-4 py-3 sm:px-6">
        <button
          type="button"
          disabled={state.phase === 'intro'}
          onClick={() => {
            const i = PHASES.findIndex((p) => p.id === state.phase)
            tour.setPhase(PHASES[Math.max(0, i - 1)].id)
          }}
          className="btn btn-ghost-dark btn-sm"
        >
          ← Back
        </button>
        <p className="hidden text-[11px] text-ink-400 sm:block">Demo data only. Nothing here is sent to MYR.</p>
        <button
          type="button"
          disabled={state.phase === 'summary'}
          onClick={() => {
            const i = PHASES.findIndex((p) => p.id === state.phase)
            tour.setPhase(PHASES[Math.min(PHASES.length - 1, i + 1)].id)
          }}
          className="btn btn-primary btn-sm"
        >
          Continue →
        </button>
      </footer>
    </div>,
    document.body,
  )
}

/* ------------------------------- phases -------------------------------- */

function IntroPhase() {
  const { config, setPhase } = useTour()
  return (
    <div className="mx-auto max-w-2xl py-10 text-center">
      <h2 className="text-3xl font-bold text-ink-950 sm:text-4xl">Welcome to the {config.title}</h2>
      <p className="mx-auto mt-4 text-ink-500">{config.intro}</p>
      <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2">
        {[
          'Click through campus departments',
          'Switch between seven real roles',
          'Run short workflows, earn XP and badges',
          'Everything stays in your browser',
        ].map((t) => (
          <li key={t} className="rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink-600">
            {t}
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => setPhase('campus')} className="btn btn-primary btn-md mt-8">
        Start the tour →
      </button>
    </div>
  )
}

function CampusPhase({ identity }: { identity: (typeof SEGMENTS)[SegmentId]['identity'] }) {
  const tour = useTour()
  const { config, state } = tour
  const active = config.locations.find((l) => l.id === state.activeLocation) ?? null

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <h2 className="text-xl font-bold text-ink-950">Explore the campus</h2>
        <p className="mt-1.5 text-sm text-ink-500">Pick any numbered building. {config.intro}</p>
        <div className="mt-4">
          <CampusScene
            locations={config.locations}
            identity={identity}
            activeId={state.activeLocation ?? undefined}
            visitedIds={state.visitedLocations}
            onPick={(loc) => tour.selectLocation(loc)}
          />
        </div>
        <p className="mt-3 text-[11px] text-ink-400">
          Visited {state.visitedLocations.length} of {config.locations.length} locations
        </p>
      </div>
      <div>
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-ink-950">{active.label}</h3>
              <StatusChip status={active.status} />
            </div>
            <ul className="space-y-2">
              {active.workflow.map((w, i) => (
                <li key={i} className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm leading-relaxed text-ink-600">
                  {w}
                </li>
              ))}
            </ul>
            <SimDashboard screen={active.screen} compact />
          </div>
        ) : (
          <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white p-8 text-center">
            <p className="text-sm text-ink-500">Select a building to see that department&apos;s workflow and a demo dashboard.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function RolesPhase() {
  const tour = useTour()
  const { config, state } = tour
  const active = config.roles.find((r) => r.id === state.activeRole) ?? null

  return (
    <div>
      <h2 className="text-xl font-bold text-ink-950">Step into a role</h2>
      <p className="mt-1.5 text-sm text-ink-500">Same records, different view. Pick one to open its dashboard.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {config.roles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => tour.pickRole(r)}
            aria-pressed={state.activeRole === r.id}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              state.activeRole === r.id
                ? 'border-ink-950 bg-ink-950 text-white'
                : 'border-line bg-white text-ink-600 hover:border-ink-950/30 hover:text-ink-950',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
      {active ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h3 className="text-lg font-bold text-ink-950">{active.label}</h3>
            <p className="mt-1 text-sm text-ink-500">{active.blurb}</p>
            <ul className="mt-4 space-y-2">
              {active.responsibilities.map((resp) => (
                <li key={resp.text} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-2.5">
                  <span className="text-sm text-ink-700">{resp.text}</span>
                  <StatusChip status={resp.status} className="shrink-0" />
                </li>
              ))}
            </ul>
          </div>
          <SimDashboard screen={active.screen} />
        </div>
      ) : (
        <div className="mt-6 flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-ink-500">
          Choose a role above to see its responsibilities and dashboard.
        </div>
      )}
    </div>
  )
}

function MissionsPhase() {
  const tour = useTour()
  const { config, state } = tour
  const runMission = config.missions.find((m) => m.id === state.runMission) ?? null

  if (runMission) {
    return (
      <div className="mx-auto max-w-2xl">
        <button type="button" onClick={() => tour.runMission(null)} className="btn btn-ghost-dark btn-sm mb-4">
          ← All missions
        </button>
        <MissionRunner mission={runMission} />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-ink-950">Interactive missions</h2>
      <p className="mt-1.5 text-sm text-ink-500">
        Short workflows on sample data. The guards are real: duplicate attendance is rejected, receipts stop at the balance, marks are
        checked against the maximum.
      </p>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {config.missions.map((m) => {
          const done = state.doneMissions.includes(m.id)
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => tour.runMission(m.id)}
                className={cn(
                  'flex h-full w-full flex-col items-start rounded-2xl border p-4 text-left transition',
                  done ? 'border-emerald-300 bg-emerald-50/50' : 'border-line bg-white hover:border-ink-950/20',
                )}
              >
                <span className="flex w-full items-center gap-2">
                  <span className="rounded-full bg-paper px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-500">{m.ordinal}</span>
                  <StatusChip status={m.status} />
                  <span className="ml-auto text-[11px] font-bold text-flame-600">+{m.xp} XP</span>
                </span>
                <span className="mt-2.5 text-sm font-bold text-ink-950">{done ? '✓ ' : ''}{m.title}</span>
                <span className="mt-1 text-xs leading-relaxed text-ink-500">{m.brief}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function SummaryPhase({ onExit }: { onExit: () => void }) {
  const tour = useTour()
  const { config, state } = tour
  const pct = config.missions.length ? Math.round((state.doneMissions.length / config.missions.length) * 100) : 0

  return (
    <div className="mx-auto max-w-2xl py-6 text-center">
      <h2 className="text-3xl font-bold text-ink-950">That is the tour</h2>
      <p className="mt-3 text-ink-500">
        {state.visitedLocations.length} of {config.locations.length} locations, {config.roles.length} roles, {state.doneMissions.length} of{' '}
        {config.missions.length} missions done.
      </p>
      <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
        {[
          { label: 'XP earned', value: `${tour.xp}` },
          { label: 'Badges', value: `${state.badges.length}` },
          { label: 'Missions', value: `${pct}%` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-4">
            <p className="text-2xl font-bold text-ink-950">{s.value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-400">{s.label}</p>
          </div>
        ))}
      </div>
      {state.badges.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Badges earned</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {state.badges.map((b) => (
              <span key={b} className="rounded-full bg-flame-400/10 px-3 py-1.5 text-xs font-bold text-flame-600">
                {b}
              </span>
            ))}
          </div>
        </div>
      )}
      <p className="mx-auto mt-8 max-w-md text-xs leading-relaxed text-ink-400">
        All of it ran on sample data in your browser. The real workspace runs on your institution&apos;s data behind a secure account. See
        it in a live demo.
      </p>
      <button type="button" onClick={onExit} className="btn btn-primary btn-md mt-5">
        Back to the page
      </button>
    </div>
  )
}
