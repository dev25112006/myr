import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePopup } from '@/lib/stores'
import { LEAD_FORM_4500 } from '@/content/leadForms'
import { Reveal } from '@/components/ui'
import { SmartForm } from '@/components/forms/SmartForm'

const CCTV_SLIDES = [
  {
    eyebrow: 'A clear starting point',
    title: '16-channel CCTV systems',
    description: 'Start with coverage for up to 16 cameras—well suited to shops, offices, clinics, and smaller facilities.',
    points: ['Plan camera locations around key entry points', 'Choose indoor and outdoor coverage', 'Keep room to add more cameras later'],
    channels: 16,
  },
  {
    eyebrow: 'More areas, one system',
    title: '32-channel CCTV systems',
    description: 'Bring larger premises into one view, from multiple floors and work areas to wider perimeters.',
    points: ['Coordinate coverage across multiple zones', 'Review footage from a central recorder', 'Design camera placement to reduce blind spots'],
    channels: 32,
  },
  {
    eyebrow: 'For larger properties',
    title: '64-channel CCTV systems',
    description: 'Plan broader surveillance for warehouses, campuses, commercial buildings, and multi-area sites.',
    points: ['Map coverage across a larger property', 'Organize views by building or area', 'Discuss storage and network needs upfront'],
    channels: 64,
  },
  {
    eyebrow: 'Designed around your site',
    title: 'A system that can grow with you',
    description: 'We help match camera count, recorder capacity, storage, and coverage to your site and future plans.',
    points: ['Start with a site-specific assessment', 'Plan expansion before you need it', 'Get a clear recommendation for your budget'],
    channels: null,
  },
  {
    eyebrow: 'Why work with MYR',
    title: 'From planning through installation',
    description: 'Get help choosing a practical security setup, placing cameras thoughtfully, and getting the system ready to use.',
    points: ['Guidance on camera and recorder options', 'Neat, considered installation planning', 'Support with setup and handover'],
    channels: null,
  },
]

function CctvShowcase() {
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()
  const { setOpen } = usePopup()
  const slide = CCTV_SLIDES[active]

  useEffect(() => {
    if (reduceMotion) return
    const timer = window.setInterval(() => setActive((current) => (current + 1) % CCTV_SLIDES.length), 6000)
    return () => window.clearInterval(timer)
  }, [reduceMotion])

  const showSlide = (index: number) => setActive((index + CCTV_SLIDES.length) % CCTV_SLIDES.length)

  return (
    <section className="section-light overflow-hidden py-16 sm:py-20" aria-label="CCTV system options">
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">CCTV systems for every site</p>
            <h2 className="mt-2 text-3xl font-bold text-ink-950 sm:text-4xl">Find the right coverage</h2>
          </div>
          <div className="flex items-center gap-2" aria-label="Choose a CCTV slide">
            <button type="button" onClick={() => showSlide(active - 1)} className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-800 transition hover:border-accent-400 hover:text-accent-600" aria-label="Previous slide">←</button>
            <button type="button" onClick={() => showSlide(active + 1)} className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-800 transition hover:border-accent-400 hover:text-accent-600" aria-label="Next slide">→</button>
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-line bg-white shadow-card sm:min-h-[390px] lg:min-h-[430px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={reduceMotion ? false : { opacity: 0, x: 36, scale: 0.985 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -28, scale: 0.99 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="grid min-h-[360px] items-center gap-8 p-5 sm:min-h-[390px] sm:p-10 lg:min-h-[430px] lg:grid-cols-[1fr_.9fr] lg:p-12"
              aria-live="polite"
            >
              <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } } }}>
                <motion.p variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="text-xs font-bold uppercase tracking-[.16em] text-accent-600">{slide.eyebrow}</motion.p>
                <motion.h3 variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="mt-3 text-3xl font-bold text-ink-950 sm:text-4xl">{slide.title}</motion.h3>
                <motion.p variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="mt-4 max-w-2xl leading-relaxed text-ink-500">{slide.description}</motion.p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {slide.points.map((point, index) => <motion.li key={point} initial={reduceMotion ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 + index * 0.08 }} className="flex items-start gap-2 text-sm text-ink-300"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-400/12 text-[11px] text-accent-600" aria-hidden>✓</span>{point}</motion.li>)}
                </ul>
                <motion.button type="button" onClick={() => setOpen('appointment')} whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }} className="btn btn-primary btn-sm mt-6">Get a CCTV quote <span aria-hidden>→</span></motion.button>
              </motion.div>
              <motion.div whileHover={reduceMotion ? undefined : { y: -4 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="group relative flex min-h-48 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#080f4d] via-ink-950 to-[#25307c] p-6 text-white shadow-xl shadow-ink-950/20 sm:min-h-56">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / .12) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .12) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <motion.div aria-hidden className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-accent-300/20" animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
                <div className="absolute -right-2 -top-2 h-32 w-32 rounded-full border border-white/10" />
                {slide.channels ? (
                  <div className="relative z-10 flex w-full items-center justify-between gap-4 sm:gap-6">
                    <div className="grid flex-1 grid-cols-2 gap-2 sm:gap-3" aria-hidden>
                      {[0, 1, 2, 3].map((camera) => <motion.div key={`${active}-${camera}`} initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: camera * 0.08 }} className="relative aspect-[1.3] overflow-hidden rounded-lg border border-white/15 bg-gradient-to-br from-slate-500/35 to-slate-950/70 p-2"><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /><div className="absolute inset-x-2 bottom-2 h-px bg-white/15" /><motion.div className="absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-cyan-300/20 to-transparent" animate={reduceMotion ? undefined : { y: [0, 52, 0] }} transition={{ duration: 3.2 + camera * 0.3, repeat: Infinity, ease: 'linear', delay: camera * 0.2 }} /></motion.div>)}
                    </div>
                    <div className="shrink-0 text-center">
                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-white/20 bg-white/10 sm:h-14 sm:w-14">
                        <svg viewBox="0 0 48 48" className="h-8 w-8 sm:h-9 sm:w-9" fill="none" aria-hidden><path d="M8 17h32v22H8zM15 17l3-7h12l3 7M18 28a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /></svg>
                      </div>
                      <motion.p key={slide.channels} initial={reduceMotion ? false : { opacity: 0, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 12 }} className="mt-2 font-display text-4xl font-bold sm:text-5xl">{slide.channels}</motion.p>
                      <p className="text-xs text-white/70 sm:text-sm">camera channels</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 grid w-full grid-cols-3 gap-2 sm:gap-3">
                    {['Site survey', 'System plan', 'Installation', 'Setup', 'Handover', 'Expansion'].map((step, index) => <motion.div key={`${active}-${step}`} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }} whileHover={reduceMotion ? undefined : { scale: 1.04, backgroundColor: 'rgba(255,255,255,.16)' }} className="rounded-xl border border-white/15 bg-white/10 px-2 py-3 text-center text-[11px] font-medium sm:px-3 sm:text-sm"><span className="mb-1 block text-accent-300">0{index + 1}</span>{step}</motion.div>)}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10"><motion.div key={active} className="h-full bg-accent-400" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: reduceMotion ? 0 : 6, ease: 'linear' }} /></div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex justify-center gap-2" role="group" aria-label="CCTV slide navigation">
          {CCTV_SLIDES.map((item, index) => <button key={item.title} type="button" onClick={() => showSlide(index)} className={`h-2.5 rounded-full transition-all ${index === active ? 'w-8 bg-accent-500' : 'w-2.5 bg-ink-300/30 hover:bg-ink-300/60'}`} aria-label={`Show slide ${index + 1}: ${item.title}`} aria-current={index === active ? 'true' : undefined} />)}
        </div>
      </div>
    </section>
  )
}

/**
 * /cctv-solution/ — FLAG §7.13: the source page contains only the H1
 * "cctv solution" (exact lowercase) plus WPForms 4500. The channel carousel
 * introduces system sizes and installation advantages. "Book Now" opens the
 * shared appointment popup (source nav badge: CCTV Solution → Book Now).
 */
export function CctvSolutionPage() {
  const { setOpen } = usePopup()

  return (
    <>
      <section className="section-dark grid-noise relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
        <div className="container-page text-center">
          <Reveal>
            <p className="eyebrow justify-center">CCTV Solution &amp; Installation</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] text-ink-950 sm:text-5xl lg:text-6xl">
              CCTV Security Camera Installation
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
              Plan surveillance for your business with 16, 32, and 64-channel CCTV systems, thoughtful camera placement, and installation support from MYR Advance Solution.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setOpen('appointment')} className="btn btn-primary btn-md">
                Book Now
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <CctvShowcase />

      <section className="section-deep py-16 sm:py-20">
        <div className="container-page max-w-3xl">
          <Reveal>
            <div className="card p-6 sm:p-8">
              <p className="eyebrow">Get Quote</p>
              <h2 className="mt-3 text-2xl font-bold text-ink-950 sm:text-3xl">
                Tell us about your CCTV &amp; security needs
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
