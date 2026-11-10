import { useEffect, useState, type FormEvent } from 'react'
import { slugify, useBlogs, type Blog } from '@/lib/blogs'

const box = 'rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6'

const COVER_PRESETS = [
  '/assets/2024-09-website-development.jpg',
  '/assets/2024-09-crm-development.png',
  '/assets/2024-09-digital-marketing.jpg',
  '/assets/2024-09-ip-pbx-1.png',
  '/assets/2024-08-creative-team-solution.png',
  '/assets/2024-10-business-agreement-shaking-hands-e1728391908541.png',
  '/assets/2025-01-website-front-hero-image.png',
]

type Draft = {
  id: string | null
  title: string
  slug: string
  excerpt: string
  category: string
  tags: string
  author: string
  coverImage: string
  content: string
  status: 'published' | 'draft'
  featured: boolean
}

const EMPTY_DRAFT: Draft = {
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  category: 'General',
  tags: '',
  author: 'MYR Editorial Team',
  coverImage: COVER_PRESETS[0],
  content: '',
  status: 'published',
  featured: false,
}

function toDraft(blog: Blog): Draft {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    category: blog.category,
    tags: blog.tags.join(', '),
    author: blog.author,
    coverImage: blog.coverImage,
    content: blog.content,
    status: blog.status,
    featured: blog.featured,
  }
}

/**
 * Admin > Blogs: create, edit, publish/unpublish and delete articles.
 * Persists to /api/admin/blogs (admin role enforced server-side).
 */
export function BlogManager() {
  const { refresh } = useBlogs()
  const [posts, setPosts] = useState<Blog[]>([])
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
  const [editing, setEditing] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    void fetch('/api/admin/blogs', { credentials: 'same-origin' })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Unable to load posts.'))))
      .then((data: { blogs?: Blog[] }) => setPosts(data.blogs ?? []))
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Unable to load posts.'))
  }

  useEffect(() => { load() }, [])

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
    setError('')
  }

  function onTitleChange(value: string) {
    setDraft((current) => ({ ...current, title: value, slug: slugTouched ? current.slug : slugify(value) }))
  }

  function startNew() {
    setDraft(EMPTY_DRAFT)
    setEditing(true)
    setSlugTouched(false)
    setMessage('')
    setError('')
  }

  function startEdit(blog: Blog) {
    setDraft(toDraft(blog))
    setEditing(true)
    setSlugTouched(true)
    setMessage('')
    setError('')
  }

  function cancelEdit() {
    setDraft(EMPTY_DRAFT)
    setEditing(false)
    setSlugTouched(false)
    setError('')
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const payload = {
        title: draft.title.trim(),
        slug: draft.slug.trim() || slugify(draft.title),
        excerpt: draft.excerpt.trim(),
        category: draft.category.trim() || 'General',
        tags: draft.tags,
        author: draft.author.trim(),
        coverImage: draft.coverImage.trim(),
        content: draft.content,
        status: draft.status,
        featured: draft.featured,
      }
      const response = await fetch(draft.id ? `/api/admin/blogs/${draft.id}` : '/api/admin/blogs', {
        method: draft.id ? 'PATCH' : 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save the post.')
      setMessage(draft.id ? `Saved "${data.blog.title}".` : `Published "${data.blog.title}".`)
      setEditing(false)
      setDraft(EMPTY_DRAFT)
      setSlugTouched(false)
      load()
      void refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save the post.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(blog: Blog) {
    const next = blog.status === 'published' ? 'draft' : 'published'
    setError('')
    setMessage('')
    try {
      const response = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to update the post.')
      setPosts((current) => current.map((item) => (item.id === blog.id ? data.blog : item)))
      setMessage(`"${blog.title}" is now ${next}.`)
      void refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update the post.')
    }
  }

  async function removePost(blog: Blog) {
    if (!window.confirm(`Delete "${blog.title}" permanently? This cannot be undone.`)) return
    setError('')
    setMessage('')
    try {
      const response = await fetch(`/api/admin/blogs/${blog.id}`, { method: 'DELETE', credentials: 'same-origin' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to delete the post.')
      setPosts((current) => current.filter((item) => item.id !== blog.id))
      if (draft.id === blog.id) cancelEdit()
      setMessage(`Deleted "${blog.title}".`)
      void refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to delete the post.')
    }
  }

  const field = 'input'
  const publishedCount = posts.filter((post) => post.status === 'published').length

  return (
    <>
      <section className={box}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-ink-950">Blog manager</h2>
            <p className="mt-1 text-sm text-ink-400">
              Write, edit and publish articles that appear in the public blogs section.{' '}
              {publishedCount} published · {posts.length - publishedCount} draft{posts.length - publishedCount === 1 ? '' : 's'}.
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn btn-outline-light btn-sm" onClick={load}>Refresh</button>
            {!editing && (
              <button type="button" className="btn btn-primary btn-sm" onClick={startNew}>＋ New post</button>
            )}
          </div>
        </div>

        {message && <p role="status" className="mt-3 text-sm font-semibold text-emerald-700">{message}</p>}
        {error && <p role="alert" className="mt-3 text-sm font-semibold text-flame-600">{error}</p>}

        {/* ------------------- Editor ------------------- */}
        {editing && (
          <form onSubmit={(event) => void save(event)} className="mt-5 rounded-3xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-ink-950">{draft.id ? 'Edit post' : 'New post'}</h3>
              <button type="button" className="text-xs font-bold text-ink-400 hover:text-ink-950" onClick={cancelEdit}>
                Cancel
              </button>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <label className="block text-sm font-medium text-ink-700 lg:col-span-2">
                Title *
                <input
                  className={`${field} mt-1`}
                  required
                  minLength={3}
                  maxLength={150}
                  value={draft.title}
                  onChange={(event) => onTitleChange(event.target.value)}
                  placeholder="e.g. How a School ERP Saves 10 Hours Every Week"
                />
              </label>

              <label className="block text-sm font-medium text-ink-700">
                URL slug *
                <input
                  className={`${field} mt-1`}
                  required
                  value={draft.slug}
                  onChange={(event) => { setSlugTouched(true); update('slug', slugify(event.target.value)) }}
                  placeholder="how-school-erp-saves-hours"
                />
                <span className="mt-1 block text-xs text-ink-400">/blogs/{draft.slug || 'your-slug'}/</span>
              </label>

              <label className="block text-sm font-medium text-ink-700">
                Category
                <input
                  className={`${field} mt-1`}
                  value={draft.category}
                  onChange={(event) => update('category', event.target.value)}
                  placeholder="Education ERP, CRM, HRM…"
                />
              </label>

              <label className="block text-sm font-medium text-ink-700">
                Tags (comma separated)
                <input
                  className={`${field} mt-1`}
                  value={draft.tags}
                  onChange={(event) => update('tags', event.target.value)}
                  placeholder="School ERP, automation, fees"
                />
              </label>

              <label className="block text-sm font-medium text-ink-700">
                Author
                <input
                  className={`${field} mt-1`}
                  value={draft.author}
                  onChange={(event) => update('author', event.target.value)}
                />
              </label>

              <label className="block text-sm font-medium text-ink-700 lg:col-span-2">
                Cover image
                <input
                  className={`${field} mt-1`}
                  value={draft.coverImage}
                  onChange={(event) => update('coverImage', event.target.value)}
                  placeholder="/assets/2024-09-website-development.jpg"
                  list="blog-cover-presets"
                />
                <datalist id="blog-cover-presets">
                  {COVER_PRESETS.map((preset) => <option key={preset} value={preset} />)}
                </datalist>
              </label>

              <label className="block text-sm font-medium text-ink-700 lg:col-span-2">
                Excerpt <span className="text-xs font-normal text-ink-400">({draft.excerpt.length}/400) — shown in search results</span>
                <textarea
                  className={`${field} mt-1 min-h-16`}
                  maxLength={400}
                  value={draft.excerpt}
                  onChange={(event) => update('excerpt', event.target.value)}
                  placeholder="One or two sentences summarising the article for SEO meta description."
                />
              </label>

              <label className="block text-sm font-medium text-ink-700 lg:col-span-2">
                Content *
                <span className="mt-1 block text-xs font-normal text-ink-400">
                  Use blank lines for paragraphs, “## Heading” for sections, “### Subheading”,
                  “- bullet point”, “&gt; quote” and **double asterisks** for bold.
                </span>
                <textarea
                  className={`${field} mt-2 min-h-72 font-mono text-sm`}
                  required
                  minLength={10}
                  value={draft.content}
                  onChange={(event) => update('content', event.target.value)}
                  placeholder={'Start with a short introduction…\n\n## First section\n\nParagraph text here.\n\n- A benefit\n- Another benefit'}
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-4">
              <label className="block text-sm font-medium text-ink-700">
                Status
                <select
                  className={`${field} mt-1 !w-auto`}
                  value={draft.status}
                  onChange={(event) => update('status', event.target.value as Draft['status'])}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
              <label className="flex items-center gap-2 pb-2 text-sm font-medium text-ink-700">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(event) => update('featured', event.target.checked)}
                />
                Feature on the blogs landing page
              </label>
              <button type="submit" className="btn btn-primary btn-md ml-auto" disabled={saving}>
                {saving ? 'Saving…' : draft.id ? 'Save changes' : 'Create post'}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ------------------- Post list ------------------- */}
      <section className={`${box} mt-5`}>
        <h2 className="text-xl font-bold text-ink-950">All posts</h2>
        <p className="mt-1 text-sm text-ink-400">Drafts are hidden from the public blogs section until published.</p>

        <div className="mt-4 space-y-3">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-line p-4">
              <div className="flex min-w-0 items-start gap-3">
                <img
                  src={post.coverImage || '/assets/2025-01-website-front-hero-image.png'}
                  alt=""
                  className="h-14 w-20 shrink-0 rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                        post.status === 'published' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/15 text-amber-700'
                      }`}
                    >
                      {post.status}
                    </span>
                    {post.featured && (
                      <span className="rounded-full bg-accent-400/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent-600">
                        Featured
                      </span>
                    )}
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">{post.category}</span>
                  </div>
                  <h3 className="mt-1.5 truncate font-bold text-ink-950">{post.title}</h3>
                  <p className="mt-0.5 text-xs text-ink-400">
                    /blogs/{post.slug}/ · updated {new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="btn btn-outline-light btn-sm" onClick={() => startEdit(post)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={() => void toggleStatus(post)}
                >
                  {post.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  type="button"
                  className="shrink-0 text-xs font-semibold text-flame-600 hover:underline"
                  onClick={() => void removePost(post)}
                  aria-label={`Delete ${post.title}`}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
          {!posts.length && (
            <p className="rounded-2xl bg-paper p-5 text-sm text-ink-400">
              No posts yet — use “New post” to write your first article.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
