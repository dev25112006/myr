#!/usr/bin/env node
/**
 * Smoke test: boots `vite preview`, visits routes, fails on console/page
 * errors or blank renders. Usage:
 *   node scripts/smoke.mjs            # all routes from routeMeta
 *   node scripts/smoke.mjs / /cart/   # specific routes
 */
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const PORT = 4188
const BASE = `http://localhost:${PORT}`

function routesFromMeta() {
  const src = readFileSync(new URL('../src/content/routeMeta.ts', import.meta.url), 'utf8')
  return [...src.matchAll(/path: "([^"]+)"/g)].map((m) => m[1])
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : routesFromMeta()

const apiServer = spawn('node', ['--env-file-if-exists=.env', 'server/index.mjs'], {
  cwd: new URL('..', import.meta.url).pathname,
  stdio: 'ignore',
})
const previewServer = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: new URL('..', import.meta.url).pathname,
  stdio: 'ignore',
})

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
await wait(2500)

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } })
const failures = []
let checked = 0

for (const route of targets) {
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    const optionalCatalogFailure = route === '/education-erp/modules/' && m.text().includes('Failed to load resource')
    if (m.type() === 'error' && !optionalCatalogFailure) errors.push(`console: ${m.text()}`)
  })
  try {
    const resp = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 20000 })
    const status = resp?.status() ?? 0
    const text = (await page.locator('body').innerText().catch(() => '')).trim()
    if (status >= 400) failures.push(`${route} → HTTP ${status}`)
    else if (text.length < 40) failures.push(`${route} → blank render (${text.length} chars)`)
    else if (errors.length) failures.push(`${route} → ${errors.slice(0, 2).join(' | ')}`)
    checked++
  } catch (e) {
    failures.push(`${route} → ${String(e).split('\n')[0]}`)
  }
  await page.close()
}

await browser.close()
previewServer.kill('SIGTERM')
apiServer.kill('SIGTERM')

console.log(`\nSmoke: ${checked}/${targets.length} routes checked`)
if (failures.length) {
  console.log(`FAILURES (${failures.length}):`)
  for (const f of failures) console.log('  ✗', f)
  process.exit(1)
}
console.log('All routes rendered with no console/page errors.')
