import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { cn, inr } from '@/lib/format'
import { WEBSITE_PLANS } from '@/content/plans'
import { useCart } from '@/lib/stores'
import { useCatalogPrice } from '@/lib/useCatalogPrice'

/* ============================ DATA ============================ */


const STATS = [
  { label: 'Team Member', value: 70, suffix: '+' },
  { label: 'Efficiency', value: 95, suffix: '%' },
  { label: 'Happy Clients', value: 10000, suffix: '+', comma: true },
  { label: 'Countries', value: 10, suffix: '+' },
]
const HERO_PHRASES = ['IT Solutions', 'IT Products', 'IT Services']

const SERVICES = [
  {
    title: 'Web Development',
    desc: 'We craft sleek, user-friendly designs tailored for your success.',
    to: '/website-development/',
    badge: 'UPTO 60% OFF',
  },
  {
    title: 'CRM Development',
    desc: 'We create tailored CRM solutions for your business success.',
    to: '/crm-development/',
  },
  {
    title: 'Digital Marketing',
    desc: 'We excel in digital marketing, maximizing your online success.',
    to: '/digital-marketing/',
    badge: 'UPTO 70% OFF',
  },
  {
    title: 'Networking Solution',
    desc: 'Streamline connections with tailored networking solutions.',
    to: '/network-solution/',
  },
  {
    title: 'IPBX Solution',
    desc: 'Seamless communication, enhanced efficiency for your business.',
    to: '/ipbx-solution/',
    badge: 'UPTO 60% OFF',
  },
  {
    title: 'CCTV Solution',
    desc: 'We fortify your digital and physical spaces with CCTV solutions.',
    to: '/cctv-solution/',
  },
  {
    title: 'Toll-Free 1800 XXX 8899 Number',
    desc: 'Unlock unparalleled customer engagement with our exclusive 1-800 toll-free number service.',
    to: '/1800-number/',
  },
  {
    title: 'Education ERP',
    desc: 'Connected systems for school, college and coaching institute operations.',
    to: '/education-erp/',
    badge: 'SCHOOLS · COLLEGES · COACHING',
  },
]

const PARTNER_LOGOS = [
  '2024-08-buy-time-attendance.png',
  '2024-08-buy-restaurant-billing-software.png',
  '2024-08-buy-pos-system.png',
  '2024-08-buy-Lenovo.png',
  '2024-08-buy-keyboard-mouse.png',
  '2024-08-buy-hp-laptop.png',
  '2024-08-buy-hikvision.png',
  '2024-08-buy-grandstream.png',
  '2024-08-buy-dlink.png',
  '2024-08-buy-dell-laptop.png',
  '2024-08-buy-cp-plus.png',
  '2024-08-buy-cctv.png',
  '2024-08-buy-belden.png',
  '2024-08-buy-avaya.png',
  '2024-08-buy-thermal-printer.png',
].map((file) => `/assets/${file}`)

const TESTIMONIALS = [
  {
    image:
      '/assets/2024-08-Prabhat-Tripathi.jpeg',
    name: 'Dr. Prabhat Tripathi',
    role: 'Chairman Tirupati College of Engineering',
    quote:
      'Myr Advance Solution has been exceptional in optimizing our **IT infrastructure.** Their responsive and knowledgeable team consistently goes above and beyond to meet our needs.',
  },
  {
    image:
      '/assets/2024-08-Abhishek-Khare.jpg',
    name: "Abhishek Khare",
    role: "Owner Khare's Kitchen Restaurant",
    quote:
      "**Professional CCTV Installation!** Myr Advance Solution's highly skilled team installed CCTV cameras in our premises with remarkable efficiency and professionalism. Now, we feel more secure and protected than ever.",
  },
  {
    image:
      '/assets/2024-08-male-icon.jpg',
    name: 'Mohammad Ali Khan',
    role: 'Loyaltech Management Services Pvt. Ltd.',
    quote:
      "Exceptional **Toll-Free Number Service!** We're delighted with the toll-free number service provided by Myr Advance Solution. It's easy to set up and manage, and our customers love the convenience.",
  },
  {
    image:
      '/assets/2024-08-female-icon.jpg',
    name: 'Riya Tiwari',
    role: 'Owner Fashion Store.',
    quote:
      "**Stunning Website Design !** Myr Advance Solution designed our website beautifully, reflecting our brand perfectly. It's user-friendly and has helped us attract more customers.",
  },
]

const FAQS = [
  {
    q: 'How to buy a product?',
    a: (
      <ul className="space-y-2 list-disc pl-5">
        <li>
          Browse products/services on our website. on{' '}
          <a href="/tech-store/" className="text-accent-600 underline">
            Shop Page
          </a>
          <br />
          Select the desired product.
        </li>
        <li>
          Add it to your cart.
          <br />
          Proceed to checkout.
        </li>
        <li>
          Enter billing and payment information.
          <br />
          Complete the purchase.
        </li>
        <li>
          Receive confirmation and delivery/access details.
          <br />
          <strong>
            If you need assistance, simply raise a query on our "Contact Us" page for a demo or any
            other support needed.
          </strong>
        </li>
      </ul>
    ),
  },
  {
    q: 'How to send a custom query?',
    a: (
      <div className="space-y-3">
        <p>
          <strong>Follow these steps:</strong>
        </p>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            Visit our website and navigate to the "
            <a href="/contact-us/" className="text-accent-600 underline">
              Contact Us
            </a>
            " page.
          </li>
          <li>
            Fill out the query form with your contact information, including your name, email
            address, and phone number.
          </li>
          <li>
            In the message section, provide details of your query or request, including any specific
            information or requirements you have.
          </li>
          <li>Click on the "Submit" or "Send" button to send your query to our team.</li>
          <li>You will receive a confirmation message acknowledging receipt of your query.</li>
          <li>
            Our team will review your query and respond to you promptly with the relevant
            information or assistance you need.
          </li>
        </ul>
        <p>
          <strong>
            If you have any urgent queries or prefer to contact us directly, you can also find our
            contact details, such as email address or phone number, on the "Contact Us" page for
            immediate assistance.
          </strong>
        </p>
      </div>
    ),
  },
  {
    q: 'How Does the Support Policy Work?',
    a: (
      <ul className="space-y-2 list-disc pl-5">
        <li>
          <strong>Scope</strong>: Covers product functionality, usage, and troubleshooting.
        </li>
        <li>
          <strong>Channels</strong>: Email, phone, or live chat during support hours.
        </li>
        <li>
          <strong>Response Time</strong>:
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Phone/live chat: Assistance within minutes.</li>
            <li>Email: Response within 24 hours.</li>
          </ul>
        </li>
        <li>
          <strong>Support Hours</strong>: Mon-Fri, 10 AM to 6 PM (excluding holidays).
        </li>
        <li>
          <strong>Ticketing System</strong>: Ensures efficient tracking and resolution.
        </li>
        <li>
          <strong>Severity Levels</strong>: Issues categorized for prioritized response.
        </li>
        <li>
          <strong>Escalation</strong>: Ensures timely resolution for critical issues.
        </li>
        <li>
          <strong>Updates</strong>: Regular updates and maintenance with advance notice.
        </li>
        <li>
          <strong>End of Support</strong>: Communicated in advance with upgrade options.
        </li>
        <li>
          <strong>Feedback</strong>: Welcome for continuous improvement.
        </li>
      </ul>
    ),
  },
  {
    q: 'How can send a refund request?',
    a: (
      <ul className="space-y-2 list-disc pl-5">
        <li>
          Go to the "
          <a
            href="/my-account/"
            className="text-accent-600 underline"
          >
            My Account
          </a>
          " section on our website and select <strong>"Orders."</strong>
        </li>
        <li>Locate the order for which you'd like to request a refund.</li>
        <li>
          Click on "Request Refund."
          <br />
          Select the appropriate reason for your refund request from the options provided.
        </li>
        <li>
          Once done, click "Submit" to send your request.
        </li>
      </ul>
    ),
  },
  {
    q: 'My account blocked what can I do?',
    a: (
      <ul className="space-y-2 list-disc pl-5">
        <li>If your account is blocked:</li>
        <li>
          Reach out to Customer <strong>Chat Support</strong> or email us at{' '}
          <a
            href="mailto:support@myradvancesolution.com"
            className="text-accent-600 underline"
          >
            support@myradvancesolution.com
          </a>
          <br />
          Provide the necessary information related to your account.
        </li>
        <li>Understand the reason for the block through the support team.</li>
        <li>
          Follow the instructions provided to resolve the issue.
          <br />
          Review our account policies for better understanding.
        </li>
        <li>Ask for clarification if anything is unclear.</li>
        <li>Please be patient while we work on resolving the issue.</li>
      </ul>
    ),
  },
]

/* ============================ COMPONENTS ============================ */

function Bold({ text }: { text: string }) {
  // Render text with **bold** markers
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-bold">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

function StatCounter({ target, suffix, comma }: { target: number; suffix: string; comma?: boolean }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    let step = 0
    const t = setInterval(() => {
      step++
      current = Math.min(target, increment * step)
      setVal(Math.floor(current))
      if (step >= steps) {
        setVal(target)
        clearInterval(t)
      }
    }, duration / steps)
    return () => clearInterval(t)
  }, [target])
  const display = comma ? val.toLocaleString('en-IN') : String(val)
  return (
    <span>
      {display}
      {suffix}
    </span>
  )
}


function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="Rated 5 out of 5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function HeroHeading() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText('IT Solutions, Products & Services')
      return
    }

    const phrase = HERO_PHRASES[phraseIndex]
    let timeout: ReturnType<typeof setTimeout> | undefined

    if (!deleting && text === phrase) {
      timeout = setTimeout(() => setDeleting(true), 1400)
    } else if (deleting && text.length === 0) {
      setDeleting(false)
      setPhraseIndex((current) => (current + 1) % HERO_PHRASES.length)
    } else {
      const nextText = deleting ? text.slice(0, -1) : phrase.slice(0, text.length + 1)
      timeout = setTimeout(() => setText(nextText), deleting ? 45 : 85)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [deleting, phraseIndex, text])

  return (
    <h1
      aria-label="IT Solutions, IT Products, IT Services"
      className="text-4xl font-bold leading-[1.1] text-black sm:text-5xl lg:text-6xl"
    >
      <span aria-hidden="true">{text}</span>
      <span aria-hidden="true" className="ml-1 inline-block h-[0.9em] border-r-2 border-accent-500 align-middle animate-pulse" />
    </h1>
  )
}

function AnimatedWebsitePreview() {
  return (
    <div className="dental-ad-shell" aria-hidden="true">
      <div className="dental-ad-screen">
        <div className="dental-ad-backdrop">
          <div className="dental-ad-sun" />
          <div className="dental-ad-horizon" />
        </div>
        <div className="dental-ad-content">
          <header className="dental-ad-nav">
            <span className="dental-ad-brand"><i aria-hidden="true">✣</i> MYR</span>
            <span className="dental-ad-nav-button">Become a Partner</span>
            <span className="dental-ad-menu">Menu <i aria-hidden="true"><b /><b /></i></span>
            <span className="dental-ad-nav-button dental-ad-reserve">Reserve Now</span>
          </header>
          <h2 className="dental-ad-title">
            <span className="dental-ad-title-line dental-ad-title-first">EVERY DETAIL</span>
            <span className="dental-ad-title-line dental-ad-title-second">CAPTURED</span>
          </h2>
          <div className="dental-ad-scanner" aria-hidden="true">
            <div className="dental-ad-scanner-art">
              <img src="/assets/dental-scanner-hero.svg" alt="" />
              <span className="dental-ad-scanner-glint" />
            </div>
          </div>
          <div className="dental-ad-specs">
            <div className="dental-ad-spec dental-ad-spec-one"><i /><span><strong>20MM</strong><small>Accuracy</small></span></div>
            <div className="dental-ad-spec dental-ad-spec-two"><i /><span><strong>45S</strong><small>Full-arch scan</small></span></div>
            <div className="dental-ad-spec dental-ad-spec-three"><i /><span><strong>COLOR</strong><small>Real-time images</small></span></div>
          </div>
          <div className="dental-ad-info">
            <p>Fast, precise intraoral scanning designed to make digital dentistry simpler, from chairside capture to treatment planning.</p>
            <span className="dental-ad-info-button">Reserve Now</span>
          </div>
        </div>
        <div className="dental-ad-endcard">
          <img src="/assets/2024-08-MYR-LOGO.png" alt="" />
        </div>
      </div>
      <div className="dental-ad-bezel" />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="section-dark relative overflow-hidden">
      <div className="container-page py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 sm:grid-cols-2 xl:grid-cols-[.812fr_1fr]">
          <div>
            <HeroHeading />
            <p className="mt-4 text-sm leading-relaxed text-ink-400 sm:text-base">
              <Bold text="At **MyR Advance Solution,** we specialize in delivering cutting-edge **IT solutions** to enhance business operations and support individuals. Our services include **PBX & IP-PBX systems, CCTV security, CRM development, website design, networking, cloud computing, mobile apps, data analytics, digital marketing, VoIP solutions,** and a comprehensive range of **IT hardware products.** With our expertise, we ensure seamless connectivity, security, and efficiency. Partner with us for reliable and innovative technology solutions tailored to your needs." />
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/tech-store/"
                className="btn btn-primary btn-lg"
              >
                Shop Now
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <AnimatedWebsitePreview />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="section-dark py-12 sm:py-16">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 text-center sm:grid-cols-4 sm:gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <p className="text-3xl font-bold font-display text-ink-950 sm:text-4xl lg:text-5xl">
                <StatCounter target={s.value} suffix={s.suffix} comma={s.comma} />
              </p>
              <span className="text-xs font-normal text-ink-400 sm:text-sm">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceScreen({ serviceIndex }: { serviceIndex: number }) {
  const service = SERVICES[serviceIndex]

  return (
    <div className="relative aspect-[4/3] w-full max-w-xl animate-[serviceScreenEnter_500ms_ease-out]">
      <div className="absolute inset-0 origin-center transform-gpu scale-100 rotate-0 opacity-100 blur-0 transition-all duration-[1400ms] ease-in-out">
      <div className="relative h-full rounded-[1.2rem] bg-slate-900 p-[0.8%] shadow-[0_40px_90px_-45px_rgba(15,23,42,.55)] ring-1 ring-slate-900/10">
        <div key={serviceIndex} className="relative h-full overflow-hidden rounded-[1rem] bg-white animate-[serviceScreenEnter_500ms_ease-out]">
          <div className="flex h-[7%] items-center gap-2 border-b border-slate-100 px-3">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="ml-2 flex-1 truncate rounded-md bg-slate-100 px-2 py-0.5 text-[8px] text-slate-500">myradvancesolution.com/{service.to.replace(/^\//, '')}</span>
          </div>
          <div className="relative h-[93%] overflow-hidden bg-slate-50 text-slate-800">
          {serviceIndex === 0 && (
            <div className="service-site-scroll absolute inset-0 bg-white p-[5%]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-[clamp(6px,.7vw,10px)] font-semibold"><span className="text-emerald-700">MYR<span className="text-slate-700"> Studio</span></span><span className="flex gap-3 text-slate-500"><span>Work</span><span>Services</span><span>About</span></span><span className="rounded bg-emerald-600 px-2 py-1 text-white">Start a project</span></div>
              <div className="grid grid-cols-2 items-center gap-3 py-[7%]"><div><span className="text-[clamp(6px,.65vw,9px)] font-semibold uppercase tracking-widest text-emerald-700">Digital experiences</span><h3 className="mt-2 text-[clamp(12px,1.8vw,25px)] font-bold leading-tight">Websites made for what comes next.</h3><p className="mt-2 text-[clamp(6px,.65vw,9px)] text-slate-500">Thoughtful design, clean code, and an experience customers love.</p><span className="mt-3 inline-block rounded bg-slate-900 px-3 py-1.5 text-[clamp(6px,.65vw,9px)] text-white">Explore our work</span></div><div className="aspect-[1.1] rounded-lg bg-gradient-to-br from-cyan-100 via-emerald-100 to-amber-100 p-[8%]"><div className="h-full rounded-md border-4 border-white bg-gradient-to-br from-emerald-300 to-sky-300 shadow-lg" /></div></div>
              <div className="grid grid-cols-3 gap-2">{['Strategy', 'Design', 'Development'].map((item) => <div key={item} className="rounded-md border border-slate-100 p-2 text-[clamp(6px,.7vw,9px)] font-semibold">{item}<div className="mt-2 h-1 rounded bg-slate-100" /></div>)}</div>
            </div>
          )}
          {serviceIndex === 1 && (
            <div className="absolute inset-0 bg-slate-100 p-[4%] text-[clamp(6px,.68vw,9px)]">
              <div className="flex h-full gap-[3%]"><aside className="w-[19%] rounded-md bg-slate-900 p-[4%] text-white"><b className="text-emerald-300">MYR CRM</b>{['Overview', 'Leads', 'Contacts', 'Tasks'].map((item, i) => <div key={item} className={`mt-4 rounded px-1.5 py-1 ${i === 1 ? 'bg-white/15 text-white' : 'text-slate-400'}`}>{item}</div>)}</aside><div className="flex-1"><div className="flex justify-between"><div><b className="text-[1.5em]">Sales overview</b><p className="mt-1 text-slate-400">Your pipeline at a glance</p></div><span className="rounded bg-emerald-600 px-2 py-1 text-white">+ Add lead</span></div><div className="mt-[4%] grid grid-cols-3 gap-2">{[['New leads', '128'], ['In progress', '46'], ['Converted', '32']].map(([label, value]) => <div key={label} className="rounded bg-white p-2 shadow-sm"><span className="text-slate-400">{label}</span><b className="mt-1 block text-[1.5em]">{value}</b></div>)}</div><div className="mt-[4%] rounded bg-white p-2 shadow-sm"><b>Recent leads</b>{['Olivia Chen', 'Daniel Rivera', 'Priya Sharma'].map((name, i) => <div key={name} className="mt-2 flex justify-between border-t border-slate-100 pt-1.5 text-slate-500"><span>{name}</span><span className="text-emerald-700">{['New', 'Contacted', 'Qualified'][i]}</span></div>)}</div></div></div>
            </div>
          )}
          {serviceIndex === 2 && (
            <div className="absolute inset-0 bg-white p-[5%] text-[clamp(6px,.7vw,9px)]"><div className="flex justify-between"><div><b className="text-[1.6em]">Campaign performance</b><p className="mt-1 text-slate-400">Reach, engagement, and growth</p></div><span className="h-fit rounded bg-violet-100 px-2 py-1 text-violet-700">Last 30 days</span></div><div className="mt-[4%] grid grid-cols-3 gap-2">{[['Reach', '248.6K', '+18.4%'], ['Engagement', '36.2K', '+12.8%'], ['Leads', '1,284', '+24.1%']].map(([label, value, change]) => <div key={label} className="rounded-lg border border-slate-100 p-2"><span className="text-slate-400">{label}</span><b className="mt-1 block text-[1.5em]">{value}</b><span className="text-emerald-600">↗ {change}</span></div>)}</div><div className="mt-[4%] flex h-[38%] items-end gap-[2%] rounded-lg bg-slate-50 px-[4%] pt-[3%]">{[32, 48, 39, 68, 56, 80, 61, 92, 71, 100, 79, 88, 65, 96].map((height, i) => <i key={i} className="flex-1 rounded-t bg-gradient-to-t from-violet-500 to-fuchsia-400" style={{ height: `${height}%` }} />)}</div></div>
          )}
          {serviceIndex === 3 && (
            <div className="absolute inset-0 bg-[#0d1728] p-[5%] text-[clamp(6px,.7vw,9px)] text-white"><div className="flex justify-between"><div><b className="text-[1.5em]">Network overview</b><p className="mt-1 text-slate-400">All systems operational</p></div><span className="rounded bg-emerald-400/15 px-2 py-1 text-emerald-300">● Live</span></div><div className="relative mt-[3%] flex h-[72%] items-center justify-center"><svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 170" preserveAspectRatio="none"><path d="M200 22L78 82M200 22L322 82M78 82L135 145M78 82L265 145M322 82L265 145" stroke="#27c8bb" strokeOpacity=".45" strokeWidth="2" /></svg>{[['Core Router', 'top-[2%] left-[43%]'], ['Office Wi-Fi', 'top-[38%] left-[7%]'], ['Cloud Backup', 'top-[38%] right-[7%]'], ['Workstations', 'bottom-[1%] left-[21%]'], ['Secure Access', 'bottom-[1%] right-[21%]']].map(([label, pos]) => <div key={label} className={`absolute ${pos} z-10 rounded-lg border border-cyan-400/30 bg-slate-800 px-2 py-2 text-center shadow-lg`}><span className="text-cyan-300">◆</span><b className="mt-1 block">{label}</b><small className="text-emerald-300">Connected</small></div>)}</div></div>
          )}
          {serviceIndex === 4 && (
            <div className="absolute inset-0 bg-[#0c1827] p-[5%] text-[clamp(6px,.7vw,9px)] text-white"><div className="flex justify-between"><div><b className="text-[1.5em]">MYRLINK IPBX</b><p className="mt-1 text-slate-400">Business phone system</p></div><span className="text-emerald-300">● Online</span></div><div className="mt-[4%] grid h-[67%] grid-cols-[1fr_.9fr] gap-[4%]"><div className="flex flex-col items-center justify-center rounded-xl bg-slate-800"><span className="text-slate-400">Active call</span><b className="mt-2 text-[2em]">+1 800 555 0142</b><span className="mt-1 text-emerald-300">00:04:28 · Connected</span><div className="mt-4 flex gap-3"><span className="rounded-full bg-slate-700 p-3">⌕</span><span className="rounded-full bg-rose-500 p-3">☎</span><span className="rounded-full bg-slate-700 p-3">⋯</span></div></div><div className="grid grid-cols-3 gap-1.5">{['1','2','3','4','5','6','7','8','9','*','0','#'].map((key) => <span key={key} className="flex items-center justify-center rounded bg-slate-800 text-[1.3em]">{key}</span>)}</div></div></div>
          )}
          {serviceIndex === 5 && (
            <div className="absolute inset-0 bg-slate-950 p-[4%] text-[clamp(6px,.7vw,9px)] text-white"><div className="mb-[3%] flex justify-between"><b className="text-[1.4em]">Security cameras</b><span className="text-rose-400">● LIVE</span></div><div className="grid h-[82%] grid-cols-2 grid-rows-2 gap-2">{['Main entrance', 'Reception', 'Warehouse', 'Parking area'].map((camera, i) => <div key={camera} className={`relative overflow-hidden rounded bg-gradient-to-br ${['from-slate-500 to-slate-800','from-emerald-900 to-slate-700','from-zinc-500 to-slate-900','from-blue-900 to-slate-700'][i]}`}><div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent 0 8px,#fff 9px 10px)' }} /><span className="absolute bottom-1 left-2 rounded bg-black/50 px-1.5 py-0.5">{camera}</span><span className="absolute right-2 top-2 text-rose-400">● REC</span></div>)}</div></div>
          )}
          {serviceIndex === 6 && (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-slate-900 p-[5%] text-[clamp(6px,.7vw,9px)] text-white"><div className="flex justify-between"><div><span className="font-bold text-cyan-300">MYR CONNECT</span><h3 className="mt-2 text-[1.7em] font-bold">One number. Every customer.</h3></div><span className="h-fit rounded-full bg-emerald-400/15 px-2 py-1 text-emerald-300">● Active</span></div><div className="mt-[5%] flex items-center justify-between gap-2"><div className="rounded-lg border border-cyan-400/30 bg-white/5 p-3 text-center"><span className="text-cyan-300">☎</span><b className="mt-1 block">1800 XXX 8899</b><small className="text-slate-400">Toll-free</small></div><div className="flex-1"><div className="h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400" /><p className="mt-1 text-center text-slate-400">Smart call routing</p></div><div className="space-y-2">{['Sales team', 'Support team', 'WhatsApp'].map((item) => <div key={item} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"><span className="mr-2 text-emerald-300">●</span>{item}</div>)}</div></div></div>
          )}
          {serviceIndex === 7 && (
            <div className="absolute inset-0 bg-[#f7faf9] p-[4%] text-[clamp(6px,.68vw,9px)]"><div className="flex h-full gap-[3%]"><aside className="w-[19%] rounded-lg bg-[#112d32] p-[3%] text-white"><b className="text-cyan-200">CAMPUS</b>{['Overview','Students','Academics','Fees','Reports'].map((item,i)=><div key={item} className={`mt-3 rounded px-1.5 py-1 ${i===0?'bg-white/15 text-white':'text-white/60'}`}>{item}</div>)}</aside><div className="flex-1"><div className="flex items-center justify-between"><div><b className="text-[1.5em]">Campus overview</b><p className="text-slate-500">Monday · Term 2</p></div><span className="rounded bg-cyan-800 px-2 py-1 text-white">All campuses</span></div><div className="mt-[3%] grid grid-cols-3 gap-2">{[['Students','2,486'],['Attendance','94.2%'],['Fee collection','82%']].map(([label,value])=><div key={label} className="rounded-lg bg-white p-2 shadow-sm"><span className="text-slate-500">{label}</span><b className="mt-1 block text-[1.5em]">{value}</b></div>)}</div><div className="mt-[3%] rounded-lg bg-white p-2 shadow-sm"><b>Today · Class 10 A</b>{[['Mathematics','09:00','Present'],['Physics','10:15','In progress'],['English','11:30','Upcoming']].map(([subject,time,status])=><div key={subject} className="mt-2 flex justify-between border-t border-slate-100 pt-1.5 text-slate-600"><span>{subject}</span><span>{time}</span><span className="text-emerald-700">{status}</span></div>)}</div></div></div></div>
          )}
        </div>
      </div>
      </div>
      </div>
      <style>{`
        @keyframes serviceScreenEnter { from { opacity: .2; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes serviceWebsiteScroll { 0%, 18% { transform: translateY(0); } 75%, 100% { transform: translateY(-22%); } }
        .service-site-scroll { animation: serviceWebsiteScroll 12s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) { .service-site-scroll { animation: none; } }
      `}</style>
    </div>
  )
}

function CoreServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-core-service]'))
    if (!items.length) return

    const updateActiveService = () => {
      const center = window.innerHeight / 2
      const nearestItem = items.reduce<{ item: HTMLElement; distance: number } | null>((nearest, item) => {
        const bounds = item.getBoundingClientRect()
        const distance = center < bounds.top ? bounds.top - center : center > bounds.bottom ? center - bounds.bottom : 0
        return !nearest || distance < nearest.distance ? { item, distance } : nearest
      }, null)
      if (nearestItem) setActiveIndex(Number(nearestItem.item.dataset.coreService))
    }

    updateActiveService()
    window.addEventListener('scroll', updateActiveService, { passive: true })
    window.addEventListener('resize', updateActiveService)
    return () => {
      window.removeEventListener('scroll', updateActiveService)
      window.removeEventListener('resize', updateActiveService)
    }
  }, [])

  return (
    <section
      className="relative bg-[#fbfaf8] py-16 text-ink-900 sm:py-20"
      style={{
        backgroundImage: [
          'radial-gradient(ellipse at 12% 24%, rgba(249, 115, 22, .075), transparent 28%)',
          'radial-gradient(ellipse at 84% 68%, rgba(251, 146, 60, .065), transparent 30%)',
          'linear-gradient(rgba(71, 85, 105, .045) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(71, 85, 105, .045) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: 'auto, auto, 36px 36px, 36px 36px',
      }}
    >
      <div className="container-page">
        <h2 className="text-center text-3xl font-bold text-ink-900 sm:text-4xl lg:text-[2.75rem]">
          Our <span className="text-accent-600">Core</span> Services
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base leading-relaxed text-ink-600">
          we aim to meet all your technological needs and drive your business towards success in the
          digital age.
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 lg:order-1">
            {SERVICES.map((service, index) => (
              <article
                key={service.title}
                data-core-service={index}
                className="flex min-h-[30vh] items-center py-3 sm:min-h-[34vh]"
              >
                <a
                  href={service.to}
                  className={cn(
                    'group relative block w-full rounded-[1.5rem] border bg-white p-6 transition duration-300 sm:p-8',
                    activeIndex === index
                      ? 'border-accent-400/60 shadow-xl shadow-accent-950/5'
                      : 'border-line hover:border-accent-400/40',
                  )}
                >
                  <span className="text-xs font-bold uppercase tracking-[.18em] text-accent-600">
                    0{index + 1} / 0{SERVICES.length}
                  </span>
                  {service.badge && (
                    <span className="absolute right-5 top-5 rounded-full bg-flame-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-flame-600">
                      {service.badge}
                    </span>
                  )}
                  <h3 className="mt-3 text-xl font-bold text-ink-950 transition group-hover:text-accent-600 sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500 sm:text-base">
                    {service.desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 transition group-hover:gap-2">
                    Explore service →
                  </span>
                  <div className="mt-5 lg:hidden">
                    <ServiceScreen serviceIndex={index} />
                  </div>
                </a>
              </article>
            ))}
          </div>

          <div className="hidden order-1 lg:order-2 lg:sticky lg:top-[14vh] lg:flex lg:h-[72vh] lg:self-start lg:items-center">
            <ServiceScreen serviceIndex={activeIndex} />
          </div>
        </div>
      </div>
    </section>
  )
}

function WhoWeAreSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="section-light py-12 sm:py-16">
      <div className="container-page">
        <div className="grid items-center gap-10 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/[0.04] sm:grid-cols-2 sm:p-10 lg:p-12">
          <motion.div
            initial={false}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <h2 className="text-3xl font-bold text-ink-950 sm:text-4xl lg:text-[2.75rem]">
              Who We Are
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-600">
              <Bold text="We are a team of **IT experts** committed to delivering **innovative technology solutions** for businesses and individuals. With years of experience in the IT industry, we provide **cutting-edge services** that enhance connectivity, security, and efficiency. Our goal is to offer **reliable and scalable IT solutions** that meet the evolving needs of modern businesses and general customers alike." />
            </p>
          </motion.div>
          <motion.div
            className="flex min-w-0 justify-center overflow-hidden sm:justify-end"
            initial={false}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/assets/2025-02-it-expert-2.png"
              alt=""
              loading="lazy"
              className="w-full max-w-md rounded-[2rem] object-contain"
            />
          </motion.div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/[0.04] sm:p-10 lg:p-12">
          <h2 className="text-3xl font-bold text-ink-950 sm:text-4xl lg:text-[2.75rem]">
            What We Can Do <span className="text-accent-600">for You</span>
          </h2>
          <div className="mt-5 grid items-start gap-6 lg:grid-cols-[1fr_auto] lg:gap-12">
            <div>
              <p className="text-base leading-relaxed text-ink-600">
              <Bold text="We offer a wide range of **IT solutions** tailored to improve your business operations and everyday technology needs." />{' '}
              <span className="text-black">
                From PBX &amp; IP-PBX systems, CCTV security, and networking to CRM development,
                website design, cloud computing, mobile apps, data analytics, digital marketing,
                VoIP solutions, and IT hardware products,{' '}
              </span>
              <Bold text="**we** provide seamless technology integration and support. Whether you need secure surveillance, efficient communication, or advanced digital solutions, we ensure top-quality services with expert guidance." />
              </p>
            </div>
            <div className="min-w-0 lg:max-w-sm">
              <div className="flex items-start gap-3 rounded-xl border border-line bg-ink-950/[0.04] p-4 text-sm text-ink-600">
              <span className="mt-0.5 text-accent-600">●</span>
              <p>
                <Bold text="Let MyR Advance Solution be your trusted IT partner, helping you stay ahead with reliable, high-performance, and future-ready technology." />
              </p>
            </div>
            <a
              href="/contact-us/"
              className="btn btn-primary btn-md mt-6 inline-block"
            >
              Contact Us Now
            </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MissionSection() {
  return (
    <section className="section-deep py-16 sm:py-20">
      <div className="container-page">
        <div className="grid items-center gap-10 sm:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-ink-900 sm:text-4xl lg:text-[2.75rem]">
              About our mission, values, and commitment
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-600">
              <Bold text="our mission is to **empower businesses and individuals** with **cutting-edge IT solutions** that enhance efficiency, security, and connectivity. We are guided by **integrity, professionalism, and a customer-centric approach**, ensuring reliable and high-quality technology services tailored to diverse needs." />
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-ink-700">
              <li>
                <strong>Our Mission:</strong> To provide innovative IT solutions that optimize
                operations, enhance digital presence, and improve overall business efficiency.
              </li>
              <li>
                <strong>Our Values:</strong> Built on trust, excellence, and customer-first service,
                we prioritize delivering reliable, scalable, and secure IT solutions with
                professionalism.
              </li>
              <li>
                <strong>Our Commitment:</strong> We are dedicated to offering top-tier IT services,
                ensuring seamless technology integration, strong security, and long-term client
                success.
              </li>
            </ul>
            <p className="mt-5 text-base leading-relaxed text-ink-600">
              <Bold text="Partner with us to experience expert IT support, innovative technology, and unparalleled customer service. Let us help you stay ahead with reliable and future-ready IT solutions." />
            </p>
            <a
              href="/about-us/"
              className="btn btn-light btn-md mt-6 inline-block"
            >
              Know More
            </a>
          </div>
          <div className="flex justify-center">
            <img
              src="/assets/2024-08-buy-toll-free-number-768x644-1.png"
              alt=""
              loading="lazy"
              className="w-full max-w-md rounded-[2rem] object-contain drop-shadow-[0_30px_60px_rgba(2,6,23,0.25)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const { add } = useCart()
  const navigate = useNavigate()
  const price2765 = useCatalogPrice(2765, 14499)
  const price2766 = useCatalogPrice(2766, 24499)
  const price2767 = useCatalogPrice(2767, 59499)
  const currentPrices: Record<number, number> = { 2765: price2765, 2766: price2766, 2767: price2767 }

  const plans = [
    {
      name: 'NewBiz Essentials',
      desc: 'Classic, timeless designs to establish a strong online presence.',
      price: '₹ 14,499',
      oldPrice: '₹ 30,000',
      save: 'Save 51%',
      renewal: '₹599.00/mo when you renew hosting*',
      features: [
        '1 Customized premium website',
        '50 GB SSD storage',
        '1 mailbox',
        'Mobile-Friendly & Responsive Design',
      ],
      extraTitle: 'What you get:',
      extras: ['1 Year Free Hosting', 'Unlimited SSL', 'Weekly backups'],
      productId: 2765,
      popular: false,
    },
    {
      name: 'RevampCommerce Lite',
      desc: 'Modern custom design + integrated e-commerce functionality.',
      price: '₹ 24,499',
      oldPrice: '₹ 60,999',
      save: 'Save 60%',
      renewal: '₹1649.00/mo when you renew hosting*',
      features: [
        '1 Customized premium website',
        '100 GB SSD storage',
        '100 mailboxes',
        'Mobile-Friendly & Responsive Design',
      ],
      extraTitle: 'All the benefits of NewBiz, plus:',
      extras: [
        'Domain included (₹749.00 value)',
        'Payment Gateway Integration',
        'E-Commerce Functionality',
      ],
      productId: 2766,
      popular: true,
    },
    {
      name: 'EliteCustom Suite',
      desc: 'Tailored designs, advanced features, and seamless functionality.',
      price: '₹ 59,499',
      oldPrice: '₹ 75,000',
      save: 'SAVE 20%',
      renewal: '₹2499.00/mo when you renew hosting*',
      features: [
        '1 Customized premium website',
        '200 GB NVMe storage',
        '100 mailboxes',
        'Mobile-Friendly & Responsive Design',
      ],
      extraTitle: 'All the goodness of Revamp, plus:',
      extras: [
        'Daily and on-demand backups',
        'Social accounts Integration',
        'Agent live chat & telephony',
        'AI ChatBot, Integration',
        'CDN included',
      ],
      productId: 2767,
      popular: false,
    },
  ]

  return (
    <section className="section-light py-16 sm:py-20" id="E-Commerce">
      <div className="container-page">
        <h4 className="text-center text-sm font-bold uppercase tracking-[0.18em] text-accent-600">
          Exclusive Website Pricing
        </h4>
        <h2 className="mt-2 text-center text-3xl font-bold text-ink-900 sm:text-4xl lg:text-[2.75rem]">
          Pick Your Perfect{' '}
          <span className="relative">
            Plan
            <span className="absolute -bottom-1 left-0 h-1 w-full rounded bg-accent-400/40" />
          </span>
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={cn(
                'relative rounded-[1.75rem] border bg-white p-6 sm:p-8 transition-all duration-300',
                p.popular
                  ? 'border-accent-400/50 bg-accent-400/[0.03] shadow-lg'
                  : 'border-line hover:border-accent-400/50 hover:bg-ink-950/[0.03]',
              )}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-400 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  MOST POPULAR
                </span>
              )}
              <span className="absolute -top-3 left-3 rounded-full bg-flame-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-flame-600">
                {p.save}
              </span>

              <h3 className="mt-3 text-xl font-bold text-ink-950">{p.name}</h3>
              <p className="mt-2 text-sm text-ink-400">{p.desc}</p>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-ink-950">{inr(currentPrices[p.productId], { paise: false })}</span>
                <span className="text-sm text-ink-500 line-through">{p.oldPrice}</span>
              </div>
              <p className="mt-1 text-center text-xs italic text-ink-500">{p.renewal}</p>

              <button
                type="button"
                onClick={() => {
                  const plan = WEBSITE_PLANS.find((item) => item.productId === p.productId)
                  if (!plan) return
                  add({ id: plan.productId, qty: 1, price: currentPrices[plan.productId], name: plan.name })
                  navigate('/checkout/')
                }}
                className="btn btn-primary btn-sm mt-4 block w-full text-center"
              >
                Choose plan
              </button>

              <ul className="mt-5 space-y-2 text-sm text-ink-400">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-accent-600">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <h5 className="mt-5 text-sm font-bold text-ink-950">{p.extraTitle}</h5>
              <ul className="mt-2 space-y-2 text-sm text-ink-400">
                {p.extras.map((e) => (
                  <li key={e} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-accent-600">✓</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/website-development/#viewallfeatures"
            className="btn btn-ghost-dark btn-md"
          >
            View all features ↗
          </a>
        </div>
      </div>
    </section>
  )
}

function GetInTouchSection() {
  return (
    <section className="section-dark py-16 sm:py-20 border-y border-line">
      <div className="container-page text-center">
        <h2 className="text-3xl font-bold text-ink-900 sm:text-4xl lg:text-[2.75rem]">
          GET IN TOUCH
        </h2>
        <h2 className="mt-4 max-w-2xl mx-auto text-2xl font-bold text-ink-900 sm:text-3xl">
          Connect with us for{' '}
          <span className="relative">
            custom plan pricing
            <span className="absolute -bottom-1 left-0 h-1 w-full rounded bg-accent-400/40" />
          </span>{' '}
          that fits your needs.
        </h2>
        <a
          href="/contact-us/"
          className="btn btn-primary btn-lg mt-6 inline-block"
        >
          Contact Us
        </a>
      </div>
    </section>
  )
}

function PartnersSection() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee) return

    let frame = 0
    const updateLogoScale = () => {
      const center = window.innerWidth / 2
      marquee.querySelectorAll<HTMLImageElement>('[data-partner-logo]').forEach((logo) => {
        const logoCenter = logo.getBoundingClientRect().left + logo.offsetWidth / 2
        const distance = Math.min(1, Math.abs(logoCenter - center) / (window.innerWidth / 2))
        const scale = 1.45 - distance * 0.7
        logo.style.setProperty('--partner-scale', scale.toFixed(3))
      })
      frame = window.requestAnimationFrame(updateLogoScale)
    }

    frame = window.requestAnimationFrame(updateLogoScale)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <section className="section-deep py-14 sm:py-16">
      <div className="container-page">
        <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-accent-600">
          Our Brand
        </p>
        <h2 className="mt-2 text-center text-3xl font-bold text-ink-900 sm:text-4xl lg:text-[2.75rem]">
          Partners
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-ink-600">
          &ldquo;Celebrating our esteemed collaborations with leading brands, we&rsquo;re dedicated
          to offering top-quality products and services. Partnering with the best ensures your
          satisfaction and success, as we prioritize excellence in every aspect of our
          offerings.&rdquo;
        </p>

        <div className="mt-10 overflow-hidden">
          <div
            ref={marqueeRef}
            className="partners-marquee-track flex items-center gap-8"
            style={{
              animation: 'partnersScroll 30s linear infinite',
              width: 'max-content',
            }}
          >
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={src.split('/').pop()?.replace('.png', '') || ''}
                loading="lazy"
                data-partner-logo
                className="h-16 w-16 shrink-0 rounded-full object-contain transition-transform duration-150 sm:h-20 sm:w-20"
                style={{ transform: 'scale(var(--partner-scale, 0.75))' }}
              />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes partnersScroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 1rem)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .partners-marquee-track { animation: none !important; }
        }
      `}</style>
    </section>
  )
}

function StoriesSection() {
  return (
    <section className="section-light py-16 sm:py-20">
      <div className="container-page">
        <h2 className="text-center text-3xl font-bold text-ink-950 sm:text-4xl lg:text-[2.75rem]">
          Featured <span className="text-accent-600">Client</span> Stories
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base leading-relaxed text-ink-600">
          Trusted by over 9,000+ customers worldwide, Myr Advance Solution is the leading choice for
          comprehensive IT services and infrastructure solutions.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-line bg-white p-6 transition hover:border-accent-400/50"
            >
              <img
                src={t.image}
                alt=""
                loading="lazy"
                className="mx-auto h-20 w-20 rounded-full object-cover"
              />
              <div className="mt-4 flex justify-center">
                <Stars />
              </div>
              <h4 className="mt-3 text-center text-base font-bold text-ink-950">{t.name}</h4>
              <p className="text-center text-sm text-ink-500">{t.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-400">
                <Bold text={t.quote} />
              </p>
              <a
                href="#"
                className="mt-4 inline-block text-sm font-medium text-accent-600 underline"
              >
                Read the full story
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="section-deep py-16 sm:py-20">
      <div className="container-page">
        <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-accent-600">
          FAQS
        </p>
        <h2 className="mt-2 text-center text-3xl font-bold text-ink-900 sm:text-4xl lg:text-[2.75rem]">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base leading-relaxed text-ink-600">
          Find answers to your questions about MYR Advance Solution&apos;s services, support, and
          expertise. Tailored IT solutions for your business needs.
        </p>

        <div className="mx-auto mt-10 max-w-3xl">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={cn(
                  'mb-3 overflow-hidden rounded-2xl border transition',
                  isOpen ? 'border-accent-400/45' : 'border-line bg-white',
                )}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className={cn(
                      'flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold sm:text-lg',
                      'text-ink-900',
                    )}
                  >
                    <span>{item.q}</span>
                    <span
                      className={cn(
                        'grid h-7 w-7 shrink-0 place-items-center rounded-full border text-sm transition-all duration-300',
                        isOpen
                          ? 'rotate-45 border-accent-400 bg-accent-400 text-white'
                          : 'border-ink-900/20 text-ink-600',
                      )}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-ink-600 sm:text-base">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function UnlockSection() {
  return (
    <section className="section-deep py-16 sm:py-20">
      <div className="container-page">
        <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-accent-600">
          FAQS
        </p>
        <h2 className="mt-2 text-center text-3xl font-bold text-ink-900 sm:text-4xl lg:text-[2.75rem]">
          Unlock the Ideal Solution for Your Needs - Reach Out for Assistance Today !
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-ink-600">
          &ldquo;Discover the <strong>Perfect IT Solution</strong> &ndash; Reach Out for Expert
          Assistance!
          <br />
          Explore our range of <strong>IT services</strong> and find the perfect solution tailored
          to your needs. With <strong>over 9000+ loyal customers who trust us</strong>, rest assured
          that we provide the <strong>best and most cost-effective solutions.</strong> Don&apos;t
          hesitate to reach out if you need any help. Our team of experts is here to assist you every
          step of the way!&rdquo;
        </p>
      </div>
    </section>
  )
}

function SupportBlockSection() {
  return (
    <section className="section-dark py-16 sm:py-20">
      <div className="container-page">
        <div className="grid items-center gap-10 rounded-[2rem] border border-line bg-ink-950/[0.04] p-6 sm:p-10 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-ink-950 sm:text-3xl">Here to help 24/7</h2>
            <div className="mt-5 space-y-4">
              <p className="flex gap-3 text-sm leading-relaxed text-ink-400 sm:text-base">
                <span className="mt-0.5 text-accent-600">✅</span>
                <span>
                  Access expert support whenever you need it via{' '}
                  <strong className="text-ink-950">live chat and email</strong>
                </span>
              </p>
              <p className="flex gap-3 text-sm leading-relaxed text-ink-400 sm:text-base">
                <span className="mt-0.5 text-accent-600">✅</span>
                <span>
                  Our specialists are adept at handling diverse needs, so you can be sure
                  communication and support will be{' '}
                  <strong className="text-ink-950">seamless.</strong>
                </span>
              </p>
              <p className="flex gap-3 text-sm leading-relaxed text-ink-400 sm:text-base">
                <span className="mt-0.5 text-accent-600">✅</span>
                <span>
                  Spend less time waiting, our speedy support team typically responds in under{' '}
                  <strong className="text-ink-950">a few minutes</strong>
                </span>
              </p>
            </div>
            <a
              href="https://1367.3cx.cloud/myradvancesolutionpr"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-md mt-7 inline-block"
            >
              👋 Got Questions? Chat Now!
            </a>
          </div>
          <div className="relative flex justify-center">
            <div
              className="absolute inset-0 rounded-full bg-accent-400/10 blur-3xl"
              aria-hidden
            />
            <img
              src="/assets/2024-08-Live-Support-Chat.png"
              alt=""
              loading="lazy"
              className="relative mx-auto max-h-72 w-auto object-contain drop-shadow-[0_24px_48px_rgba(45,226,230,0.25)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function BottomCtaBand() {
  return (
    <section className="section-dark border-y border-line py-14 sm:py-16">
      <div className="container-page flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="max-w-2xl text-2xl font-bold text-ink-900 sm:text-3xl">
            Save up to 60% on Website Development plan + get a free domain
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Try risk-free. 30-day money-back guarantee.
          </p>
        </div>
        <a href="#E-Commerce" className="btn btn-primary btn-lg shrink-0">
          Get Started
        </a>
      </div>
    </section>
  )
}

/* ============================ PAGE ============================ */

export function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <CoreServicesSection />
      <WhoWeAreSection />
      <MissionSection />
      <PricingSection />
      <GetInTouchSection />
      <PartnersSection />
      <StoriesSection />
      <FaqSection />
      <UnlockSection />
      <SupportBlockSection />
      <BottomCtaBand />
    </>
  )
}
