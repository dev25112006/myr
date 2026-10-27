import { Reveal } from './motion'
import { cn } from '@/lib/format'

export type Story = {
  name: string
  role: string
  quote: React.ReactNode
  image: string
  /** Source links "Read the full story" to `#` (dead) — keep as flagged control. */
  deadLinkLabel?: string
}

/** Featured client story card (homepage "Featured Client Stories"). */
export function TestimonialCard({ story, tone = 'dark', once = true }: { story: Story; tone?: 'dark' | 'light'; once?: boolean }) {
  const light = tone === 'light'
  return (
    <Reveal
      as="article"
      once={once}
      className={cn(
        'flex h-full flex-col rounded-[1.75rem] border p-6 transition duration-300 hover:-translate-y-1',
        light
          ? 'border-ink-900/8 bg-white shadow-[0_30px_70px_-50px_rgb(2_6_23/0.6)]'
          : 'border-line bg-ink-950/[0.04] hover:border-accent-400/40',
      )}
    >
      <div className="flex items-center gap-4">
        <img
          src={story.image}
          alt={story.name}
          loading="lazy"
          className="h-14 w-14 rounded-2xl object-cover"
        />
        <div>
          <p className={cn('font-display font-bold', light ? 'text-ink-900' : 'text-ink-950')}>
            {story.name}
          </p>
          <p className={cn('text-xs', light ? 'text-ink-500' : 'text-ink-400')}>{story.role}</p>
        </div>
      </div>
      <blockquote
        className={cn(
          'mt-4 flex-1 text-sm leading-relaxed',
          light ? 'text-ink-600' : 'text-ink-300',
        )}
      >
        {story.quote}
      </blockquote>
      {story.deadLinkLabel && (
        <span
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-ink-400"
          title="Source links to '#' — dead link preserved & flagged for owner review"
          aria-disabled="true"
        >
          {story.deadLinkLabel} <span className="text-flame-600">·</span> <span className="normal-case">source link is dead (#)</span>
        </span>
      )}
    </Reveal>
  )
}
