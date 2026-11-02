import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/stores'

type Organization = { id: string; name: string; role: string }
type Article = { id: string; title: string; summary: string; body: string; productSlug: string | null }
type Attachment = { id: string; name: string; mime: string; size: number; downloadUrl: string }
type Message = { id: string; authorType: string; authorName: string; body: string; isInternal: boolean; createdAt: string; attachments?: Attachment[] }
type Ticket = { id: string; organizationId: string; productSlug: string | null; subject: string; status: string; priority: string; updatedAt: string; messages: Message[] }
type AssistantResult = { disclosure: string; answer: string; sources: Array<{ id: string; title: string; excerpt: string }> }

async function filesPayload(files: File[]) {
  return Promise.all(files.map(async (file) => {
    if (file.size > 3 * 1024 * 1024) throw new Error(`${file.name} exceeds the 3 MB attachment limit.`)
    const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(new Error(`Could not read ${file.name}.`)); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file) })
    return { name: file.name, contentBase64: dataUrl.split(',')[1] || '' }
  }))
}

export function SaaSSupportPage() {
  const { user } = useAuth()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [organizationId, setOrganizationId] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [question, setQuestion] = useState('')
  const [assistant, setAssistant] = useState<AssistantResult | null>(null)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const refresh = async () => {
    const [orgResponse, ticketResponse] = await Promise.all([fetch('/api/saas/organizations', { credentials: 'same-origin' }), fetch('/api/saas/support/tickets', { credentials: 'same-origin' })])
    if (orgResponse.ok) { const data = await orgResponse.json(); setOrganizations(data.organizations); if (!organizationId && data.organizations[0]) setOrganizationId(data.organizations[0].id) }
    if (ticketResponse.ok) { const data = await ticketResponse.json(); setTickets(data.tickets); if (selected) setSelected(data.tickets.find((item: Ticket) => item.id === selected.id) || null) }
  }
  useEffect(() => { if (user) void refresh().catch(() => setNotice('Support data could not be loaded.')) }, [user?.id])
  const searchArticles = async (event?: FormEvent) => {
    event?.preventDefault(); const response = await fetch(`/api/saas/support/knowledge?q=${encodeURIComponent(search)}`); const data = await response.json()
    if (!response.ok) { setNotice(data.error || 'Knowledge search failed.'); return }
    setArticles(data.articles)
  }
  useEffect(() => { void searchArticles() }, [])
  const createTicket = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setNotice('')
    try {
      const response = await fetch('/api/saas/support/tickets', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ organizationId, subject, message, handoverSummary: assistant?.answer || '' }) }); const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to create support ticket.')
      setSelected(data.ticket); setSubject(''); setMessage(''); setNotice(`Ticket ${data.ticket.id} created. A support agent can continue here.`); await refresh()
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Unable to create support ticket.') }
    finally { setBusy(false) }
  }
  const sendReply = async (event: FormEvent) => {
    event.preventDefault(); if (!selected) return
    setBusy(true); setNotice('')
    try {
      const attachments = await filesPayload(files)
      const response = await fetch(`/api/saas/support/tickets/${encodeURIComponent(selected.id)}/messages`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: reply, attachments }) }); const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to send reply.')
      setReply(''); setFiles([]); await refresh(); setNotice('Your reply was added to the ticket.')
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Unable to send reply.') }
    finally { setBusy(false) }
  }
  const askAssistant = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setAssistant(null); setNotice('')
    try { const response = await fetch('/api/saas/support/assistant', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Automated help is unavailable.'); setAssistant(data) }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Automated help is unavailable.') }
    finally { setBusy(false) }
  }
  if (!user) return <section className="container-page py-20 text-center"><h1 className="text-3xl font-bold">Sign in to get support</h1><Link to="/my-account/" className="btn btn-primary btn-md mt-5 inline-flex">Go to account</Link></section>
  return <section className="section-light min-h-screen py-12"><div className="container-page"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">MYR Software support</p><h1 className="mt-2 text-3xl font-bold text-ink-950">Help and support</h1><p className="mt-2 text-sm text-ink-500">Automated help uses approved articles only. A person handles tickets and billing questions.</p></div><Link to="/workspace/" className="text-sm font-semibold text-accent-700">← Workspace</Link></div>{notice && <p role="status" className="mt-5 rounded-xl border border-line bg-white p-4 text-sm">{notice}</p>}
    <div className="mt-6 grid gap-5 xl:grid-cols-2"><section className="rounded-3xl border border-line bg-white p-6"><h2 className="text-xl font-bold">Automated help</h2><p className="mt-2 text-sm text-ink-500">This assistant returns exact excerpts from approved MYR help articles. It does not use a generative model, access private account data, or perform financial actions.</p><form onSubmit={(event) => void askAssistant(event)} className="mt-4 flex gap-2"><input className="input min-w-0 flex-1" required minLength={3} maxLength={1000} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about a MYR product"/><button className="btn btn-primary btn-sm" disabled={busy}>Search help</button></form>{assistant && <div className="mt-4 rounded-2xl bg-paper p-4"><p className="whitespace-pre-line text-sm leading-relaxed">{assistant.answer}</p>{assistant.sources.length > 0 && <div className="mt-3 space-y-2">{assistant.sources.map((source) => <Link key={source.id} to={`/support/?article=${source.id}`} className="block rounded-xl bg-white p-3 text-sm"><strong>{source.title}</strong><span className="mt-1 block text-xs text-ink-500">{source.excerpt}</span></Link>)}</div>}</div>}{assistant && <button type="button" className="mt-3 text-sm font-semibold text-accent-700" onClick={() => { setSubject(`Help request: ${question.slice(0, 150)}`); setMessage(`Question: ${question}\n\nAutomated help searched approved articles and returned these sources: ${assistant.sources.map((source) => source.title).join(", ") || "no matching article"}.\n\nPlease review and help.`); setNotice("Handover summary copied into the ticket form. Choose an organization and submit to reach a support agent.") }}>Prepare a human support handover →</button>}<form onSubmit={(event) => void searchArticles(event)} className="mt-6 border-t border-line pt-4"><label className="label">Search help articles<input className="input mt-2" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search approved guidance"/></label><button className="mt-3 text-sm font-semibold text-accent-700">Search articles</button></form><div className="mt-3 space-y-2">{articles.map((article) => <article key={article.id} id={article.id} className="rounded-xl border border-line p-3"><h3 className="font-bold">{article.title}</h3>{article.productSlug && <p className="text-xs text-ink-400">{article.productSlug}</p>}<p className="mt-1 text-sm text-ink-600">{article.summary}</p><details className="mt-2"><summary className="cursor-pointer text-xs font-semibold text-accent-700">Read article</summary><p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-600">{article.body}</p></details></article>)}</div></section>
      <section className="rounded-3xl border border-line bg-white p-6"><h2 className="text-xl font-bold">Contact a support agent</h2><form onSubmit={(event) => void createTicket(event)} className="mt-4 space-y-3"><label className="label block">Organization<select className="input mt-2" required value={organizationId} onChange={(event) => setOrganizationId(event.target.value)}><option value="">Choose organization</option>{organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}</select></label><label className="label block">Subject<input className="input mt-2" required minLength={3} maxLength={180} value={subject} onChange={(event) => setSubject(event.target.value)}/></label><label className="label block">Describe the issue<textarea className="input mt-2 min-h-24" required minLength={2} maxLength={12000} value={message} onChange={(event) => setMessage(event.target.value)}/></label><button disabled={busy || !organizations.length} className="btn btn-primary btn-sm">Create support ticket</button></form><div className="mt-6 border-t border-line pt-4"><h3 className="font-bold">Your tickets</h3>{tickets.length ? <div className="mt-3 space-y-2">{tickets.map((ticket) => <button type="button" key={ticket.id} onClick={() => setSelected(ticket)} className={`w-full rounded-xl border p-3 text-left ${selected?.id === ticket.id ? 'border-accent-500 bg-accent-50' : 'border-line'}`}><div className="flex justify-between gap-3 text-sm"><strong>{ticket.subject}</strong><span>{ticket.priority}</span></div><p className="mt-1 text-xs text-ink-500">{ticket.id} · {ticket.status} · updated {new Date(ticket.updatedAt).toLocaleString()}</p></button>)}</div> : <p className="mt-3 text-sm text-ink-400">No support tickets yet.</p>}</div></section></div>
    {selected && <section className="mt-5 rounded-3xl border border-line bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">{selected.id} · {selected.status}</p><h2 className="mt-1 text-xl font-bold">{selected.subject}</h2><p className="mt-1 text-xs text-ink-500">Priority: {selected.priority} · {selected.productSlug || 'General support'}</p></div><button type="button" className="text-sm text-ink-500" onClick={() => setSelected(null)}>Close</button></div>{selected.messages.map((item) => <article key={item.id} className="mt-4 rounded-xl bg-paper p-4"><div className="flex justify-between gap-3 text-xs"><strong>{item.authorType === 'agent' ? 'MYR Support' : 'You'}</strong><time>{new Date(item.createdAt).toLocaleString()}</time></div><p className="mt-2 whitespace-pre-line text-sm">{item.body}</p>{item.attachments?.map((attachment) => <a key={attachment.id} className="mt-2 block text-xs font-semibold text-accent-700" href={attachment.downloadUrl}>{attachment.name} · {(attachment.size / 1024).toFixed(0)} KB · download</a>)}</article>)}{selected.status !== 'Closed' && <form onSubmit={(event) => void sendReply(event)} className="mt-4"><label className="label">Reply<textarea className="input mt-2 min-h-20" minLength={2} maxLength={12000} required value={reply} onChange={(event) => setReply(event.target.value)}/></label><input className="mt-3 block text-sm" type="file" multiple accept="application/pdf,image/png,image/jpeg,text/plain" onChange={(event) => setFiles(Array.from(event.target.files || []))}/><p className="mt-1 text-xs text-ink-400">Up to 3 files, 3 MB each. PDF, PNG, JPEG, or plain text.</p><button disabled={busy} className="btn btn-primary btn-sm mt-3">Send reply</button></form>}</section>}
  </div></section>
}
