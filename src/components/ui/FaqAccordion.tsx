import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/format'

export type FaqItem = {
  q: string
  /** Markdown-lite body: supports **bold**, [text](href) links, and line breaks. */
  a: React.ReactNode
}

/** FAQ accordion — single-open, keyboard accessible. */
export function FaqAccordion({ items, tone = 'dark' }: { items: FaqItem[]; tone?: 'dark' | 'light' }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-3xl divide-y divide-transparent">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            className={cn(
              'mb-3 overflow-hidden rounded-2xl border transition',
              isOpen
                ? 'border-accent-400/45'
                : tone === 'light'
                  ? 'border-ink-900/10 bg-white'
                  : 'border-line bg-ink-950/[0.04]',
            )}
          >
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={cn(
                  'flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold sm:text-lg',
                  tone === 'light' ? 'text-ink-900' : 'text-ink-950',
                )}
              >
                <span>{item.q}</span>
                <span
                  className={cn(
                    'grid h-7 w-7 shrink-0 place-items-center rounded-full border text-sm transition-all duration-300',
                    isOpen
                      ? 'rotate-45 border-accent-400 bg-accent-400 text-ink-950'
                      : tone === 'light'
                        ? 'border-ink-900/20 text-ink-600'
                        : 'border-line text-ink-300',
                  )}
                  aria-hidden
                >
                  +
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div
                    className={cn(
                      'px-5 pb-5 text-sm leading-relaxed sm:text-base',
                      tone === 'light' ? 'text-ink-600' : 'text-ink-300',
                    )}
                  >
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
