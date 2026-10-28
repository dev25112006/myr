import { ModalShell } from '../ModalShell'
import { SmartForm, type FormConfig } from '@/components/forms/SmartForm'

/** Partner form — footer popup (Elementor id 4499). Fields verbatim from audit. */
export const PARTNER_FORM: FormConfig = {
  id: 'partner',
  inboxType: 'lead',
  inboxSubject: 'Partnership inquiry',
  submitLabel: 'Submit',
  successMessage: 'Thank you for your interest in partnering with MYR ADVANCE SOLUTION! Our team will be in touch.',
  fields: [
    { kind: 'text', name: 'name', label: 'Your Name', required: true, half: true, autocomplete: 'name' },
    { kind: 'email', name: 'email', label: 'Email', required: true, half: true, autocomplete: 'email' },
    { kind: 'tel', name: 'contact', label: 'Contact Number', required: true, half: true, autocomplete: 'tel' },
    { kind: 'text', name: 'business', label: 'Business Name', half: true },
    { kind: 'textarea', name: 'address', label: 'Complete Address', rows: 2 },
    { kind: 'text', name: 'alt_contact', label: 'Number (Optional) Email', placeholder: 'Number (Optional) Email' },
    {
      kind: 'checkbox-group',
      name: 'services',
      label: 'Services You Are Interested In',
      options: [
        'Website Development',
        'CRM Solutions',
        'IT Infrastructure',
        'Digital Marketing',
        'Toll-Free Numbers',
        'Cloud Telephony Systems',
        'CCTV & Security',
        'Other',
      ],
    },
    { kind: 'text', name: 'location', label: 'Your Location (City/State)', required: true },
    { kind: 'textarea', name: 'message', label: 'Message/Additional Details (Optional)', rows: 3 },
  ],
}

export function PartnerFormPopup() {
  return (
    <ModalShell id="partner" title="Partner with Us & Earn 40% Profit Today!" wide>
      <div className="mb-5">
        <p className="text-sm leading-relaxed text-ink-300">
          “Partner with <strong className="text-ink-950">MYR ADVANCE SOLUTION PVT. LTD.</strong> and
          unlock the opportunity to <strong className="text-accent-600">earn up to 40% in revenue</strong>{' '}
          by promoting our wide range of IT services. These include Website Development, CRM
          Solutions, Toll-Free Numbers, Cloud Telephony Systems, CCTV Installation, IT Infrastructure,
          and Digital Marketing &amp; More. Join us today and start earning!”
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-ink-200 sm:grid-cols-2">
          <li>✦ Earn 40% revenue on every successful sale.</li>
          <li>✦ Access to premium marketing resources and training.</li>
          <li>✦ Dedicated partner support for smooth collaboration.</li>
          <li>✦ Expand your business network and customer base.</li>
        </ul>
      </div>
      <SmartForm config={PARTNER_FORM} />
    </ModalShell>
  )
}
