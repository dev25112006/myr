import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { LoginRegisterPopup } from '@/components/layout/popups/LoginRegisterPopup'
import { PartnerFormPopup } from '@/components/layout/popups/PartnerFormPopup'
import { AppointmentPopup } from '@/components/layout/popups/AppointmentPopup'
import { PrivyrSignupPopup } from '@/components/layout/popups/PrivyrSignupPopup'
import { SeoHead } from '@/components/seo/SeoHead'
import { getRouteMeta } from '@/content/routeMeta'

/** Thin top scroll-progress bar (premium affordance, reduced-motion aware). */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 })
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-80 h-0.5 origin-left bg-gradient-to-r from-accent-500 via-accent-400 to-flame-500"
    />
  )
}

export function Layout() {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const variant = getRouteMeta(pathname)?.header ?? 'inner'
  const hideFooter = variant === 'panel'

  // Scroll to top on route change (instant for reduced motion).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <SeoHead />
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-accent-400 focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {!hideFooter && <SiteFooter />}

      <LoginRegisterPopup />
      <PartnerFormPopup />
      <AppointmentPopup />
      <PrivyrSignupPopup />
    </div>
  )
}
