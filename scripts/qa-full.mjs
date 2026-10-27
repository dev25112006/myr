import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = 4195
const routes = process.argv.slice(2)
if (!routes.length) {
  console.error('Usage: node scripts/qa-full.mjs <route> [route...]')
  process.exit(1)
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: process.cwd(),
  stdio: 'ignore',
})
await new Promise((r) => setTimeout(r, 1500))
const browser = await chromium.launch()

const viewports = [
  { name: 'm', width: 390, height: 844 },
  { name: 't', width: 768, height: 1024 },
  { name: 'd', width: 1440, height: 960 },
]

for (const route of routes) {
  const slug = route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' })
    // progressive scroll so every whileInView reveal fires, then back to top
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 120))
      }
      window.scrollTo(0, 0)
      // smooth-scroll CSS means scrollTo(0,0) animates — wait until it lands
      await new Promise((r) => {
        const t = setInterval(() => {
          if (window.scrollY === 0) { clearInterval(t); r() }
        }, 100)
        setTimeout(() => { clearInterval(t); r() }, 4000)
      })
      await new Promise((r) => setTimeout(r, 300))
    })
    await page.screenshot({ path: `/tmp/myr/full-${vp.name}-${slug}.png`, fullPage: true })
    await page.close()
    console.log('shot', vp.name, route)
  }
}

await browser.close()
server.kill('SIGTERM')
console.log('done')
