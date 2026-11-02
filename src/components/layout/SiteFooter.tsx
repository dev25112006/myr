import { Link } from 'react-router-dom'
import {
  COPYRIGHT,
  FOOTER_BLURB,
  FOOTER_COMPANY,
  FOOTER_QUICK_LINKS,
  FOOTER_SERVICES,
  SOCIALS,
} from './nav'
import { usePopup } from '@/lib/stores'

const LOGO_WIDE = '/assets/2024-08-MYR-LOGO.png'

function Column({ title, links }: { title: string; links: typeof FOOTER_QUICK_LINKS }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-600">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-sm text-ink-300 transition hover:text-accent-600"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  const { setOpen } = usePopup()

  return (
    <footer className="section-dark border-t border-line">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link to="/" aria-label="MyR Advance Solution — Home">
            <img src={LOGO_WIDE} alt="MYR ADVANCE SOLUTION" className="h-10 w-auto" />
          </Link>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-300">{FOOTER_BLURB}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.to}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink-300 transition hover:border-accent-400/50 hover:text-accent-600"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <Column title="Quick Links." links={FOOTER_QUICK_LINKS} />
        </div>
        <div className="lg:col-span-2">
          <Column title="Services." links={FOOTER_SERVICES} />
        </div>

        <div className="lg:col-span-4">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-600">
            Company.
          </h3>
          <ul className="space-y-2.5">
            {FOOTER_COMPANY.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-ink-300 transition hover:text-accent-600">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setOpen('partner')}
                className="text-sm text-ink-300 transition hover:text-accent-600"
              >
                Partner with Us
              </button>
            </li>
          </ul>

          <div className="mt-6 rounded-2xl border border-accent-400/25 bg-accent-400/5 p-4">
            <p className="text-sm font-semibold text-accent-600">
              Partner with Us &amp; Earn Profit Today!
            </p>
            <button
              type="button"
              onClick={() => setOpen('partner')}
              className="btn btn-primary btn-sm mt-3"
            >
              Become a partner
            </button>
          </div>

          {/* UNVERIFIED: original footer renders [lsft_horizontal_flags] country flags strip */}
          <div
            className="mt-5 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-wider text-ink-400"
            title="UNVERIFIED: [lsft_horizontal_flags] language flags strip on original site"
          >
            <span className="rounded border border-line px-1.5 py-0.5">IN</span>
            <span className="rounded border border-line px-1.5 py-0.5">SA</span>
            <span className="rounded border border-line px-1.5 py-0.5">AE</span>
            <span className="rounded border border-line px-1.5 py-0.5">+ flags</span>
          </div>
        </div>
      </div>

      <div className="border-t border-line py-5">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-center text-xs text-ink-400 sm:flex-row sm:text-left">
          <p>{COPYRIGHT}</p>
          <p>Rebuilt independently — new visual identity, same verified content.</p>
        </div>
        <div className="mt-6 px-4 sm:px-6 lg:px-8">
          <img
            src="/assets/2024-08-MYR-LOGO.png"
            alt="MYR Advance Solution"
            className="w-full h-auto rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg sm:p-6"
          />
        </div>
      </div>
    </footer>
  )
}
