import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getRouteMeta } from '@/content/routeMeta'
import { ORGANIZATION_LD, WEBSITE_LD, blogIndexLd, blogPostingLd, breadcrumbLd, pageLd } from '@/lib/seoLd'
import { useBlogs } from '@/lib/blogs'

const SITE = typeof window !== 'undefined' ? window.location.origin : ''
const CANONICAL_SITE = SITE && !/^https?:\/\/(localhost|127\.0\.0\.1)(:|$)/.test(SITE)
  ? SITE
  : SITE
const DEFAULT_OG = `${CANONICAL_SITE}/assets/2025-01-website-front-hero-image.png`

const BLOG_INDEX_TITLE = 'Blog | ERP, CRM, Website & Digital Marketing Guides | MyR Advance Solution'
const BLOG_INDEX_DESCRIPTION =
  'Practical guides on school and college ERP, CRM, HRM, website development cost, AI digital marketing and IP PBX phone systems from the MYR Advance Solution team.'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove()
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setLd(id: string, data: object | object[] | null) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!data) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Full SEO head: title, description, keywords, robots, canonical,
 * Open Graph, Twitter Card, and JSON-LD (Organization, WebSite,
 * Breadcrumb + per-page Service/FAQ/Product/Blog).
 * Blog routes (/blogs/…) take their meta from the published CMS posts.
 */
export function SeoHead() {
  const { pathname } = useLocation()
  const { blogs } = useBlogs()

  useEffect(() => {
    const meta = getRouteMeta(pathname)
    let title = meta?.title || 'MyR Advance Solution'
    let description =
      meta?.meta ||
      'MyR Advance Solution delivers IT solutions: PBX, CCTV, CRM development, website design, networking, digital marketing and more.'
    let keywords = meta?.keywords || 'MyR Advance Solution, IT solutions'
    let ogImage = DEFAULT_OG
    let publishedTime: string | null = null
    let blogLd: object | null = null
    // This is a clone deployment: canonical URLs must use the current host,
    // never the reference site's host embedded in the audit inventory.
    const canonical = meta?.canonical || `${CANONICAL_SITE}${pathname}`
    const robots = meta?.robots === false ? 'noindex, nofollow' : 'index, follow'
    const isHome = pathname === '/'

    /* ---------- Blog routes: CMS-driven meta + BlogPosting/Blog JSON-LD ---------- */
    const isBlogIndex = pathname === '/blogs/' || pathname === '/blogs'
    const blogPostMatch = pathname.match(/^\/blogs\/([^/]+)\/?$/)
    if (isBlogIndex) {
      title = BLOG_INDEX_TITLE
      description = BLOG_INDEX_DESCRIPTION
      keywords =
        'IT blog, ERP software blog, school ERP guide, CRM software tips, HRM software, website development cost, digital marketing strategies, IP PBX guide'
      if (blogs.length) blogLd = blogIndexLd(blogs.slice(0, 30))
    } else if (blogPostMatch) {
      const slug = decodeURIComponent(blogPostMatch[1])
      const blog = blogs.find((item) => item.slug === slug && item.status === 'published')
      if (blog) {
        title = `${blog.title} | MyR Advance Solution Blog`
        description = blog.excerpt
        keywords = [blog.category, ...blog.tags].join(', ')
        if (blog.coverImage) {
          ogImage = blog.coverImage.startsWith('http') ? blog.coverImage : `${CANONICAL_SITE}${blog.coverImage}`
        }
        publishedTime = blog.createdAt
        blogLd = blogPostingLd(blog)
      }
    }

    document.title = title
    upsertMeta('name', 'description', description.slice(0, 160))
    upsertMeta('name', 'keywords', keywords)
    upsertMeta('name', 'robots', robots)
    upsertMeta('name', 'theme-color', '#f1f3f9')
    upsertLink('canonical', canonical)

    /* Hreflang for multi-region (India + US) */
    ;(() => {
      let el = document.head.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="en-IN"]')
      if (!el) { el = document.createElement('link'); el.rel = 'alternate'; el.hreflang = 'en-IN'; document.head.appendChild(el) }
      el.href = canonical
    })()
    ;(() => {
      let el = document.head.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="en-US"]')
      if (!el) { el = document.createElement('link'); el.rel = 'alternate'; el.hreflang = 'en-US'; document.head.appendChild(el) }
      el.href = canonical.replace('www.myradvancesolution.com', 'us.myradvancesolution.com')
    })()
    ;(() => {
      let el = document.head.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="x-default"]')
      if (!el) { el = document.createElement('link'); el.rel = 'alternate'; el.hreflang = 'x-default'; document.head.appendChild(el) }
      el.href = canonical
    })()

    /* Open Graph */
    upsertMeta('property', 'og:type', isHome || isBlogIndex ? 'website' : 'article')
    upsertMeta('property', 'og:site_name', 'MyR Advance Solution')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description.slice(0, 200))
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('property', 'og:locale', 'en_IN')
    upsertMeta('property', 'og:locale:alternate', 'en_US')
    if (publishedTime) {
      upsertMeta('property', 'article:published_time', publishedTime)
      upsertMeta('property', 'article:section', 'Blog')
    } else {
      removeMeta('property', 'article:published_time')
      removeMeta('property', 'article:section')
    }

    /* Twitter */
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description.slice(0, 200))
    upsertMeta('name', 'twitter:image', ogImage)

    /* JSON-LD — Organization ships statically in index.html (no-JS crawlers). */
    setLd('ld-organization-static', ORGANIZATION_LD)
    setLd('ld-website', WEBSITE_LD)
    setLd('ld-blog', blogLd)
    if (meta?.robots !== false) {
      setLd('ld-page', [breadcrumbLd(pathname, title), ...pageLd(pathname)])
    } else {
      setLd('ld-page', null)
    }
  }, [pathname, blogs])

  return null
}
