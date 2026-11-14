import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CHAT_SUPPORT, CHAT_SALES } from '@/components/layout/nav'
import { Reveal, SectionHeading, Stagger, StaggerItem, StatCounters, SupportBlock, type Stat } from '@/components/ui'

/* ------------------------------- source data ------------------------------ */


/* ============================ SEO META ============================ */
const PAGE_TITLE = "Network & IT Products | MYR Advance Solution";
const PAGE_DESCRIPTION = "MYR Advance Solution provides network products including routers, switches, firewalls and cabling solutions for businesses in the USA and India.";

/* ============================ DATA ============================ */
type Product = {
  name: string
  category: 'Routers' | 'Switches' | 'Firewalls' | 'Access Points' | 'Cabling' | 'Servers'
  tagline: string
  price: string
  original?: string
  specs: string[]
}

const PRODUCTS: Product[] = [
  { name: 'Enterprise Gateway Router', category: 'Routers', tagline: 'High-throughput routing for multi-site businesses.', price: '₹18,999', original: '₹24,999', specs: ['Up to 1 Gbps throughput', 'Dual WAN failover', 'VPN & QoS built-in', 'Central cloud management'] },
  { name: 'Wi-Fi 6 Business Router', category: 'Routers', tagline: 'Congestion-free wireless for dense environments.', price: '₹9,499', original: '₹12,999', specs: ['Wi-Fi 6 AX1800', '120+ concurrent clients', 'Guest portal & vouchers', 'App-based setup'] },
  { name: '24-Port Managed Switch', category: 'Switches', tagline: 'PoE+ aggregation with VLAN and redundancy.', price: '₹24,999', original: '₹31,999', specs: ['24× PoE+ (370 W budget)', '4× 10G SFP+ uplinks', 'LACP & ring redundancy', 'LLDP topology view'] },
  { name: '8-Port Gigabit Switch', category: 'Switches', tagline: 'Plug-and-play expansion for small offices.', price: '₹3,499', original: '₹4,499', specs: ['8× Gigabit ports', 'Silent fanless design', 'Energy Efficient Ethernet', 'Lifetime warranty'] },
  { name: 'Next-Gen Firewall Appliance', category: 'Firewalls', tagline: 'Layer-7 inspection with intrusion prevention.', price: '₹42,999', original: '₹54,999', specs: ['1 Gbps IPS throughput', 'Application & URL filtering', 'Site-to-site VPN', 'Real-time threat dashboards'] },
  { name: 'Unified Threat Gateway', category: 'Firewalls', tagline: 'All-in-one security for growing networks.', price: '₹28,999', specs: ['Firewall + IPS + AV', 'Dual-WAN load balancing', 'User-level bandwidth policy', 'Centralised reporting'] },
  { name: 'Wi-Fi 6 Access Point', category: 'Access Points', tagline: 'Seamless roaming with controllerless cloud.', price: '₹7,999', original: '₹9,999', specs: ['1.8 Gbps dual-band', 'Zero-touch cloud adoption', '802.11k/v/r roaming', 'PoE or local power'] },
  { name: 'Outdoor Mesh AP', category: 'Access Points', tagline: 'Weatherproof coverage for campuses & yards.', price: '₹11,499', specs: ['IP67 rated enclosure', 'Mesh backhaul up to 5 nodes', 'Point-to-point bridge mode', 'Omni directional antenna'] },
  { name: 'Cat6 Structured Cabling', category: 'Cabling', tagline: 'Certified copper infrastructure, end to end.', price: '₹45 / m', specs: ['Fluke-tested per drop', 'LSZH cable options', 'Rack & patch panel build', 'As-built documentation'] },
  { name: 'Fibre Backbone Deployment', category: 'Cabling', tagline: 'Dark-fibre and OS2 links between buildings.', price: 'Custom quote', specs: ['OS2/OM4 splicing & OTDR test', 'Weather-proof outdoor routing', 'Redundant ring topologies', '24/7 maintenance plans'] },
  { name: 'Rack-Mount Server', category: 'Servers', tagline: 'Virtualisation-ready compute for ERP & CRM.', price: '₹89,999', original: '₹1,05,999', specs: ['Xeon 8-core / 64 GB ECC', 'RAID 5/10 controller', 'Redundant PSU', '3-yr next-business-day support'] },
  { name: 'NAS Storage Array', category: 'Servers', tagline: 'Central backups with snapshot retention.', price: '₹54,999', specs: ['8-bay hot-swap', 'Up to 128 TB raw', 'Snapshots & replication', 'AD / LDAP integration'] },
]

const CATEGORIES = ['All', 'Routers', 'Switches', 'Firewalls', 'Access Points', 'Cabling', 'Servers'] as const

const STATS: Stat[] = [
  { label: 'Devices Deployed', value: 8500, suffix: '+' },
  { label: 'Networks Managed', value: 320, suffix: '+' },
  { label: 'Avg. Uptime', value: 99.9, suffix: '%', decimals: 1 },
  { label: 'Cities Served', value: 45, suffix: '+' },
]

const SERVICES = [
  { icon: '🧭', title: 'Network Design & Survey', body: 'Heat-mapped site surveys and topology designs sized for today and scale-ready for tomorrow.' },
  { icon: '🔧', title: 'Installation & Commissioning', body: 'Certified engineers rack, stack, cable and configure every device with documented handover.' },
  { icon: '📈', title: 'Managed Monitoring', body: '24/7 proactive monitoring with alerting, monthly health reports and capacity planning.' },
  { icon: '🔒', title: 'Security Hardening', body: 'Firewall rules, VPN segmentation, patching and periodic vulnerability assessments.' },
  { icon: '☁️', title: 'Cloud & Hybrid Networking', body: 'SD-WAN, site-to-site tunnels and hybrid cloud connectivity that just works.' },
  { icon: '🧾', title: 'AMC & Support', body: 'Annual maintenance contracts with guaranteed SLAs, spares and on-site response.' },
]

/* --------------------------------- sections -------------------------------- */

function HeroSection() {
  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState<number | null>(null)
  const nodes = [
    { x: 15, y: 20 }, { x: 50, y: 12 }, { x: 85, y: 24 },
    { x: 28, y: 58 }, { x: 68, y: 55 },
    { x: 18, y: 88 }, { x: 52, y: 86 }, { x: 86, y: 84 },
  ]
  return (
    <section className="section-dark grid-noise relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow">Network Products</p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
              Smart Networking Devices —{' '}
              <span className="text-gradient">Connect Smarter, Communicate Better</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
              Routers, switches, firewalls, access points, structured cabling and servers — genuine
              hardware, professional deployment and ongoing managed support.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#products" className="btn btn-primary btn-md">Browse Products ↓</a>
              <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">Talk to sales</a>
              <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">Live Chat</a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="relative">
          <div className="absolute inset-6 rounded-[2.5rem] bg-accent-400/12 blur-3xl" aria-hidden />
          {/* Animated network topology */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-line bg-white shadow-card"
            onMouseLeave={() => setHovered(null)}
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
              {nodes.map((n, i) =>
                nodes.slice(i + 1).map((m, j) => (
                  <motion.line
                    key={`${i}-${j}`}
                    x1={n.x} y1={n.y} x2={m.x} y2={m.y}
                    stroke={hovered === i || hovered === i + j + 1 ? 'rgb(232 117 42)' : 'rgb(5 12 95 / 0.12)'}
                    strokeWidth="0.4"
                    initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: hovered === i || hovered === i + j + 1 ? 0.9 : 0.35 }}
                    transition={{ duration: 0.9, delay: 0.2 + (i + j) * 0.05 }}
                    strokeDasharray={hovered === i || hovered === i + j + 1 ? '2 1.5' : undefined}
                  />
                )),
              )}
              {nodes.map((n, i) => (
                <motion.g
                  key={i}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 260, damping: 18 }}
                  onMouseEnter={() => setHovered(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle cx={n.x} cy={n.y} r={hovered === i ? 4.4 : 3.4} fill={hovered === i ? 'rgb(232 117 42)' : 'rgb(5 12 95)'} />
                  <circle cx={n.x} cy={n.y} r={hovered === i ? 6.6 : 5.4} fill="none" stroke={hovered === i ? 'rgb(232 117 42 / 0.4)' : 'rgb(5 12 95 / 0.15)'} strokeWidth="0.6" />
                  {!reduceMotion && (
                    <motion.circle
                      cx={n.x} cy={n.y} r="3.4" fill="none"
                      stroke="rgb(232 117 42 / 0.5)" strokeWidth="0.5"
                      animate={{ r: [3.4, 7], opacity: [0.6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
                    />
                  )}
                </motion.g>
              ))}
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-line bg-white/90 px-5 py-3 text-[10px] text-ink-400 backdrop-blur">
              <span>{hovered !== null ? `Node ${hovered + 1} · link active` : 'Hover a node to inspect links'}</span>
              <span className="font-bold text-emerald-600">● All links healthy</span>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="section-dark border-y border-line py-12">
      <div className="container-page">
        <StatCounters stats={STATS} tone="light" />
      </div>
    </section>
  )
}

function ProductsSection() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('All')
  const reduceMotion = useReducedMotion()
  const shown = filter === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)

  return (
    <section id="products" className="section-deep scroll-mt-20 py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Networking devices & infrastructure" sub="Genuine hardware with warranty, configured and supported by MYR engineers." />

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`min-h-10 rounded-full border px-4 text-xs font-semibold transition sm:text-sm ${
                filter === c
                  ? 'border-flame-500 bg-flame-500 text-white shadow-lg shadow-flame-500/15'
                  : 'border-line bg-white text-ink-500 hover:border-flame-400/50 hover:text-flame-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <motion.article
              key={p.name}
              layout
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
              className="group flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-flame-400/50 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-full bg-paper px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-400">
                  {p.category}
                </span>
                {p.original && (
                  <span className="rounded-full bg-flame-500/10 px-2.5 py-1 text-[10px] font-bold text-flame-600">
                    Sale
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-base font-bold text-ink-950">{p.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{p.tagline}</p>
              <ul className="mt-4 flex-1 space-y-1.5">
                {p.specs.map((s) => (
                  <li key={s} className="flex gap-2 text-xs text-ink-500">
                    <span className="text-flame-600">✓</span>{s}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-baseline gap-2 border-t border-line pt-4">
                {p.original && <span className="text-xs text-ink-400 line-through">{p.original}</span>}
                <span className="text-lg font-bold text-flame-600">{p.price}{p.original !== p.price && (<span className="ml-2 text-[8px] font-semibold text-flame-600">Best Deal</span>)}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to="/contact-us/?interest=network-products#contact-form" className="btn btn-primary btn-sm flex-1 justify-center">
                  Request Quote
                </Link>
                <Link to="/cart/" className="btn btn-ghost-dark btn-sm flex-1 justify-center">
                  Add to cart
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="More than hardware — end-to-end network services" />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <StaggerItem key={s.title} className="card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-flame-500/10 text-2xl transition group-hover:bg-flame-500/20" aria-hidden>
                {s.icon}
              </span>
              <h3 className="text-base font-bold text-ink-950">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{s.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="section-deep py-16">
      <div className="container-page">
        <Reveal className="rounded-[2rem] border border-line bg-white p-8 text-center shadow-card sm:p-12">
          <p className="eyebrow">Connect smarter</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold text-ink-950 sm:text-3xl">
            Upgrade to IP Telephony & modern networking today
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/ip-pbx/" className="btn btn-primary btn-md">Explore IP PBX ↗</Link>
            <Link to="/cctv-solutions/" className="btn btn-ghost-dark btn-md">CCTV Solutions ↗</Link>
            <Link to="/contact-us/" className="btn btn-ghost-dark btn-md">Contact Us</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SupportSection() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SupportBlock
            bullets={[
              <>Access expert support whenever you need it via live chat and email</>,
              <>Our specialists are adept at handling diverse needs, so you can be sure communication and support will be seamless.</>,
              <>Spend less time waiting, our speedy support team typically responds in under 2 minutes</>,
            ]}
            ctaLabel="Still Have Questions ? Live Chat Now"
            image="/assets/2024-09-male-network-support-e1726830127733.png"
          />
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export function NetworkProductsPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProductsSection />
      <ServicesSection />
      <CtaSection />
      <SupportSection />
    </>
  )
}
