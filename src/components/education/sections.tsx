/** 
 * Education ERP section components.
 * 
 * Contains reusable UI sections for the Education ERP experience.
 * All content is demo data rendered with <DemoBadge/>.
 */

import { useState } from 'react'
import type { ReactNode } from 'react'
import type { CollegeModule } from '@/content/education/segments'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Reveal, SectionHeading, FaqAccordion } from '@/components/ui'
import { usePopup } from '@/lib/stores'
import { DemoBadge, StatusChip } from './DemoBadge'
import { PreviewSurface, SimDashboard } from './SimDashboard'
import { useTour } from './useTour'
import { CampusScene } from './CampusScene'
import type { SegmentIdentity } from '@/content/education/segments'
import type { TourConfig, TourRole } from '@/components/education/types'

/** Small count words so headings read like a person wrote them. */
const NUM_WORDS: Record<number, string> = { 4: 'Four', 7: 'Seven', 8: 'Eight', 9: 'Nine', 16: 'Sixteen' }
const numWord = (n: number) => NUM_WORDS[n] ?? String(n)

/* ------------------------------------------------------------------ */
/* Section 2 — campus tour (on-page, hotspots open demo dashboards)    */
/* ------------------------------------------------------------------ */
export function CampusTourSection({ identity, config }: { identity: SegmentIdentity; config: TourConfig }) {
  const tour = useTour()
  const [pickedId, setPickedId] = useState<string | null>(null)
  const picked = config.locations.find((l) => l.id === pickedId) ?? null

  return (
    <section className="section-white px-5 py-20 sm:px-8" aria-labelledby="tour-heading">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Virtual tour"
          title={
            <span id="tour-heading">
              Walk the campus. <span className={identity.accentText}>Open any department.</span>
            </span>
          }
          sub={`${numWord(config.locations.length)} buildings, each a hotspot. Click one and you get the workflow behind it plus a demo dashboard on sample data.`}
          tone="light"
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <CampusScene
              locations={config.locations}
              identity={identity}
              activeId={pickedId ?? undefined}
              visitedIds={tour.state.visitedLocations}
              onPick={(loc) => {
                setPickedId(loc.id)
                tour.selectLocation(loc)
              }}
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-ink-400">{numWord(config.locations.length)} hotspots, keyboard accessible</p>
              <button type="button" onClick={() => tour.open('campus')} className="btn btn-ghost-dark btn-sm">
                Enter the full tour →
              </button>
            </div>
          </div>
          <div aria-live="polite">
            {picked ? (
              <motion.div key={picked.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-ink-950">{picked.label}</h3>
                  <StatusChip status={picked.status} />
                </div>
                <ul className="space-y-2">
                  {picked.workflow.map((w, i) => (
                    <li key={i} className="rounded-xl border border-line bg-paper/40 px-4 py-2.5 text-sm leading-relaxed text-ink-600">
                      {w}
                    </li>
                  ))}
                </ul>
                <SimDashboard screen={picked.screen} compact />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper/40 p-8 text-center"
              >
                <p className="text-sm text-ink-500">Click a building to open its department.</p>
                <ul className="mt-5 grid gap-2 text-left">
                  {config.locations.map((l, i) => (
                    <li key={l.id} className="flex items-center gap-3 text-xs text-ink-400">
                      <span className="flex size-6 items-center justify-center rounded-full bg-white font-bold text-ink-950">{i + 1}</span>
                      {l.label}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 3 — role-based experience                                   */
/* ------------------------------------------------------------------ */
export function RoleSection({ roles, sub }: { roles: TourRole[]; sub: string }) {
  return (
    <section className="section-white px-5 py-20 sm:px-8" aria-labelledby="roles-heading">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Roles"
          title={<span id="roles-heading">Role-based panels</span>}
          sub={sub}
          tone="light"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-line bg-paper/40 p-4 hover:border-flame-600 transition-colors"
            >
              <h3 className="text-sm font-semibold text-flame-600 uppercase tracking-wider">{r.label}</h3>
              <p className="mt-2 text-[11px] text-ink-500 line-clamp-3">{r.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 4 — module showcase (college modules with gamification)     */
/* ------------------------------------------------------------------ */
export function ModuleShowcase({ modules, eyebrow, title, sub }: {
  modules: CollegeModule[]
  eyebrow: string
  title: ReactNode
  sub: string
}) {
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  return (
    <section className="section-white px-5 py-20 sm:px-8" aria-labelledby="modules-heading">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={eyebrow}
          title={<span id="modules-heading">{title}</span>}
          sub={sub}
          tone="light"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Reveal key={m.id} className="min-w-0">
              <article className="card flex h-full min-w-0 flex-col p-5">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <h3 className="min-w-0 text-base font-bold leading-snug text-ink-950">{m.title}</h3>
                  <StatusChip status={m.status} className="shrink-0" />
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{m.body}</p>
                <div className="mt-4 min-w-0 flex-1">
                  <PreviewSurface preview={m.preview} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  {m.note && <p className="min-w-0 flex-1 text-[11px] leading-relaxed text-ink-400">{m.note}</p>}
                  <DemoBadge className="shrink-0" />
                  <button
                    type="button"
                    onClick={() => {
                      const has = expandedIds.includes(m.id)
      setExpandedIds(has ? expandedIds.filter(id => id !== m.id) : [...expandedIds, m.id])
    }}
                    className="text-[10px] font-semibold text-flame-600 hover:text-flame-500 transition"
                  >
                    {expandedIds.includes(m.id) ? 'Less info' : 'More info'}
                  </button>
                </div>
                {expandedIds.includes(m.id) && (
                  <div className="mt-4 p-3 rounded-xl border border-flame-400/20 bg-flame-400/5">
                    <p className="font-semibold text-flame-600">
                      {m.status === 'live' ? 'Running in workspace' : 'Configurable scope'}
                    </p>
                    <p className="text-[11px] text-ink-500">{m.body}</p>
                  </div>
                )}
              </article>
            </Reveal>
          ))}
          <div className="mt-8">
            <p className="text-sm text-ink-500">
              {expandedIds.length || 0} of {modules.length} modules expanded
            </p>
            <button
              type="button"
              onClick={() => setExpandedIds([])}
              className="btn btn-ghost-dark btn-sm mt-2"
            >
              Collapse all
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 5 — interactive missions                                    */
/* ------------------------------------------------------------------ */
export function MissionsBoard({ config }: { config: TourConfig }) {
  const tour = useTour()
  const doneCount = config.missions.filter((m) => tour.state.doneMissions.includes(m.id)).length

  return (
    <section className="section-deep px-5 py-20 sm:px-8" aria-labelledby="missions-heading">
      <div className="mx-auto max-w-5xl text-center">
        <SectionHeading
          eyebrow="Interactive missions"
          title={<span id="missions-heading">
            Run the workflows yourself. <span className="text-flame-600">Earn XP.</span>
          </span>}
          sub={`${numWord(config.missions.length)} short missions on sample data, with the same guards the real product enforces. Duplicate attendance is rejected, receipts stop at the outstanding balance, marks are checked against the maximum.`}
          tone="light"
        />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => tour.open('missions')} className="btn btn-primary btn-md">
            Start missions · {config.missions.length} available
          </button>
          <span className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink-500">
            {tour.state.hydrated && doneCount > 0 ? `${doneCount} done · ${tour.xp} XP` : `${config.missions.reduce((s, m) => s + m.xp, 0)} XP on offer`}
          </span>
        </div>
        <ol className="mx-auto mt-10 grid max-w-4xl gap-3 text-left sm:grid-cols-2">
          {config.missions.map((m) => (
            <li key={m.id} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-flame-400/10 text-xs font-black text-flame-600">
                {m.ordinal.replace('Mission ', '')}
              </span>
              <span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-ink-950">{m.title}</span>
                  <StatusChip status={m.status} />
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-500">{m.brief}</span>
                <span className="mt-1.5 block text-[11px] font-semibold text-flame-600">+{m.xp} XP · {m.badge} badge</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 6 — closing, FAQ, conversion                                */
/* ------------------------------------------------------------------ */
export function ClosingSection({
  headline,
  body,
  journeyLabel,
  journeyTo,
  demoLabel,
  tourLabel,
  faq,
}: {
  headline: string
  body: string
  journeyLabel: string
  journeyTo: string
  demoLabel: string
  tourLabel: string
  faq: { q: string; a: string }[]
}) {
  const tour = useTour()
  const { setOpen } = usePopup()

  return (
    <>
      <section className="section-dark grid-noise relative overflow-hidden px-5 py-20 sm:px-8" aria-labelledby="closing-heading">
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <h2 id="closing-heading" className="text-3xl font-bold leading-tight text-ink-950 sm:text-4xl lg:text-[2.9rem]">
              {headline}
            </h2>
            <p className="mt-5 max-w-xl text-lg text-ink-500">{body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={journeyTo} className="btn btn-primary btn-md">
                {journeyLabel}
              </Link>
              <button type="button" onClick={() => setOpen('appointment')} className="btn btn-ghost-dark btn-md">
                {demoLabel}
              </button>
              <button type="button" onClick={() => tour.open('intro')} className="btn btn-ghost-dark btn-md">
                {tourLabel}
              </button>
            </div>
          </Reveal>

          <ClosingDevices />
        </div>
      </section>

      <section className="section-white px-5 py-20 sm:px-8" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="FAQs" title={<span id="faq-heading">Straight answers.</span>} tone="light" />
          <div className="mt-8">
            <FaqAccordion items={faq} tone="light" />
          </div>
        </div>
      </section>

      <FinalConversion />
    </>
  )
}

/* Laptop and phone showing the same dashboard, side by side. */
function ClosingDevices() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* laptop */}
        <div className="rounded-t-2xl border border-line bg-ink-950 p-3 shadow-card">
          <div className="rounded-xl border border-line bg-white p-4">
            <div className="flex items-center gap-2 border-b border-line pb-2.5">
              <span aria-hidden className="size-2 rounded-full bg-ink-200/40" />
              <span aria-hidden className="size-2 rounded-full bg-ink-200/40" />
              <span aria-hidden className="size-2 rounded-full bg-ink-200/40" />
              <span className="ml-2 text-[10px] text-ink-400">MYR workspace</span>
              <span className="ml-auto">
                <DemoBadge />
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {[62, 78, 70, 88, 94, 82, 90].map((v, i) => (
                <div key={v} className="rounded-lg bg-paper/60 p-2.5">
                  <p className="text-[9px] leading-tight text-ink-400">{['Attendance today', 'Collected today', 'Results published'][i]}</p>
                  <p className="mt-1 text-sm font-bold text-ink-950">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-2.5 h-24 rounded-lg bg-paper/40 p-2.5">
              <div className="flex h-full items-end gap-1.5">
                {[62, 78, 70, 88, 94, 82, 90].map((v, i) => (
                  <div key={i} className="flex-1 rounded-t bg-ink-950/80" style={{ height: `${v}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* laptop base */}
        <div className="mx-auto h-3 w-[106%] -translate-x-[2.8%] rounded-b-lg bg-ink-800" />

        {/* phone */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -bottom-6 -right-1 w-36 rounded-3xl border border-line bg-ink-950 p-2.5 shadow-card sm:-right-5"
        >
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/25" />
          <div className="rounded-2xl bg-white p-3">
            <p className="text-[9px] uppercase tracking-wide text-ink-400">My child</p>
            <p className="mt-1 text-lg font-bold text-ink-950">96%</p>
            <p className="text-[9px] text-ink-400">attendance</p>
            <div className="mt-2 space-y-1.5">
              {['Fees · Paid', 'English · 68/80', 'PTM · Sat 9:30'].map((t) => (
                <p key={t} className="rounded-md bg-paper px-2 py-1 text-[9px] text-ink-600">
                  {t}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Final conversion section                                            */
/* ------------------------------------------------------------------ */
function FinalConversion() {
  const { setOpen } = usePopup()
  return (
    <section className="section-deep border-t border-line px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-ink-950 sm:text-4xl">See it running your own scenarios.</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-500">
            Book a walkthrough of the actual workspace. Pricing depends on your size and module selection, so MYR quotes it directly
            instead of us printing made-up numbers here.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setOpen('appointment')} className="btn btn-primary btn-md">
              Book a live demo
            </button>
            <Link to="/contact-us/" className="btn btn-ghost-dark btn-md">
              Contact the team
            </Link>
          </div>
        </Reveal>
    </div>
    </section>
  )
}