import { chromium } from 'playwright'

const BASE = 'http://localhost:4173/website-development/'
const targets = [
  { t: 3000, name: 'shotA-wide' },
  { t: 6000, name: 'shotB-zoom' },
  { t: 8500, name: 'shotB-zoom2' }, // same shot, later — proves film scroll
  { t: 11000, name: 'shotC-dutch' },
  { t: 16000, name: 'shotD-close' },
]

const browser = await chromium.launch()

async function capture(viewport, suffix) {
  const page = await browser.newPage({ viewport })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForSelector('.cine-camera')
  await page.waitForTimeout(1500)

  for (const target of targets) {
    await page.evaluate((t) => {
      for (const a of document.getAnimations()) {
        a.pause()
        a.currentTime = t
      }
    }, target.t)
    await page.waitForTimeout(50)
    await page.locator('section').first().screenshot({ path: `/tmp/myr/cine-${suffix}${target.name}.png` })
    console.log(suffix + target.name, 't =', target.t)
  }
  await page.close()
}

await capture({ width: 1440, height: 900 }, '')
await capture({ width: 390, height: 844 }, 'm-')
await browser.close()
console.log('done')
