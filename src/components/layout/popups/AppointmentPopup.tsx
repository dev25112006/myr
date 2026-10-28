import { ModalShell } from '../ModalShell'
import { SmartForm, type FormConfig } from '@/components/forms/SmartForm'

/**
 * Appointment popup — source: Elementor popups 3175/3195 ("Schedule an
 * Appointment with Our IT Pro"). Original popup body UNVERIFIED; honest demo
 * scheduling form used instead (flagged in QA).
 */
export const APPOINTMENT_FORM: FormConfig = {
  id: 'appointment',
  inboxType: 'lead',
  inboxSubject: 'Appointment request',
  submitLabel: 'Request appointment',
  successMessage: 'Your appointment request has been sent. Our team will contact you to confirm the slot.',
  fields: [
    { kind: 'text', name: 'name', label: 'Your Name', required: true, half: true, autocomplete: 'name' },
    { kind: 'email', name: 'email', label: 'Email', required: true, half: true, autocomplete: 'email' },
    { kind: 'tel', name: 'phone', label: 'Phone', required: true, half: true, autocomplete: 'tel' },
    { kind: 'date', name: 'date', label: 'Preferred date', required: true, half: true },
    {
      kind: 'select',
      name: 'service',
      label: 'Service',
      options: [
        'Web Development',
        'CRM Development',
        'Digital Marketing',
        'Networking Solution',
        'IPBX Solution',
        'CCTV Solution',
        'Toll-Free 1800 Number',
      ],
    },
    { kind: 'textarea', name: 'notes', label: 'Notes (Optional)', rows: 3 },
  ],
}

export function AppointmentPopup() {
  return (
    <ModalShell id="appointment" title="Schedule an Appointment with Our IT Pro" wide>
      <p className="mb-5 text-sm text-ink-300">
        Tell us when suits you and our IT team will confirm the slot.
      </p>
      <SmartForm config={APPOINTMENT_FORM} />
    </ModalShell>
  )
}
