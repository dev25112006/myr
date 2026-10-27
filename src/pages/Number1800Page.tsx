import { LEAD_FORM_4500 } from '@/content/leadForms'
import { Reveal } from '@/components/ui'
import { SmartForm } from '@/components/forms/SmartForm'

/**
 * /1800-number/ — FLAG §7.13: the source page contains only the H1
 * "1800 NUMBER" plus WPForms 4500. The tagline below is the exact card
 * wording used on the homepage/services cards for this route (source strings
 * "Toll-Free 1800 XXX 8899 Number" + "Seamless Communication with 1800
 * Toll-Free & WhatsApp API Solutions." + "Unlock unparalleled customer
 * engagement with our exclusive 1-800 toll-free number service"). No pricing
 * for the toll-free service exists anywhere in the manifest — none invented.
 */
export function Number1800Page() {
  return (
    <>
      <section className="section-dark grid-noise relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
        <div className="container-page text-center">
          <Reveal>
            <p className="eyebrow justify-center">Toll-Free 1800 XXX 8899 Number</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] text-ink-950 sm:text-5xl lg:text-6xl">
              1800 <span className="text-gradient">NUMBER</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
              Seamless Communication with 1800 Toll-Free &amp; WhatsApp API Solutions.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-400 sm:text-base">
              Unlock unparalleled customer engagement with our exclusive 1-800 toll-free number
              service.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-deep py-16 sm:py-20">
        <div className="container-page max-w-3xl">
          <Reveal>
            <div className="card p-6 sm:p-8">
              <p className="eyebrow">Get Quote</p>
              <h2 className="mt-3 text-2xl font-bold text-ink-950 sm:text-3xl">
                Get your 1800 number
              </h2>
              <p className="mt-3 text-sm text-ink-400">
                Fields match the WPForms lead form embedded on the source page.
              </p>
              <div className="mt-6">
                <SmartForm config={LEAD_FORM_4500} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
