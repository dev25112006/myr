import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/format'
import { StatusChip } from './DemoBadge'
import { useTour } from './useTour'
import type { TourMission } from './types'

/**
 * Mission runner — guided ERP workflows that earn XP.
 * Everything happens in local component state. The interesting part is
 * the guards: over-payments blocked, marks checked against the maximum,
 * one mark per student per day. Those mirror what the real product does.
 */
export function MissionRunner({ mission }: { mission: TourMission }) {
  const { state } = useTour()
  const done = state.doneMissions.includes(mission.id)
  const [success, setSuccess] = useState(done)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-paper px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500">
          {mission.ordinal}
        </span>
        <StatusChip status={mission.status} />
        <span className="ml-auto rounded-full bg-flame-400/10 px-2.5 py-1 text-[11px] font-bold text-flame-600">
          +{mission.xp} XP
        </span>
      </div>
      <h4 className="mt-3 text-lg font-bold text-ink-950">{mission.title}</h4>
      <p className="mt-1 text-sm text-ink-500">{mission.brief}</p>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4"
          >
            <p className="flex items-center gap-2 text-sm font-bold text-emerald-800">
              <span aria-hidden>✓</span> {mission.successTitle}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-600">{mission.successBody}</p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-flame-600">
              Badge earned · {mission.badge}
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
            {mission.kind === 'form' && <FormRunner mission={mission} onError={setError} onDone={() => setSuccess(true)} />}
            {mission.kind === 'roster' && <RosterRunner mission={mission} onDone={() => setSuccess(true)} />}
            {mission.kind === 'receipt' && <ReceiptRunner mission={mission} onError={setError} onDone={() => setSuccess(true)} />}
            {mission.kind === 'marks' && <MarksRunner mission={mission} onError={setError} onDone={() => setSuccess(true)} />}
            {mission.kind === 'publish' && <PublishRunner mission={mission} onDone={() => setSuccess(true)} />}
            {mission.kind === 'checklist' && <ChecklistRunner mission={mission} onDone={() => setSuccess(true)} />}
            {error && <p role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
            <p className="mt-3 text-[11px] text-ink-400">Simulated. Runs only in your browser on sample data.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const btn = 'btn btn-primary btn-sm'
const inputCls =
  'w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-accent-400 focus:outline-none'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-ink-600">{label}</span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  )
}

/* ------------------------------ form kind ------------------------------ */
function FormRunner({ mission, onDone, onError }: { mission: TourMission; onDone: () => void; onError: (m: string | null) => void }) {
  const { completeMission } = useTour()
  const [values, setValues] = useState<Record<string, string>>({})
  const fields = mission.fields ?? []

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const missing = fields.filter((f) => f.required && !values[f.name]?.trim())
    if (missing.length) {
      onError(`Fill in: ${missing.map((f) => f.label).join(', ')}.`)
      return
    }
    const email = fields.find((f) => f.kind === 'email')
    if (email && values[email.name] && !/^\S+@\S+\.\S+$/.test(values[email.name])) {
      onError('That email address does not look right.')
      return
    }
    onError(null)
    completeMission(mission)
    onDone()
  }

  return (
    <form onSubmit={submit} className="space-y-3.5" noValidate>
      {fields.map((f) => (
        <Field key={f.name} label={f.label + (f.required ? ' *' : '')}>
          {f.kind === 'select' ? (
            <select
              className={inputCls}
              value={values[f.name] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            >
              <option value="">Choose…</option>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : f.kind === 'textarea' ? (
            <textarea
              rows={3}
              className={inputCls}
              placeholder={f.placeholder}
              value={values[f.name] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            />
          ) : (
            <input
              type={f.kind === 'email' ? 'email' : f.kind === 'number' ? 'number' : 'text'}
              className={inputCls}
              placeholder={f.placeholder}
              value={values[f.name] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            />
          )}
        </Field>
      ))}
      <button type="submit" className={btn}>
        Submit
      </button>
    </form>
  )
}

/* ------------------------------ roster kind ----------------------------- */
function RosterRunner({ mission, onDone }: { mission: TourMission; onDone: () => void }) {
  const { completeMission } = useTour()
  const roster = mission.roster ?? []
  const [marks, setMarks] = useState<Record<string, 'present' | 'absent' | 'late'>>({})
  const allMarked = roster.every((s) => marks[s.id])

  return (
    <div>
      <ul className="space-y-2">
        {roster.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-3.5 py-2.5">
            <span className="text-sm font-medium text-ink-900">
              {s.name} <span className="text-xs text-ink-400">· {s.meta}</span>
            </span>
            <span className="flex gap-1.5" role="group" aria-label={`Mark for ${s.name}`}>
              {(['present', 'absent', 'late'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setMarks((m) => ({ ...m, [s.id]: k }))}
                  aria-pressed={marks[s.id] === k}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition',
                    marks[s.id] === k
                      ? k === 'present'
                        ? 'bg-emerald-600 text-white'
                        : k === 'absent'
                          ? 'bg-rose-600 text-white'
                          : 'bg-flame-500 text-white'
                      : 'bg-paper text-ink-500 hover:text-ink-900',
                  )}
                >
                  {k}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={!allMarked}
        onClick={() => {
          completeMission(mission)
          onDone()
        }}
        className={cn(btn, 'mt-4')}
      >
        {allMarked ? 'Submit attendance' : `Mark every student (${Object.keys(marks).length}/${roster.length})`}
      </button>
    </div>
  )
}

/* ------------------------------ receipt kind ---------------------------- */
function ReceiptRunner({ mission, onDone, onError }: { mission: TourMission; onDone: () => void; onError: (m: string | null) => void }) {
  const { completeMission } = useTour()
  const fees = mission.fees ?? []
  const [feeId, setFeeId] = useState(fees[0]?.value ?? '')
  const [amount, setAmount] = useState('')
  const selected = fees.find((f) => f.value === feeId)
  const amt = Number(amount)

  const submit = () => {
    if (!selected) return onError('Pick a fee record.')
    if (!amount || Number.isNaN(amt) || amt <= 0) return onError('Enter the amount received.')
    // The real workflow rejects over-payments. So does this one.
    if (selected.outstanding > 0 && amt > selected.outstanding) {
      return onError(`That is more than the ₹${selected.outstanding.toLocaleString('en-IN')} outstanding. The real counter rejects this too.`)
    }
    onError(null)
    completeMission(mission)
    onDone()
  }

  return (
    <div className="space-y-3.5">
      <Field label="Fee record *">
        <select className={inputCls} value={feeId} onChange={(e) => setFeeId(e.target.value)}>
          {fees.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label} — outstanding ₹{f.outstanding.toLocaleString('en-IN')}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Amount received (₹) *">
        <input type="number" min={1} className={inputCls} placeholder={selected ? String(selected.outstanding) : '0'} value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>
      {selected && (
        <p className="rounded-lg bg-paper px-3 py-2 text-xs text-ink-500">
          Balance after:{' '}
          <span className="font-semibold text-ink-900">
            ₹{Math.max(0, selected.outstanding - (Number.isNaN(amt) ? 0 : amt)).toLocaleString('en-IN')}
          </span>
        </p>
      )}
      <button type="button" onClick={submit} className={btn}>
        Record payment and issue receipt
      </button>
    </div>
  )
}

/* ------------------------------- marks kind ----------------------------- */
function MarksRunner({ mission, onDone, onError }: { mission: TourMission; onDone: () => void; onError: (m: string | null) => void }) {
  const { completeMission } = useTour()
  const exams = mission.exams ?? []
  const [examId, setExamId] = useState(exams[0]?.value ?? '')
  const [score, setScore] = useState('')
  const exam = exams.find((e) => e.value === examId)
  const val = Number(score)

  const submit = () => {
    if (!exam) return
    if (score === '' || Number.isNaN(val) || val < 0) return onError('Enter the marks obtained.')
    if (val > exam.maxMarks) {
      return onError(`Out of range. This exam is marked out of ${exam.maxMarks} — the real workflow blocks this.`)
    }
    onError(null)
    completeMission(mission)
    onDone()
  }

  return (
    <div className="space-y-3.5">
      <Field label="Exam *">
        <select className={inputCls} value={examId} onChange={(e) => setExamId(e.target.value)}>
          {exams.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label} · out of {e.maxMarks}
            </option>
          ))}
        </select>
      </Field>
      <Field label={`Marks obtained${exam ? ` (0–${exam.maxMarks})` : ''} *`}>
        <input type="number" min={0} max={exam?.maxMarks} className={inputCls} placeholder="0" value={score} onChange={(e) => setScore(e.target.value)} />
      </Field>
      <button type="button" onClick={submit} className={btn}>
        Save mark (pending review)
      </button>
    </div>
  )
}

/* ------------------------------ publish kind ---------------------------- */
function PublishRunner({ mission, onDone }: { mission: TourMission; onDone: () => void }) {
  const { completeMission } = useTour()
  const pending = mission.pending ?? []
  const [reviewed, setReviewed] = useState<string[]>([])
  const allReviewed = pending.every((p) => reviewed.includes(p.id))

  return (
    <div>
      <ul className="space-y-2">
        {pending.map((p) => {
          const isReviewed = reviewed.includes(p.id)
          return (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-3.5 py-2.5">
              <span className="text-sm font-medium text-ink-900">
                {p.name} <span className="text-xs text-ink-400">· {p.marks} / {p.max}</span>
              </span>
              <button
                type="button"
                onClick={() => setReviewed((r) => (r.includes(p.id) ? r : [...r, p.id]))}
                aria-pressed={isReviewed}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[11px] font-semibold transition',
                  isReviewed ? 'bg-emerald-600 text-white' : 'bg-paper text-ink-500 hover:text-ink-900',
                )}
              >
                {isReviewed ? 'Reviewed ✓' : 'Review'}
              </button>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        disabled={!allReviewed}
        onClick={() => {
          completeMission(mission)
          onDone()
        }}
        className={cn(btn, 'mt-4')}
      >
        {allReviewed ? 'Publish to student and guardian portals' : 'Review every result first'}
      </button>
      {!allReviewed && <p className="mt-2 text-[11px] text-ink-400">Publishing needs a review step. Nothing goes out on its own.</p>}
    </div>
  )
}

/* ----------------------------- checklist kind --------------------------- */
function ChecklistRunner({ mission, onDone }: { mission: TourMission; onDone: () => void }) {
  const { completeMission } = useTour()
  const items = mission.checklist ?? []
  const [checked, setChecked] = useState<string[]>([])
  const allChecked = items.length > 0 && items.every((i) => checked.includes(i.id))

  return (
    <div>
      <ul className="space-y-2">
        {items.map((item) => {
          const on = checked.includes(item.id)
          return (
            <li key={item.id} className="flex items-start gap-3 rounded-xl border border-line px-3.5 py-2.5">
              <button
                type="button"
                onClick={() => setChecked((c) => (on ? c.filter((x) => x !== item.id) : [...c, item.id]))}
                aria-pressed={on}
                aria-label={`Mark reviewed: ${item.text}`}
                className={cn(
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold transition',
                  on ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-line bg-white text-transparent hover:border-ink-950/40',
                )}
              >
                ✓
              </button>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink-900">{item.text}</span>
                {item.meta && <span className="mt-0.5 block text-xs text-ink-400">{item.meta}</span>}
              </span>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        disabled={!allChecked}
        onClick={() => {
          completeMission(mission)
          onDone()
        }}
        className={cn(btn, 'mt-4')}
      >
        {allChecked ? 'Sign off the review' : `Open every figure first (${checked.length}/${items.length})`}
      </button>
    </div>
  )
}
