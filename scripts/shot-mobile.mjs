import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = 4193
const routes = process.argv.slice(2)
if (!routes.length) {
  console.error('Usage: node scripts/shot-mobile.mjs <route> [route...]')
  process.exit(1)
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: process.cwd(),
  stdio: 'ignore',
})
await new Promise((r) => setTimeout(r, 1500))
const browser = await chromium.launch()

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
const tablet = await browser.newPage({ viewport: { width: 768, height: 1024 } })

for (const route of routes) {
  const slug = route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'
  await mobile.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' })
  await mobile.screenshot({ path: `/tmp/myr/m-${slug}-top.png` })
  await mobile.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45))
  await new Promise((r) => setTimeout(r, 700))
  await mobile.screenshot({ path: `/tmp/myr/m-${slug}-mid.png` })
  await tablet.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' })
  await tablet.screenshot({ path: `/tmp/myr/t-${slug}-top.png` })
  console.log('shot', route)
}

await browser.close()
server.kill('SIGTERM')
console.log('done')
