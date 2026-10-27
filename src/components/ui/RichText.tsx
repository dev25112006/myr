import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/format'

type Piece = { text: string; bold?: boolean; href?: string; external?: boolean }

/** Parse `**bold**` and `[label](href)` from source text into React nodes. */
function parse(src: string): Piece[] {
  const out: Piece[] = []
  const re = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ text: src.slice(last, m.index) })
    const tok = m[0]
    if (tok.startsWith('**')) {
      // Nested markup inside bold (e.g. **[label](href)**) — recurse, keep bold.
      for (const p of parse(tok.slice(2, -2))) out.push({ ...p, bold: true })
    } else {
      const lm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (lm) {
        const href = lm[2].replace(/^https?:\/\/(www\.)?myradvancesolution\.com/, '')
        let label = lm[1]
        let labelBold = false
        if (label.startsWith('**') && label.endsWith('**') && label.length > 4) {
          label = label.slice(2, -2)
          labelBold = true
        }
        out.push({
          text: label,
          bold: labelBold || undefined,
          href,
          external: href.startsWith('http') || href.startsWith('mailto:'),
        })
      }
    }
    last = m.index + tok.length
  }
  if (last < src.length) out.push({ text: src.slice(last) })
  return out
}

export function RichText({
  children,
  onInternalClick,
  className,
}: {
  children: string
  /** Called for internal links (e.g. popup triggers). */
  onInternalClick?: (href: string) => void
  className?: string
}) {
  const nodes: ReactNode[] = parse(children).map((p, i) => {
    if (p.bold && !p.href) {
      return <strong key={i} className="font-bold">{p.text}</strong>
    }
    if (p.href) {
      const href = p.href
      if (p.external) {
        return (
          <a
            key={i}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className={cn(
              'text-accent-600 underline decoration-accent-400/40 underline-offset-2 hover:decoration-accent-400',
              p.bold ? 'font-bold' : 'font-semibold',
            )}
          >
            {p.text}
          </a>
        )
      }
      return (
        <Link
          key={i}
          to={href}
          onClick={() => onInternalClick?.(href)}
          className={cn(
            'text-accent-600 underline decoration-accent-400/40 underline-offset-2 hover:decoration-accent-400',
            p.bold ? 'font-bold' : 'font-semibold',
          )}
        >
          {p.text}
        </Link>
      )
    }
    return <Fragment key={i}>{p.text}</Fragment>
  })

  return <span className={className}>{nodes}</span>
}

/** Render a source bullet list (array of strings with markdown). */
export function RichList({
  items,
  className,
  bullet = '•',
  onInternalClick,
}: {
  items: string[]
  className?: string
  bullet?: string
  onInternalClick?: (href: string) => void
}) {
  return (
    <ul className={className}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="shrink-0 text-accent-600" aria-hidden>
            {bullet}
          </span>
          <span>
            <RichText onInternalClick={onInternalClick}>{it}</RichText>
          </span>
        </li>
      ))}
    </ul>
  )
}
