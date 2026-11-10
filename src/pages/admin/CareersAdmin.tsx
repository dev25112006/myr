import { useEffect, useState, type FormEvent } from 'react'
import { PanelIcons, type PanelNavItem } from '@/components/panel/PanelShell'

const box = 'rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6'

export type AdminJob = {
  id: string
  title: string
  department: string
  location: string
  employmentType: string
  experience?: string
  salaryRange?: string
  description: string
  requirements?: string
  status: 'Draft' | 'Published'
  isOpen: boolean
  createdAt: string
  updatedAt: string
}

export type AdminApplication = {
  id: string
  jobId: string
  jobTitle: string
  jobDepartment?: string
  name: string
  email: string
  phone?: string
  experience?: string
  location?: string
  portfolio?: string
  coverNote?: string
  status: 'New' | 'Reviewed' | 'Shortlisted' | 'Hired' | 'Rejected'
  createdAt: string
}

export const CAREERS_ADMIN_NAV: PanelNavItem[] = [
  { id: 'jobs', label: 'Job postings', icon: PanelIcons.store },
  { id: 'applications', label: 'Job applications', icon: PanelIcons.users },
]

const DEPARTMENT_OPTIONS = ['Engineering', 'Design', 'Sales', 'Marketing', 'Customer Support', 'Operations', 'General']

type JobFormState = {
  id: string
  title: string
  department: string
  location: string
  employmentType: string
  experience: string
  salaryRange: string
  description: string
  requirements: string
  status: 'Draft' | 'Published'
}

const emptyJobForm: JobFormState = {
  id: '', title: '', department: 'Engineering', location: 'Lucknow, India', employmentType: 'Full-time',
  experience: '', salaryRange: '', description: '', requirements: '', status: 'Draft',
}

function jobToForm(job: AdminJob): JobFormState {
  return { id: job.id, title: job.title, department: job.department, location: job.location, employmentType: job.employmentType, experience: job.experience || '', salaryRange: job.salaryRange || '', description: job.description, requirements: job.requirements || '', status: job.status }
}

export function JobsAdmin() {
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [form, setForm] = useState<JobFormState | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    void fetch('/api/admin/jobs', { credentials: 'same-origin' })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error('Unable to load job postings.')))
      .then((data) => { setJobs(data.jobs || []); setCounts(data.applicationCounts || {}) })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Unable to load job postings.'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!form) return
    setMessage('')
    try {
      const editing = Boolean(form.id)
      const response = await fetch(editing ? `/api/admin/jobs/${form.id}` : '/api/admin/jobs', {
        method: editing ? 'PATCH' : 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save the job.')
      setJobs((current) => {
        const nextJobs = editing ? current.map((job) => (job.id === data.job.id ? data.job : job)) : [data.job, ...current]
        return nextJobs
      })
      setMessage(`${data.job.title} ${editing ? 'updated' : 'created'}${data.job.status === 'Published' && data.job.isOpen !== false ? ' — it is live on the careers page.' : ' — it is hidden from the careers page until published and open.'}`)
      setForm(null)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save the job.')
    }
  }

  const patch = async (job: AdminJob, body: Record<string, unknown>) => {
    setMessage('')
    try {
      const response = await fetch(`/api/admin/jobs/${job.id}`, { method: 'PATCH', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to update the job.')
      setJobs((current) => current.map((item) => (item.id === data.job.id ? data.job : item)))
      setMessage(`${data.job.title} updated.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update the job.')
    }
  }

  const remove = async (job: AdminJob) => {
    if (!window.confirm(`Remove "${job.title}" from the careers portal? Existing applications are kept.`)) return
    setMessage('')
    const response = await fetch(`/api/admin/jobs/${job.id}`, { method: 'DELETE', credentials: 'same-origin' })
    if (response.ok) { setJobs((current) => current.filter((item) => item.id !== job.id)); setMessage(`${job.title} removed.`) }
    else setMessage('Unable to remove the job.')
  }

  return (
    <section className={`${box} mt-5`} aria-labelledby="admin-jobs-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="admin-jobs-heading" className="text-xl font-bold text-ink-950">Job postings</h2>
          <p className="mt-1 text-sm text-ink-400">Add or remove openings for the public careers page. Published + open roles appear instantly; draft or closed roles are hidden.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-outline-light btn-sm" onClick={load}>Refresh</button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setForm({ ...emptyJobForm })}>+ Add job</button>
        </div>
      </div>
      {message && <p role="status" className="mt-3 text-sm text-accent-600">{message}</p>}

      {form && (
        <form className="mt-5 rounded-2xl border border-line bg-paper p-4" onSubmit={(event) => { void save(event) }}>
          <h3 className="font-bold text-ink-950">{form.id ? `Edit: ${form.title}` : 'New job posting'}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">Job title<input className="input mt-1" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Full-Stack Developer" /></label>
            <label className="text-sm">Department<select className="input mt-1" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })}>{DEPARTMENT_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="text-sm">Location<input className="input mt-1" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="e.g. Remote — India & US / Lucknow, India" /></label>
            <label className="text-sm">Employment type<select className="input mt-1" value={form.employmentType} onChange={(event) => setForm({ ...form, employmentType: event.target.value })}>{['Full-time', 'Part-time', 'Contract', 'Internship'].map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="text-sm">Experience (optional)<input className="input mt-1" value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} placeholder="e.g. Fresher to 3 years" /></label>
            <label className="text-sm sm:col-span-2">Salary range (optional, as shown publicly)<input className="input mt-1" value={form.salaryRange} onChange={(event) => setForm({ ...form, salaryRange: event.target.value })} placeholder="e.g. ₹4–8 LPA" /></label>
            <label className="text-sm sm:col-span-2">Role description<input className="input mt-1" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What the role involves… (required)" /></label>
            <label className="text-sm sm:col-span-2">Requirements (optional)<textarea className="input mt-1 min-h-20" value={form.requirements} onChange={(event) => setForm({ ...form, requirements: event.target.value })} placeholder="Skills, experience, qualifications… one per line" /></label>
            <label className="text-sm">Visibility<select className="input mt-1" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as JobFormState['status'] })}><option value="Draft">Draft (hidden)</option><option value="Published">Published (live)</option></select></label>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="btn btn-primary btn-md">{form.id ? 'Save changes' : 'Create job'}</button>
            <button type="button" className="btn btn-outline-light btn-md" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <p className="mt-5 text-sm text-ink-400">Loading job postings…</p> : jobs.length ? (
        <div className="mt-5 divide-y divide-line">
          {jobs.map((job) => (
            <div key={job.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-ink-950">{job.title}</strong>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${job.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>{job.status}</span>
                  <span className="rounded-full bg-paper px-2.5 py-0.5 text-[11px] text-ink-300">{job.isOpen === false ? 'Closed' : 'Open'}</span>
                  <span className="rounded-full bg-accent-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent-600">{counts[job.id] || 0} applications</span>
                </div>
                <p className="mt-1 text-xs text-ink-400">{job.department} · {job.location} · {job.employmentType} · updated {new Date(job.updatedAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="btn btn-outline-light btn-sm" onClick={() => setForm(jobToForm(job))}>Edit</button>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => { void patch(job, { status: job.status === 'Published' ? 'Draft' : 'Published' }) }}>{job.status === 'Published' ? 'Unpublish' : 'Publish'}</button>
                <button type="button" className="btn btn-outline-light btn-sm" onClick={() => { void patch(job, { isOpen: !(job.isOpen !== false) }) }}>{job.isOpen === false ? 'Reopen' : 'Close applications'}</button>
                <button type="button" className="text-xs font-semibold text-flame-600 hover:underline" onClick={() => { void remove(job) }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="mt-5 rounded-2xl bg-paper p-5 text-sm text-ink-400">No job postings yet. Add one with "+ Add job" — publish it to show it on the public careers page.</p>}
    </section>
  )
}

const APPLICATION_STATUSES: AdminApplication['status'][] = ['New', 'Reviewed', 'Shortlisted', 'Hired', 'Rejected']

export function ApplicationsAdmin() {
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [unreadOnly, setUnreadOnly] = useState(true)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const load = (onlyUnread: boolean) => {
    setLoading(true)
    void fetch(`/api/admin/job-applications?status=${onlyUnread ? 'New' : 'all'}`, { credentials: 'same-origin' })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error('Unable to load applications.')))
      .then((data) => setApplications(data.applications || []))
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Unable to load applications.'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load(unreadOnly) }, [unreadOnly])

  const setStatus = async (application: AdminApplication, status: AdminApplication['status']) => {
    setMessage('')
    const response = await fetch(`/api/admin/job-applications/${application.id}`, { method: 'PATCH', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) })
    const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to update the application.'); return }
    setApplications((current) => current.map((item) => (item.id === data.application.id ? data.application : item)))
    setMessage(`${data.application.name} → ${data.application.status}.`)
  }

  const remove = async (application: AdminApplication) => {
    if (!window.confirm(`Delete the application from ${application.name}?`)) return
    const response = await fetch(`/api/admin/job-applications/${application.id}`, { method: 'DELETE', credentials: 'same-origin' })
    if (response.ok) setApplications((current) => current.filter((item) => item.id !== application.id))
    else setMessage('Unable to delete the application.')
  }

  return (
    <section className={`${box} mt-5`} aria-labelledby="admin-applications-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="admin-applications-heading" className="text-xl font-bold text-ink-950">Job applications</h2>
          <p className="mt-1 text-sm text-ink-400">Applications submitted through the public careers page. Anyone can apply — no account required.</p>
        </div>
        <div className="flex gap-2">
          <select aria-label="Application filter" className="input !w-auto !py-2 text-sm" value={unreadOnly ? 'New' : 'all'} onChange={(event) => setUnreadOnly(event.target.value === 'New')}>
            <option value="New">New only</option>
            <option value="all">All statuses</option>
          </select>
          <button type="button" className="btn btn-outline-light btn-sm" onClick={() => load(unreadOnly)}>Refresh</button>
        </div>
      </div>
      {message && <p role="status" className="mt-3 text-sm text-accent-600">{message}</p>}

      {loading ? <p className="mt-5 text-sm text-ink-400">Loading applications…</p> : applications.length ? (
        <div className="mt-5 max-h-[40rem] space-y-3 overflow-auto">
          {applications.map((application) => (
            <article key={application.id} className="rounded-2xl border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-ink-950">{application.name} <span className="text-xs font-normal text-ink-400">applied for</span> {application.jobTitle}</h3>
                  <p className="mt-1 break-all text-sm text-ink-400">{application.email}{application.phone ? ` · ${application.phone}` : ''}{application.experience ? ` · ${application.experience}` : ''}{application.location ? ` · ${application.location}` : ''}</p>
                  {application.portfolio && <p className="mt-1 break-all text-sm"><a href={application.portfolio} target="_blank" rel="noopener noreferrer" className="text-accent-600 hover:underline">{application.portfolio}</a></p>}
                </div>
                <div className="flex items-center gap-2">
                  <select aria-label={`Status for ${application.name}`} className="input !w-auto !py-2 text-sm" value={application.status} onChange={(event) => { void setStatus(application, event.target.value as AdminApplication['status']) }}>
                    {APPLICATION_STATUSES.map((status) => <option key={status}>{status}</option>)}
                  </select>
                  <button type="button" onClick={() => { void remove(application) }} className="text-xs font-semibold text-flame-600 hover:underline" aria-label={`Delete application from ${application.name}`}>Delete</button>
                </div>
              </div>
              {application.coverNote && <p className="mt-3 whitespace-pre-line rounded-xl bg-paper p-3 text-sm text-ink-500">{application.coverNote}</p>}
              <time className="mt-2 block text-xs text-ink-400" dateTime={application.createdAt}>Applied {new Date(application.createdAt).toLocaleString()}</time>
            </article>
          ))}
        </div>
      ) : <p className="mt-5 rounded-2xl bg-paper p-5 text-sm text-ink-400">{unreadOnly ? 'No new applications. Switch to "All statuses" to review the full pipeline.' : 'No applications yet.'}</p>}
    </section>
  )
}
