import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  INNER_NAV,
  OFFCANVAS_SERVICES,
} from './nav'
import { useCart, useAuth, usePopup } from '@/lib/stores'
import { cn, inr } from '@/lib/format'

const LOGO = '/assets/2024-08-MYR-LOGO.png'

function CartGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.4" fill="currentColor" />
      <circle cx="17.5" cy="20" r="1.4" fill="currentColor" />
    </svg>
  )
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-5" aria-hidden>
      <span
        className={cn(
          'absolute left-0 h-0.5 w-full bg-current transition-all duration-300',
          open ? 'top-1.5 rotate-45' : 'top-0',
        )}
      />
      <span
        className={cn(
          'absolute left-0 top-1.5 h-0.5 w-full bg-current transition-all duration-300',
          open ? 'opacity-0' : 'opacity-100',
        )}
      />
      <span
        className={cn(
          'absolute left-0 h-0.5 w-full bg-current transition-all duration-300',
          open ? 'top-1.5 -rotate-45' : 'top-3',
        )}
      />
    </span>
  )
}

export function SiteHeader() {
  const location = useLocation()
  const variant = location.pathname === '/' ? 'primary' : 'inner'
  // Keep the same navigation and header controls on every route so the
  // navbar does not reflow when navigating between pages.
  const nav = INNER_NAV
  const { count, total } = useCart()
  const { user, logout } = useAuth()
  const { setOpen } = usePopup()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const [pinnedMenu, setPinnedMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)

  // Close transient panels when the route changes (adjust-during-render pattern).
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setMobileOpen(false)
    setAccountOpen(false)
    setServicesOpen(false)
    setMegaOpen(null)
    setPinnedMenu(null)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!accountOpen) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) setAccountOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccountOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [accountOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-line bg-white/85 backdrop-blur-xl'
          : 'border-transparent bg-white/70 backdrop-blur-md',
      )}
    >
      <div
        className="container-page relative flex h-16 items-center justify-between gap-2 sm:h-[72px] lg:gap-3"
        onMouseLeave={() => { if (!pinnedMenu) setMegaOpen(null) }}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !pinnedMenu) setMegaOpen(null) }}
      >
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center" aria-label="MyR Advance Solution — Home">
          <img src={LOGO} alt="MyR Advance Solution" className="h-8 w-auto sm:h-9" loading="eager" />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden min-w-0 flex-nowrap items-center gap-0.5 whitespace-nowrap xl:flex xl:gap-1"
          aria-label="Primary"
        >
          {nav.filter((item) => item.label !== 'Contact Us').map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onMouseEnter={() => {
                if (!pinnedMenu) { setMegaOpen(item.to); setServicesOpen(false) }
              }}
              onFocus={() => {
                if (!pinnedMenu) { setMegaOpen(item.to); setServicesOpen(false) }
              }}
              onClick={() => {
                setMegaOpen(null)
                setPinnedMenu(null)
                setServicesOpen(false)
              }}
              className="whitespace-nowrap rounded-full px-2 py-2 text-xs font-medium text-ink-200 transition-colors hover:text-accent-600 focus-visible:text-accent-600 xl:px-2.5 xl:text-sm"
            >
              {item.label}
            </Link>
          ))}

          {/* All Services dropdown */}
          <div className="relative" onMouseEnter={() => { if (!pinnedMenu) { setServicesOpen(true); setMegaOpen(null) } }} onMouseLeave={() => { if (pinnedMenu !== 'services') setServicesOpen(false) }}>
            <button
                type="button"
                onClick={() => {
                  const next = !servicesOpen
                  setServicesOpen(next)
                  setPinnedMenu(next ? 'services' : null)
                  setMegaOpen(null)
                }}
                className={cn(
                  'flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-2 text-xs font-medium transition xl:px-3 xl:text-sm',
                  variant === 'primary'
                    ? 'border border-accent-400/40 bg-accent-400/10 text-accent-600 hover:bg-accent-400/20'
                    : 'text-ink-200 hover:text-accent-600',
                )}
                aria-expanded={servicesOpen}
                aria-controls="all-services-menu"
              >
                All Services
                <svg className={cn('h-2.5 w-2.5 transition-transform duration-200', servicesOpen && 'rotate-180')} viewBox="0 0 10 10" aria-hidden>
                  <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                </svg>
            </button>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.16 }}
                    id="all-services-menu"
                    className="fixed left-1/2 top-[calc(var(--header-height,4.5rem)+0.5rem)] z-50 max-h-[min(80vh,48rem)] w-[min(96vw,82rem)] -translate-x-1/2 overflow-y-auto rounded-2xl border border-line bg-white p-4 shadow-card backdrop-blur-xl sm:p-6"
                  >
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                    {[
                      { title: 'Home', to: '/', links: [['Services', '/#services'], ['Shop', '/#E-Commerce'], ['Plans', '/#pricing'], ['Contact', '/#contact']] },
                      { title: 'Shop', to: '/tech-store/', links: [['Browse categories', '/tech-store/#store-browse'], ['Popular products & plans', '/tech-store/#store-products'], ['IP telephony', '/tech-store/#store-categories'], ['Contact our team', '/tech-store/#store-contact']] },
                      { title: 'Launch Your Website', to: '/website-development/', links: [['Website solutions', '/website-development/#website-solutions'], ['Development process', '/website-development/#development-process'], ['Included features', '/website-development/#viewallfeatures'], ['Pricing plans', '/website-development/#Pricing']] },
                      { title: 'CRM', to: '/crm/', links: [['Lead management', '/crm/#lead-management'], ['Features', '/crm/#crm-features'], ['30-second setup', '/crm/#quick-setup'], ['Plans & pricing', '/crm/#privyrpricing']] },
                      { title: 'HRM Solutions', to: '/hrm-solutions/', links: [['People management', '/hrm-solutions/#hrm-workspace'], ['Attendance & leave', '/hrm-solutions/#hrm-workspace'], ['Payroll & hiring', '/hrm-solutions/#hrm-workspace'], ['Talk to our team', '/contact-us/?interest=hrm#contact-form']] },
                      { title: 'Education ERP', to: '/education-erp/', links: [['School ERP', '/education-erp/school/'], ['College ERP', '/education-erp/college/'], ['Coaching ERP', '/education-erp/coaching/'], ['Modules & features', '/education-erp/modules/']] },
                      { title: 'Contact Us', to: '/contact-us/', links: [['Contact options', '/contact-us/#contact-options'], ['Send us a message', '/contact-us/#contact-form'], ['Our offices', '/contact-us/#our-offices']] },
                    ].map((page) => <section key={page.to}><Link to={page.to} onClick={() => { setServicesOpen(false); setPinnedMenu(null) }} className="text-sm font-bold text-ink-950 hover:text-accent-600">{page.title} ↗</Link><div className="mt-2 flex flex-col gap-1">{page.links.map(([label, href]) => <Link key={href} to={href} onClick={() => { setServicesOpen(false); setPinnedMenu(null) }} className="rounded-lg px-2 py-2 text-sm text-ink-300 hover:bg-paper hover:text-accent-600">{label}</Link>)}</div></section>)}
                    </div>
                    <div className="mt-5 border-t border-line pt-4">
                      <h2 className="text-sm font-bold text-ink-950">All Services &amp; Solutions</h2>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
                        {[
                          ['Website Development', '/website-development/'], ['CRM Solutions', '/crm-development/'], ['HRM Solutions', '/hrm-solutions/'], ['E-Commerce Solutions', '/ecommerce-solutions/'], ['WhatsApp Automation', '/crm/#quick-setup'], ['AI Digital Marketing', '/digital-marketing/'], ['Networking Solutions', '/network-solution/'], ['IPBX Solutions', '/ipbx-solution/'], ['CCTV Solutions', '/cctv-solution/'], ['Toll-Free 1800 Numbers', '/1800-number/'], ['Other Software Solutions', '/contact-us/?interest=software#contact-form'], ['Browse All Services', '/services/'],
                        ].map(([label, href]) => <Link key={label} to={href} onClick={() => { setServicesOpen(false); setPinnedMenu(null) }} className="flex min-h-12 items-center rounded-xl border border-line bg-paper/50 px-3 py-2 text-sm text-ink-300 hover:border-accent-400/40 hover:bg-accent-400/10 hover:text-accent-600">{label}</Link>)}
                      </div>
                    </div>
                    {/* Keep the compact service list available in the mobile menu only. */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {nav.filter((item) => item.label === 'Contact Us').map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onMouseEnter={() => { if (!pinnedMenu) { setMegaOpen(item.to); setServicesOpen(false) } }}
              onFocus={() => { if (!pinnedMenu) { setMegaOpen(item.to); setServicesOpen(false) } }}
              className="whitespace-nowrap rounded-full px-2 py-2 text-xs font-medium text-ink-200 transition-colors hover:text-accent-600 xl:px-2.5 xl:text-sm"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <AnimatePresence>
          {megaOpen && megaOpen !== '/services/' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.16 }}
              onMouseLeave={() => { if (!pinnedMenu) setMegaOpen(null) }}
              className="absolute left-0 right-0 top-full z-50 hidden pt-2 xl:block"
            >
              <div className="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-line bg-white p-6 shadow-card">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {[
                    { title: 'Home', to: '/', links: [['Services', '/#services'], ['Shop', '/#E-Commerce'], ['Plans', '/#pricing'], ['Contact', '/#contact']] },
                    { title: 'Shop', to: '/tech-store/', links: [['Browse categories', '/tech-store/#store-browse'], ['Popular products & plans', '/tech-store/#store-products'], ['IP telephony', '/tech-store/#store-categories'], ['Contact our team', '/tech-store/#store-contact']] },
                    { title: 'Launch Your Website', to: '/website-development/', links: [['Website solutions', '/website-development/#website-solutions'], ['Development process', '/website-development/#development-process'], ['Included features', '/website-development/#viewallfeatures'], ['Pricing plans', '/website-development/#Pricing']] },
                    { title: 'CRM', to: '/crm/', links: [['Lead management', '/crm/#lead-management'], ['Features', '/crm/#crm-features'], ['30-second setup', '/crm/#quick-setup'], ['Plans & pricing', '/crm/#privyrpricing']] },
                    { title: 'HRM', to: '/hrm-solutions/', links: [['People management', '/hrm-solutions/#hrm-workspace'], ['Attendance & leave', '/hrm-solutions/#hrm-workspace'], ['Payroll & hiring', '/hrm-solutions/#hrm-workspace'], ['Talk to our team', '/contact-us/?interest=hrm#contact-form']] },
                    { title: 'Education ERP', to: '/education-erp/', links: [['School ERP', '/education-erp/school/'], ['College ERP', '/education-erp/college/'], ['Coaching ERP', '/education-erp/coaching/'], ['Modules & features', '/education-erp/modules/']] },
                    { title: 'Contact Us', to: '/contact-us/', links: [['Contact options', '/contact-us/#contact-options'], ['Send us a message', '/contact-us/#contact-form'], ['Our offices', '/contact-us/#our-offices']] },
                  ].filter((page) => page.to === megaOpen).map((page) => <section key={page.to}><Link to={page.to} onClick={() => { setMegaOpen(null); setPinnedMenu(null) }} className="text-sm font-bold text-ink-950 hover:text-accent-600">{page.title} ↗</Link><div className="mt-3 flex flex-col gap-1">{page.links.map(([label, href]) => <Link key={href} to={href} onClick={() => { setMegaOpen(null); setPinnedMenu(null) }} className="rounded-lg px-2 py-2 text-sm text-ink-300 transition hover:bg-paper hover:text-accent-600">{label}</Link>)}</div></section>)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-3">
          {user ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => { setAccountOpen((open) => !open); setMobileOpen(false) }}
                className="flex max-w-[7.5rem] items-center gap-1.5 rounded-full border border-line bg-ink-950/[0.04] px-2.5 py-2 text-xs font-semibold text-ink-200 transition hover:border-accent-400/50 hover:text-accent-600 sm:max-w-40 sm:px-3"
                aria-expanded={accountOpen}
                aria-controls="account-menu"
                aria-label={`Open ${user.role} account menu`}
              >
                <span className="truncate">{user.email.split('@')[0]}</span>
                <svg className={cn('h-3 w-3 shrink-0 transition-transform', accountOpen && 'rotate-180')} viewBox="0 0 12 12" aria-hidden>
                  <path d="m2 4 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 top-full z-[60] mt-2 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-line bg-white p-2 shadow-card"
                    id="account-menu"
                  >
                    <div className="border-b border-line px-3 py-2.5">
                      <p className="truncate text-sm font-semibold text-ink-950">{user.email}</p>
                      <p className="mt-0.5 text-xs capitalize text-ink-400">{user.role} account</p>
                    </div>
                    <Link to="/my-account/" onClick={() => setAccountOpen(false)} className="mt-1 flex min-h-11 items-center rounded-xl px-3 py-2.5 text-sm text-ink-200 hover:bg-paper hover:text-accent-600">My account</Link>
                    {user.role === 'admin' && <Link to="/admin/" onClick={() => setAccountOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-accent-600 hover:bg-accent-400/10">Admin dashboard</Link>}
                    {(user.role === 'admin' || user.role === 'manager') && <Link to="/manager/" onClick={() => setAccountOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 py-2.5 text-sm text-ink-200 hover:bg-paper hover:text-accent-600">Manager inbox</Link>}
                    <button type="button" onClick={() => { setAccountOpen(false); logout() }} className="mt-1 flex min-h-11 w-full items-center rounded-xl border-t border-line px-3 py-2.5 text-left text-sm text-ink-300 hover:bg-paper hover:text-accent-600">Log out</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setOpen('login')}
              className="hidden whitespace-nowrap rounded-full px-2 py-2 text-xs font-medium text-ink-200 transition hover:text-accent-600 lg:block"
            >
              Log in
            </button>
          )}

          <Link
            to="/cart/"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-ink-950/[0.04] px-2.5 py-2 text-xs font-semibold text-ink-100 transition hover:border-accent-400/50 sm:gap-2 sm:px-3 sm:text-sm"
          >
            <CartGlyph />
            {count > 0 && <span className="hidden font-mono text-xs sm:inline">{inr(total)}</span>}
            {count > 0 && (
              <span className="rounded-full bg-accent-400 px-1.5 text-[11px] font-bold text-ink-950">
                {count}
              </span>
            )}
            <span className="hidden text-xs text-ink-300 sm:inline">Cart</span>
            <span className="sr-only">
              Cart, {count} {count === 1 ? 'item' : 'items'}, total {inr(total)}
            </span>
          </Link>

          <button
            type="button"
            className="shrink-0 p-2 text-ink-100 xl:hidden"
            onClick={() => {
              setServicesOpen(false)
              setMobileOpen((v) => !v)
            }}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <MenuGlyph open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-line bg-white/95 backdrop-blur-xl xl:hidden"
          >
            <nav className="container-page flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto py-4" aria-label="Mobile">
              {nav.filter((item) => item.label !== 'Contact Us').map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="rounded-xl px-3 py-3 text-base font-medium text-ink-200"
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={() => setServicesOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-base font-semibold text-accent-600 transition hover:bg-ink-950/[0.04]"
                aria-expanded={servicesOpen}
                aria-controls="mobile-services-list"
              >
                <span>All Services</span>
                <svg className={cn('h-4 w-4 transition-transform duration-200', servicesOpen && 'rotate-180')} viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="m3 6 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {servicesOpen && (
                  <motion.div
                    id="mobile-services-list"
                    initial={{ height: 0, opacity: 0, y: -4 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="ml-3 flex flex-col gap-1 border-l-2 border-accent-400/25 py-1 pl-3">
                      {OFFCANVAS_SERVICES.map((service) => (
                        <Link
                          key={service.to + service.label}
                          to={service.to}
                          onClick={() => {
                            setServicesOpen(false)
                            setMobileOpen(false)
                          }}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink-200 transition hover:bg-accent-400/8 hover:text-accent-600"
                        >
                          <span>{service.label}</span>
                          <span className="flex items-center gap-2">
                            {service.badge && <span className="rounded-full bg-accent-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-600">{service.badge}</span>}
                            <span aria-hidden>→</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {nav.filter((item) => item.label === 'Contact Us').map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium text-ink-200"
                >
                  {item.label}
                </NavLink>
              ))}
              {!user && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    setOpen('login')
                  }}
              className="flex min-h-11 items-center rounded-xl px-3 py-3 text-left text-base font-medium text-ink-200"
                >
                  Log in
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  )
}
