import { chromium } from 'playwright'

const BASE = 'http://localhost:4173/'
const targets = [
  { t: 1300, name: 'assemble' },
  { t: 3300, name: 'formed' },
  { t: 5600, name: 'scroll-tilt' },
  { t: 7900, name: 'disassemble' },
]

const browser = await chromium.launch()

async function capture(viewport, suffix) {
  const page = await browser.newPage({ viewport })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForSelector('.piece')
  await page.waitForTimeout(1500) // let entrance reveals finish (JS-driven)

  for (const target of targets) {
    // deterministic: freeze every animation at the exact loop time
    await page.evaluate((t) => {
      for (const a of document.getAnimations()) {
        a.pause()
        a.currentTime = t
      }
    }, target.t)
    await page.waitForTimeout(50)
    await page.locator('section').first().screenshot({ path: `/tmp/myr/asm-${suffix}${target.name}.png` })
    console.log(suffix + target.name, 't =', target.t, 'ms')
  }
  await page.close()
}

await capture({ width: 1440, height: 900 }, '')
await capture({ width: 390, height: 844 }, 'm-')
await browser.close()
console.log('done')
