import { useState, type FormEvent } from 'react'
import { cn } from '@/lib/format'
import { useAuth } from '@/lib/stores'

export type FormField =
  | {
      kind: 'text' | 'email' | 'tel' | 'date' | 'time' | 'password' | 'number' | 'url'
      name: string
      label: string
      required?: boolean
      placeholder?: string
      half?: boolean
      autocomplete?: string
    }
  | { kind: 'textarea'; name: string; label: string; required?: boolean; placeholder?: string; rows?: number }
  | { kind: 'select'; name: string; label: string; required?: boolean; options: string[]; half?: boolean }
  | { kind: 'checkbox-group'; name: string; label: string; options: string[]; required?: boolean; min?: number }
  | { kind: 'radio'; name: string; label: string; options: string[]; required?: boolean }

export type FormConfig = {
  id: string
  inboxType?: 'lead' | 'ticket' | 'form'
  inboxSubject?: string
  fields: FormField[]
  submitLabel?: string
  /** Shown after the submission has been saved by the backend. */
  successMessage?: string
}

type Values = Record<string, string | string[] | undefined>

function initialValues(fields: FormField[]): Values {
  const v: Values = {}
  for (const f of fields) {
    if (f.kind === 'checkbox-group') v[f.name] = []
    else v[f.name] = ''
  }
  return v
}

function validate(cfg: FormConfig, values: Values): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const f of cfg.fields) {
    const val = values[f.name]
    if (f.kind === 'checkbox-group') {
      const arr = (val as string[]) ?? []
      if (f.required && arr.length < (f.min ?? 1)) errors[f.name] = 'Please select at least one option.'
      continue
    }
    const s = (val ?? '') as string
    if (f.required && !s.trim()) {
      errors[f.name] = 'This field is required.'
      continue
    }
    if (f.kind === 'email' && s && !/^\S+@\S+\.\S+$/.test(s)) errors[f.name] = 'Enter a valid email address.'
    if (f.kind === 'tel' && s && !/^[+\d][\d\s\-()]{6,}$/.test(s)) errors[f.name] = 'Enter a valid phone number.'
  }
  return errors
}

/**
 * Config-driven form: submits validated form fields to the shared server inbox.
 */
export function SmartForm({
  config,
  light = false,
  className,
}: {
  config: FormConfig
  light?: boolean
  className?: string
}) {
  const [values, setValues] = useState<Values>(() => initialValues(config.fields))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { submitInbox } = useAuth()

  const set = (name: string, v: string | string[] | undefined) => {
    setValues((prev) => ({ ...prev, [name]: v }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(config, values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(`${config.id}-${first}`)?.focus()
      return
    }
    setSending(true)
    const fields = config.fields.flatMap((field) => {
      const value = values[field.name]
      if (field.kind === 'checkbox-group') return value && (value as string[]).length ? [`${field.label}: ${(value as string[]).join(', ')}`] : []
      return typeof value === 'string' && value.trim() ? [`${field.label}: ${value.trim()}`] : []
    })
    const emailField = config.fields.find((field) => field.kind === 'email')
    const nameField = config.fields.find((field) => field.name === 'name')
      ?? config.fields.find((field) => /^(your|full|contact)\s+name$/i.test(field.label.trim()))
    const email = emailField ? String(values[emailField.name] ?? '') : ''
    const name = nameField ? String(values[nameField.name] ?? '') : email || 'Website visitor'
    const type = config.inboxType ?? (/support|ticket|refund/i.test(config.id) ? 'ticket' : /lead|contact|appointment|partner|sales|booking|privyr/i.test(config.id) ? 'lead' : 'form')
    setSubmitError('')
    try {
      await submitInbox({ type, subject: config.inboxSubject ?? config.id.replace(/[-_]/g, ' '), name, email, message: fields.join('\n'), source: window.location.pathname })
      setDone(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit this form. Please try again.')
    } finally { setSending(false) }
  }

  if (done) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-accent-400/30 bg-accent-400/8 p-6 text-center',
          className,
        )}
        role="status"
      >
          <p className="text-lg font-semibold text-accent-600">Thank you!</p>
        <p className={cn('mt-2 text-sm', light ? 'text-ink-600' : 'text-ink-300')}>
            {config.successMessage ?? 'Your submission was received by our team.'}
        </p>
      </div>
    )
  }

  const inputCls = light ? 'input-light' : 'input'
  const lblCls = light ? 'label-light' : 'label'
  const errCls = 'mt-1 text-xs text-flame-600'

  return (
    <form onSubmit={onSubmit} noValidate className={cn('grid gap-4 sm:grid-cols-2', className)}>
      {config.fields.map((f) => {
        const err = errors[f.name]
        const id = `${config.id}-${f.name}`
      const full = f.kind === 'textarea' || f.kind === 'checkbox-group' || f.kind === 'radio' || !('half' in f && f.half)

        const label = (
          <span className={lblCls}>
            {f.label}
            {'required' in f && f.required && <span className="text-flame-600"> *</span>}
          </span>
        )

        if (f.kind === 'textarea') {
          return (
            <div key={f.name} className={full ? 'sm:col-span-2' : ''}>
              <label htmlFor={id}>{label}</label>
              <textarea
                id={id}
                rows={f.rows ?? 4}
                className={inputCls}
                placeholder={f.placeholder}
                value={(values[f.name] as string) ?? ''}
                onChange={(e) => set(f.name, e.target.value)}
                aria-invalid={!!err}
              />
              {err && <p className={errCls}>{err}</p>}
            </div>
          )
        }

        if (f.kind === 'checkbox-group') {
          const selected = (values[f.name] as string[]) ?? []
          return (
            <fieldset key={f.name} className="sm:col-span-2" id={id}>
              <legend className={lblCls}>
                {f.label}
                {f.required && <span className="text-flame-600"> *</span>}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {f.options.map((opt) => (
                  <label
                    key={opt}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition',
                      selected.includes(opt)
                        ? 'border-accent-400/60 bg-accent-400/10 text-accent-600'
                        : light
                          ? 'border-ink-900/12 bg-white text-ink-700 hover:border-ink-900/30'
                          : 'border-line bg-white text-ink-200 hover:border-line-strong',
                    )}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[var(--color-accent-400)]"
                      checked={selected.includes(opt)}
                      onChange={(e) =>
                        set(
                          f.name,
                          e.target.checked
                            ? [...selected, opt]
                            : selected.filter((s) => s !== opt),
                        )
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {err && <p className={errCls}>{err}</p>}
            </fieldset>
          )
        }

        if (f.kind === 'radio') {
          return (
            <fieldset key={f.name} className="sm:col-span-2" id={id}>
              <legend className={lblCls}>
                {f.label}
                {f.required && <span className="text-flame-600"> *</span>}
              </legend>
              <div className="flex flex-wrap gap-2">
                {f.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-ink-200">
                    <input
                      type="radio"
                      name={f.name}
                      value={opt}
                      checked={values[f.name] === opt}
                      onChange={() => set(f.name, opt)}
                      className="accent-[var(--color-accent-400)]"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {err && <p className={errCls}>{err}</p>}
            </fieldset>
          )
        }

        if (f.kind === 'select') {
          return (
            <div key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
              <label htmlFor={id}>{label}</label>
              <select
                id={id}
                className={inputCls}
                value={(values[f.name] as string) ?? ''}
                onChange={(e) => set(f.name, e.target.value)}
                aria-invalid={!!err}
              >
                <option value="">Select…</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              {err && <p className={errCls}>{err}</p>}
            </div>
          )
        }

        // text-like
        return (
          <div key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
            <label htmlFor={id}>{label}</label>
            <input
              id={id}
              type={f.kind}
              className={inputCls}
              placeholder={f.placeholder}
              autoComplete={f.autocomplete}
              value={(values[f.name] as string) ?? ''}
              onChange={(e) => set(f.name, e.target.value)}
              aria-invalid={!!err}
            />
            {err && <p className={errCls}>{err}</p>}
          </div>
        )
      })}

      {submitError && <p className="text-sm text-flame-600 sm:col-span-2" role="alert">{submitError}</p>}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" className={cn('btn btn-primary btn-md sm:w-auto', sending && 'opacity-70')} disabled={sending}>
          {sending ? 'Sending…' : (config.submitLabel ?? 'Submit')}
        </button>
        <p className="text-[11px] text-ink-400">
          Your submission is sent securely to our team.
        </p>
      </div>
    </form>
  )
}
