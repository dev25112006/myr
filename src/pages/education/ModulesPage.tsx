import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/format'
import { Reveal, SectionHeading, FaqAccordion } from '@/components/ui'
import { usePopup } from '@/lib/stores'
import { PLATFORM_GROUPS, MODULES_FAQ, SEGMENT_LIST, SEGMENT_LINKS, type ModuleItem } from '@/content/education/segments'
import { StatusLegend } from '@/components/education/DemoBadge'

type CatalogItem = { id: string; name: string; group: string }

/**
 * Modules & features — the capability matrix.
 *
 * Optionally pulls the published product list from the read-only
 * /api/saas/products endpoint. If that fetch fails the page still works,
 * because the static matrix below is the source of truth.
 */
export function ModulesPage() {
  const { setOpen } = usePopup()
  const [catalog, setCatalog] = useState<CatalogItem[] | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/saas/products')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('catalog unavailable'))))
      .then((data: unknown) => {
        if (cancelled || !Array.isArray(data)) return
        const items: CatalogItem[] = data
          .flatMap((p): CatalogItem[] => {
            if (!p || typeof p !== 'object') return []
            const rec = p as Record<string, unknown>
            const id = typeof rec.slug === 'string' ? rec.slug : typeof rec.id === 'string' ? rec.id : ''
            const name = typeof rec.name === 'string' ? rec.name : ''
            const group = typeof rec.category === 'string' ? rec.category : 'Published catalog'
            if (!id || !name) return []
            return [{ id, name, group }]
          })
          .slice(0, 24)
        if (items.length) setCatalog(items)
      })
      .catch(() => {
        /* the static matrix below carries the page on its own */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main>
      {/* hero */}
      <section className="section-deep grid-noise relative overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-32 text-center sm:px-8 lg:pt-40">
          <p className="eyebrow justify-center">Modules and features</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.06] tracking-tight text-ink-950 sm:text-5xl">
            Every module, <span className="text-gradient">honestly labelled.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-500">
            One list across the MYR platform. Coaching workflows, CRM, HRM and the account layer are built and running. School and
            college specifics get configured per institution, and we say so everywhere.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setOpen('appointment')} className="btn btn-primary btn-md">
              Book a live demo
            </button>
            <Link to="/education-erp/" className="btn btn-ghost-dark btn-md">
              ← Education ERP hub
            </Link>
          </div>
          <div className="mt-9">
            <StatusLegend />
          </div>
        </div>
      </section>

      {/* matrix */}
      <section className="section-white px-5 py-20 sm:px-8" aria-labelledby="matrix-heading">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Capability matrix"
            title={
              <span id="matrix-heading">
                What runs today. <span className="text-accent-600">What gets configured.</span>
              </span>
            }
            tone="light"
          />
          <div className="mt-10 space-y-6">
            {PLATFORM_GROUPS.map((g) => (
              <Reveal key={g.title}>
                <article className="card overflow-hidden">
                  <header className="border-b border-line bg-paper/50 px-6 py-5">
                    <h3 className="text-lg font-bold text-ink-950">{g.title}</h3>
                    <p className="mt-1 text-sm text-ink-500">{g.blurb}</p>
                  </header>
                  <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
                    {g.items.map((item) => (
                      <li key={item.name} className="flex items-center justify-between gap-3 bg-white px-5 py-4">
                        <span className="text-sm text-ink-700">{item.name}</span>
                        <StatusPill status={item.status} />
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* published catalog, read-only and optional */}
      {catalog && catalog.length > 0 && (
        <section className="section-deep border-y border-line px-5 py-16 sm:px-8" aria-labelledby="catalog-heading">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              eyebrow="Published catalog"
              title={<span id="catalog-heading">Products published on the MYR platform.</span>}
              sub="Loaded read-only from the public catalog. It reflects what is published today and updates itself."
              tone="light"
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.map((c) => (
                <li key={c.id} className="rounded-2xl border border-line bg-white px-4 py-3.5">
                  <p className="text-sm font-semibold text-ink-950">{c.name}</p>
                  <p className="mt-1 text-xs text-ink-400">{c.group}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* per-segment entry */}
      <section className="section-white px-5 py-16 sm:px-8" aria-labelledby="segments-heading">
        <div className="mx-auto max-w-5xl text-center">
          <SectionHeading
            eyebrow="See them in context"
            title={<span id="segments-heading">Modules make more sense inside a campus.</span>}
            tone="light"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {SEGMENT_LIST.map((seg) => {
              const link = SEGMENT_LINKS[seg.id]
              return link.ready ? (
                <Link key={seg.id} to={link.href} className="btn btn-ghost-dark btn-sm">
                  {seg.name} →
                </Link>
              ) : (
                <Link key={seg.id} to="/education-erp/" className="btn btn-ghost-dark btn-sm">
                  {seg.name} →
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-deep border-t border-line px-5 py-20 sm:px-8" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="FAQs" title={<span id="faq-heading">Scope and pricing, plainly.</span>} tone="light" />
          <div className="mt-8">
            <FaqAccordion items={MODULES_FAQ} tone="light" />
          </div>
        </div>
      </section>

      {/* conversion */}
      <section className="section-white px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-ink-950 sm:text-4xl">Pick what your institution needs.</h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-500">
              Most start with attendance and fees, then expand. MYR scopes the rest with you and quotes against what you actually pick.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setOpen('appointment')}
                className="btn btn-primary btn-md"
              >
                Request pricing and demo
              </motion.button>
              <Link to="/contact-us/" className="btn btn-ghost-dark btn-md">
                Contact the team
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

function StatusPill({ status }: { status: ModuleItem['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]',
        status === 'live' ? 'bg-emerald-50 text-emerald-700' : 'bg-paper text-ink-500',
      )}
    >
      <span aria-hidden className={cn('size-1.5 rounded-full', status === 'live' ? 'bg-emerald-500' : 'bg-ink-300')} />
      {status === 'live' ? 'Live' : 'Scope'}
    </span>
  )
}
