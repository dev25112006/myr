import { chromium } from 'playwright'

const BASE = 'http://localhost:4173/'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(BASE, { waitUntil: 'networkidle' })
await sleep(800)

const sticky = page.locator('div[class*="50vh"]').first()
const shot = (name) => page.screenshot({ path: `/tmp/myr/core-${name}.png` })
const centerCard = async (text) => {
  await page.getByRole('heading', { name: text, exact: true }).scrollIntoViewIfNeeded()
  await page.evaluate((t) => {
    const h = [...document.querySelectorAll('h3')].find((e) => e.textContent.trim() === t)
    h?.scrollIntoView({ block: 'center' })
  }, text)
  await sleep(1300) // observer + 700ms morph transitions
}

// 1 — first feature: device frozen at viewport mid
await centerCard('Web Development')
console.log('matches:', await sticky.count())
const box1 = await sticky.boundingBox()
console.log('box1:', JSON.stringify(box1))
await shot('f1-webdev')

// 2 — mid feature: screen content changed, device position must NOT move
await centerCard('Networking Solution')
const boxA = await sticky.boundingBox()
console.log('boxA:', JSON.stringify(boxA))
await shot('f3-network')

// freeze pair: IPBX feature — device top must equal the Networking one
await centerCard('IPBX Solution')
const boxB = await sticky.boundingBox()
console.log('boxB:', JSON.stringify(boxB))

// 3 — toll-free: iPhone call animation
await centerCard('Toll-Free 1800 XXX 8899 Number')
await shot('f6-call')
await sleep(900)
await shot('f6-call-b') // second frame of the ringing loop

// 4 — appointment: MYR app open/close (three frames across the 5.5s loop)
await page.evaluate(() => {
  const el = [...document.querySelectorAll('p')].find((e) =>
    e.textContent.includes('Schedule an Appointment'),
  )
  el?.scrollIntoView({ block: 'center' })
})
await sleep(1300)
await shot('f7-app-a')
await sleep(1900)
await shot('f7-app-b')
await sleep(1900)
await shot('f7-app-c')

const drift = Math.abs((boxA?.top ?? 0) - (boxB?.top ?? 0))
console.log('device top @networking:', boxA?.top, '| @ipbx:', boxB?.top, '| drift:', drift, 'px')
console.log(drift <= 1 ? 'FREEZE OK' : 'FREEZE FAILED')
await browser.close()
