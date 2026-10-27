import type { ReactNode } from 'react'
import { Reveal } from './motion'
import { RichText } from './RichText'
import { cn } from '@/lib/format'

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = 'center',
  tone = 'dark',
  id,
  className,
  children,
}: {
  eyebrow?: string
  title: ReactNode
  sub?: ReactNode
  align?: 'center' | 'left'
  tone?: 'dark' | 'light'
  id?: string
  className?: string
  children?: ReactNode
}) {
  return (
    <Reveal
      className={cn(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && <p className="eyebrow justify-center" style={align === 'left' ? { justifyContent: 'flex-start' } : undefined}>{eyebrow}</p>}
      <h2
        id={id}
        className={cn(
          'mt-3 text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-[2.75rem]',
          tone === 'light' ? 'text-ink-900' : 'text-ink-950',
        )}
      >
        {title}
      </h2>
      {sub && (
        <div
          className={cn(
            'mt-4 text-base leading-relaxed sm:text-lg',
            tone === 'light' ? 'text-ink-600' : 'text-ink-300',
          )}
        >
          {typeof sub === 'string' ? <RichText>{sub}</RichText> : sub}
        </div>
      )}
      {children}
    </Reveal>
  )
}
