/**
 * Generates public/sitemap.xml from audit/inventory.json (indexable routes only).
 * Run: node scripts/gen-sitemap.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const SITE = process.env.SITE_ORIGIN || process.env.APP_ORIGIN || 'https://www.myradvancesolution.com'
const NOINDEX = new Set([
  '/myr/', '/shop/', '/cart/', '/checkout/', '/my-account/', '/my-account/lost-password/',
  '/not-found/', '/lets-keep-in-touch/', '/product-category/networking-devices/',
  '/services/web-development/',
  '/crm-dashboard/', '/my-leads/', '/crm-reports/', '/crm-tasks/', '/my-profile/',
  '/import-leads/', '/crm-login/', '/team-chat/', '/team-panel/', '/customer-panel/',
])
const CANONICAL_PATHS = {
  '/shop/': '/tech-store/',
  '/partnership/': '/partner/',
  '/cctv-solutions/': '/cctv-solution/',
  '/ip-pbx/': '/ipbx-solution/',
  '/crm/': '/privyr/',
  '/product-category/pbx/': '/product-category/ip-pbx/',
}

const inv = JSON.parse(readFileSync('audit/inventory.json', 'utf8'))
const routes = (Array.isArray(inv) ? inv : Object.values(inv))
  .map((r) => r.route)
  .filter((p) => !NOINDEX.has(p) && !CANONICAL_PATHS[p])
  .sort()

const today = new Date().toISOString().slice(0, 10)
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(
    (p) =>
      `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod><changefreq>${p === '/' ? 'daily' : 'weekly'}</changefreq><priority>${p === '/' ? '1.0' : '0.7'}</priority></url>`,
  ),
  '</urlset>',
  '',
].join('\n')

writeFileSync('public/sitemap.xml', xml)
const robots = readFileSync('public/robots.txt', 'utf8').replace(/^Sitemap:.*$/m, `Sitemap: ${SITE}/sitemap.xml`)
writeFileSync('public/robots.txt', robots)
console.log(`sitemap.xml — ${routes.length} URLs`)
