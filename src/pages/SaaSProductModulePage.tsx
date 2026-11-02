import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/lib/stores'

type ModuleSlug = 'coaching-erp' | 'crm' | 'hrm'
type Field = { key: string; label: string; type?: string; options?: string[]; required?: boolean }
type ResourceConfig = { resource: string; noun: string; title: string; statuses: string[]; fields: Field[]; hint?: string }
type ModuleRecord = Record<string, unknown> & { id: string; name?: string; title?: string; status?: string; createdAt: string }

const moduleConfig: Record<ModuleSlug, { title: string; resource: string; noun: string; description: string; statuses: string[]; fields: Field[]; workflows: ResourceConfig[] }> = {
  crm: {
    title: 'CRM', resource: 'leads', noun: 'lead', description: 'Manage leads, contacts, appointments, and follow-up stages for this organization.', statuses: ['new','contacted','qualified','proposal','won','lost'],
    fields: [{ key: 'company', label: 'Company' }, { key: 'source', label: 'Lead source' }, { key: 'followUpAt', label: 'Follow-up date', type: 'date' }],
    workflows: [
      { resource: 'appointments', noun: 'appointment', title: 'Appointments', statuses: ['scheduled','completed','no_show','cancelled'], fields: [{ key: 'title', label: 'Title', required: true }, { key: 'scheduledAt', label: 'Scheduled at', type: 'datetime-local', required: true }, { key: 'durationMinutes', label: 'Duration (minutes)', type: 'number' }, { key: 'type', label: 'Type', options: ['call','meeting','demo','other'] }] },
      { resource: 'reports', noun: 'report', title: 'Reports', statuses: [], fields: [] },
    ],
  },
  hrm: {
    title: 'HRM', resource: 'employees', noun: 'employee', description: 'Manage employee records, shifts, leave, and documents for this organization.', statuses: ['onboarding','active','on_leave','inactive'],
    fields: [{ key: 'department', label: 'Department' }, { key: 'jobTitle', label: 'Job title' }, { key: 'startDate', label: 'Start date', type: 'date' }],
    workflows: [
      { resource: 'shifts', noun: 'shift', title: 'Shifts', statuses: ['active','archived'], fields: [{ key: 'name', label: 'Shift name', required: true }, { key: 'startDate', label: 'Start date', type: 'date', required: true }, { key: 'endDate', label: 'End date', type: 'date', required: true }, { key: 'startTime', label: 'Start time (HH:MM)', required: true }, { key: 'endTime', label: 'End time (HH:MM)', required: true }] },
      { resource: 'leave', noun: 'leave request', title: 'Leave', statuses: ['pending','approved','rejected'], fields: [{ key: 'type', label: 'Type', options: ['sick','casual','annual','unpaid','other'], required: true }, { key: 'startDate', label: 'Start date', type: 'date', required: true }, { key: 'endDate', label: 'End date', type: 'date', required: true }, { key: 'reason', label: 'Reason', required: true }], hint: 'Employee documents stay private to this workspace.' },
      { resource: 'documents', noun: 'document', title: 'Documents', statuses: [], fields: [], hint: 'PDF, PNG, JPEG, or plain text up to 3 MB. Downloads require active workspace membership.' },
      { resource: 'reports', noun: 'report', title: 'Reports', statuses: [], fields: [] },
    ],
  },
  'coaching-erp': {
    title: 'Coaching ERP', resource: 'students', noun: 'student', description: 'Manage admissions, branches, fees, attendance, exams, results, and portal access.', statuses: ['inquiry','applied','enrolled','inactive'],
    fields: [{ key: 'program', label: 'Program' }, { key: 'batch', label: 'Batch' }],
    workflows: [
      { resource: 'branches', noun: 'branch', title: 'Branches', statuses: ['active','inactive'], fields: [{ key: 'name', label: 'Branch name', required: true }, { key: 'code', label: 'Code' }, { key: 'address', label: 'Address' }] },
      { resource: 'fees', noun: 'fee', title: 'Fees', statuses: ['unpaid','partial','paid','waived'], fields: [{ key: 'title', label: 'Fee title', required: true }, { key: 'amountMinor', label: 'Amount (INR)', type: 'number', required: true }, { key: 'dueDate', label: 'Due date', type: 'date', required: true }], hint: 'Amounts are stored in INR paise. Choose an enrolled student by name.' },
      { resource: 'receipts', noun: 'receipt', title: 'Receipts', statuses: [], fields: [{ key: 'amountMinor', label: 'Amount (INR)', type: 'number', required: true }, { key: 'receivedDate', label: 'Received date', type: 'date', required: true }, { key: 'method', label: 'Method', options: ['cash','upi','card','bank','other'] }, { key: 'reference', label: 'Reference' }], hint: 'Record a payment against a fee by fee title. Over-payments are rejected; voiding keeps the audit trail.' },
      { resource: 'attendance', noun: 'attendance mark', title: 'Attendance', statuses: ['present','absent','late'], fields: [{ key: 'date', label: 'Date', type: 'date', required: true }, { key: 'status', label: 'Status', options: ['present','absent','late'], required: true }, { key: 'note', label: 'Note' }], hint: 'One mark per student per date. Choose the student by name.' },
      { resource: 'exams', noun: 'exam', title: 'Exams', statuses: ['scheduled','completed','cancelled'], fields: [{ key: 'title', label: 'Exam title', required: true }, { key: 'subject', label: 'Subject' }, { key: 'examDate', label: 'Exam date', type: 'date', required: true }, { key: 'maxMarks', label: 'Maximum marks', type: 'number', required: true }] },
      { resource: 'results', noun: 'result', title: 'Results', statuses: ['pending','published'], fields: [{ key: 'marks', label: 'Marks', type: 'number', required: true }, { key: 'grade', label: 'Grade' }], hint: 'Enter the exam title and student name to link the result.' },
      { resource: 'portal-grants', noun: 'portal grant', title: 'Portal access', statuses: ['pending','active'], fields: [{ key: 'email', label: 'Guardian or student email', type: 'email', required: true }, { key: 'role', label: 'Role', options: ['guardian','student'], required: true }], hint: 'Read-only access activates when the invited email verifies its MYR account.' },
      { resource: 'reports', noun: 'report', title: 'Reports', statuses: [], fields: [] },
    ],
  },
}

const label = (key: string) => key.replaceAll('_', ' ').replace(/^\w/, (character) => character.toUpperCase())
const formatValue = (value: unknown) => {
  if (value == null || value === '') return ''
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number' && /amount|marks/i.test(String(value))) return String(value)
  const text = String(value)
  return /^\d{4}-\d{2}-\d{2}(T| )/.test(text) && !/^\d{4}-\d{2}-\d{2}$/.test(text) ? new Date(text).toLocaleString() : /^\d{4}-\d{2}-\d{2}$/.test(text) ? new Date(text).toLocaleDateString() : text
}

export function SaaSProductModulePage() {
  const { user } = useAuth()
  const { slug = '' } = useParams()
  const [searchParams] = useSearchParams()
  const config = moduleConfig[slug as ModuleSlug]
  const organizationId = searchParams.get('organizationId') || ''
  const [activeTab, setActiveTab] = useState('')
  const [records, setRecords] = useState<ModuleRecord[]>([])
  const [limits, setLimits] = useState<Record<string, number>>({})
  const [values, setValues] = useState<Record<string, string>>({})
  const [fileData, setFileData] = useState<{ name: string; contentBase64: string } | null>(null)
  const [referenceRecords, setReferenceRecords] = useState<Record<string, ModuleRecord[]>>({})
  const [reports, setReports] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const tabs = useMemo(() => config ? [{ resource: config.resource, noun: config.noun, title: config.title, statuses: config.statuses, fields: config.fields }, ...config.workflows] : [], [config])
  const active = tabs.find((tab) => tab.resource === activeTab) || tabs[0]
  const endpoint = active && organizationId ? `/api/saas/modules/${slug}/organizations/${encodeURIComponent(organizationId)}/${active.resource}` : ''

  const refresh = async () => {
    if (!endpoint || !active) { setLoading(false); return }
    setLoading(true)
    try {
      const response = await fetch(endpoint, { credentials: 'same-origin' }); const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to load product records.')
      if (active.resource === 'reports') setReports(data.reports || {})
      else { setRecords(data.records); setLimits(data.limits || {}) }
      setMessage('')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to load product records.') }
    finally { setLoading(false) }
  }
  useEffect(() => { if (user && config && organizationId && !activeTab && tabs[0]) setActiveTab(tabs[0].resource) }, [user?.id, config, organizationId])
  useEffect(() => { if (user && config && organizationId && activeTab) void refresh() }, [user?.id, endpoint])

  // Reference data (students/employees/leads/branches/fees/exams) for cross-record fields.
  const referenceKeys = active ? active.fields.filter((field) => /studentId|employeeId|feeId|examId|branchId/i.test(field.key)).map((field) => field.key) : []
  useEffect(() => {
    if (!organizationId || !referenceKeys.length) return
    const resourceFor = (key: string) => key.startsWith('student') ? 'students' : key.startsWith('employee') ? 'employees' : key.startsWith('fee') ? 'fees' : key.startsWith('exam') ? 'exams' : 'branches'
    void Promise.all([...new Set(referenceKeys.map(resourceFor))].map(async (resource) => {
      const response = await fetch(`/api/saas/modules/${slug}/organizations/${encodeURIComponent(organizationId)}/${resource}`, { credentials: 'same-origin' })
      if (response.ok) { const data = await response.json(); setReferenceRecords((current) => ({ ...current, [resource]: data.records })) }
    }))
  }, [slug, organizationId, activeTab])

  const createRecord = async (event: FormEvent) => {
    event.preventDefault(); if (!endpoint || !active) return
    setBusy(true); setMessage('')
    try {
      let payload: Record<string, unknown>
      if (active.resource === 'documents') {
        if (!fileData) throw new Error('Choose a file to upload.')
        payload = { attachment: fileData, employeeId: values.employeeId || null }
      } else {
        payload = {}
        for (const field of active.fields) {
          const raw = values[field.key] || ''
          if (!raw) continue
          payload[field.key] = field.type === 'number' ? Math.round(Number(raw) * (field.key === 'amountMinor' ? 100 : 1)) : raw
        }
        if (active.resource === config.resource) { payload.name = values.name || ''; if (values.email) payload.email = values.email; if (values.status) payload.status = values.status }
      }
      const response = await fetch(endpoint, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }); const data = await response.json()
      if (!response.ok) throw new Error(data.error || `Unable to create ${active.noun}.`)
      setRecords((current) => [data.record, ...current]); setValues({}); setFileData(null); setMessage(`${active.noun[0].toUpperCase()}${active.noun.slice(1)} created.`)
    } catch (error) { setMessage(error instanceof Error ? error.message : `Unable to create ${active.noun}.`) }
    finally { setBusy(false) }
  }
  const updateStatus = async (record: ModuleRecord, status: string) => {
    if (!endpoint) return
    const response = await fetch(`${endpoint}/${record.id}`, { method: 'PATCH', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) }); const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to update workflow status.'); return }
    setRecords((current) => current.map((item) => item.id === record.id ? data.record : item))
  }
  const removeRecord = async (record: ModuleRecord) => {
    if (!endpoint || !active) return
    const name = record.name || record.title || active.noun
    if (!window.confirm(`Delete ${name}?`)) return
    const response = await fetch(`${endpoint}/${record.id}`, { method: 'DELETE', credentials: 'same-origin' }); const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to delete record.'); return }
    if (active.resource === 'receipts' || active.resource === 'portal-grants') void refresh()
    else setRecords((current) => current.filter((item) => item.id !== record.id))
  }
  const displayFields = (record: ModuleRecord) => Object.entries(record).filter(([key]) => !['id','organizationId','createdBy','updatedAt','createdAt','status','storageKey','storageDriver','uploadedBy','revokedBy','revokedAt','voidedAt','voidedBy','purgedAt'].includes(key) && record[key] !== '' && record[key] != null).slice(0, 8)

  if (!user) return <section className="container-page py-20 text-center"><h1 className="text-3xl font-bold">Sign in required</h1><Link to="/my-account/" className="mt-5 inline-flex text-accent-700">Go to account</Link></section>
  if (!config || !organizationId) return <section className="container-page py-20"><h1 className="text-3xl font-bold">Product workspace unavailable</h1><p className="mt-3 text-ink-500">Choose an active product from an organization workspace.</p><Link to="/workspace/" className="mt-5 inline-flex text-accent-700">Back to workspace</Link></section>
  const isReports = active?.resource === 'reports'
  return <section className="section-light min-h-screen py-12"><div className="container-page"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">MYR Software · Organization workspace</p><h1 className="mt-2 text-3xl font-bold text-ink-950">{config.title}</h1><p className="mt-2 text-sm text-ink-500">{config.description}</p></div><Link to="/workspace/" className="text-sm font-semibold text-accent-700">← All products and billing</Link></div>
    <nav aria-label={`${config.title} sections`} className="mt-6 flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab.resource} type="button" onClick={() => setActiveTab(tab.resource)} aria-current={active?.resource === tab.resource ? 'page' : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active?.resource === tab.resource ? 'bg-ink-950 text-white' : 'border border-line bg-white text-ink-600 hover:text-ink-950'}`}>{tab.title}</button>)}</nav>
    {message && <p role="status" className="mt-5 rounded-xl border border-line bg-white p-4 text-sm">{message}</p>}
    {isReports ? <section className="mt-6 rounded-3xl border border-line bg-white p-6"><h2 className="text-xl font-bold">Reports</h2>{loading ? <p className="mt-4 text-sm text-ink-400">Loading reports…</p> : reports ? <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(reports).map(([key, value]) => <article key={key} className="rounded-2xl border border-line p-4">{Array.isArray(value) ? <><strong className="text-sm">{label(key)}</strong><ul className="mt-2 space-y-1 text-sm text-ink-600">{value.slice(0, 8).map((item, index) => <li key={index}>{typeof item === 'object' ? Object.entries(item as Record<string, unknown>).map(([k, v]) => `${label(k)}: ${formatValue(v)}`).join(' · ') : formatValue(item)}</li>)}</ul></> : typeof value === 'object' && value !== null ? <><strong className="text-sm">{label(key)}</strong><dl className="mt-2 space-y-1 text-sm text-ink-600">{Object.entries(value as Record<string, unknown>).map(([k, v]) => <div key={k} className="flex justify-between gap-2"><dt>{label(k)}</dt><dd className="font-semibold">{formatValue(v)}</dd></div>)}</dl></> : <><p className="text-xs text-ink-400">{label(key)}</p><p className="mt-1 text-2xl font-bold">{formatValue(value)}</p></>}</article>)}</div> : <p className="mt-4 text-sm text-ink-400">No report data yet.</p>}</section> : <div className="mt-6 grid gap-5 lg:grid-cols-[.75fr_1.25fr]"><form onSubmit={(event) => void createRecord(event)} className="h-fit rounded-3xl border border-line bg-white p-6"><h2 className="text-xl font-bold">Add {active?.noun}</h2>{active?.hint && <p className="mt-2 text-xs text-ink-400">{active.hint}</p>}
      {active?.resource === config.resource && <><label className="label mt-4 block">Name<input className="input mt-2" required minLength={2} maxLength={160} value={values.name || ''} onChange={(event) => setValues({ ...values, name: event.target.value })} /></label><label className="label mt-3 block">Email (optional)<input className="input mt-2" type="email" value={values.email || ''} onChange={(event) => setValues({ ...values, email: event.target.value })} /></label></>}
      {(active?.fields || []).filter((field) => !(active.resource === config.resource && field.key === 'name')).map((field) => <label key={field.key} className="label mt-3 block">{field.label}{field.options ? <select className="input mt-2" required={field.required} value={values[field.key] || ''} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}><option value="">Choose…</option>{field.options.map((option) => <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>)}</select> : field.key.endsWith('Id') ? <select className="input mt-2" required={field.required} value={values[field.key] || ''} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}><option value="">Choose…</option>{(referenceRecords[field.key.startsWith('student') ? 'students' : field.key.startsWith('employee') ? 'employees' : field.key.startsWith('fee') ? 'fees' : field.key.startsWith('exam') ? 'exams' : 'branches'] || []).map((item) => <option key={item.id} value={item.id}>{item.name || item.title || item.id}</option>)}</select> : <input className="input mt-2" type={field.type || 'text'} required={field.required} maxLength={300} value={values[field.key] || ''} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} />}</label>)}
      {active && active.statuses.length > 0 && active.resource !== config.resource && active.resource !== 'attendance' && active.resource !== 'leave' && active.resource !== 'results' && <label className="label mt-3 block">Status<select className="input mt-2" value={values.status || active.statuses[0]} onChange={(event) => setValues({ ...values, status: event.target.value })}>{active.statuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}</select></label>}
      {active?.resource === config.resource && <label className="label mt-3 block">Status<select className="input mt-2" value={values.status || config.statuses[0]} onChange={(event) => setValues({ ...values, status: event.target.value })}>{config.statuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}</select></label>}
      {active?.resource === 'documents' ? <label className="label mt-4 block">File (PDF, PNG, JPEG, or text, up to 3 MB)<input className="input mt-2" type="file" accept=".pdf,.png,.jpg,.jpeg,.txt" required onChange={(event) => { const file = event.target.files?.[0]; if (!file) { setFileData(null); return } const reader = new FileReader(); reader.onload = () => setFileData({ name: file.name, contentBase64: String(reader.result).split(',')[1] || '' }); reader.readAsDataURL(file) }} /></label> : active && active.fields.length >= 0 && active.resource !== 'reports' && <button className="btn btn-primary btn-md mt-5 w-full" disabled={busy}>{busy ? 'Saving…' : `Add ${active.noun}`}</button>}
      <p className="mt-3 text-xs text-ink-400">Records are isolated to this organization and require an active subscription. Sensitive student details (date of birth, health, guardian identity) are not collected in these initial modules.</p></form>
      <section className="rounded-3xl border border-line bg-white p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">{active?.title}</h2><p className="mt-1 text-sm text-ink-500">{records.length} total records</p></div><button type="button" className="text-sm font-semibold text-accent-700" onClick={() => void refresh()}>Refresh</button></div>{Object.keys(limits).length > 0 && <p className="mt-3 rounded-xl bg-paper p-3 text-xs text-ink-600">Plan limits: {Object.entries(limits).map(([key, value]) => `${key.replaceAll('_', ' ')} ${value}`).join(' · ')}</p>}{loading ? <p className="mt-5 text-sm text-ink-400">Loading records…</p> : records.length ? <div className="mt-4 space-y-3">{records.map((record) => { const displayName = String(record.name || record.title || `${active?.noun} ${record.id.slice(0, 6)}`); return <article key={record.id} className="rounded-2xl border border-line p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><strong className="break-words">{displayName}</strong>{record.email ? <p className="mt-1 text-sm text-ink-500">{String(record.email)}</p> : null}<dl className="mt-1 space-y-0.5">{displayFields(record).filter(([key]) => !['email','name','title'].includes(key)).map(([key, value]) => <div key={key} className="flex flex-wrap gap-1 text-xs text-ink-400"><dt>{label(key)}:</dt><dd className="text-ink-600">{formatValue(value)}</dd></div>)}</dl></div><div className="flex items-center gap-2">{active?.statuses.length ? <select aria-label={`Status for ${displayName}`} className="input !w-auto !py-1 text-xs" value={record.status || active.statuses[0]} onChange={(event) => void updateStatus(record, event.target.value)}>{active.statuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}</select> : record.status ? <span className="rounded-full bg-paper px-3 py-1 text-xs capitalize">{String(record.status).replaceAll('_', ' ')}</span> : null}<button type="button" className="text-xs font-semibold text-flame-600" onClick={() => void removeRecord(record)}>Delete</button></div></div></article> })}</div> : <p className="mt-5 rounded-xl bg-paper p-4 text-sm text-ink-500">No records yet. Add the first {active?.noun} to start using this workspace.</p>}</section></div>}
  </div></section>
}
