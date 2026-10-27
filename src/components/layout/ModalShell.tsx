import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePopup, type PopupId } from '@/lib/stores'

type Props = {
  id: PopupId
  title?: string
  children: ReactNode
  wide?: boolean
}

/** Shared modal shell controlled by PopupProvider (Esc + backdrop close). */
export function ModalShell({ id, title, children, wide }: Props) {
  const { open, setOpen } = usePopup()

  useEffect(() => {
    if (open !== id) return
    const t = setTimeout(() => {
      document.querySelector<HTMLElement>('[data-modal-first]')?.focus()
    }, 50)
    return () => clearTimeout(t)
  }, [open, id])

  return (
    <AnimatePresence>
      {open === id && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-80 flex items-start justify-center overflow-y-auto bg-ink-950/80 p-4 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={
              wide
                ? 'my-8 w-full max-w-3xl rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8'
                : 'my-8 w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8'
            }
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              {title && <h2 className="text-xl font-bold text-ink-950 sm:text-2xl">{title}</h2>}
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="rounded-full border border-line p-2 text-ink-300 transition hover:border-accent-400/50 hover:text-accent-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
