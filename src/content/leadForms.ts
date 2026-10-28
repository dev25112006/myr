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
