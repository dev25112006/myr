import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/lib/stores'

type Organization = { id: string; name: string; countryCode: string; billingCountryCode: string; billingName?: string; billingEmail?: string; billingAddress?: string; billingCity?: string; billingState?: string; billingPostalCode?: string; gstin?: string; status: string; role: string; createdAt: string }
type Entitlement = { organizationId: string; organizationName: string; productSlug: string; productName: string; launchUrl?: string | null; subscriptionId: string; planId: string; featureKey: string; limit: number | null; validUntil: string | null }
type Member = { userId: string; email: string; role: string; status: string }
type Subscription = { id: string; productId: string; productName: string; planName: string; planId: string; pendingPlanName?: string | null; status: string; effectiveStatus: string; periodEnd?: string; renewalMode: string; cancelAtPeriodEnd: boolean; mandate?: Mandate | null }
type Mandate = { id: string; organizationId: string; subscriptionId?: string; planId?: string; status: string; mode?: string | null; billingAmount?: string; billingCurrency?: string; billingCycle?: string; hasMandate?: boolean; createdAt: string }
type Invoice = { id: string; organizationId: string; currency: string; subtotalMinor: number; taxMinor: number; totalMinor: number; issuedAt: string }
type Notification = { id: string; template: string; status: string; createdAt: string; organizationId: string }
type Usage = { organizationId: string; organizationName: string; productSlug: string; productName: string; resource: string; used: number; limit: number | null; validUntil: string }
type InvoiceDetail = Invoice & { taxRateBps: number; taxTreatment: string; periodStart: string; periodEnd: string; billingDetails?: { name: string; email: string; address: string; city: string; state: string; postalCode: string; countryCode: string; gstin: string }; lines: Array<{ description: string; quantity: number; unitAmountMinor: number; taxMinor: number; totalMinor: number }> }

export function SaaSWorkspacePage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [entitlements, setEntitlements] = useState<Entitlement[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [usage, setUsage] = useState<Usage[]>([])
  const [mandates, setMandates] = useState<Mandate[]>([])
  const [changeTarget, setChangeTarget] = useState<Record<string, string>>({})
  const [planOptions, setPlanOptions] = useState<Record<string, Array<{ id: string; name: string; interval: string; currency: string; amountMinor: number | null }>>>({})
  const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetail | null>(null)
  const [members, setMembers] = useState<Record<string, Member[]>>({})
  const [name, setName] = useState('')
  const [countryCode, setCountryCode] = useState('IN')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [mfaSetup, setMfaSetup] = useState<{ secret: string; otpauthUrl: string } | null>(null)
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [verificationBusy, setVerificationBusy] = useState(false)
  const verificationToken = searchParams.get('verify')
  const consumedTokens = useRef(new Set<string>())
  const refresh = async () => {
    const [orgResponse, entitlementResponse, subscriptionResponse, invoiceResponse, notificationResponse, usageResponse, mandateResponse] = await Promise.all([
      fetch('/api/saas/organizations', { credentials: 'same-origin' }),
      fetch('/api/saas/entitlements', { credentials: 'same-origin' }),
      fetch('/api/saas/subscriptions', { credentials: 'same-origin' }),
      fetch('/api/saas/invoices', { credentials: 'same-origin' }),
      fetch('/api/saas/notifications', { credentials: 'same-origin' }),
      fetch('/api/saas/usage', { credentials: 'same-origin' }),
      fetch('/api/saas/mandates', { credentials: 'same-origin' }),
    ])
    if (orgResponse.ok) {
      const orgData = await orgResponse.json() as { organizations: Organization[] }
      setOrganizations(orgData.organizations)
      const memberData: Record<string, Member[]> = {}
      await Promise.all(orgData.organizations.map(async (org) => {
        const response = await fetch(`/api/saas/organizations/${org.id}/members`, { credentials: 'same-origin' })
        if (response.ok) memberData[org.id] = (await response.json()).members
      }))
      setMembers(memberData)
    }
    if (entitlementResponse.ok) setEntitlements((await entitlementResponse.json()).entitlements)
    if (subscriptionResponse.ok) {
      const subscriptionData = await subscriptionResponse.json() as { subscriptions: Subscription[] }
      setSubscriptions(subscriptionData.subscriptions)
      const productIds = [...new Set(subscriptionData.subscriptions.map((item) => item.productId).filter(Boolean))]
      if (productIds.length) {
        const catalog = await fetch('/api/saas/products', { credentials: 'same-origin' }).then((response) => response.json()).catch(() => ({ products: [] })) as { products?: Array<{ id: string; plans: Array<{ id: string; name: string; interval: string; currency: string; amountMinor: number | null }> }> }
        const options: Record<string, Array<{ id: string; name: string; interval: string; currency: string; amountMinor: number | null }>> = {}
        for (const product of catalog.products || []) options[product.id] = product.plans.filter((plan) => plan.currency === 'INR' && plan.amountMinor != null && ['month', 'year'].includes(plan.interval))
        setPlanOptions(options)
      }
    }
    if (invoiceResponse.ok) setInvoices((await invoiceResponse.json()).invoices)
    if (notificationResponse.ok) setNotifications((await notificationResponse.json()).notifications)
    if (usageResponse.ok) setUsage((await usageResponse.json()).usage)
    if (mandateResponse.ok) setMandates((await mandateResponse.json()).mandates)
    if (!orgResponse.ok && orgResponse.status !== 401) {
      const body = await orgResponse.json().catch(() => ({}))
      setMessage(body.error || 'SaaS workspace storage is not available yet.')
    }
    setLoading(false)
  }
  useEffect(() => { if (user) void refresh() }, [user?.id])
  const createOrganization = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      const response = await fetch('/api/saas/organizations', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, countryCode }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to create workspace.')
      setOrganizations((current) => [data.organization, ...current]); setName(''); setMessage('Workspace created in pending status. Product access is granted only after an active subscription or configured trial.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to create workspace.') }
    finally { setBusy(false) }
  }
  const saveBillingProfile = async (event: FormEvent<HTMLFormElement>, organization: Organization) => {
    event.preventDefault(); const form = new FormData(event.currentTarget); const fields = ['billingName','billingEmail','billingAddress','billingCity','billingState','billingPostalCode','billingCountryCode','gstin']; const profile = Object.fromEntries(fields.map((field) => [field, String(form.get(field) || '')]))
    const response = await fetch(`/api/saas/organizations/${organization.id}/billing-profile`, { method: 'PATCH', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(profile) }); const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to save billing details.'); return }
    setOrganizations((current) => current.map((item) => item.id === organization.id ? { ...item, ...data.organization } : item)); setMessage('Billing profile saved for future invoices.')
  }
  const sendInvite = async (event: FormEvent, organizationId: string) => {
    event.preventDefault(); setMessage('')
    const response = await fetch(`/api/saas/organizations/${organizationId}/invitations`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: inviteEmail, role: inviteRole }) })
    const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to invite member.'); return }
    setInviteEmail(''); setMessage(data.emailSent ? `Invitation sent to ${data.invitation.email}.` : 'Invitation created; email delivery is not configured.')
  }
  const changeRole = async (organizationId: string, memberId: string, role: string) => {
    const response = await fetch(`/api/saas/organizations/${organizationId}/members/${memberId}/role`, { method: 'PATCH', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ role }) })
    const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to change member role.'); return }
    setMembers((current) => ({ ...current, [organizationId]: current[organizationId].map((member) => member.userId === memberId ? { ...member, role } : member) }))
  }
  const removeMember = async (organizationId: string, member: Member) => {
    if (!window.confirm(`Remove ${member.email} from this workspace?`)) return
    const response = await fetch(`/api/saas/organizations/${organizationId}/members/${member.userId}`, { method: 'DELETE', credentials: 'same-origin' })
    const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to remove member.'); return }
    setMembers((current) => ({ ...current, [organizationId]: current[organizationId].filter((item) => item.userId !== member.userId) }))
  }
  const cancelSubscription = async (subscription: Subscription) => {
    if (!window.confirm(`Cancel ${subscription.productName} at the end of its paid term?`)) return
    const response = await fetch(`/api/saas/subscriptions/${subscription.id}/cancel`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' })
    const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to cancel subscription.'); return }
    setMessage('Cancellation scheduled for the end of the paid term. This plan does not auto-renew.'); void refresh()
  }
  const reactivateSubscription = async (subscription: Subscription) => {
    const response = await fetch(`/api/saas/subscriptions/${subscription.id}/reactivate`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' })
    const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to reverse scheduled cancellation.'); return }
    setMessage('Scheduled cancellation reversed. This plan still renews manually.'); void refresh()
  }
  const changePlan = async (subscription: Subscription, timing: 'immediate' | 'renewal') => {
    const targetPlanId = changeTarget[subscription.id]
    if (!targetPlanId) { setMessage('Choose a target plan first.'); return }
    if (!window.confirm(timing === 'immediate' ? 'Change plan now? The unused part of the current term is credited against the new plan price; the difference is charged via PayU.' : 'Schedule this plan change for the next renewal?')) return
    const response = await fetch(`/api/saas/subscriptions/${subscription.id}/change-plan`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ targetPlanId, timing }) })
    const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to change plan.'); return }
    if (data.payment?.redirectUrl) { setMessage('Opening PayU for the prorated plan-change payment…'); window.location.href = data.payment.redirectUrl; return }
    setMessage(timing === 'renewal' ? 'Plan change scheduled for the next renewal.' : 'Plan change completed.'); void refresh()
  }
  const revokeMandate = async (mandate: Mandate) => {
    if (!window.confirm('Cancel automatic renewal for this plan? Future terms will require manual renewal.')) return
    const response = await fetch(`/api/saas/subscriptions/${mandate.subscriptionId || ''}/cancel`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' })
    const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to cancel automatic renewal.'); return }
    setMessage(data.mandateRevoked ? 'Automatic renewal cancelled and the mandate revoked at PayU.' : 'Automatic renewal cancelled at term end; the mandate could not be revoked automatically and now renews manually.')
    void refresh()
  }
  const launchProduct = async (item: Entitlement) => {
    const launchWindow = window.open('about:blank', '_blank')
    if (launchWindow) launchWindow.opener = null
    const response = await fetch(`/api/saas/organizations/${item.organizationId}/products/${encodeURIComponent(item.productSlug)}/launch`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' })
    const data = await response.json()
    if (!response.ok) { launchWindow?.close(); setMessage(data.error || 'Product could not be launched.'); return }
    if (launchWindow) launchWindow.location.href = data.moduleUrl || data.launchUrl
    else setMessage('Your browser blocked the product window. Allow pop-ups and try again.')
  }
  const viewInvoice = async (invoiceId: string) => {
    const response = await fetch(`/api/saas/invoices/${encodeURIComponent(invoiceId)}`, { credentials: 'same-origin' })
    const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to load invoice.'); return }
    setInvoiceDetail(data.invoice)
  }
  const setupMfa = async () => {
    const response = await fetch('/api/saas/admin/mfa/setup', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' })
    const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to set up MFA.'); return }
    setMfaSetup(data)
  }
  const enableMfa = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const code = String(new FormData(event.currentTarget).get('code') || '')
    const response = await fetch('/api/saas/admin/mfa/enable', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code }) })
    const data = await response.json()
    if (!response.ok) { setMessage(data.error || 'Unable to enable MFA.'); return }
    setRecoveryCodes(data.recoveryCodes); setMfaSetup(null); setMessage('MFA enabled. Save your one-time recovery codes securely.')
  }
  useEffect(() => {
    if (!verificationToken || consumedTokens.current.has(verificationToken)) return
    consumedTokens.current.add(verificationToken)
    void fetch(`/api/saas/verify-email?token=${encodeURIComponent(verificationToken)}`).then(async (response) => {
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Email verification failed.')
      setMessage(data.message || 'MYR Software email verified.')
      setSearchParams({}, { replace: true })
      void refresh()
    }).catch((error) => { setMessage(error instanceof Error ? error.message : 'Email verification failed.'); setSearchParams({}, { replace: true }) })
  }, [verificationToken, setSearchParams])
  useEffect(() => {
    const payment = searchParams.get('payment'); const orderId = searchParams.get('order')
    if (!payment || !orderId || !user) return
    let active = true
    void fetch(`/api/saas/orders/${encodeURIComponent(orderId)}`, { credentials: 'same-origin' }).then(async (response) => {
      const data = await response.json()
      if (!active) return
      if (!response.ok) throw new Error(data.error || 'Unable to load payment status.')
      const status = data.order.status
      setMessage(status === 'paid' ? 'Payment confirmed. Your subscription and product access are active.' : status === 'failed' ? 'Payment was not completed. No product access was granted.' : 'Payment is still pending confirmation. Product access begins only after PayU verification.')
      void refresh()
    }).catch((error) => { if (active) setMessage(error instanceof Error ? error.message : 'Unable to load payment status.') })
    return () => { active = false }
  }, [searchParams, user?.id])
  useEffect(() => {
    const invitationId = searchParams.get('invite'); const token = searchParams.get('token')
    const invitationKey = `${invitationId}:${token}`
    if (!user || !invitationId || !token || consumedTokens.current.has(invitationKey)) return
    consumedTokens.current.add(invitationKey)
    void fetch(`/api/saas/invitations/${invitationId}/accept`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token }) }).then(async (response) => {
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Invitation could not be accepted.')
      setMessage('Workspace invitation accepted.'); setSearchParams({}, { replace: true }); void refresh()
    }).catch((error) => setMessage(error instanceof Error ? error.message : 'Invitation could not be accepted.'))
  }, [user?.id, searchParams, setSearchParams])
  const requestVerification = async () => {
    setVerificationBusy(true); setMessage('')
    try {
      const response = await fetch('/api/saas/email-verification/request', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to send verification email.')
      setMessage(data.alreadyVerified ? 'Your MYR Software email is already verified.' : data.message)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to send verification email.') }
    finally { setVerificationBusy(false) }
  }
  if (!user) return <section className="container-page py-20"><div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center"><p className="eyebrow">Customer workspace</p><h1 className="mt-2 text-3xl font-bold text-ink-950">Sign in to continue</h1><p className="mt-3 text-sm text-ink-500">Your SaaS organizations and product access will appear here.</p><Link to="/my-account/" className="btn btn-primary btn-md mt-6 inline-flex">Go to account</Link></div></section>
  return <section className="section-light min-h-[70vh] py-12 sm:py-16"><div className="container-page"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">MYR Software</p><h1 className="mt-2 text-3xl font-bold text-ink-950 sm:text-4xl">Your workspaces</h1><p className="mt-3 text-sm text-ink-500">Signed in as {user.email}. Organization access is scoped to your active membership.</p></div><Link to="/support/" className="text-sm font-semibold text-accent-700">Help and support →</Link></div>
    {message && <p role="status" className="mt-5 rounded-xl border border-line bg-white p-4 text-sm text-ink-700">{message}</p>}
    <div className="mt-5 rounded-2xl border border-line bg-white p-4"><p className="text-sm text-ink-600">MYR Software requires email verification before creating workspaces or inviting members.</p><button type="button" className="mt-3 text-sm font-semibold text-accent-700" disabled={verificationBusy} onClick={() => void requestVerification()}>{verificationBusy ? 'Sending…' : 'Send MYR Software verification email'}</button></div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
      <form onSubmit={(event) => void createOrganization(event)} className="h-fit rounded-3xl border border-line bg-white p-6"><h2 className="text-xl font-bold text-ink-950">Create a workspace</h2><p className="mt-2 text-sm leading-relaxed text-ink-500">A workspace starts pending and does not include paid product access.</p><label className="label mt-5 block">Organization or institute name<input className="input mt-2" required minLength={2} maxLength={180} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your organization" /></label><label className="label mt-4 block">Country<input className="input mt-2" required pattern="[A-Za-z]{2}" maxLength={2} value={countryCode} onChange={(event) => setCountryCode(event.target.value.toUpperCase())} aria-describedby="country-help" /></label><p id="country-help" className="mt-1 text-xs text-ink-400">Enter the two-letter country code, for example IN.</p><button className="btn btn-primary btn-md mt-5 w-full" disabled={busy}>{busy ? 'Creating…' : 'Create pending workspace'}</button></form>
      <div className="space-y-5"><section className="rounded-3xl border border-line bg-white p-6"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-ink-950">Organizations</h2><button type="button" className="text-sm font-semibold text-accent-700" onClick={() => void refresh()}>Refresh</button></div>{loading ? <p className="mt-4 text-sm text-ink-400">Loading workspaces…</p> : organizations.length ? <div className="mt-4 space-y-3">{organizations.map((org) => <article key={org.id} className="rounded-2xl border border-line p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold text-ink-950">{org.name}</h3><span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold capitalize text-ink-600">{org.status}</span></div><p className="mt-2 text-xs text-ink-400">{org.countryCode} · {org.role} · Created {new Date(org.createdAt).toLocaleDateString()}</p>{org.status === 'pending' && <p className="mt-3 text-sm text-amber-800">No product access is active for this workspace.</p>}</article>)}</div> : <p className="mt-4 rounded-xl bg-paper p-4 text-sm text-ink-500">No SaaS workspaces yet. Create one after your email is verified.</p>}</section>
        <section className="rounded-3xl border border-line bg-white p-6"><h2 className="text-xl font-bold text-ink-950">Subscriptions and billing</h2>{subscriptions.length ? <div className="mt-4 space-y-3">{subscriptions.map((subscription) => { const autoRenew = subscription.renewalMode === 'auto'; const options = (planOptions[subscription.productId] || []).filter((plan) => plan.id !== subscription.planId); return <article key={subscription.id} className="rounded-2xl border border-line p-4"><div className="flex flex-wrap items-center justify-between gap-3"><strong>{subscription.productName} · {subscription.planName}</strong><span className="rounded-full bg-paper px-3 py-1 text-xs capitalize">{subscription.effectiveStatus.replaceAll('_', ' ')}</span></div><p className="mt-2 text-xs text-ink-500">Paid through {subscription.periodEnd ? new Date(subscription.periodEnd).toLocaleDateString() : '—'} · {autoRenew ? 'renews automatically via PayU mandate' : 'manual renewal, no automatic charge'}</p>{autoRenew && subscription.mandate && <p className="mt-1 text-xs text-ink-400">Mandate {subscription.mandate.status.replaceAll('_', ' ')}{subscription.mandate.billingAmount ? ` · INR ${subscription.mandate.billingAmount} per ${subscription.mandate.billingCycle === 'YEARLY' ? 'year' : 'month'}` : ''}{subscription.mandate.hasMandate === false ? ' · awaiting provider confirmation' : ''}</p>}{subscription.pendingPlanName && <p className="mt-1 text-xs font-semibold text-accent-700">Plan change to {subscription.pendingPlanName} takes effect at the next renewal.</p>}{subscription.effectiveStatus === 'active' && options.length > 0 && <div className="mt-3 flex flex-wrap items-center gap-2"><select aria-label={`New plan for ${subscription.planName}`} className="input !w-auto !py-1 text-xs" value={changeTarget[subscription.id] || ''} onChange={(event) => setChangeTarget({ ...changeTarget, [subscription.id]: event.target.value })}><option value="">Change plan…</option>{options.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} · {plan.interval} · ₹{((plan.amountMinor ?? 0) / 100).toFixed(0)}</option>)}</select>{changeTarget[subscription.id] && (autoRenew ? <button type="button" className="text-xs font-semibold text-accent-700" onClick={() => void changePlan(subscription, 'renewal')}>Schedule for renewal</button> : <><button type="button" className="text-xs font-semibold text-accent-700" onClick={() => void changePlan(subscription, 'immediate')}>Change now (prorated)</button><button type="button" className="text-xs font-semibold text-ink-500" onClick={() => void changePlan(subscription, 'renewal')}>At renewal</button></>)}</div>}{subscription.effectiveStatus === 'active' && !subscription.cancelAtPeriodEnd && <button type="button" className="mt-3 text-sm font-semibold text-flame-600" onClick={() => void cancelSubscription(subscription)}>{autoRenew ? 'Cancel automatic renewal at term end' : 'Cancel at term end'}</button>}{subscription.status === 'cancellation_scheduled' && <button type="button" className="mt-3 text-sm font-semibold text-accent-700" onClick={() => void reactivateSubscription(subscription)}>Keep subscription active</button>}{subscription.effectiveStatus === 'expired' && <Link to="/pricing/" className="mt-3 inline-flex text-sm font-semibold text-accent-700">Renew from pricing →</Link>}</article> })}</div> : <p className="mt-3 text-sm text-ink-400">No subscriptions yet. Available plans can be selected from <Link className="font-semibold text-accent-700" to="/pricing/">Pricing</Link>.</p>}{mandates.filter((mandate) => mandate.hasMandate && !['revoked', 'expired'].includes(mandate.status)).length > 0 && <div className="mt-5 border-t border-line pt-4"><h3 className="font-bold">Automatic renewal mandates</h3><p className="mt-1 text-xs text-ink-500">Each mandate authorizes PayU to charge the fixed term amount on its renewal date. Cancelling a subscription revokes the mandate at the provider.</p><div className="mt-3 space-y-2">{mandates.filter((mandate) => mandate.hasMandate && !['revoked', 'expired'].includes(mandate.status)).map((mandate) => <div key={mandate.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper p-3 text-sm"><span>{mandate.billingCurrency || 'INR'} {mandate.billingAmount || '—'} · {mandate.billingCycle === 'YEARLY' ? 'annual' : 'monthly'} · <span className="capitalize">{mandate.status.replaceAll('_', ' ')}</span></span>{mandate.subscriptionId && <button type="button" className="text-xs font-semibold text-flame-600" onClick={() => void revokeMandate(mandate)}>Cancel auto-renewal</button>}</div>)}</div></div>}{invoices.length > 0 && <div className="mt-5 border-t border-line pt-4"><h3 className="font-bold">Invoices</h3><div className="mt-3 space-y-2">{invoices.map((invoice) => <button key={invoice.id} type="button" onClick={() => void viewInvoice(invoice.id)} className="flex w-full flex-wrap justify-between gap-2 rounded-xl bg-paper p-3 text-left text-sm"><span>{invoice.id} · {new Date(invoice.issuedAt).toLocaleDateString()}</span><strong>{invoice.currency} {(invoice.totalMinor / 100).toFixed(2)}</strong></button>)}</div></div>}</section>
        <section className="rounded-3xl border border-line bg-white p-6"><h2 className="text-xl font-bold text-ink-950">Product access and plan usage</h2>{entitlements.length ? <div className="mt-4 space-y-3">{entitlements.map((item) => { const recordUsage = usage.find((entry) => entry.organizationId === item.organizationId && entry.productSlug === item.productSlug); const hasModule = ['crm','hrm','coaching-erp'].includes(item.productSlug); return <article key={`${item.organizationId}-${item.productSlug}-${item.featureKey}`} className="rounded-2xl border border-line p-4"><div className="flex flex-wrap justify-between gap-3"><strong>{item.productName}</strong><span className="text-xs text-ink-400">{item.organizationName}</span></div><p className="mt-2 text-sm text-ink-600">{item.featureKey.replaceAll('_', ' ')}{item.limit == null ? ' · included' : ` · limit ${item.limit}`}</p>{recordUsage && <p className="mt-1 text-xs text-ink-500">{recordUsage.resource[0].toUpperCase() + recordUsage.resource.slice(1)} used: {recordUsage.used}{recordUsage.limit == null ? '' : ` / ${recordUsage.limit}`}</p>}{item.validUntil && <p className="mt-1 text-xs text-ink-400">Available through {new Date(item.validUntil).toLocaleDateString()}</p>}{item.launchUrl || hasModule ? <button type="button" onClick={() => void launchProduct(item)} className="mt-3 inline-flex text-sm font-semibold text-accent-700">Launch {item.productName} →</button> : <p className="mt-3 text-xs text-amber-800">The product launch destination is not configured yet. Contact MYR for access.</p>}</article>})}</div> : <p className="mt-4 rounded-xl bg-paper p-4 text-sm text-ink-500">No active product entitlements. Access appears after a configured trial or verified subscription.</p>}<Link to="/software/" className="mt-4 inline-flex text-sm font-semibold text-accent-700">Explore available MYR products →</Link></section></div>
    </div>
    <section className="mt-6 rounded-3xl border border-line bg-white p-6"><h2 className="text-xl font-bold text-ink-950">Members</h2><p className="mt-1 text-sm text-ink-500">Owners and admins can invite verified accounts. Only owners can change roles.</p><div className="mt-4 grid gap-4 md:grid-cols-2">{organizations.map((org) => <article key={org.id} className="rounded-2xl border border-line p-4"><h3 className="font-bold">{org.name}</h3><div className="mt-3 space-y-2">{(members[org.id] || []).map((member) => <div key={member.userId} className="flex flex-wrap items-center justify-between gap-2 text-sm"><span>{member.email}</span>{member.role === 'owner' ? <span className="text-xs text-ink-400">Owner</span> : <><select aria-label={`Role for ${member.email}`} className="input !w-auto !py-1 text-xs" value={member.role} onChange={(event) => void changeRole(org.id, member.userId, event.target.value)}><option value="admin">Admin</option><option value="member">Member</option><option value="billing">Billing</option></select><button type="button" className="text-xs font-semibold text-flame-600" onClick={() => void removeMember(org.id, member)}>Remove</button></>}</div>)}</div><form onSubmit={(event) => void sendInvite(event, org.id)} className="mt-4 flex flex-wrap gap-2"><input className="input min-w-0 flex-1" type="email" required value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="Member email"/><select className="input !w-auto" value={inviteRole} onChange={(event) => setInviteRole(event.target.value)}><option value="member">Member</option><option value="admin">Admin</option><option value="billing">Billing</option></select><button className="btn btn-outline-light btn-sm">Invite</button></form></article>)}</div>{!organizations.length && <p className="mt-3 text-sm text-ink-400">Create a workspace to manage members.</p>}</section>
    <section className="mt-6 rounded-3xl border border-line bg-white p-6"><h2 className="text-xl font-bold text-ink-950">Billing profile</h2><p className="mt-1 text-sm text-ink-500">These organization details are stored for future invoice documents. Only billing-authorized members can save changes.</p><div className="mt-4 grid gap-4 lg:grid-cols-2">{organizations.filter((org) => ['owner','admin','billing'].includes(org.role)).map((org) => <form key={org.id} onSubmit={(event) => void saveBillingProfile(event, org)} className="rounded-2xl border border-line p-4"><h3 className="font-bold">{org.name}</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><input className="input" name="billingName" maxLength={180} defaultValue={org.billingName || org.name} placeholder="Legal or billing name"/><input className="input" name="billingEmail" type="email" maxLength={254} defaultValue={org.billingEmail || ''} placeholder="Billing email"/><input className="input sm:col-span-2" name="billingAddress" maxLength={300} defaultValue={org.billingAddress || ''} placeholder="Billing address"/><input className="input" name="billingCity" maxLength={100} defaultValue={org.billingCity || ''} placeholder="City"/><input className="input" name="billingState" maxLength={100} defaultValue={org.billingState || ''} placeholder="State / region"/><input className="input" name="billingPostalCode" maxLength={24} defaultValue={org.billingPostalCode || ''} placeholder="Postal code"/><input className="input" name="billingCountryCode" maxLength={2} pattern="[A-Za-z]{2}" defaultValue={org.billingCountryCode || org.countryCode} placeholder="Country code"/><input className="input sm:col-span-2" name="gstin" maxLength={15} defaultValue={org.gstin || ''} placeholder="GSTIN (optional for India)"/></div><button className="btn btn-outline-light btn-sm mt-4">Save billing profile</button></form>)}</div>{!organizations.some((org) => ['owner','admin','billing'].includes(org.role)) && <p className="mt-3 text-sm text-ink-400">You do not have billing access to an organization.</p>}</section>
    <section className="mt-6 rounded-3xl border border-line bg-white p-6"><h2 className="text-xl font-bold text-ink-950">Notifications</h2>{notifications.length ? <div className="mt-3 space-y-2">{notifications.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-paper p-3 text-sm"><span>{item.template.replaceAll('_', ' ')}</span><span className="text-xs capitalize text-ink-400">{item.status} · {new Date(item.createdAt).toLocaleString()}</span></div>)}</div> : <p className="mt-3 text-sm text-ink-400">No workspace notifications yet.</p>}</section>
    {user.role === 'admin' && <section className="mt-6 rounded-3xl border border-line bg-white p-6"><h2 className="text-xl font-bold text-ink-950">Administrator MFA</h2><p className="mt-1 text-sm text-ink-500">Use an authenticator app to protect SaaS administration.</p>{user.mfaEnabled ? <><p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">MFA is enabled for administrator sign-in.</p><Link to="/saas-admin/" className="btn btn-outline-light btn-sm mt-4 inline-flex">Open catalog administration</Link></> : mfaSetup ? <><p className="mt-4 text-sm">Authenticator key: <code className="break-all rounded bg-paper px-2 py-1">{mfaSetup.secret}</code></p><p className="mt-2 break-all text-xs text-ink-400">{mfaSetup.otpauthUrl}</p><form onSubmit={(event) => void enableMfa(event)} className="mt-4 flex gap-2"><input name="code" className="input !w-48" inputMode="numeric" pattern="[0-9]{6}" required placeholder="6-digit code"/><button className="btn btn-primary btn-sm">Enable MFA</button></form></> : <button type="button" className="btn btn-outline-light btn-sm mt-4" onClick={() => void setupMfa()}>Set up MFA</button>}{recoveryCodes.length > 0 && <div className="mt-4 rounded-xl bg-amber-50 p-4"><p className="text-sm font-bold text-amber-950">Save these codes now. They are displayed once.</p><div className="mt-2 grid grid-cols-2 gap-2 font-mono text-sm">{recoveryCodes.map((code) => <code key={code}>{code}</code>)}</div></div>}</section>}
    {invoiceDetail && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4" role="presentation" onClick={() => setInvoiceDetail(null)}><section role="dialog" aria-modal="true" aria-labelledby="invoice-title" className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">MYR Software</p><h2 id="invoice-title" className="mt-1 text-2xl font-bold">Invoice {invoiceDetail.id}</h2><p className="mt-1 text-sm text-ink-500">Issued {new Date(invoiceDetail.issuedAt).toLocaleDateString()}</p></div><button type="button" className="text-sm font-semibold text-ink-500" onClick={() => setInvoiceDetail(null)}>Close</button></div>{invoiceDetail.billingDetails && <div className="mt-5 rounded-xl bg-paper p-4 text-sm"><strong>{invoiceDetail.billingDetails.name}</strong><p>{[invoiceDetail.billingDetails.address, invoiceDetail.billingDetails.city, invoiceDetail.billingDetails.state, invoiceDetail.billingDetails.postalCode, invoiceDetail.billingDetails.countryCode].filter(Boolean).join(", ")}</p>{invoiceDetail.billingDetails.email && <p>{invoiceDetail.billingDetails.email}</p>}{invoiceDetail.billingDetails.gstin && <p>GSTIN: {invoiceDetail.billingDetails.gstin}</p>}</div>}<div className="mt-5 space-y-3">{invoiceDetail.lines.map((line, index) => <div key={`${line.description}-${index}`} className="rounded-xl bg-paper p-4"><div className="flex justify-between gap-3 text-sm"><strong>{line.description}</strong><span>{invoiceDetail.currency} {(line.totalMinor / 100).toFixed(2)}</span></div><p className="mt-1 text-xs text-ink-500">Quantity {line.quantity} · tax {invoiceDetail.currency} {(line.taxMinor / 100).toFixed(2)}</p></div>)}</div><dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{invoiceDetail.currency} {(invoiceDetail.subtotalMinor / 100).toFixed(2)}</dd></div><div className="flex justify-between"><dt>Tax ({invoiceDetail.taxTreatment === 'explicitly_exempt' ? 'exempt' : `${(invoiceDetail.taxRateBps / 100).toFixed(2)}%`})</dt><dd>{invoiceDetail.currency} {(invoiceDetail.taxMinor / 100).toFixed(2)}</dd></div><div className="flex justify-between border-t border-line pt-2 font-bold"><dt>Total paid</dt><dd>{invoiceDetail.currency} {(invoiceDetail.totalMinor / 100).toFixed(2)}</dd></div></dl><p className="mt-4 text-xs text-ink-400">Service period: {new Date(invoiceDetail.periodStart).toLocaleDateString()} – {new Date(invoiceDetail.periodEnd).toLocaleDateString()}</p><button type="button" onClick={() => window.print()} className="btn btn-outline-light btn-sm mt-4">Print invoice</button></section></div>}
    </div></section>
}
