import type { FormConfig } from '@/components/forms/SmartForm'

/**
 * WPForms 4500 — shared lead form posted to /cctv-solution/ and
 * /1800-number/ (field order + labels from both `.links.md` manifests and
 * raw HTML). Field 4 ("Contact Address Message/Additional") is a honeypot
 * (absolutely positioned anti-spam field) and is intentionally omitted.
 * Required flags from source: Your Name*, Email*, Contact Number*,
 * Your Location (City/State)*. Message textarea maxlength=160 in source.
 */
export const LEAD_FORM_4500: FormConfig = {
  id: 'lead-4500',
  inboxType: 'lead',
  inboxSubject: 'Website inquiry',
  submitLabel: 'Submit',
  successMessage: 'Thank you! Your request has been received by our team.',
  fields: [
    {
      kind: 'text',
      name: 'name',
      label: 'Your Name',
      required: true,
      placeholder: 'Your Name',
      autocomplete: 'name',
    },
    {
      kind: 'email',
      name: 'email',
      label: 'Email',
      required: true,
      placeholder: 'Email',
      autocomplete: 'email',
    },
    {
      kind: 'tel',
      name: 'phone',
      label: 'Contact Number',
      required: true,
      placeholder: 'Contact Number',
      autocomplete: 'tel',
    },
    {
      kind: 'text',
      name: 'business',
      label: 'Business Name',
      placeholder: 'Business Name',
      half: true,
    },
    {
      kind: 'textarea',
      name: 'address',
      label: 'Complete Address',
      placeholder: 'Complete Address',
      rows: 3,
    },
    {
      kind: 'checkbox-group',
      name: 'services',
      label: 'Services Interested',
      options: [
        'Website Development',
        'CRM Solutions',
        'HRM Solutions',
        'Education ERP',
        'IT Infrastructure',
        'Digital Marketing',
        'Toll-Free Numbers',
        'Cloud Telephony Systems',
        'CCTV & Security',
        'Other',
      ],
    },
    {
      kind: 'text',
      name: 'location',
      label: 'Your Location (City/State)',
      required: true,
      placeholder: 'Your Location (City/State)',
      half: true,
    },
    {
      kind: 'textarea',
      name: 'message',
      label: 'Message/Additional Details (Optional)',
      placeholder: 'Message/Additional Details (Optional)',
      rows: 3,
    },
  ],
}

/** Partner enquiry form — white-label / reseller / distribution segments. */
export const PARTNER_FORM: FormConfig = {
  id: 'partner-enquiry',
  inboxType: 'lead',
  inboxSubject: 'Partnership enquiry',
  submitLabel: 'Request partnership details',
  successMessage: 'Thank you! Our partnership team will contact you within one business day.',
  fields: [
    { kind: 'text', name: 'name', label: 'Your Name', required: true, placeholder: 'Your Name', autocomplete: 'name' },
    { kind: 'email', name: 'email', label: 'Email', required: true, placeholder: 'Email', autocomplete: 'email' },
    { kind: 'tel', name: 'phone', label: 'Contact Number', required: true, placeholder: 'Contact Number', autocomplete: 'tel' },
    { kind: 'text', name: 'business', label: 'Business / Firm Name', placeholder: 'Business Name', half: true },
    { kind: 'text', name: 'location', label: 'Your Location (City/State)', required: true, placeholder: 'City / State', half: true },
    {
      kind: 'checkbox-group',
      name: 'segments',
      label: 'Products you want to white-label / resell',
      options: [
        'White Label School ERP',
        'White Label College ERP',
        'White Label Coaching ERP',
        'White Label CRM',
        'White Label HRM',
        'White Label E-commerce Website',
        'White Label Billing Software',
        'White Label Website Development',
        'White Label Digital Marketing',
        'IP PBX & Telephony',
        'CCTV & Security',
        'Other',
      ],
    },
    {
      kind: 'select',
      name: 'partnershipType',
      label: 'Preferred partnership type',
      options: ['White Label Partnership', 'Reseller Partnership', 'Distribution Partnership'],
    },
    { kind: 'textarea', name: 'message', label: 'Tell us about your business (Optional)', placeholder: 'Your market, customers and what you are looking for…', rows: 4 },
  ],
}
