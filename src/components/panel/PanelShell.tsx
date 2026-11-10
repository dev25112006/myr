import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/format'

/** A single destination in the panel sidebar. */
export type PanelNavItem = {
  id: string
  label: string
  icon: ReactNode
  /** Optional count pill (cart items, open tickets, …). */
  badge?: string | number
}

const icon = (children: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-5 w-5 shrink-0"
  >
    {children}
  </svg>
)

/** Inline icon set for the role panels (no icon dependency). */
export const PanelIcons = {
  home: icon(
    <>
      <path d="M3 10.8 12 3.5l9 7.3" />
      <path d="M5.5 9.6V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9.6" />
    </>,
  ),
  cart: icon(
    <>
      <path d="M3 4h2l2.2 9.6a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20.5 8H6" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </>,
  ),
  orders: icon(
    <>
      <path d="M21 8.2 12 3.4 3 8.2v7.6l9 4.8 9-4.8z" />
      <path d="m3 8.2 9 4.8 9-4.8" />
      <path d="M12 13v7.6" />
    </>,
  ),
  user: icon(
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20.5c.9-3.6 4-5.5 7.5-5.5s6.6 1.9 7.5 5.5" />
    </>,
  ),
  support: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" />
    </>,
  ),
  inbox: icon(
    <>
      <path d="M3.5 12.5H8l1.8 2.6h4.4l1.8-2.6h4.5" />
      <path d="M5.4 4.5h13.2l2.4 8v7H3v-7z" />
    </>,
  ),
  chart: icon(<path d="M4 20V11M9.3 20V4M14.7 20v-6M20 20V8" />),
  users: icon(
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3 19.5c.8-3.1 3.3-4.8 6-4.8s5.2 1.7 6 4.8" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 6M17.5 15.2c1.9.6 3.2 2.1 3.7 4.3" />
    </>,
  ),
  tag: icon(
    <>
      <path d="M3.5 11.2V4.5h6.7l9.3 9.3-6.7 6.7z" />
      <circle cx="7.8" cy="8.3" r="1.3" />
    </>,
  ),
  shield: icon(
    <>
      <path d="M12 3.2 19 6v5.6c0 4.4-2.9 7.4-7 9.2-4.1-1.8-7-4.8-7-9.2V6z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>,
  ),
  settings: icon(
    <>
      <path d="M4 7.5h8M15.5 7.5H20M4 16.5h4.5M12 16.5h8" />
      <circle cx="13.2" cy="7.5" r="2.2" />
      <circle cx="9.7" cy="16.5" r="2.2" />
    </>,
  ),
  star: icon(<path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 17.1l-5.2 2.8 1-5.9L3.5 9.8l5.9-.8z" />),
  list: icon(
    <>
      <path d="M8.5 6H21M8.5 12H21M8.5 18H21" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </>,
  ),
  store: icon(
    <>
      <path d="M4 9.5 5.5 4h13L20 9.5" />
      <path d="M4 9.5a2.4 2.4 0 0 0 4 1.7 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4-1.7" />
      <path d="M5.5 11.5V20h13v-8.5" />
    </>,
  ),
  doc: icon(
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h7M9 17h5" />
    </>,
  ),
}

type PanelShellProps = {
  /** localStorage key used to remember the sidebar open/closed state. */
  storageKey: string
  eyebrow: string
  title: string
  /** Small line under the title in the sidebar (e.g. signed-in email). */
  meta?: ReactNode
  nav: PanelNavItem[]
  active: string
  onSelect: (id: string) => void
  /** Extra controls for the toolbar (e.g. refresh buttons). */
  actions?: ReactNode
  children: ReactNode
}

function readCollapsed(storageKey: string) {
  try {
    return localStorage.getItem(`${storageKey}.collapsed`) === '1'
  } catch {
    return false
  }
}

/**
 * Shared shell for the customer / manager / admin panels: a sidebar listing the
 * role's sections with explicit open and close controls. On desktop it is a
 * collapsible column (state remembered across visits); below `lg` it becomes a
 * drawer with a backdrop that closes on Escape, backdrop click or selection.
 */
export function PanelShell({ storageKey, eyebrow, title, meta, nav, active, onSelect, actions, children }: PanelShellProps) {
  const [collapsed, setCollapsed] = useState(() => readCollapsed(storageKey))
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeItem = nav.find((item) => item.id === active) || nav[0]

  const toggle = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) {
      setCollapsed((previous) => {
        const next = !previous
        try {
          localStorage.setItem(`${storageKey}.collapsed`, next ? '1' : '0')
        } catch {
          /* private mode — the preference simply is not remembered */
        }
        return next
      })
    } else {
      setMobileOpen(true)
    }
  }

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const renderNav = (inDrawer: boolean) => (
    <nav className="space-y-1" aria-label={`${title} sections`}>
      {nav.map((item) => {
        const isActive = item.id === active
        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => {
              onSelect(item.id)
              if (inDrawer) setMobileOpen(false)
            }}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition',
              isActive ? 'bg-ink-950 text-white shadow-card' : 'text-ink-300 hover:bg-paper hover:text-ink-950',
            )}
          >
            <span className={cn(isActive ? 'text-white' : 'text-accent-600')}>{item.icon}</span>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.badge != null && item.badge !== '' && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[11px] font-bold',
                  isActive ? 'bg-white/20 text-white' : 'bg-accent-400/15 text-accent-700',
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )

  const sidebarBody = (inDrawer: boolean) => (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2 px-1 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-600">{eyebrow}</p>
          <p className="mt-1 truncate text-base font-bold text-ink-950">{title}</p>
          {meta && <p className="mt-0.5 truncate text-xs text-ink-400">{meta}</p>}
        </div>
        <button
          type="button"
          onClick={() => (inDrawer ? setMobileOpen(false) : toggle())}
          aria-label={inDrawer ? 'Close sidebar' : 'Close sidebar'}
          className="rounded-lg p-1.5 text-ink-300 transition hover:bg-paper hover:text-ink-950"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      {renderNav(inDrawer)}
      <div className="mt-auto hidden rounded-2xl bg-paper p-3 lg:block">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Signed in</p>
        <p className="mt-1 truncate text-xs font-semibold text-ink-700">{meta || '—'}</p>
      </div>
    </div>
  )

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex items-start gap-6">
        {/* Desktop sidebar — collapsible via the toolbar toggle */}
        <aside
          className={cn(
            'sticky top-24 hidden shrink-0 self-start overflow-hidden transition-all duration-300 lg:block',
            collapsed ? 'w-0 opacity-0' : 'w-[16.5rem] opacity-100',
          )}
          aria-hidden={collapsed}
        >
          <div className="h-[calc(100vh-9rem)] rounded-3xl border border-line bg-white p-4 shadow-card">{sidebarBody(false)}</div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Toolbar: sidebar open/close + current section */}
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-3 py-2.5 shadow-card">
            <button
              type="button"
              onClick={toggle}
              aria-expanded={collapsed ? 'false' : 'true'}
              aria-controls={`${storageKey}-sidebar`}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-paper hover:text-ink-950"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true" className="h-5 w-5">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <span className="hidden sm:inline">Sidebar</span>
            </button>
            <div className="min-w-0 flex-1 border-l border-line pl-3">
              <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-ink-400">{eyebrow}</p>
              <p className="truncate text-sm font-bold text-ink-950">{activeItem?.label || title}</p>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>

          <div key={active} className="animate-panel-in">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-[2px] lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <aside
            id={`${storageKey}-sidebar`}
            className="fixed inset-y-0 left-0 z-50 w-[17.5rem] max-w-[85vw] overflow-y-auto bg-white p-4 shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} sidebar`}
          >
            {sidebarBody(true)}
          </aside>
        </>
      )}
    </div>
  )
}
