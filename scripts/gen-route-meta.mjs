/**
 * Regenerates src/content/routeMeta.ts from audit/inventory.json.
 * Extended with SEO fields: keywords, canonical, robots, og defaults.
 * Run: node scripts/gen-route-meta.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const SITE = process.env.SITE_ORIGIN || process.env.APP_ORIGIN || 'https://www.myradvancesolution.com'
const inv = JSON.parse(readFileSync('audit/inventory.json', 'utf8'))
const routes = Array.isArray(inv) ? inv : Object.values(inv)

/** Curated keywords for key routes (fallback: derived from title). */
const KEYWORDS = {
  '/': 'business software India, IT solutions US, website development, ecommerce, CRM, HRMS, education ERP, digital marketing, networking, VoIP',
  '/services/': 'business software services India, software company US, website development, CRM, HRMS, education ERP, ecommerce, IT services',
  '/website-development/': 'website development company India, web design US, custom website development, responsive website, SEO-ready web design',
  '/crm-development/': 'CRM development company India, custom CRM software US, sales pipeline, lead management, workflow automation',
  '/hrm-solutions/': 'HRMS software India, HR software US, employee management, attendance, leave, payroll workflows, HR self service',
  '/education-erp/': 'school ERP India, college ERP software, coaching institute management software, student information system, education ERP US',
  '/ecommerce-solutions/': 'ecommerce website development India, ecommerce web design US, online store development, ecommerce checkout, product catalog',
  '/digital-marketing/': 'digital marketing agency India, digital marketing services US, SEO services, lead generation, social media marketing, paid campaigns',
  '/network-solution/': 'business network solutions India, IT infrastructure US, Wi-Fi, LAN, structured cabling, network security, managed IT',
  '/ipbx-solution/': 'IP PBX India, VoIP phone system US, business phone system, IVR, call routing, call queue, MYRLINK',
  '/cctv-solution/': 'CCTV installation India, commercial security cameras, 16 channel DVR, 32 channel NVR, remote video monitoring',
  '/1800-number/': 'India toll free number 1800, business helpline number, toll-free phone service, IVR, call routing',
  '/privyr/': 'mobile CRM software India, lead management CRM US, sales CRM, WhatsApp lead follow up, sales automation',
  '/crm/': 'mobile CRM software India, lead management CRM US, sales CRM, WhatsApp lead follow up, sales automation',
  '/about-us/': 'about MyR Advance Solution, IT company, technology partner',
  '/contact-us/': 'contact IT support, live chat, WhatsApp support',
  '/tech-store/': 'business software and IT products India, CRM, HRMS, education ERP, website plans, networking and PBX systems',
  '/shop/': 'IT products store, website development plans',
  '/product/newbiz-essentials/': 'business website design plan, mobile responsive website, website development India, custom website package',
  '/product/revampcommerce-lite/': 'ecommerce website package India, ecommerce store website, payment gateway website development, responsive online store',
  '/product/elitecustom-suite/': 'custom website development package, advanced website plan, website with integrations and support',
  '/product/digital-marketing/': 'digital marketing plan India, SEO services plan, social media marketing, lead generation package',
  '/product/myrlink-ip-pbx-ip100-v3/': 'MYRLINK IP PBX IP100 V3, business IP PBX price India, SIP trunk phone system, call center phone system',
  '/product/website-development/': 'website development plans, custom website package, business web design, responsive website India',
  '/product-category/website-development/': 'website development plans, business website packages, ecommerce website plan, custom web design',
  '/product-category/digital-marketing/': 'digital marketing packages, SEO plan, social media marketing plans, lead generation service',
  '/partner/': 'white label ERP, white label CRM, white label HRM, reseller partnership India, school ERP white label, coaching ERP reseller',
  '/partnership/': 'white label ERP, white label CRM, white label HRM, reseller partnership India, school ERP white label, coaching ERP reseller',
  '/cctv-solutions/': 'CCTV installation India, commercial security cameras, 16 channel DVR, 32 channel NVR, remote video monitoring',
  '/ip-pbx/': 'IP PBX India, VoIP phone system US, business phone system, IVR, call routing, call queue, MYRLINK',
  '/network-product/': 'networking products India, business switches, routers, Wi-Fi access points, structured cabling products',
  '/education-erp/school/': 'school ERP India, school management software, student attendance system, school fee management, school parent portal',
  '/education-erp/college/': 'college ERP India, college management software, examination management system, college attendance, student portal',
  '/education-erp/coaching/': 'coaching institute software India, coaching ERP, batch scheduling software, test series management, coaching fee management',
  '/education-erp/modules/': 'education ERP modules, school management modules, attendance module, exam module, fee module, timetable module',
  '/booking/': 'book IT consultation India, software demo appointment, business technology discussion, MYR services appointment',
  '/how-we-help-your-business/': 'business IT consulting India, software implementation, digital transformation services, technology partner',
  '/knowledge-base/': 'MYR help center, product support articles, business software help, account and order guidance',
  '/product-category/ip-pbx/': 'IP PBX products India, business phone systems, MYRLINK IP PBX, IVR and call routing equipment',
  '/product-category/it-products/': 'business IT products India, networking equipment, IP PBX hardware, workplace infrastructure',
  '/product-category/pbx/': 'business PBX equipment, IP telephony products, office phone systems, call routing hardware',
  '/product-category/website-development/website-design/': 'website design packages India, responsive business website, ecommerce design plans, custom website development',
  '/product-category/website-development/website/': 'business website packages India, responsive website design, website development plans, ecommerce options',
}

const PANEL_ROUTES = new Set([
  '/crm-dashboard/', '/my-leads/', '/crm-reports/', '/crm-tasks/', '/my-profile/',
  '/import-leads/', '/crm-login/', '/team-chat/', '/team-panel/', '/customer-panel/',
  '/lets-keep-in-touch/',
])

/** URL aliases should consolidate signals on their primary route. */
const CANONICAL_PATHS = {
  '/shop/': '/tech-store/',
  '/partnership/': '/partner/',
  '/cctv-solutions/': '/cctv-solution/',
  '/ip-pbx/': '/ipbx-solution/',
  '/crm/': '/privyr/',
  '/product-category/pbx/': '/product-category/ip-pbx/',
}

/** Noindex routes (login-gated / duplicate / soft-404 source quirks). */
const NOINDEX = new Set([
  '/myr/', '/cart/', '/checkout/', '/my-account/', '/my-account/lost-password/',
  '/not-found/', '/lets-keep-in-touch/', '/product-category/networking-devices/',
  '/services/web-development/',
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
  const canonical = `${SITE}${CANONICAL_PATHS[path] ?? path}`
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
