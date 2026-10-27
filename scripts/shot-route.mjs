import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = 4191
const routes = process.argv.slice(2)
if (!routes.length) {
  console.error('Usage: node scripts/shot-route.mjs <route> [route...]')
  process.exit(1)
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: process.cwd(),
  stdio: 'ignore',
})
await new Promise((r) => setTimeout(r, 1500))
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } })

for (const route of routes) {
  const slug = route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: `/tmp/myr/qa-${slug}-top.png` })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4))
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({ path: `/tmp/myr/qa-${slug}-mid.png` })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.75))
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({ path: `/tmp/myr/qa-${slug}-low.png` })
  console.log('shot', route)
}

await browser.close()
server.kill('SIGTERM')
console.log('done')
