import { ModalShell } from '../ModalShell'
import { SmartForm, type FormConfig } from '@/components/forms/SmartForm'

/**
 * Privyr "Get Started" popup — source: Elementor popup 5180 (verified from
 * /privyr/ HTML): hero blurb, "1,599.00 / mo" price line, WPForms 5177
 * (Name*, Email*, honeypot; submit "Get Started").
 */
export const PRIVYR_SIGNUP_FORM: FormConfig = {
  id: 'privyr-signup',
  inboxType: 'lead',
  inboxSubject: 'Privyr signup request',
  submitLabel: 'Get Started',
  successMessage: 'Thanks! Your request has been received by our team.',
  fields: [
    { kind: 'text', name: 'name', label: 'Name', required: true, autocomplete: 'name' },
    { kind: 'email', name: 'email', label: 'Email', required: true, autocomplete: 'email' },
  ],
}

export function PrivyrSignupPopup() {
  return (
    <ModalShell id="privyr-signup" title="Ready to get started?">
      <p className="mb-4 text-sm leading-relaxed text-ink-300">
        Boost your sales with instant lead notifications, automated personalized content, interest
        monitoring, seamless follow-ups, and efficient lead management— all conveniently accessible
        from your phone in just seconds.
      </p>
      <p className="mb-5 font-display text-2xl font-bold text-ink-950">
        1,599.00 <span className="text-base font-medium text-ink-400">/ mo</span>
      </p>
      <SmartForm config={PRIVYR_SIGNUP_FORM} />
    </ModalShell>
  )
}
