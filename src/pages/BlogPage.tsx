import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { cn } from '@/lib/format'
import { slugify, useBlogs, type Blog } from '@/lib/blogs'
import { CountUp, Reveal, Stagger, StaggerItem, TiltCard } from '@/components/ui'

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

const CATEGORY_PALETTE = [
  'bg-accent-400/15 text-accent-600',
  'bg-flame-400/20 text-flame-600',
  'bg-ink-950/10 text-ink-950',
  'bg-emerald-500/10 text-emerald-700',
  'bg-sky-500/10 text-sky-700',
]

/** Sliding hero images beside the blog statement. */
const BLOG_HERO_IMAGES = [
  '/assets/2025-01-website-front-hero-image.png',
  '/assets/2024-09-website-development.jpg',
  '/assets/2024-09-crm-development.png',
  '/assets/2024-09-digital-marketing.jpg',
  '/assets/2024-09-ip-pbx-1.png',
]

function categoryClass(category: string): string {
  let hash = 0
  for (const char of category) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length]
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function coverOf(blog: Blog): string {
  return blog.coverImage || '/assets/2025-01-website-front-hero-image.png'
}

/**
 * Cover image that never cuts its subject: wide artwork fills the frame with
 * `object-cover`, while squarish/portrait artwork (e.g. 300×300 product shots
 * like the IP PBX unit) is shown complete via `object-contain` on the frame's
 * background instead of being cropped to the frame ratio.
 */
function SmartCover({
  src,
  alt,
  className,
  frameRatio = 16 / 9,
  lazy = false,
}: {
  src: string
  alt: string
  /** Box classes for the frame (aspect-… / h-full w-full + hover transitions). */
  className?: string
  /** Width ÷ height of the frame the image sits in. */
  frameRatio?: number
  lazy?: boolean
}) {
  const [contain, setContain] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const decide = (img: HTMLImageElement | null) => {
    if (!img || !img.naturalWidth) return
    const ratio = img.naturalWidth / img.naturalHeight
    // Contain only when the art is substantially squarer than its frame,
    // so normal wide photos keep the full-bleed cover look.
    setContain(ratio < frameRatio * 0.85)
  }

  /* Handles already-cached images that never fire `load` after mount. */
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete) decide(img)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, frameRatio])

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading={lazy ? 'lazy' : undefined}
      onLoad={(event) => decide(event.currentTarget)}
      className={cn(className, contain ? 'object-contain p-3 sm:p-5' : 'object-cover')}
    />
  )
}

/** Inline **bold** support for admin-authored copy. */
function renderInline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={index} className="font-semibold text-ink-950">{part.slice(2, -2)}</strong>
      ) : (
        <span key={index}>{part}</span>
      ),
    )
}

/* ------------------------------------------------------------------ */
/* Blog card (grid + related)                                          */
/* ------------------------------------------------------------------ */

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <StaggerItem as="li">
      <TiltCard className="h-full">
        <Link
          to={`/blogs/${blog.slug}/`}
          className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-shadow duration-300 hover:shadow-glow"
        >
          <div className="relative aspect-[16/9] overflow-hidden bg-paper">
            <SmartCover
              src={coverOf(blog)}
              alt={blog.title}
              frameRatio={16 / 9}
              lazy
              className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <span className={cn('absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm', categoryClass(blog.category))}>
              {blog.category}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="flex items-center gap-2 text-xs text-ink-400">
              <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{blog.readingMinutes} min read</span>
            </div>
            <h3 className="mt-2 text-lg font-bold leading-snug text-ink-950 transition-colors duration-200 group-hover:text-accent-600">
              {blog.title}
            </h3>
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-400">{blog.excerpt}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-flame-600">
              Read article
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </span>
          </div>
        </Link>
      </TiltCard>
    </StaggerItem>
  )
}

function BlogGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border border-line bg-white">
          <div className="aspect-[16/9] animate-pulse bg-paper" />
          <div className="space-y-3 p-6">
            <div className="h-3 w-24 animate-pulse rounded-full bg-paper" />
            <div className="h-5 w-3/4 animate-pulse rounded-full bg-paper" />
            <div className="h-3 w-full animate-pulse rounded-full bg-paper" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-paper" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Listing page — /blogs/                                              */
/* ------------------------------------------------------------------ */

export function BlogPage() {
  const { blogs, loading } = useBlogs()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = useMemo(() => ['All', ...Array.from(new Set(blogs.map((blog) => blog.category)))], [blogs])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return blogs.filter((blog) => {
      if (category !== 'All' && blog.category !== category) return false
      if (!needle) return true
      return [blog.title, blog.excerpt, blog.category, ...blog.tags].join(' ').toLowerCase().includes(needle)
    })
  }, [blogs, query, category])

  const featured = filtered.find((blog) => blog.featured) ?? filtered[0]
  const rest = filtered.filter((blog) => blog !== featured)

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="section-dark relative overflow-hidden">
        <div className="grid-noise absolute inset-0 opacity-60" aria-hidden="true" />
        <div aria-hidden="true" className="absolute -left-24 top-10 h-72 w-72 animate-[var(--animate-float)] rounded-full bg-accent-500/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-16 bottom-0 h-80 w-80 animate-[var(--animate-float)] rounded-full bg-flame-500/15 blur-3xl [animation-delay:1.6s]" />

        <div className="container-page relative py-16 sm:py-20 lg:py-24">
          <div className="relative z-10 grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Left: text content */}
            <div className="relative">
              <Reveal variant="blur">
                <p className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-flame-600/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-flame-400 backdrop-blur-sm border border-flame-600/40 shadow-[0_0_15px_rgba(225,29,72,0.35)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-flame-500" />
                  Insights from the MYR team
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-4 max-w-lg text-4xl font-bold leading-[1.05] text-accent-300 drop-shadow-[0_0_20px_rgba(24,144,255,0.45)] sm:text-5xl lg:text-6xl">
                  Ideas, guides &amp; playbooks for{' '}
                  <span className="text-shimmer text-gradient">growing businesses</span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-5 max-w-lg text-xl leading-relaxed text-accent-100 sm:text-lg">
                  Deep dives on ERP software, CRM, HRM, website development, AI digital marketing, IP PBX and
                  CCTV — written to answer the questions our clients actually ask.
                </p>
              </Reveal>

              {/* Running stat counters */}
              <Reveal delay={0.24}>
                <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
                  {[
                    { label: 'Articles published', value: <CountUp to={blogs.length} suffix="+" /> },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-flame-500/30 bg-flame-900/20 px-5 py-4 backdrop-blur-sm shadow-[0_0_15px_rgba(225,29,72,0.2)]">
                      <dd className="text-2xl font-bold text-accent-200 sm:text-3xl">{stat.value}</dd>
                      <dt className="mt-1 text-xs uppercase tracking-wider text-flame-300">{stat.label}</dt>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            {/* Right: running slide in a framed container (stacks below text on small screens) */}
            <div className="relative overflow-hidden rounded-3xl border border-flame-500/30 bg-black/20 shadow-[0_0_30px_rgba(225,29,72,0.15)] backdrop-blur-sm">
              {/* Decorative header strip */}
              <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-4 py-2.5 sm:px-5">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-flame-300 sm:text-[11px]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-flame-500" aria-hidden="true" />
                  Fresh from the blog
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-300/70 sm:text-[11px]">
                  Live feed
                </span>
              </div>

              {/* Running slide — edge-faded track */}
              <div className="overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] sm:py-5">
                <div className="flex w-max animate-[var(--animate-marquee)] gap-4 sm:gap-5">
                  {[...BLOG_HERO_IMAGES, ...BLOG_HERO_IMAGES].map((src, i) => (
                    <SmartCover
                      key={i}
                      src={src}
                      alt="Blog preview"
                      frameRatio={1.2}
                      lazy
                      className="h-28 w-36 shrink-0 rounded-2xl border border-flame-500/40 shadow-[0_0_25px_rgba(225,29,72,0.3)] transition-transform duration-300 hover:scale-105 sm:h-36 sm:w-44 lg:h-44 lg:w-52"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Controls ---------------- */}
      <section className="section-light">
        <div className="container-page py-12 sm:py-16">
          <Reveal>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <label htmlFor="blog-search" className="sr-only">Search articles</label>
                <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">⌕</span>
                <input
                  id="blog-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search articles, topics, tags…"
                  className="input !rounded-full !pl-11"
                />
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    aria-pressed={category === item}
                    className={cn(
                      'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300',
                      category === item
                        ? 'border-ink-950 bg-ink-950 text-white shadow-card'
                        : 'border-line bg-white text-ink-400 hover:border-accent-400 hover:text-accent-600',
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {loading ? (
            <div className="mt-10"><BlogGridSkeleton /></div>
          ) : filtered.length === 0 ? (
            <Reveal className="mt-10 rounded-3xl border border-dashed border-line bg-white p-12 text-center">
              <p className="text-4xl" aria-hidden="true">📝</p>
              <h2 className="mt-4 text-xl font-bold text-ink-950">No articles match that search</h2>
              <p className="mt-2 text-sm text-ink-400">Try a different keyword or clear the filters to browse everything.</p>
              <button
                type="button"
                className="btn btn-primary btn-md mt-6"
                onClick={() => { setQuery(''); setCategory('All') }}
              >
                Clear filters
              </button>
            </Reveal>
          ) : (
            <>
              {/* ---------------- Featured post ---------------- */}
              {featured && (
                <Reveal className="mt-10">
                  <TiltCard max={4}>
                    <Link
                      to={`/blogs/${featured.slug}/`}
                      className="group grid overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-shadow duration-300 hover:shadow-glow lg:grid-cols-2"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-paper lg:aspect-auto lg:min-h-[22rem]">
                        <SmartCover
                          src={coverOf(featured)}
                          alt={featured.title}
                          frameRatio={16 / 10}
                          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-[var(--animate-pulse-ring)]" aria-hidden="true" />
                          Featured
                        </span>
                      </div>
                      <div className="flex flex-col justify-center p-6 sm:p-10">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
                          <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider', categoryClass(featured.category))}>
                            {featured.category}
                          </span>
                          <time dateTime={featured.createdAt}>{formatDate(featured.createdAt)}</time>
                          <span aria-hidden="true">·</span>
                          <span>{featured.readingMinutes} min read</span>
                        </div>
                        <h2 className="mt-4 text-2xl font-bold leading-tight text-ink-950 transition-colors duration-200 group-hover:text-accent-600 sm:text-3xl">
                          {featured.title}
                        </h2>
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-400 sm:text-base">
                          {featured.excerpt}
                        </p>
                        <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-ink-950 px-6 py-3 text-sm font-bold text-white">
                          Read the article
                          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                        </span>
                      </div>
                    </Link>
                  </TiltCard>
                </Reveal>
              )}

              {/* ---------------- Grid ---------------- */}
              {rest.length > 0 && (
                <>
                  <Reveal className="mt-14 flex items-end justify-between gap-4">
                    <div>
                      <p className="eyebrow">Latest articles</p>
                      <h2 className="mt-2 text-2xl font-bold text-ink-950 sm:text-3xl">
                        {category === 'All' ? 'All posts' : category}
                        <span className="ml-2 text-base font-semibold text-ink-400">({rest.length})</span>
                      </h2>
                    </div>
                  </Reveal>
                  <Stagger className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
                    {rest.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
                  </Stagger>
                </>
              )}
            </>
          )}

          {/* ---------------- CTA ---------------- */}
          {!loading && (
            <Reveal className="mt-16">
              <div className="section-dark relative overflow-hidden rounded-3xl p-8 sm:p-12">
                <div className="grid-noise absolute inset-0 opacity-60" aria-hidden="true" />
                <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                  <div>
                    <p className="eyebrow">Talk to an expert</p>
                    <h2 className="mt-3 max-w-xl text-2xl font-bold text-white sm:text-3xl">
                      Need the same results implemented in your business?
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-300">
                      Our team builds ERP, CRM, HRM, websites, phone systems and marketing engines that
                      turn these guides into working systems.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/contact-us/" className="btn btn-primary btn-md">Talk to sales</Link>
                    <Link to="/tech-store/" className="btn btn-outline-light btn-md">Explore plans</Link>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Content renderer (markdown-lite, admin-authored)                    */
/* ------------------------------------------------------------------ */

type Block =
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string }

function parseContent(content: string): Block[] {
  const blocks: Block[] = []
  const seen = new Map<string, number>()
  for (const raw of content.split(/\n+/)) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4) })
    } else if (line.startsWith('## ')) {
      const text = line.slice(3)
      const base = slugify(text) || 'section'
      const count = (seen.get(base) ?? 0) + 1
      seen.set(base, count)
      blocks.push({ type: 'h2', id: count > 1 ? `${base}-${count}` : base, text })
    } else if (line.startsWith('- ')) {
      const last = blocks[blocks.length - 1]
      if (last && last.type === 'ul') last.items.push(line.slice(2))
      else blocks.push({ type: 'ul', items: [line.slice(2)] })
    } else if (line.startsWith('> ')) {
      blocks.push({ type: 'quote', text: line.slice(2) })
    } else {
      blocks.push({ type: 'p', text: line })
    }
  }
  return blocks
}

/* ------------------------------------------------------------------ */
/* Post page — /blogs/:slug/                                           */
/* ------------------------------------------------------------------ */

export function BlogPostPage() {
  const { slug = '' } = useParams()
  const { blogs, loading } = useBlogs()
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false)
  const [activeHeading, setActiveHeading] = useState('')

  const blog = blogs.find((item) => item.slug === slug && item.status === 'published')
  const blocks = useMemo(() => (blog ? parseContent(blog.content) : []), [blog])
  const toc = useMemo(() => blocks.filter((block): block is { type: 'h2'; id: string; text: string } => block.type === 'h2'), [blocks])
  const related = useMemo(
    () =>
      blog
        ? blogs
            .filter((item) => item.id !== blog.id)
            .sort((a, b) => Number(b.category === blog.category) - Number(a.category === blog.category))
            .slice(0, 3)
        : [],
    [blogs, blog],
  )

  /* Reading progress bar (running animation) */
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 26, mass: 0.35 })

  /* Active table-of-contents highlight */
  useEffect(() => {
    if (!toc.length) return
    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!headings.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveHeading(entry.target.id)
        }
      },
      { rootMargin: '-90px 0px -65% 0px', threshold: 0 },
    )
    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [toc])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  if (loading) {
    return (
      <div className="container-page py-20">
        <div className="h-4 w-40 animate-pulse rounded-full bg-paper" />
        <div className="mt-6 h-10 w-3/4 animate-pulse rounded-2xl bg-paper" />
        <div className="mt-4 h-64 w-full animate-pulse rounded-3xl bg-paper" />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-5xl" aria-hidden="true">🧭</p>
        <h1 className="mt-5 text-3xl font-bold text-ink-950">Article not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-400">
          This post may have been unpublished or the link is incorrect. Browse all articles to find what you
          were looking for.
        </p>
        <Link to="/blogs/" className="btn btn-primary btn-md mt-7 inline-flex">Back to all articles</Link>
      </div>
    )
  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = encodeURIComponent(blog.title)

  return (
    <>
      {/* Reading progress (running animation along the top) */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          style={{ scaleX }}
          className="fixed inset-x-0 top-0 z-90 h-1 origin-left bg-gradient-to-r from-accent-500 via-flame-500 to-accent-400"
        />
      )}

      <article className="section-white">
        <div className="container-page py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
            <Link to="/" className="font-semibold transition-colors hover:text-accent-600">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/blogs/" className="font-semibold transition-colors hover:text-accent-600">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink-300">{blog.category}</span>
          </nav>

          {/* Header */}
          <Reveal className="mt-6 max-w-3xl">
            <span className={cn('inline-block rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider', categoryClass(blog.category))}>
              {blog.category}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-[1.12] text-ink-950 sm:text-4xl lg:text-5xl">
              {blog.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-400">{blog.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink-400">
              <span className="inline-flex items-center gap-2.5">
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 text-xs font-bold text-white">
                  {blog.author.split(' ').map((word) => word[0]).slice(0, 2).join('').toUpperCase()}
                </span>
                <span className="font-semibold text-ink-950">{blog.author}</span>
              </span>
              <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{blog.readingMinutes} min read</span>
            </div>
          </Reveal>

          {/* Cover */}
          <Reveal delay={0.1} className="mt-8">
            <div className="group relative overflow-hidden rounded-3xl border border-line bg-paper">
              <SmartCover
                src={coverOf(blog)}
                alt={blog.title}
                frameRatio={2}
                className="aspect-[16/8] w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </Reveal>

          {/* Body + TOC */}
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div id="blog-content" className="min-w-0 max-w-3xl">
              {blocks.map((block, index) => {
                if (block.type === 'h2') {
                  return (
                    <h2
                      key={index}
                      id={block.id}
                      className="mt-10 scroll-mt-28 text-2xl font-bold leading-snug text-ink-950 first:mt-0"
                    >
                      {renderInline(block.text)}
                    </h2>
                  )
                }
                if (block.type === 'h3') {
                  return (
                    <h3 key={index} className="mt-7 text-xl font-bold text-ink-950">
                      {renderInline(block.text)}
                    </h3>
                  )
                }
                if (block.type === 'ul') {
                  return (
                    <ul key={index} className="mt-4 space-y-2.5">
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-300">
                          <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-400" />
                          <span>{renderInline(item)}</span>
                        </li>
                      ))}
                    </ul>
                  )
                }
                if (block.type === 'quote') {
                  return (
                    <blockquote key={index} className="mt-6 rounded-r-2xl border-l-4 border-accent-400 bg-accent-400/5 px-5 py-4 text-[15px] italic leading-relaxed text-ink-300">
                      {renderInline(block.text)}
                    </blockquote>
                  )
                }
                return (
                  <p key={index} className="mt-5 text-[16px] leading-[1.8] text-ink-300">
                    {renderInline(block.text)}
                  </p>
                )
              })}

              {/* Tags */}
              {blog.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-400">Tagged:</span>
                  {blog.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink-400">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-400">Share:</span>
                <a
                  href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-ink-400 transition-colors hover:border-emerald-500 hover:text-emerald-600"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-ink-400 transition-colors hover:border-sky-500 hover:text-sky-600"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-ink-400 transition-colors hover:border-ink-950 hover:text-ink-950"
                >
                  X / Twitter
                </a>
                <button
                  type="button"
                  onClick={() => void copyLink()}
                  className="rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-ink-400 transition-colors hover:border-accent-400 hover:text-accent-600"
                >
                  {copied ? 'Link copied ✓' : 'Copy link'}
                </button>
              </div>

              {/* Author card */}
              <div className="mt-8 rounded-3xl border border-line bg-paper p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Written by</p>
                <p className="mt-2 font-bold text-ink-950">{blog.author}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                  The team at MYR Advance Solution builds ERP, CRM, HRM, web and telecom systems for
                  growing businesses across India and the US.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to="/contact-us/" className="btn btn-primary btn-sm">Ask a question</Link>
                  <Link to="/blogs/" className="btn btn-outline-light btn-sm">More articles</Link>
                </div>
              </div>
            </div>

            {/* Sticky sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              {toc.length > 0 && (
                <nav aria-label="Table of contents" className="rounded-3xl border border-line bg-white p-5 shadow-card">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400">On this page</p>
                  <ul className="mt-3 space-y-2.5 border-l border-line">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={cn(
                            '-ml-px block border-l-2 py-0.5 pl-4 text-sm leading-snug transition-colors',
                            activeHeading === item.id
                              ? 'border-accent-400 font-semibold text-accent-600'
                              : 'border-transparent text-ink-400 hover:border-line hover:text-ink-950',
                          )}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
              <div className="mt-5 rounded-3xl border border-line bg-ink-950 p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-accent-300">Need help?</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">
                  Get a walkthrough of the tools mentioned in this article — free, no obligation.
                </p>
                <Link to="/contact-us/" className="btn btn-primary btn-sm mt-4 inline-flex">Book a call</Link>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="section-light">
          <div className="container-page py-14">
            <Reveal>
              <p className="eyebrow">Keep reading</p>
              <h2 className="mt-2 text-2xl font-bold text-ink-950 sm:text-3xl">Related articles</h2>
            </Reveal>
            <Stagger className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
              {related.map((item) => <BlogCard key={item.id} blog={item} />)}
            </Stagger>
            <Reveal className="mt-9 text-center">
              <Link to="/blogs/" className="btn btn-outline-light btn-md inline-flex">← View all articles</Link>
            </Reveal>
          </div>
        </section>
      )}
      {/* Newsletter CTA */}
      <section className="section-dark py-16 bg-ink-950/[0.04]">
        <div className="container-page">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Stay updated</h2>
            <p className="text-white/80 mb-6">Subscribe for monthly insights on ERP, CRM, IP PBX, and digital marketing delivered to your inbox.</p>
            <form className="max-w-md mx-auto space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-line rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-accent-400"
              />
              <button type="submit" className="btn btn-primary w-full">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
