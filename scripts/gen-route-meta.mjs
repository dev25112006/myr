/**
 * Regenerates src/content/routeMeta.ts from audit/inventory.json.
 * Extended with SEO fields: keywords, canonical, robots, og defaults.
 * Run: node scripts/gen-route-meta.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const SITE = process.env.SITE_ORIGIN || process.env.APP_ORIGIN || 'http://localhost:3000'
const inv = JSON.parse(readFileSync('audit/inventory.json', 'utf8'))
const routes = Array.isArray(inv) ? inv : Object.values(inv)

/** Curated keywords for key routes (fallback: derived from title). */
const KEYWORDS = {
  '/': 'IT solutions, PBX, CCTV, CRM development, website design, networking, cloud computing, digital marketing, VoIP, India',
  '/services/': 'IT services, web development, CRM, digital marketing, networking, IPBX, CCTV, toll-free number',
  '/website-development/': 'website development, custom website design, SEO friendly website, e-commerce website, India',
  '/crm-development/': 'custom CRM development, CRM software, lead management, business CRM solutions',
  '/digital-marketing/': 'digital marketing, SEO services, lead generation, social media marketing, ad campaign',
  '/network-solution/': 'network solutions, IT infrastructure, data security, system support',
  '/ipbx-solution/': 'IP PBX, PBX system, business phone system, VoIP, MYRLINK',
  '/cctv-solution/': 'CCTV installation, 16 channel CCTV, 32 channel CCTV, 64 channel CCTV, security camera systems, commercial surveillance, India',
  '/1800-number/': 'toll free number, 1800 number, IVR, business call routing',
  '/privyr/': 'mobile CRM, lead management, sales automation, WhatsApp CRM',
  '/about-us/': 'about MyR Advance Solution, IT company, technology partner',
  '/contact-us/': 'contact IT support, live chat, WhatsApp support',
  '/tech-store/': 'buy IT products, website plans, hosting, store',
  '/shop/': 'IT products store, website development plans',
}

const PANEL_ROUTES = new Set([
  '/crm-dashboard/', '/my-leads/', '/crm-reports/', '/crm-tasks/', '/my-profile/',
  '/import-leads/', '/crm-login/', '/team-chat/', '/team-panel/', '/customer-panel/',
  '/lets-keep-in-touch/',
])

/** Noindex routes (login-gated / duplicate / soft-404 source quirks). */
const NOINDEX = new Set([
  '/myr/', '/cart/', '/checkout/', '/my-account/', '/my-account/lost-password/',
  '/not-found/', '/lets-keep-in-touch/', '/product-category/networking-devices/',
  ...PANEL_ROUTES,
])

function keywordsFor(path, title, meta) {
  if (KEYWORDS[path]) return KEYWORDS[path]
  const base = 'MyR Advance Solution'
  const words = title.replace(/\s*[-|–]\s*MyR Advance Solution.*$/i, '').trim()
  return words ? `${words}, ${base}` : base
}

const lines = []
lines.push('/**')
lines.push(' * AUTO-GENERATED from audit/inventory.json by scripts/gen-route-meta.mjs — do not hand-edit.')
lines.push(' * Route metadata: title, description, header variant, SEO fields.')
lines.push(' */')
lines.push('')
lines.push('export type HeaderVariant = "primary" | "inner" | "store" | "panel"')
lines.push('')
lines.push('export type RouteMeta = {')
lines.push('  path: string')
lines.push('  title: string')
lines.push('  meta: string')
lines.push('  header: HeaderVariant')
lines.push('  /** comma-separated keywords */')
lines.push('  keywords: string')
lines.push('  /** absolute canonical URL */')
lines.push('  canonical: string')
lines.push('  /** false = noindex */')
lines.push('  robots: boolean')
lines.push('}')
lines.push('')
lines.push('export const ROUTE_META: RouteMeta[] = [')

const sorted = [...routes].sort((a, b) => a.route.localeCompare(b.route))
for (const r of sorted) {
  const path = r.route
  const title = r.title || 'MyR Advance Solution'
  const meta = (r.meta_description || '').slice(0, 300)
  const header = PANEL_ROUTES.has(path)
    ? 'panel'
    : (r.header_variant ?? inferHeader(path))
  const kw = keywordsFor(path, title, meta)
  const canonical = `${SITE}${path}`
  const robots = NOINDEX.has(path) ? false : true
  lines.push(
    `  { path: ${JSON.stringify(path)}, title: ${JSON.stringify(title)}, meta: ${JSON.stringify(meta)}, header: ${JSON.stringify(header)}, keywords: ${JSON.stringify(kw)}, canonical: ${JSON.stringify(canonical)}, robots: ${robots} },`,
  )
}
lines.push(']')
lines.push('')

function inferHeader(path) {
  if (path === '/') return 'primary'
  if (path.startsWith('/product') || path === '/tech-store/' || path === '/shop/' ||
      path === '/cart/' || path === '/checkout/') return 'store'
  return 'inner'
}

lines.push('export function getRouteMeta(path: string): RouteMeta | undefined {')
lines.push('  const clean = path !== "/" && path.endsWith("/") ? path : path === "/" ? "/" : `${path}/`')
lines.push('  return ROUTE_META.find((r) => r.path === clean) ?? ROUTE_META.find((r) => r.path === path)')
lines.push('}')
lines.push('')

writeFileSync('src/content/routeMeta.ts', lines.join('\n'))
console.log(`routeMeta.ts regenerated — ${sorted.length} routes`)
