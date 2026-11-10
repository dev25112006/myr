import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { HumanVerification, turnstileSiteKey } from '@/components/forms/HumanVerification'
import { SITE_ORIGIN } from '@/lib/seoLd'

const box = 'rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6'

export type PublicJob = {
  id: string
  title: string
  department: string
  location: string
  employmentType: string
  experience?: string
  salaryRange?: string
  description: string
  requirements?: string
  createdAt: string
}

const DEPARTMENTS = ['All departments', 'Engineering', 'Design', 'Sales', 'Marketing', 'Customer Support', 'Operations', 'General']
const EXPERIENCE_OPTIONS = ['Fresher (0–1 years)', '1–3 years', '3–5 years', '5+ years', '10+ years']

function formatDate(value: string) {
  try { return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' }
}

/** JobPosting JSON-LD so published roles can surface as Google job results (IN / US). */
function injectCareersLd(jobs: PublicJob[]) {
  let el = document.getElementById('ld-careers') as HTMLScriptElement | null
  if (!el) { el = document.createElement('script'); el.id = 'ld-careers'; el.type = 'application/ld+json'; document.head.appendChild(el) }
  if (!jobs.length) { el.remove(); return }
  const postings = jobs.map((job) => ({
    '@type': 'JobPosting',
    title: job.title,
    description: `${job.description}${job.requirements ? `\n\nRequirements: ${job.requirements}` : ''}`,
    datePosted: job.createdAt,
    employmentType: job.employmentType === 'Full-time' ? 'FULL_TIME' : job.employmentType === 'Part-time' ? 'PART_TIME' : job.employmentType === 'Contract' ? 'CONTRACTOR' : 'INTERN',
    hiringOrganization: { '@type': 'Organization', name: 'MYR Advance Solution', sameAs: `${SITE_ORIGIN}/` },
    jobLocationType: /remote/i.test(job.location) ? 'TELECOMMUTE' : undefined,
    jobLocation: /remote/i.test(job.location) ? undefined : { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: /united states|us\b|\bny\b/i.test(job.location) ? 'US' : 'IN' } },
    ...(job.salaryRange ? { baseSalary: { '@type': 'MonetaryAmount', currency: 'INR', value: { '@type': 'QuantitativeValue', value: job.salaryRange, unitText: 'YEAR' } } } : {}),
    applicantLocationRequirements: /remote/i.test(job.location) ? [{ '@type': 'Country', name: 'India' }, { '@type': 'Country', name: 'United States' }] : undefined,
    directApply: true,
  }))
  el.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', mainEntityOfPage: `${SITE_ORIGIN}/careers/`, itemListElement: postings })
}

export function CareersPage() {
  const [jobs, setJobs] = useState<PublicJob[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [department, setDepartment] = useState(DEPARTMENTS[0])
  const [query, setQuery] = useState('')
  const [activeJob, setActiveJob] = useState<PublicJob | null>(null)

  useEffect(() => {
    let active = true
    void fetch('/api/jobs', { credentials: 'same-origin' })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error('Unable to load open positions.')))
      .then((data) => { if (active) { setJobs(data.jobs || []); injectCareersLd(data.jobs || []) } })
      .catch(() => { if (active) setLoadError('Unable to check for open positions. Please refresh in a moment.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const visible = useMemo(() => jobs.filter((job) => {
    const inDepartment = department === DEPARTMENTS[0] || job.department === department
    const q = query.trim().toLowerCase()
    const inSearch = !q || [job.title, job.location, job.department, job.employmentType].some((field) => field.toLowerCase().includes(q))
    return inDepartment && inSearch
  }), [jobs, department, query])

  const departmentsPresent = useMemo(() => DEPARTMENTS.filter((name) => name === DEPARTMENTS[0] || jobs.some((job) => job.department === name)), [jobs])

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="section-dark">
        <div className="container-page py-16 text-center sm:py-20">
          <p className="eyebrow">Careers at MYR</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold text-ink-950 sm:text-5xl">
            Build the software businesses in India &amp; the US run on
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
            Join a team shipping websites, CRM, HRMS, ERP, VoIP and IT infrastructure products for growing businesses in India and the United States. Anyone can apply — no login required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#open-positions" className="btn btn-primary btn-md">See open positions</a>
            <Link to="/contact-us/" className="btn btn-outline-light btn-md">Get in touch</Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
            <span>Remote-friendly</span><span>·</span>
            <span>Full-time · Part-time · Contract · Internship</span><span>·</span>
            <span>India &amp; US teams</span>
          </div>
        </div>
      </section>

      {/* Why join */}
      <section className="container-page -mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { title: 'Real products, real users', text: 'Work on CRM, HRMS, education ERP and VoIP systems used daily by teams in India and the US.' },
          { title: 'Grow across stacks', text: 'Engineering, design, sales and support — move with the business as it scales.' },
          { title: 'Hire on potential', text: 'We hire freshers and experienced professionals alike. Every application is reviewed by a human.' },
        ].map((item) => (
          <div key={item.title} className="rounded-3xl border border-line bg-white p-5 shadow-card">
            <h2 className="font-bold text-ink-950">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">{item.text}</p>
          </div>
        ))}
      </section>

      {/* Open positions */}
      <section id="open-positions" className="container-page pt-16" aria-labelledby="open-positions-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Open positions</p>
            <h2 id="open-positions-heading" className="mt-2 text-3xl font-bold text-ink-950">Current job openings</h2>
          </div>
          {jobs.length > 0 && <p className="text-sm text-ink-400">{jobs.length} role{jobs.length === 1 ? '' : 's'} open · updated regularly</p>}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="careers-search">Search positions</label>
          <input
            id="careers-search"
            className="input sm:max-w-xs"
            placeholder="Search title, location, type…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {departmentsPresent.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setDepartment(name)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${department === name ? 'border-accent-400 bg-accent-400/10 text-accent-700' : 'border-line bg-white text-ink-300 hover:text-ink-950'}`}
                aria-pressed={department === name}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="mt-8 grid gap-4 md:grid-cols-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-40 animate-pulse rounded-3xl bg-paper" />)}</div>}
        {loadError && !loading && <p role="alert" className={`${box} mt-6 text-sm text-flame-600`}>{loadError}</p>}

        {/* Empty state — shown whenever no published positions are available */}
        {!loading && !loadError && visible.length === 0 && (
          <div className={`${box} mt-8 text-center`}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-400/10" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-accent-600">
                <path d="M15.5 8.5 21 14l-5.5 5.5M21 14H9.5A4.5 4.5 0 0 1 5 9.5V9" />
                <path d="M3 5v13.5" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-bold text-ink-950">
              {jobs.length === 0 ? 'No open positions right now' : 'No positions match your filters'}
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-400">
              {jobs.length === 0
                ? 'All current roles have been filled. Our team publishes new openings here as they open — for engineering, design, sales, marketing and support across our India and US operations. Check back soon, or send us your details and we will reach out when a matching role opens.'
                : 'Try a different department or clear the search to see every open role.'}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {jobs.length > 0 && <button type="button" className="btn btn-primary btn-md" onClick={() => { setQuery(''); setDepartment(DEPARTMENTS[0]) }}>Show all positions</button>}
              <Link to="/contact-us/" className="btn btn-outline-light btn-md">Send us your profile</Link>
              <Link to="/blogs/" className="btn btn-dark btn-md">Read our insights</Link>
            </div>
          </div>
        )}

        {!loading && !loadError && visible.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {visible.map((job) => (
              <article key={job.id} className={`${box} flex flex-col`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent-400/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-600">{job.department}</span>
                  <span className="rounded-full bg-paper px-2.5 py-1 text-xs text-ink-300">{job.employmentType}</span>
                  {/remote/i.test(job.location) && <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Remote</span>}
                </div>
                <h3 className="mt-3 text-lg font-bold text-ink-950">{job.title}</h3>
                <p className="mt-1 text-sm text-ink-400">
                  {job.location}{job.experience ? ` · ${job.experience}` : ''}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-500">{job.description}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <time dateTime={job.createdAt} className="text-xs text-ink-400">Posted {formatDate(job.createdAt)}</time>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setActiveJob(job)}>View details &amp; apply</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {activeJob && <JobDetailModal job={activeJob} onClose={() => setActiveJob(null)} />}
    </div>
  )
}

function JobDetailModal({ job, onClose }: { job: PublicJob; onClose: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [experience, setExperience] = useState('')
  const [location, setLocation] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [coverNote, setCoverNote] = useState('')
  const [humanToken, setHumanToken] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [appliedId, setAppliedId] = useState('')

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (turnstileSiteKey && !humanToken) { setError('Complete human verification before applying.'); return }
    setSending(true)
    try {
      const response = await fetch(`/api/jobs/${job.id}/apply`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, phone, experience, location, portfolio, coverNote, humanToken }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to submit your application.')
      setAppliedId(data.applicationId as string)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit your application.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/50 backdrop-blur-[2px] sm:items-center" role="dialog" aria-modal="true" aria-label={`${job.title} — details and application`}>
      <button type="button" aria-label="Close" className="absolute inset-0 cursor-default" onClick={onClose} tabIndex={-1} />
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent-400/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-600">{job.department}</span>
              <span className="rounded-full bg-paper px-2.5 py-1 text-xs text-ink-300">{job.employmentType}</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-ink-950">{job.title}</h2>
            <p className="mt-1 text-sm text-ink-400">{job.location}{job.experience ? ` · ${job.experience}` : ''}{job.salaryRange ? ` · ₹ ${job.salaryRange}` : ''}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-ink-300 transition hover:bg-paper hover:text-ink-950">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-500">
          <div><h3 className="font-bold text-ink-950">About the role</h3><p className="mt-1 whitespace-pre-line">{job.description}</p></div>
          {job.requirements && <div><h3 className="font-bold text-ink-950">What we look for</h3><p className="mt-1 whitespace-pre-line">{job.requirements}</p></div>}
        </div>

        {appliedId ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
            <h3 className="text-lg font-bold text-emerald-800">Application submitted ✅</h3>
            <p className="mt-1 text-sm text-emerald-700">Reference <strong>{appliedId}</strong>. We review every application and will reach out if your profile matches the role.</p>
            <button type="button" className="btn btn-primary btn-md mt-4" onClick={onClose}>Back to open positions</button>
          </div>
        ) : (
          <form className="mt-6 border-t border-line pt-5" onSubmit={(event) => { void submit(event) }}>
            <h3 className="font-bold text-ink-950">Apply for this position</h3>
            <p className="mt-1 text-xs text-ink-400">Open to everyone — freshers and experienced candidates from India, the US, or anywhere. No sign-up needed.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm">Full name<input className="input mt-1" required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>
              <label className="text-sm">Email<input className="input mt-1" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
              <label className="text-sm">Phone (optional)<input className="input mt-1" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" /></label>
              <label className="text-sm">Experience<select className="input mt-1" value={experience} onChange={(event) => setExperience(event.target.value)}>{EXPERIENCE_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></label>
              <label className="text-sm">Current city / country<input className="input mt-1" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Lucknow, India" /></label>
              <label className="text-sm">Portfolio / LinkedIn (optional)<input className="input mt-1" value={portfolio} onChange={(event) => setPortfolio(event.target.value)} placeholder="https://…" inputMode="url" /></label>
            </div>
            <label className="mt-3 block text-sm">Why are you a good fit? (optional)<textarea className="input mt-1 min-h-24" value={coverNote} onChange={(event) => setCoverNote(event.target.value)} maxLength={4000} /></label>
            {turnstileSiteKey && <div className="mt-4"><HumanVerification onVerified={setHumanToken} /></div>}
            {error && <p role="alert" className="mt-3 text-sm text-flame-600">{error}</p>}
            <button type="submit" className="btn btn-primary btn-md mt-4 w-full sm:w-auto" disabled={sending || Boolean(turnstileSiteKey) && !humanToken}>
              {sending ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
