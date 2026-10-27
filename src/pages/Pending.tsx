import { useLocation } from 'react-router-dom'

/**
 * Placeholder for routes whose segment prompt (S02–S18) has not run yet.
 * Never renders fabricated content — only the route name + status.
 */
export function Pending({ segment }: { segment?: string }) {
  const { pathname } = useLocation()
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Segment pending</p>
      <h1 className="mt-4 max-w-2xl text-3xl font-bold text-ink-950 sm:text-4xl">{pathname}</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-400">
        This route is registered. Its content will be implemented by{' '}
        <span className="text-accent-600">{segment ?? 'its assigned segment'}</span> using the
        audited source manifest — nothing is fabricated here.
      </p>
    </div>
  )
}
