import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import seedBlogsRaw from '@/content/blogs.json'

/** A single blog article (server-persisted, admin-managed). */
export type Blog = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  coverImage: string
  readingMinutes: number
  featured: boolean
  status: 'published' | 'draft'
  content: string
  createdAt: string
  updatedAt: string
}

type BlogsCtx = {
  /** Published posts, newest first. Falls back to bundled seed articles when the API is unreachable. */
  blogs: Blog[]
  loading: boolean
  error: string
  /** True when the API could not be reached and bundled seed articles are shown instead. */
  fallback: boolean
  refresh: () => Promise<void>
}

/** Normalise anything from the API/JSON into a fully-populated Blog. */
export function normalizeBlog(raw: Partial<Blog> & Record<string, unknown>): Blog {
  const title = String(raw.title ?? 'Untitled post')
  const status = raw.status === 'draft' ? 'draft' : 'published'
  return {
    id: String(raw.id ?? slugify(title)),
    title,
    slug: String(raw.slug || slugify(title)),
    excerpt: String(raw.excerpt ?? ''),
    category: String(raw.category ?? 'General'),
    tags: Array.isArray(raw.tags) ? raw.tags.map((tag) => String(tag)).filter(Boolean) : [],
    author: String(raw.author ?? 'MYR Editorial Team'),
    coverImage: String(raw.coverImage ?? '/assets/2025-01-website-front-hero-image.png'),
    readingMinutes: Math.max(1, Math.round(Number(raw.readingMinutes) || 5)),
    featured: raw.featured === true,
    status,
    content: String(raw.content ?? ''),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw.updatedAt ?? raw.createdAt ?? new Date().toISOString()),
  }
}

/** URL-safe slug used for /blogs/:slug/ permalinks. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

/** Bundled seed articles — used as a fallback when the API is unreachable. */
export const SEED_BLOGS: Blog[] = (seedBlogsRaw as Array<Record<string, unknown>>).map(normalizeBlog)

function sortBlogs(blogs: Blog[]): Blog[] {
  return [...blogs].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

const BlogsContext = createContext<BlogsCtx | null>(null)

export function BlogsProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fallback, setFallback] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/blogs', { credentials: 'same-origin' })
      if (!response.ok) throw new Error(`Request failed (${response.status})`)
      const data = (await response.json()) as { blogs?: Array<Record<string, unknown>> }
      setBlogs(sortBlogs((data.blogs ?? []).map(normalizeBlog)))
      setError('')
      setFallback(false)
    } catch {
      // API unreachable (e.g. preview without the backend) — render bundled seed posts.
      setBlogs(sortBlogs(SEED_BLOGS))
      setError('')
      setFallback(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const value = useMemo<BlogsCtx>(() => ({ blogs, loading, error, fallback, refresh }), [blogs, loading, error, fallback, refresh])
  return <BlogsContext.Provider value={value}>{children}</BlogsContext.Provider>
}

export function useBlogs(): BlogsCtx {
  const ctx = useContext(BlogsContext)
  if (!ctx) throw new Error('useBlogs must be used within BlogsProvider')
  return ctx
}
