import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getRouteMeta } from '@/content/routeMeta'
import { ORGANIZATION_LD, WEBSITE_LD, breadcrumbLd, pageLd } from '@/lib/seoLd'

void ORGANIZATION_LD // ships statically in index.html

const SITE = 'https://www.myradvancesolution.com'
const DEFAULT_OG = `${SITE}/assets/2025-01-website-front-hero-image.png`

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
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

function setLd(id: string, data: object | object[]) {
  let el = document.getElementById(id) as HTMLScriptElement | null
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
 * Breadcrumb + per-page Service/FAQ/Product).
 */
export function SeoHead() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = getRouteMeta(pathname)
    const title = meta?.title || 'MyR Advance Solution'
    const description =
      meta?.meta ||
      'MyR Advance Solution delivers IT solutions: PBX, CCTV, CRM development, website design, networking, digital marketing and more.'
    const keywords = meta?.keywords || 'MyR Advance Solution, IT solutions'
    const canonical = meta?.canonical || `${SITE}${pathname}`
    const robots = meta?.robots === false ? 'noindex, nofollow' : 'index, follow'
    const isHome = pathname === '/'

    document.title = title
    upsertMeta('name', 'description', description.slice(0, 160))
    upsertMeta('name', 'keywords', keywords)
    upsertMeta('name', 'robots', robots)
    upsertMeta('name', 'theme-color', '#f1f3f9')
    upsertLink('canonical', canonical)

    /* Open Graph */
    upsertMeta('property', 'og:type', isHome ? 'website' : 'article')
    upsertMeta('property', 'og:site_name', 'MyR Advance Solution')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description.slice(0, 200))
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:image', DEFAULT_OG)
    upsertMeta('property', 'og:locale', 'en_IN')

    /* Twitter */
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description.slice(0, 200))
    upsertMeta('name', 'twitter:image', DEFAULT_OG)

    /* JSON-LD — Organization ships statically in index.html (no-JS crawlers). */
    setLd('ld-website', WEBSITE_LD)
    if (meta?.robots !== false) {
      setLd('ld-page', [breadcrumbLd(pathname, title), ...pageLd(pathname)])
    } else {
      const el = document.getElementById('ld-page')
      if (el) el.remove()
    }
  }, [pathname])

  return null
}
