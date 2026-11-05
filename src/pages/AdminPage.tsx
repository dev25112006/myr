import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { inr } from '@/lib/format'
import { useAuth, type TeamMember } from '@/lib/stores'
import { Link } from 'react-router-dom'
import { PanelShell, PanelIcons, type PanelNavItem } from '@/components/panel/PanelShell'

const box = 'rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6'

export function AdminPage() {
  const { user, users, refreshUsers, setUserRole, serverInbox, refreshInbox, setServerInboxStatus } = useAuth()
  const [team, setTeam] = useState<TeamMember[]>([])
  const [roleError, setRoleError] = useState('')
  const [teamName, setTeamName] = useState('')
  const [teamEmail, setTeamEmail] = useState('')
  const [teamDepartment, setTeamDepartment] = useState('Development')
  const [teamTitle, setTeamTitle] = useState('')
  const [teamMessage, setTeamMessage] = useState('')
  const [catalog, setCatalog] = useState<Array<{ id: number; name: string; category: string; price: number }>>([])
  const [serverOrders, setServerOrders] = useState<Array<{ id: string; email: string; total: number; status: string; paymentStatus: string; date: string; items: Array<{ name: string; qty: number }> }>>([])
  const [auditEvents, setAuditEvents] = useState<Array<{ id: string; actorEmail: string; action: string; target: string; detail?: Record<string, unknown>; date: string }>>([])
  const [catalogMessage, setCatalogMessage] = useState('')
  const [section, setSection] = useState('overview')
  const monthly = useMemo(() => Array.from({ length: 6 }, (_, offset) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - offset), 1)
    const count = serverOrders.filter((transaction) => {
      const paid = new Date(transaction.date)
      return paid.getMonth() === date.getMonth() && paid.getFullYear() === date.getFullYear()
    }).length
    return { label: date.toLocaleDateString(undefined, { month: 'short' }), count }
  }), [serverOrders])
  const max = Math.max(1, ...monthly.map((month) => month.count))
  useEffect(() => { if (user?.role === 'admin') void refreshUsers().catch((error) => setRoleError(error.message)) }, [user, refreshUsers])
  useEffect(() => { if (user?.role === 'admin') void fetch('/api/catalog').then((r) => r.json()).then((d) => setCatalog(d.products ?? [])).catch(() => setCatalogMessage('Unable to load server catalog.')) }, [user])
  useEffect(() => {
    if (user?.role !== 'admin') return
    let active = true
    const refresh = () => { if (document.visibilityState !== 'hidden') void fetch('/api/admin/orders', { credentials: 'same-origin' }).then((r) => r.ok ? r.json() : null).then((d) => { if (active && d) setServerOrders(d.orders) }).catch(() => {}) }
    refresh()
    const timer = window.setInterval(refresh, 15000)
    window.addEventListener('focus', refresh)
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('focus', refresh) }
  }, [user])
  useEffect(() => { if (user?.role === 'admin') void fetch('/api/manager/team', { credentials: 'same-origin' }).then((r) => r.ok ? r.json() : null).then((d) => { if (d) setTeam(d.team) }) }, [user])
  useEffect(() => { if (user?.role === 'admin') void fetch('/api/admin/audit', { credentials: 'same-origin' }).then((r) => r.ok ? r.json() : null).then((d) => { if (d) setAuditEvents(d.events) }) }, [user])
  const updatePrice = async (id: number, price: number) => { setCatalogMessage(''); try { const r = await fetch('/api/admin/catalog', { method: 'PATCH', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, price }) }); const d = await r.json(); if (!r.ok) throw new Error(d.error); setCatalog((previous) => previous.map((p) => p.id === id ? { ...p, price: d.product.price } : p)); window.dispatchEvent(new Event('myr:catalog-updated')); setCatalogMessage('Catalog price saved.') } catch (e) { setCatalogMessage(e instanceof Error ? e.message : 'Unable to save catalog settings.') } }

  const onAddTeamMember = async (event: FormEvent) => {
    event.preventDefault()
    const response = await fetch('/api/manager/team', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: teamName.trim(), email: teamEmail.trim(), department: teamDepartment, title: teamTitle.trim() }) })
    const data = await response.json()
    if (!response.ok) { setTeamMessage(data.error || 'Unable to add team member.'); return }
    setTeam((previous) => [data.member, ...previous]); setTeamMessage(`${teamName.trim()} added to the team.`); setTeamName(''); setTeamEmail(''); setTeamTitle('')
  }
  const removeTeamMember = async (id: string) => { const response = await fetch(`/api/manager/team/${id}`, { method: 'DELETE', credentials: 'same-origin' }); if (response.ok) setTeam((previous) => previous.filter((member) => member.id !== id)); else setTeamMessage('Unable to remove team member.') }

  if (!user) return <div className="container-page py-20 text-center"><h1 className="text-3xl font-bold text-ink-950">Admin sign in required</h1><p className="mt-3 text-ink-400">Sign in with an admin account to access the panel.</p><Link className="btn btn-primary btn-md mt-6 inline-flex" to="/my-account/">Go to account</Link></div>
  if (user.role !== 'admin') return <div className="container-page py-20 text-center"><h1 className="text-3xl font-bold text-ink-950">Admin access only</h1><p className="mt-3 text-ink-400">Your account role is customer.</p><Link className="btn btn-primary btn-md mt-6 inline-flex" to="/my-account/">Back to my account</Link></div>

  const adminNav: PanelNavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: PanelIcons.chart },
    { id: 'submissions', label: 'Form submissions', icon: PanelIcons.inbox, badge: serverInbox.filter((entry) => entry.status !== 'Resolved').length || undefined },
    { id: 'orders', label: 'Orders', icon: PanelIcons.orders, badge: serverOrders.length || undefined },
    { id: 'customers', label: 'Customers', icon: PanelIcons.users },
    { id: 'catalog', label: 'Catalog & prices', icon: PanelIcons.tag },
    { id: 'settings', label: 'Commerce settings', icon: PanelIcons.settings },
    { id: 'team', label: 'Team members', icon: PanelIcons.users, badge: team.length || undefined },
    { id: 'access', label: 'Roles & access', icon: PanelIcons.shield },
    { id: 'reviews', label: 'Review moderation', icon: PanelIcons.star },
    { id: 'audit', label: 'Activity log', icon: PanelIcons.list },
  ]
  const revenue = serverOrders.filter((order) => ['Paid', 'In progress', 'Completed'].includes(order.status)).reduce((sum, order) => sum + order.total, 0)
  return <PanelShell storageKey="myr.panel.admin" eyebrow="Administration" title="Admin dashboard" meta={user.email} nav={adminNav} active={section} onSelect={setSection}><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Administration</p><h1 className="mt-2 text-3xl font-bold text-ink-950 sm:text-4xl">Admin dashboard</h1><p className="mt-2 text-sm text-ink-400">Account roles are managed by the server.</p></div><div className="flex items-center gap-3"><Link to="/manager/" className="btn btn-primary btn-sm">Manager inbox · {serverInbox.filter((entry) => entry.status !== 'Resolved').length}</Link></div></div>
    {section === 'submissions' && <>
    <section className={`${box} mb-5`}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-ink-950">Website form submissions</h2><p className="mt-1 text-sm text-ink-400">Leads, appointment requests, partnership inquiries, and support tickets saved by the backend.</p></div><button type="button" className="btn btn-outline-light btn-sm" onClick={() => void refreshInbox()}>Refresh submissions</button></div>{serverInbox.length ? <div className="mt-4 max-h-[36rem] space-y-3 overflow-auto">{serverInbox.filter((entry) => entry.type !== 'order').map((entry) => <article key={entry.id} className="rounded-2xl border border-line p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-accent-400/10 px-2.5 py-1 text-xs font-bold uppercase text-accent-600">{entry.type}</span><span className="text-xs text-ink-400">{entry.source}</span><span className="text-xs text-ink-400">{new Date(entry.date).toLocaleString()}</span></div><h3 className="mt-2 font-bold capitalize text-ink-950">{entry.subject}</h3><p className="mt-1 text-sm text-ink-400">{entry.name}{entry.email ? ` · ${entry.email}` : ''}</p></div><select aria-label={`Update status for ${entry.subject}`} className="input !w-auto !py-2 text-sm" value={entry.status} onChange={(event) => void setServerInboxStatus(entry.id, event.target.value as typeof entry.status).catch(() => {})}><option>New</option><option>In progress</option><option>Resolved</option></select></div>{entry.message && <p className="mt-3 whitespace-pre-line break-words rounded-xl bg-paper p-3 text-sm text-ink-300">{entry.message}</p>}{entry.replies?.map((reply) => <div key={reply.id} className="mt-2 rounded-xl border border-line p-3 text-sm"><p className="font-semibold">{reply.author}</p><p className="mt-1 whitespace-pre-line">{reply.message}</p></div>)}</article>)}</div> : <p className="mt-4 rounded-xl bg-paper p-5 text-sm text-ink-400">No submissions yet. New website form responses will appear here.</p>}</section>
    </>}
    {section === 'overview' && <>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Total customers" value={users.filter((account) => account.role === 'customer').length.toString()} /><Metric label="Server orders" value={serverOrders.length.toString()} /><Metric label="Confirmed sales" value={inr(revenue)} /><Metric label="Products & plans" value={catalog.length.toString()} /></div>
    <div className="mt-5 grid gap-5 lg:grid-cols-2"><section className={box}><h2 className="text-xl font-bold text-ink-950">Order activity</h2><p className="mt-1 text-sm text-ink-400">Orders per month</p><div className="mt-7 flex h-48 items-end justify-around gap-3 border-b border-line px-2">{monthly.map((month) => <div key={`${month.label}-${month.count}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-xs font-semibold text-ink-300">{month.count}</span><div className="w-full max-w-12 rounded-t-lg bg-accent-400" style={{ height: `${Math.max(6, month.count / max * 120)}px` }} /><span className="pb-2 text-xs text-ink-400">{month.label}</span></div>)}</div><p className="mt-4 text-xs text-ink-400">Order counts are based on server-persisted requests.</p></section></div>
    </>}
    {section === 'catalog' && <>
      <section className={box}><h2 className="text-xl font-bold text-ink-950">Products and plans</h2><p className="mt-1 text-sm text-ink-400">Change the server catalog price used when a customer places an order.</p>{catalogMessage && <p className="mt-3 text-sm text-accent-600">{catalogMessage}</p>}<div className="mt-4 max-h-96 overflow-auto divide-y divide-line">{catalog.map((product) => <PriceEditor key={product.id} product={product} onSave={updatePrice} />)}</div></section>
    </>}
    {section === 'settings' && <>
    <CommerceSettings />
    </>}
    {section === 'orders' && <>
    <section className={`${box} mt-5`}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-ink-950">Recent orders</h2><p className="mt-1 text-sm text-ink-400">Updates automatically while this panel is open.</p></div><button type="button" className="btn btn-outline-light btn-sm" onClick={() => void fetch('/api/admin/orders', { credentials: 'same-origin' }).then((r) => r.ok ? r.json() : null).then((d) => { if (d) setServerOrders(d.orders) })}>Refresh orders</button></div>{serverOrders.length ? <>
      <div className="mt-4 space-y-3 lg:hidden">{serverOrders.map((order) => <article key={order.id} className="min-w-0 rounded-2xl border border-line p-4"><div className="flex flex-wrap items-start justify-between gap-2"><strong className="break-all text-sm text-ink-950">{order.id}</strong><span className="rounded-full bg-paper px-2.5 py-1 text-xs capitalize text-ink-300">{order.status}</span></div><p className="mt-1 break-all text-xs text-ink-400">{order.email}</p><p className="mt-3 break-words text-sm text-ink-300">{order.items.map((item) => `${item.name} × ${item.qty}`).join(', ')}</p><div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-line pt-3 text-sm"><strong>{inr(order.total)}</strong><span className="capitalize text-ink-400">Payment: {order.paymentStatus}</span></div><time className="mt-2 block text-xs text-ink-400">{new Date(order.date).toLocaleString()}</time></article>)}</div>
      <div className="mt-4 hidden overflow-x-auto lg:block"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="border-b border-line text-xs uppercase tracking-wide text-ink-400"><th className="py-3 pr-4">Order</th><th className="py-3 pr-4">Customer</th><th className="py-3 pr-4">Items</th><th className="py-3 pr-4">Total</th><th className="py-3 pr-4">Payment</th><th className="py-3">Status</th></tr></thead><tbody>{serverOrders.map((order) => <tr key={order.id} className="border-b border-line last:border-0"><td className="py-3 pr-4"><strong>{order.id}</strong><div className="text-xs text-ink-400">{new Date(order.date).toLocaleString()}</div></td><td className="py-3 pr-4">{order.email}</td><td className="py-3 pr-4">{order.items.map((item) => `${item.name} × ${item.qty}`).join(', ')}</td><td className="py-3 pr-4">{inr(order.total)}</td><td className="py-3 pr-4 capitalize">{order.paymentStatus}</td><td className="py-3">{order.status}</td></tr>)}</tbody></table></div>
    </> : <p className="mt-4 rounded-xl bg-paper p-5 text-sm text-ink-400">No orders yet.</p>}</section>
    </>}
    {section === 'audit' && <>
    <section className={`${box} mt-5`}><h2 className="text-xl font-bold text-ink-950">Admin activity</h2><p className="mt-1 text-sm text-ink-400">Recent role, pricing, order, and commerce setting changes.</p>{auditEvents.length ? <div className="mt-4 max-h-80 divide-y divide-line overflow-auto">{auditEvents.map((event) => <div key={event.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span><strong>{event.action}</strong> · {event.target} · {event.actorEmail}</span><time className="text-xs text-ink-400">{new Date(event.date).toLocaleString()}</time></div>)}</div> : <p className="mt-4 text-sm text-ink-400">No administrative changes recorded yet.</p>}</section>
    </>}
    {section === 'customers' && <>
    <section className={`${box} mt-5`}><h2 className="text-xl font-bold text-ink-950">Customers and purchases</h2><p className="mt-1 text-sm text-ink-400">{users.filter((account) => account.role === 'customer').length} customer accounts · {serverOrders.length} server orders</p>{users.filter((account) => account.role === 'customer').length ? <>
      <div className="mt-4 space-y-3 lg:hidden">{users.filter((account) => account.role === 'customer').map((account) => { const orders = serverOrders.filter((order) => order.email.toLowerCase() === account.email.toLowerCase()); const spend = orders.reduce((sum, order) => sum + order.total, 0); const bought = orders.flatMap((order) => order.items).map((item) => item.name).join(', '); return <article key={account.email} className="min-w-0 rounded-2xl border border-line p-4"><p className="break-all text-sm font-semibold text-ink-950">{account.email}</p><div className="mt-3 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-ink-400">Purchases</p><p className="mt-1 font-semibold">{orders.length}</p></div><div className="text-right"><p className="text-xs text-ink-400">Total spend</p><p className="mt-1 font-semibold">{inr(spend)}</p></div></div><p className="mt-3 break-words border-t border-line pt-3 text-xs text-ink-400">Items bought: {bought || '—'}</p></article> })}</div>
      <div className="mt-4 hidden overflow-x-auto lg:block"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b border-line text-xs uppercase tracking-wide text-ink-400"><th className="py-3 pr-4">Customer</th><th className="py-3 pr-4">Purchases</th><th className="py-3 pr-4">Items bought</th><th className="py-3 text-right">Total spend</th></tr></thead><tbody>{users.filter((account) => account.role === 'customer').map((account) => { const orders = serverOrders.filter((order) => order.email.toLowerCase() === account.email.toLowerCase()); const spend = orders.reduce((sum, order) => sum + order.total, 0); return <tr key={account.email} className="border-b border-line last:border-0"><td className="py-3 pr-4 font-medium text-ink-950">{account.email}</td><td className="py-3 pr-4">{orders.length}</td><td className="py-3 pr-4">{orders.flatMap((order) => order.items).map((item) => item.name).join(', ') || '—'}</td><td className="py-3 text-right font-semibold">{inr(spend)}</td></tr> })}</tbody></table></div>
    </> : <p className="mt-4 rounded-2xl bg-paper p-5 text-sm text-ink-400">No customer accounts yet.</p>}</section>
    </>}
    {section === 'access' && <>
    <section className={`${box} mt-5`}><h2 className="text-xl font-bold text-ink-950">Account access</h2><p className="mt-1 text-sm text-ink-400">Promote customer accounts to manager or admin. Changes take effect immediately.</p>{roleError && <p className="mt-3 text-sm text-flame-600">{roleError}</p>}<div className="mt-4 divide-y divide-line">{users.map((account) => <div key={account.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium text-ink-950">{account.email}</p><p className="text-xs text-ink-400">Created {new Date(account.createdAt).toLocaleDateString()}</p></div><select aria-label={`Role for ${account.email}`} className="input !w-auto !py-2 text-sm" value={account.role} disabled={account.id === user.id} onChange={(event) => { setRoleError(''); void setUserRole(account.id, event.target.value as 'customer' | 'manager' | 'admin').catch((error) => setRoleError(error.message)) }}><option value="customer">Customer</option><option value="manager">Manager</option><option value="admin">Admin</option></select></div>)}{users.length === 0 && <p className="py-4 text-sm text-ink-400">No accounts yet.</p>}</div></section>
    </>}
    {section === 'team' && <>
    <section className={`${box} mt-5`}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold text-ink-950">Team members</h2><p className="mt-1 text-sm text-ink-400">Add and manage your internal team roster.</p></div><span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink-300">{team.length} members</span></div>
      <form className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" onSubmit={onAddTeamMember}><input className="input" required value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="Full name"/><input className="input" type="email" required value={teamEmail} onChange={(event) => setTeamEmail(event.target.value)} placeholder="Email address"/><input className="input" required value={teamTitle} onChange={(event) => setTeamTitle(event.target.value)} placeholder="Job title"/><select className="input" value={teamDepartment} onChange={(event) => setTeamDepartment(event.target.value)}><option>Development</option><option>Design</option><option>Sales</option><option>Marketing</option><option>Customer Support</option><option>Operations</option><option>Other</option></select><button type="submit" className="btn btn-primary btn-md">Add member</button></form>{teamMessage && <p className="mt-3 text-sm text-ink-300">{teamMessage}</p>}
      {team.length ? <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{team.map((member) => <article key={member.id} className="flex items-start justify-between gap-3 rounded-2xl border border-line p-4"><div className="min-w-0"><p className="font-bold text-ink-950">{member.name}</p><p className="mt-1 truncate text-sm text-ink-400">{member.email}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-accent-400/10 px-2.5 py-1 text-xs font-semibold text-accent-600">{member.title}</span><span className="rounded-full bg-paper px-2.5 py-1 text-xs text-ink-300">{member.department}</span></div></div><button type="button" onClick={() => removeTeamMember(member.id)} className="shrink-0 text-xs font-semibold text-flame-600 hover:underline" aria-label={`Remove ${member.name}`}>Remove</button></article>)}</div> : <p className="mt-5 rounded-2xl bg-paper p-5 text-sm text-ink-400">No team members added yet.</p>}</section>
    </>}
    {section === 'reviews' && <>
    <ReviewModeration />
    </>}
    <p className="mt-6 text-xs leading-relaxed text-ink-400">Account credentials and role changes are handled by the server. Sales and product metrics on this prototype still use browser-local demo data.</p>
  </PanelShell>
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className={`${box} !p-5`}><p className="text-sm text-ink-400">{label}</p><p className="mt-2 text-2xl font-bold text-ink-950">{value}</p></div>
}

function PriceEditor({ product, onSave }: { product: { id: number; name: string; category: string; price: number }; onSave: (id: number, price: number) => Promise<void> }) {
  const [value, setValue] = useState(String(product.price))
  useEffect(() => setValue(String(product.price)), [product.price])
  return <form className="flex flex-wrap items-center justify-between gap-3 py-3" onSubmit={(event) => { event.preventDefault(); void onSave(product.id, Number(value)) }}><div><p className="font-semibold text-ink-950">{product.name}</p><p className="text-xs text-ink-400">{product.category} · ID {product.id}</p></div><div className="flex items-center gap-2"><label className="sr-only" htmlFor={`catalog-price-${product.id}`}>Price in rupees</label><input id={`catalog-price-${product.id}`} className="input !w-28 !py-2" type="number" min="0" step="1" required value={value} onChange={(e) => setValue(e.target.value)} /><button className="btn btn-primary btn-sm" type="submit">Save price</button></div></form>
}

function CommerceSettings() {
  const [taxRate, setTaxRate] = useState('0'); const [shipping, setShipping] = useState('0'); const [verified, setVerified] = useState(false); const [testMode, setTestMode] = useState(false); const [message, setMessage] = useState('')
  const [defaultRoles, setDefaultRoles] = useState('admin')
  const [orderRoles, setOrderRoles] = useState('admin')
  const [supportRoles, setSupportRoles] = useState('admin,manager')
  useEffect(() => { void fetch('/api/admin/settings', { credentials: 'same-origin' }).then((r) => r.json()).then((d) => { if (d.settings) { setTaxRate(String(d.settings.taxRateBps / 100)); setShipping(String(d.settings.shippingFlat)); setVerified(d.settings.commerceVerified === true); setTestMode(d.testMode === true); const rules = d.settings.emailNotifications || {}; setDefaultRoles((rules.defaultRoles || ['admin']).join(',')); setOrderRoles((rules.channels?.order?.roles || rules.defaultRoles || ['admin']).join(',')); setSupportRoles((rules.channels?.support?.roles || ['admin', 'manager']).join(',')); } }) }, [])
  const parseRoles = (value: string) => value.split(',').map((role) => role.trim().toLowerCase()).filter(Boolean)
  const buildNotificationSettings = () => ({ enabled: true, defaultRoles: parseRoles(defaultRoles), channels: { account: { roles: parseRoles(defaultRoles) }, order: { roles: parseRoles(orderRoles) }, payment: { roles: parseRoles(orderRoles) }, support: { roles: parseRoles(supportRoles) }, contact: { roles: parseRoles(supportRoles) }, review: { roles: parseRoles(defaultRoles) } } })
  const save = async (event: FormEvent) => { event.preventDefault(); setMessage(''); try { const response = await fetch('/api/admin/settings', { method: 'PATCH', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ taxRateBps: Math.round(Number(taxRate) * 100), shippingFlat: Number(shipping), commerceVerified: verified, emailNotifications: buildNotificationSettings() }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to save settings.'); setVerified(data.settings.commerceVerified === true); setMessage(data.settings.commerceVerified ? 'Settings verified. Checkout is enabled.' : 'Settings saved. Checkout remains paused until you verify them.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save settings.') } }
  return <section className={`${box} mt-5`}><h2 className="text-xl font-bold text-ink-950">Tax, shipping, and email routing</h2><p className="mt-1 text-sm text-ink-400">Checkout stays paused until an admin confirms the business tax rate and physical-product shipping charge. Email notifications default to admin and can be expanded to managers for support and order events.</p><p role="status" className={`mt-3 text-sm font-semibold ${verified ? 'text-emerald-700' : 'text-amber-800'}`}>{testMode ? 'Test checkout enabled · live checkout remains paused until tax and shipping are verified' : verified ? 'Tax and shipping verified · checkout enabled' : 'Not verified · checkout paused'}</p>{testMode && <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">PayU sandbox mode is active for local development. Sandbox transactions are not production payments; live checkout remains paused until actual tax and shipping values are verified.</p>}<form onSubmit={(e) => void save(e)} className="mt-4 space-y-4"><div className="flex flex-wrap items-end gap-3"><label className="text-sm">Tax rate (%)<input className="input mt-1" type="number" min="0" max="100" step="0.01" required value={taxRate} onChange={(e) => setTaxRate(e.target.value)}/></label><label className="text-sm">Flat shipping for IP PBX (₹)<input className="input mt-1" type="number" min="0" step="1" required value={shipping} onChange={(e) => setShipping(e.target.value)}/></label><label className="flex max-w-xl items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={verified} onChange={(e) => setVerified(e.target.checked)}/><span>I verified these tax and shipping values for this business.</span></label></div><div className="rounded-2xl border border-line bg-paper p-4"><h3 className="text-base font-semibold text-ink-950">Email notification recipients</h3><p className="mt-1 text-xs text-ink-400">Use comma-separated roles: admin, manager, customer. Default is admin for all notifications unless you override a core.</p><div className="mt-3 grid gap-3 md:grid-cols-3"><label className="text-sm">Default roles<input className="input mt-1" value={defaultRoles} onChange={(e) => setDefaultRoles(e.target.value)} placeholder="admin" /></label><label className="text-sm">Order / payment roles<input className="input mt-1" value={orderRoles} onChange={(e) => setOrderRoles(e.target.value)} placeholder="admin" /></label><label className="text-sm">Support / contact roles<input className="input mt-1" value={supportRoles} onChange={(e) => setSupportRoles(e.target.value)} placeholder="admin,manager" /></label></div></div><button className="btn btn-primary btn-md" type="submit">Save settings</button></form>{message && <p role="status" className="mt-3 text-sm text-accent-600">{message}</p>}</section>
}

function ReviewModeration() {
  const [reviews, setReviews] = useState<Array<{ id: string; productId: number; productName: string; rating: number; title: string; comment: string; authorName: string; createdAt: string }>>([])
  const [message, setMessage] = useState('')
  const load = () => { void fetch('/api/admin/reviews?status=pending', { credentials: 'same-origin' }).then((r) => r.ok ? r.json() : null).then((d) => { if (d) setReviews(d.reviews) }).catch(() => {}) }
  useEffect(() => { load() }, [])
  const moderate = async (id: string, status: 'approved' | 'rejected') => {
    const response = await fetch(`/api/admin/reviews/${id}`, { method: 'PATCH', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) })
    const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to update review.'); return }
    setReviews((current) => current.filter((review) => review.id !== id)); setMessage(`Review ${status}.`)
  }
  return <section className={`${box} mt-5`}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-ink-950">Product review moderation</h2><p className="mt-1 text-sm text-ink-400">Customer reviews are published after admin approval.</p></div><button type="button" className="btn btn-outline-light btn-sm" onClick={load}>Refresh reviews</button></div>{message&&<p role="status" className="mt-3 text-sm text-accent-600">{message}</p>}<div className="mt-4 space-y-3">{reviews.map((review)=><article key={review.id} className="rounded-2xl border border-line p-4"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs text-ink-400">{review.productName} · {review.authorName} · {review.rating}/5</p><h3 className="mt-1 font-bold text-ink-950">{review.title}</h3><p className="mt-2 whitespace-pre-line text-sm text-ink-500">{review.comment}</p></div><div className="flex gap-2"><button type="button" className="btn btn-primary btn-sm" onClick={()=>void moderate(review.id,'approved')}>Approve</button><button type="button" className="btn btn-outline-light btn-sm" onClick={()=>void moderate(review.id,'rejected')}>Reject</button></div></div></article>)}{!reviews.length&&<p className="rounded-xl bg-paper p-4 text-sm text-ink-400">No pending reviews.</p>}</div></section>
}
