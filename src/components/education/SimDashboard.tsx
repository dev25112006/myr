import { cn } from '@/lib/format'
import { DemoBadge } from './DemoBadge'
import type { SimPreview, SimScreen } from './types'

/**
 * Simulated product screen — sidebar, KPI cards, table or list.
 * Plain HTML/CSS, light theme matching the rest of the site.
 * Always labelled as demo data via <DemoBadge/>.
 */
export function SimDashboard({ screen, compact = false }: { screen: SimScreen; compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      {/* window bar */}
      <div className="flex items-center gap-2 border-b border-line bg-paper/60 px-4 py-2.5">
        <span aria-hidden className="size-2.5 rounded-full bg-ink-200/30" />
        <span aria-hidden className="size-2.5 rounded-full bg-ink-200/30" />
        <span aria-hidden className="size-2.5 rounded-full bg-ink-200/30" />
        <span className="ml-2 truncate text-[11px] text-ink-400">{screen.title}</span>
        <span className="ml-auto">
          <DemoBadge />
        </span>
      </div>
      <div className={cn('grid', compact ? 'grid-cols-1' : 'sm:grid-cols-[164px_1fr]')}>
        {/* sidebar */}
        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-paper/40 p-3 sm:flex-col sm:border-b-0 sm:border-r" aria-label={`${screen.title} (simulated)`}>
          {screen.nav.map((item) => {
            const active = item === screen.active
            return (
              <span
                key={item}
                className={cn(
                  'whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium',
                  active ? 'bg-white text-ink-950 shadow-[0_1px_3px_rgb(5_12_95/0.08)]' : 'text-ink-400',
                )}
                aria-current={active ? 'page' : undefined}
              >
                {item}
              </span>
            )
          })}
        </nav>

        {/* main */}
        <div className="min-w-0 p-4 sm:p-5">
          <h4 className="text-sm font-bold text-ink-950">{screen.title}</h4>
          {screen.subtitle && <p className="mt-0.5 text-xs text-ink-400">{screen.subtitle}</p>}

          {screen.stats && (
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {screen.stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-line bg-paper/40 p-3">
                  <p className="text-[11px] text-ink-400">{s.label}</p>
                  <p className="mt-1 text-lg font-bold text-ink-950">{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {screen.table && (
            <div className="mt-4 overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[400px] text-left text-xs">
                <thead className="bg-paper/60 text-ink-400">
                  <tr>
                    {screen.table.columns.map((c) => (
                      <th key={c} className="px-3 py-2 font-semibold uppercase tracking-wide">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-ink-700">
                  {screen.table.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2">{cell || '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {screen.lines && (
            <ul className="mt-4 space-y-2">
              {screen.lines.map((l, i) => (
                <li key={i} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-ink-900">{l.title}</p>
                    {l.meta && <p className="mt-0.5 truncate text-[11px] text-ink-400">{l.meta}</p>}
                  </div>
                  {l.status && (
                    <span className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-[10px] font-semibold text-ink-500">
                      {l.status}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {screen.note && (
            <p className="mt-4 rounded-xl bg-paper/60 px-3.5 py-2.5 text-[11px] leading-relaxed text-ink-500">
              {screen.note}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/** Compact preview used inside module showcase cards. */
export function PreviewSurface({ preview }: { preview: SimPreview }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-paper/40 p-3.5 text-left">
      {preview.kind === 'stats' && (
        <div className="grid grid-cols-3 gap-2">
          {preview.items.map((s) => (
            <div key={s.label} className="rounded-lg bg-white p-2.5">
              <p className="text-[10px] leading-tight text-ink-400">{s.label}</p>
              <p className="mt-1 text-sm font-bold text-ink-950">{s.value}</p>
            </div>
          ))}
        </div>
      )}
      {preview.kind === 'table' && (
        <table className="w-full text-[11px]">
          <thead className="text-ink-400">
            <tr>
              {preview.columns.map((c) => (
                <th key={c} className="px-1.5 py-1 text-left font-semibold uppercase tracking-wide">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink-700">
            {preview.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="px-1.5 py-1.5">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {preview.kind === 'calendar' && (
        <div className="grid grid-cols-6 gap-1.5">
          {preview.days.map((d) => (
            <div
              key={d.label}
              className={cn(
                'rounded-lg px-1 py-2 text-center text-[10px] font-semibold',
                d.state === 'ok' && 'bg-emerald-50 text-emerald-700',
                d.state === 'miss' && 'bg-rose-50 text-rose-600',
                d.state === 'due' && 'bg-flame-400/10 text-flame-600',
                d.state === 'off' && 'bg-white text-ink-300',
              )}
            >
              {d.label}
            </div>
          ))}
        </div>
      )}
      {preview.kind === 'form' && (
        <div className="space-y-2">
          {preview.fields.map((f) => (
            <div key={f.label}>
              <p className="text-[10px] uppercase tracking-wide text-ink-400">{f.label}</p>
              <p className="mt-0.5 rounded-md border border-line bg-white px-2.5 py-1.5 text-[11px] text-ink-700">{f.value}</p>
            </div>
          ))}
        </div>
      )}
      {preview.kind === 'chart' && (
        <div className="flex h-24 items-end gap-2">
          {preview.bars.map((b) => (
            <div key={b.label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-ink-950/80"
                style={{ height: `${Math.max(8, b.value)}%` }}
                role="img"
                aria-label={`${b.label}: ${b.value}`}
              />
              <span className="text-[10px] text-ink-400">{b.label}</span>
            </div>
          ))}
        </div>
      )}
      {preview.kind === 'list' && (
        <ul className="space-y-1.5">
          {preview.items.map((it) => (
            <li key={it.title} className="flex items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-1.5">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-ink-900">{it.title}</p>
                {it.meta && <p className="truncate text-[10px] text-ink-400">{it.meta}</p>}
              </div>
              {it.status && <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[9px] font-semibold text-ink-500">{it.status}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
