import { ModalShell } from '../ModalShell'
import { SmartForm } from '@/components/forms/SmartForm'
import { PARTNER_FORM } from '@/content/leadForms'

/** Partner popup reuses the white-label / reseller / distribution inquiry form. */
export function PartnerFormPopup() {
  return (
    <ModalShell
      id="partner"
      title="Partner with Us & Earn Profit Today!"
      wide
      fullScreen
      background="blue"
    >
      <div className="mb-5">
        <p className="text-sm leading-relaxed text-ink-300">
          “Partner with <strong className="text-ink-950">MYR ADVANCE SOLUTION PVT. LTD.</strong> and
          unlock the opportunity to <strong className="text-accent-600">earn revenue</strong>{' '}
          by promoting our wide range of IT services. These include Website Development, CRM
          Solutions, Toll-Free Numbers, Cloud Telephony Systems, CCTV Installation, IT Infrastructure,
          and Digital Marketing &amp; More. Join us today and start earning!”
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-ink-200 sm:grid-cols-2">
          <li>✦ Earn revenue on every successful sale.</li>
          <li>✦ Access to premium marketing resources and training.</li>
          <li>✦ Dedicated partner support for smooth collaboration.</li>
          <li>✦ Expand your business network and customer base.</li>
        </ul>
      </div>
      <SmartForm config={PARTNER_FORM} />
    </ModalShell>
  )
}
