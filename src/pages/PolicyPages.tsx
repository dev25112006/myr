import { useEffect, useState } from 'react'
import { SmartForm, type FormConfig } from '@/components/forms/SmartForm'
import privacyText from '../../audit/pages/privacy-policy.md?raw'
import shippingText from '../../audit/pages/shipping-policy.md?raw'
import termsText from '../../audit/pages/terms-and-conditions.md?raw'
import refundPolicyText from '../../audit/pages/refund-and-return-policy.md?raw'

const refundForm: FormConfig = {
  id: 'refund-request', submitLabel: 'Submit refund request', successMessage: 'Your refund request was sent to our team.',
  inboxType: 'ticket', inboxSubject: 'Refund request',
  fields: [
    { kind: 'text', name: 'company', label: 'Company Name', required: true, half: true },
    { kind: 'text', name: 'name', label: 'Full Name', required: true, half: true },
    { kind: 'email', name: 'email', label: 'Email', required: true, half: true },
    { kind: 'tel', name: 'phone', label: 'Contact Number', required: true, half: true },
    { kind: 'date', name: 'serviceDate', label: 'Contact Service/Product Date', half: true },
    { kind: 'text', name: 'address', label: 'Complete Address', required: true },
    { kind: 'text', name: 'invoice', label: 'Invoice Number', required: true, half: true },
    { kind: 'date', name: 'invoiceDate', label: 'Invoice Date', required: true, half: true },
    { kind: 'select', name: 'payment', label: 'Payment Method', required: true, options: ['Bank transfer', 'UPI', 'Card', 'Razorpay', 'Other'], half: true },
    { kind: 'text', name: 'product', label: 'Service/Product Name', required: true, half: true },
    { kind: 'textarea', name: 'items', label: "List product(s) you're requesting a refund for", required: true, rows: 3 },
    { kind: 'textarea', name: 'reason', label: 'Reason for Refund Request', required: true, rows: 4 },
    { kind: 'textarea', name: 'details', label: 'Additional Information', required: true, rows: 3 },
  ],
}

const policies: Record<string, { title: string; source: string }> = {
  '/privacy-policy/': { title: 'Privacy Policy', source: privacyText },
  '/shipping-policy/': { title: 'Shipping Policy', source: shippingText },
  '/terms-and-conditions/': { title: 'Terms and Conditions', source: termsText },
  '/refund-and-return-policy/': { title: 'Refund and Return Policy', source: refundPolicyText },
}

export function PolicyPage({ pathname }: { pathname: string }) {
  const policy = policies[pathname]
  const [content, setContent] = useState('')
  useEffect(() => { if (policy) setContent(policy.source.split('## Content (markdown)').slice(1).join('').split('## Link inventory')[0].replace(/^\s*\[Go Back\]\(#\)\s*/m, '').trim()) }, [policy])
  if (!policy) return <section className="container-page py-14"><p className="eyebrow">Refund request</p><h1 className="mt-2 text-3xl font-bold text-ink-950">Refund Request Form</h1><p className="mt-3 max-w-2xl text-ink-500">Provide your order details and the reason for your request. The team will review and follow up. This form does not accept attachments; if supporting documents are needed, our team will request them in a reply.</p><div className="mt-7 max-w-3xl rounded-3xl border border-line bg-white p-5 sm:p-8"><SmartForm config={refundForm} light /></div></section>
  const blocks = content.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
  return <article className="container-page min-h-[60vh] py-12 sm:py-16"><p className="eyebrow">Policies</p><h1 className="mt-2 text-3xl font-bold text-ink-950">{policy.title}</h1><div className="mt-8 max-w-4xl space-y-5 rounded-3xl border border-line bg-white p-6 leading-relaxed text-ink-600 sm:p-10">{blocks.length ? blocks.map((block, index) => { const heading = block.match(/^#{1,4}\s+(.+)$/); if (heading) return <h2 key={index} className="pt-3 text-xl font-bold text-ink-950">{heading[1].replace(/\\\./g, '.')}</h2>; if (block.startsWith('- ') || block.startsWith('* ')) return <ul key={index} className="list-disc space-y-2 pl-6">{block.split('\n').map((line, i) => <li key={i}>{line.replace(/^[-*]\s+/, '')}</li>)}</ul>; return <p key={index} className="whitespace-pre-line">{block.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\\\./g, '.')}</p> }) : <p>Loading policy…</p>}</div></article>
}

