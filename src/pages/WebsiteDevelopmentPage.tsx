import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CHAT_SALES, CHAT_SUPPORT } from '@/components/layout/nav'
import { FaqAccordion, Reveal, SectionHeading, SupportBlock } from '@/components/ui'
import { RichText } from '@/components/ui/RichText'
import { PricingPlans } from '@/components/sections/PricingPlans'
import { WEBSITE_PLANS } from '@/content/plans'
import { useCart } from '@/lib/stores'
import { useCatalogPrice } from '@/lib/useCatalogPrice'
import { inr } from '@/lib/format'

/* ------------------------------- source data ------------------------------ */


/* ============================ SEO META ============================ */
const PAGE_TITLE = "Website Development Company | MYR Advance Solution";
const PAGE_DESCRIPTION = "MYR Advance Solution crafts sleek, user-friendly websites and web applications tailored for business success. Custom design, development, and launch.";

/* ============================ DATA ============================ */
const HERO_RATINGS = [
  { name: 'Trustpilot', score: '4.5', reviews: '40,850', label: 'TrustScroe' },
  { name: 'Google', score: '5/5', reviews: '1,239', label: 'Rating' },
  { name: 'Hostadvice', score: '4.2/5', reviews: '2,347', label: 'Rating' },
  { name: 'Wpbegginer', score: '4.7', reviews: '773', label: 'Rating' },
]

const STORY_CARDS = [
  {
    name: 'Amit & Neha Khanna',
    role: 'Co-Founders of UrbanCraft Designs',
    quote:
      '"As business partners and a couple, we had a clear vision for our brand, and this team brought it to life flawlessly! Our website is not only visually appealing but also user-friendly and optimized for sales. It has truly elevated our online presence and business growth!"',
  },
  {
    name: 'Rajesh Verma',
    role: ', Marketing Head at Digital Nexus',
    quote:
      '"The team did an outstanding job revamping our website! The new design is sleek, fast, and user-friendly. We\'ve seen a significant increase in traffic and customer engagement. Highly recommended!"',
  },
  {
    name: 'Priya Sharma',
    role: 'Founder of Ethnic Elegance (E-commerce Business)',
    quote:
      '"Absolutely thrilled with our new e-commerce website! The design perfectly showcases our products, and the seamless shopping experience has significantly boosted our sales. Their expertise and attention to detail made all the difference!"',
  },
]

const TESTIMONIALS = [
  {
    name: 'Rohan Malhotra',
    role: 'Founder of TechSphere Solutions',
    image: '/assets/2025-02-7.jpg',
    quote:
      '“MyR Advance Solution took our website to the next level! The design is sleek, the performance is top-notch, and our user engagement has improved significantly. Highly professional and reliable service!”',
  },
  {
    name: 'Ananya Desai',
    role: 'Owner of Elite Fashion Hub',
    image: '/assets/2025-02-8.jpg',
    quote:
      '“Absolutely impressed with the expertise of MyR Advance Solution! They created a visually stunning and easy-to-navigate website that has boosted our online sales. Truly a game-changer for our business!”',
  },
  {
    name: 'Vikram Singh',
    role: 'CEO of SwiftLogistics',
    image: '/assets/2025-02-6.jpg',
    quote:
      '“The team at MyR Advance Solution delivered exactly what we needed—a fast, efficient, and mobile-friendly website. Their dedication and attention to detail made all the difference. Highly recommended!”',
  },
]

const TRUSTPILOT_QUOTES = [
  '“Incredible service! The team at MyR Advance Solution transformed our website into a high-performing, user-friendly platform. Highly recommended for anyone serious about online success!”',
  '“MyR Advance Solution experts delivered a flawless website with stunning design and smooth functionality. Their professionalism and expertise made the entire process effortless!”',
  '“MyR Advance Solution exceeded our expectations! Their attention to detail and innovative approach helped us create a website that truly stands out. Couldn’t be happier with the results!”',
]

const INCLUDED = [
  {
    title: 'Website Development',
    body: 'Choose a plan, make payment, and let our experts build your site—fast and hassle-free!',
  },
  {
    title: 'Total security',
    body: 'Relax, your websites and visitors are protected by the latest security software.',
  },
  {
    title: '99.9% uptime. Guaranteed',
    body: 'Our 99.9% uptime guarantee means your website is always available.',
  },
  {
    title: 'A single, simple dashboard',
    body: 'Designed to be easy-to-use for beginners and professionals alike, you can see at a glance how your site is performing.',
  },
  {
    title: '24/7 customer support',
    body: 'Access expert support whenever you need it. We typically respond in under 2 minutes and our team speak 10+ languages.',
  },
]

const ENJOY_FREE = [
  'Unlimited SSL security certificates',
  'Fast performance hosting',
  'Email addresses',
  'Free domain (with annual plans)',
  'Automatic back-ups and updates',
  'Unlimited web traffic',
]

const BUILDER_TEMPLATES = [
  { name: 'Modern Studio', style: 'Clean', color: '#e85d3f', font: 'Modern' },
  { name: 'Luxe Editorial', style: 'Elegant', color: '#a77a4e', font: 'Editorial' },
  { name: 'Bold Impact', style: 'Bold', color: '#6759e8', font: 'Impact' },
  { name: 'Fresh Minimal', style: 'Minimal', color: '#219b83', font: 'Minimal' },
  { name: 'Urban Grid', style: 'Urban', color: '#26384a', font: 'Urban' },
  { name: 'Warm & Human', style: 'Friendly', color: '#e18b39', font: 'Warm' },
  { name: 'Digital Edge', style: 'Tech', color: '#3c69dc', font: 'Digital' },
  { name: 'Natural Balance', style: 'Organic', color: '#54764a', font: 'Natural' },
]

const BUILDER_BUSINESSES = [
  { name: 'Cafe & Restaurant', headline: 'Gather around something wonderful.', sub: 'Seasonal plates, slow mornings, and warm evenings made to be shared.', action: 'Reserve your table', icon: '✦' },
  { name: 'Gym & Fitness', headline: 'Train with purpose. Get stronger.', sub: 'Expert coaching, energising classes, and a community that moves with you.', action: 'Join the gym', icon: '↗' },
  { name: 'Hospital & Clinic', headline: 'Expert care. Close to home.', sub: 'Compassionate specialists, modern care, and a healthier future for every family.', action: 'Book an appointment', icon: '✚' },
  { name: 'Fashion & Boutique', headline: 'Find your own kind of style.', sub: 'Curated pieces made for the way you want to show up.', action: 'Shop the collection', icon: '✦' },
  { name: 'Real Estate', headline: 'Find a place to call yours.', sub: 'Discover considered homes and spaces in the neighbourhoods you love.', action: 'View properties', icon: '⌂' },
  { name: 'Beauty & Salon', headline: 'A moment that is all yours.', sub: 'Feel-good treatments, thoughtful details, and a little time to reset.', action: 'Book your visit', icon: '✿' },
  { name: 'Education', headline: 'Curiosity opens every door.', sub: 'Build new skills with practical lessons and inspiring teachers.', action: 'Discover courses', icon: '⌘' },
  { name: 'Professional Services', headline: 'Good advice. Clear direction.', sub: 'A trusted partner to help you move your business forward.', action: 'Talk to our team', icon: '↗' },
]

function LiveBuilder() {
  const [open, setOpen] = useState(false)
  const [template, setTemplate] = useState(0)
  const [business, setBusiness] = useState(0)
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const theme = BUILDER_TEMPLATES[template]
  const idea = BUILDER_BUSINESSES[business]
  const openBuilder = () => {
    setOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#f7f8fc] py-14 sm:py-20">
        <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="container-page">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .65, ease: 'easeOut' }} className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_30px_90px_-40px_rgba(15,23,42,.38)] backdrop-blur">
            <div className="grid items-center gap-8 p-6 sm:p-9 lg:grid-cols-[.9fr_1.1fr] lg:gap-12 lg:p-12">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-orange-700"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-70 motion-reduce:animate-none"/><span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"/></span>Your idea, brought to life</p>
                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-[2.8rem]">See your website before it’s even built.</h2>
                <p className="mt-4 max-w-lg leading-relaxed text-slate-600">Choose a business and a design direction. Watch your own website take shape in a live, interactive preview.</p>
                <div className="mt-6 flex flex-wrap items-center gap-3"><button type="button" onClick={openBuilder} className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-slate-950 px-5 font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Build your website <span className="transition-transform group-hover:translate-x-1" aria-hidden>↗</span>
                </button>
                <span className="text-xs text-slate-500">No signup needed</span></div>
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-600"><span><b className="text-slate-950">08</b> curated styles</span><span><b className="text-slate-950">08</b> business types</span><span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>Instant live preview</span></div>
              </div>
              <motion.button type="button" onClick={openBuilder} aria-label="Open the live website builder" className="group relative min-w-0 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 p-2.5 text-left shadow-2xl shadow-slate-900/20 sm:p-3" whileHover={{ y: -4, rotate: -.25 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
                <div className="mb-2 flex items-center gap-1.5 px-1"><i className="h-2 w-2 rounded-full bg-red-400"/><i className="h-2 w-2 rounded-full bg-amber-300"/><i className="h-2 w-2 rounded-full bg-emerald-400"/><span className="ml-2 flex-1 rounded-md bg-white/10 px-3 py-1 text-[9px] text-white/60">mybusiness.com</span><span className="px-1 text-[9px] font-semibold text-white/60">•••</span></div>
                <AnimatePresence mode="wait"><motion.div key={`${template}-${business}`} initial={{ opacity: 0, scale: .97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .98, y: -5 }} transition={{ duration: .32 }} className="relative grid min-h-[230px] overflow-hidden rounded-xl bg-white sm:min-h-[300px] sm:grid-cols-[.9fr_1.1fr]">
                  <div className="relative z-10 flex flex-col justify-center p-5 sm:p-7"><span className="text-[9px] font-bold uppercase tracking-[.18em]" style={{ color: theme.color }}>{idea.name}</span><strong className="mt-2 text-xl font-extrabold leading-tight text-slate-950 sm:text-2xl">{idea.headline}</strong><span className="mt-2 text-[10px] leading-relaxed text-slate-600 sm:text-xs">{idea.sub}</span><span className="mt-4 w-fit rounded-full px-3 py-2 text-[9px] font-bold text-white shadow-md" style={{ backgroundColor: theme.color }}>{idea.action} →</span></div>
                  <div className="relative min-h-36 overflow-hidden sm:min-h-full"><div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${theme.color}20, #fff 42%, ${theme.color}35)` }}/><div className="absolute -right-10 -top-12 h-48 w-48 rounded-full opacity-70 blur-2xl" style={{ backgroundColor: `${theme.color}35` }}/><div className="absolute bottom-4 left-4 right-4 top-4 rounded-xl border border-white/80 bg-white/45 shadow-inner backdrop-blur-sm"/><span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.7rem] text-4xl text-white shadow-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" style={{ background: `linear-gradient(145deg, ${theme.color}, ${theme.color}bb)` }}>{idea.icon}</span><i className="absolute left-[18%] top-[22%] h-3 w-3 rounded-full bg-white shadow-lg"/><i className="absolute bottom-[24%] right-[18%] h-5 w-5 rounded-full border-2 border-white/90"/><span className="absolute bottom-3 right-3 rounded-full border border-white/60 bg-white/85 px-2.5 py-1.5 text-[9px] font-bold text-slate-800 shadow-lg">{theme.name}</span></div>
                  <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: theme.color }}/>
                </motion.div></AnimatePresence>
                <div className="flex items-center justify-between gap-2 px-1 pt-2 text-[9px] text-white/60"><span className="truncate">Preview adapts as you create</span><span className="inline-flex shrink-0 items-center gap-1.5"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none"/>LIVE</span></div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {open && <motion.div className="fixed inset-0 z-[100] overflow-y-auto bg-[#f3f5fa] text-slate-900" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex min-h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <button type="button" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"><span aria-hidden>←</span> <span className="hidden sm:inline">Back to website development</span><span className="sm:hidden">Back</span></button>
              <div className="hidden items-center gap-2 text-sm font-bold sm:flex"><span className="grid h-8 w-8 place-items-center rounded-lg bg-orange-500 text-white">M</span> MYR Website Studio</div>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"><i className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"/>Live preview</span>
            </div>
          </header>
          <section aria-label="Live website builder dashboard" className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[.18em] text-orange-600">Website concept builder</p><h1 className="mt-2 text-2xl font-bold sm:text-3xl">Make it look like your business.</h1><p className="mt-2 text-sm text-slate-600">Pick a template and business type to update your website preview instantly.</p></div>
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
              <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5"><div className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-red-300"/><i className="h-2.5 w-2.5 rounded-full bg-amber-300"/><i className="h-2.5 w-2.5 rounded-full bg-emerald-300"/><span className="ml-2 truncate rounded-md bg-slate-100 px-3 py-1.5 text-xs text-slate-500">yourbusiness.com</span></div><div className="flex rounded-lg bg-slate-100 p-1"><button type="button" onClick={() => setDevice('desktop')} aria-pressed={device === 'desktop'} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${device === 'desktop' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Desktop</button><button type="button" onClick={() => setDevice('mobile')} aria-pressed={device === 'mobile'} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${device === 'mobile' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Mobile</button></div></div>
                <div className="overflow-auto bg-[radial-gradient(ellipse_at_top,#fff_0%,#e9edf5_75%)] p-3 sm:p-6"><motion.div layout className={`mx-auto overflow-hidden rounded-xl bg-white shadow-[0_12px_40px_-20px_rgba(15,23,42,.4)] transition-all ${device === 'mobile' ? 'max-w-[390px]' : 'w-full'}`}>
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-8"><div className="flex items-center gap-2 text-sm font-extrabold tracking-tight"><span className="grid h-8 w-8 place-items-center rounded-xl text-white" style={{ backgroundColor: theme.color }}>{idea.icon}</span><span>{idea.name.split(' ')[0]}<span style={{ color: theme.color }}>Co.</span></span></div><nav className="hidden gap-5 text-[10px] font-semibold text-slate-500 sm:flex"><span>Home</span><span>About</span><span>Services</span><span>Contact</span></nav><button type="button" className="rounded-full px-3 py-2 text-[10px] font-bold text-white sm:px-4" style={{ backgroundColor: theme.color }}>{idea.action}</button></div>
                  <AnimatePresence mode="wait"><motion.div key={`${template}-${business}-${device}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .35 }}>
                    {business === 0 ? <RestaurantConcept theme={theme} device={device} /> : business === 1 ? <GymConcept theme={theme} device={device} /> : business === 2 ? <HospitalConcept theme={theme} device={device} /> : business >= 3 ? <IndustryConcept businessIndex={business} theme={theme} device={device} /> : <>
                    <div className={`relative isolate overflow-hidden ${device === 'mobile' ? 'min-h-[520px]' : 'min-h-[420px] sm:min-h-[510px]'}`}><div className="absolute inset-0 -z-20" style={{ background: `radial-gradient(ellipse at 80% 50%, ${theme.color}30, transparent 44%), linear-gradient(125deg, #fff9f5, #fff 52%, ${theme.color}18)` }}/><div className="absolute -right-20 top-0 -z-10 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: theme.color }}/><div className={`grid items-center gap-2 px-6 py-9 sm:px-12 ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-[1fr_.9fr]'}`}><div className="relative z-10"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.16em] text-slate-600 shadow-sm"><i className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.color }}/>{idea.name} · Since 2018</span><h2 className={`mt-5 max-w-xl font-black leading-[1.03] tracking-tight text-slate-950 ${device === 'mobile' ? 'text-4xl' : 'text-4xl sm:text-5xl lg:text-6xl'}`}>{idea.headline}</h2><p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">{idea.sub}</p><button type="button" className="mt-6 rounded-full px-5 py-3 text-xs font-bold text-white shadow-lg transition hover:-translate-y-0.5" style={{ backgroundColor: theme.color }}>{idea.action} <span className="ml-2">→</span></button><div className="mt-6 flex items-center gap-3 text-[10px] font-semibold text-slate-600"><span className="flex -space-x-2"><i className="h-6 w-6 rounded-full border-2 border-white bg-amber-300"/><i className="h-6 w-6 rounded-full border-2 border-white bg-rose-300"/><i className="h-6 w-6 rounded-full border-2 border-white bg-emerald-300"/></span> Loved by your local community</div></div><div className={`relative grid place-items-center overflow-hidden rounded-[2rem] border border-white/80 bg-white/50 shadow-xl shadow-slate-900/10 backdrop-blur-sm ${device === 'mobile' ? 'mt-5 min-h-48' : 'min-h-60'}`}><div className="absolute inset-0" style={{ background: `radial-gradient(circle at 45% 42%, ${theme.color}24, transparent 54%)` }}/><div className="absolute h-36 w-36 rounded-full opacity-50 blur-3xl" style={{ backgroundColor: theme.color }}/><motion.div animate={{ y: [0, -8, 0], rotate: [0, 1.5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="relative grid h-32 w-32 place-items-center rounded-[2.4rem] border border-white/70 text-6xl text-white shadow-2xl sm:h-40 sm:w-40 sm:rounded-[3rem] sm:text-7xl" style={{ background: `linear-gradient(145deg, ${theme.color}, ${theme.color}bb)` }}>{idea.icon}</motion.div><span className="absolute bottom-4 right-4 rounded-xl bg-white/90 px-3 py-2 text-[10px] font-bold shadow-md" style={{ color: theme.color }}>Made with care ✦</span></div></div></div>
                    <div className="grid gap-3 bg-white px-5 py-7 sm:grid-cols-3 sm:px-8 sm:py-9">{['Thoughtfully designed', 'Made for your community', 'Simple to get started'].map((label, i) => <motion.div key={label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"><span className="text-lg" style={{ color: theme.color }}>{['✦', '◎', '↗'][i]}</span><p className="mt-2 text-xs font-bold">{label}</p><p className="mt-1 text-[10px] leading-relaxed text-slate-500">A polished experience that helps your business stand out online.</p></motion.div>)}</div>
                    <div className="relative isolate overflow-hidden bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-14"><div className="absolute inset-0 -z-10 opacity-30" style={{ background: `radial-gradient(ellipse at 80% 40%, ${theme.color}, transparent 55%)` }}/><div className="relative grid items-center gap-6 sm:grid-cols-[1fr_auto]"><div><p className="text-[9px] font-bold uppercase tracking-[.2em]" style={{ color: theme.color }}>A better way to {idea.name.split(' ')[0].toLowerCase()}</p><h3 className="mt-2 max-w-lg text-2xl font-bold sm:text-3xl">A great first impression starts here.</h3><p className="mt-2 max-w-lg text-xs leading-relaxed text-white/70">Build trust, share what makes you different, and make it easy for customers to take the next step.</p></div><span className="grid h-16 w-16 place-items-center rounded-2xl text-3xl text-white shadow-xl" style={{ backgroundColor: theme.color }}>{idea.icon}</span></div></div>
                    </>}
                  </motion.div></AnimatePresence>
                </motion.div></div>
              </section>
              <aside className="space-y-5">
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-center justify-between"><h2 className="font-bold">1. Choose a template</h2><span className="text-xs text-slate-500">{template + 1} / 8</span></div><p className="mt-1 text-xs text-slate-500">Select a visual style for your website.</p><div className="mt-4 grid grid-cols-2 gap-2">{BUILDER_TEMPLATES.map((item, i) => <motion.button key={item.name} type="button" aria-pressed={template === i} onClick={() => setTemplate(i)} whileHover={{ y: -2 }} whileTap={{ scale: .98 }} className={`group relative overflow-hidden rounded-xl border p-2.5 text-left transition hover:border-slate-400 ${template === i ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' : 'border-slate-200'}`}><span className="relative mb-2 flex h-16 items-end overflow-hidden rounded-lg" style={{ background: `linear-gradient(135deg, ${item.color}28, #fff 80%)` }}><span className="absolute inset-x-2 top-2 h-2 rounded-full bg-white/90"/><span className="absolute bottom-2 left-2 h-6 w-[42%] rounded-md" style={{ backgroundColor: `${item.color}aa` }}/><span className="absolute bottom-2 right-2 h-8 w-[32%] rounded-full border-2 border-white/80" style={{ backgroundColor: item.color }}/></span><span className="block text-xs font-bold">{item.name}</span><span className="mt-0.5 block text-[10px] text-slate-500">{item.style}</span>{template === i && <motion.span layoutId="selectedTemplate" className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-bold text-emerald-600 shadow">✓</motion.span>}</motion.button>)}</div></section>
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-center justify-between"><h2 className="font-bold">2. Choose your business</h2><span className="text-xs text-slate-500">{business + 1} / 8</span></div><p className="mt-1 text-xs text-slate-500">We’ll tailor the content to your industry.</p><div className="mt-4 grid grid-cols-2 gap-2">{BUILDER_BUSINESSES.map((item, i) => <motion.button key={item.name} type="button" aria-pressed={business === i} onClick={() => setBusiness(i)} whileHover={{ y: -1 }} whileTap={{ scale: .98 }} className={`flex min-h-11 items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[11px] font-semibold transition hover:border-slate-400 ${business === i ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' : 'border-slate-200'}`}><span className="text-base" aria-hidden>{item.icon}</span>{item.name}</motion.button>)}</div></section>
                <div className="rounded-2xl bg-slate-900 p-5 text-white"><p className="text-sm font-bold">Like what you see?</p><p className="mt-1 text-xs leading-relaxed text-slate-300">Our team can turn this concept into a complete website for your business.</p><a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-white px-4 text-xs font-bold text-slate-900 hover:bg-orange-100">Discuss your website <span className="ml-2">↗</span></a></div>
              </aside>
            </div>
          </section>
        </motion.div>}
      </AnimatePresence>
    </>
  )
}

/** Compare table rows — ✓ = present, null = absent, string = text value. Source typos preserved. */
type Cell = boolean | string | null
const COMPARE_ROWS: { label: string; cells: [Cell, Cell, Cell] }[] = [
  {
    label: 'SSD storage',
    cells: ['50 GB', '100 GB', '200 GB'],
  },
  {
    label:
      'Free Email Create email addresses and forwarders at no extra cost, each mailbox comes with 1 GB of storage space. The free email is available for 1 year.',
    cells: ['1', '100', '100'],
  },
  { label: 'Mobile-Friendly & Responsive Design', cells: [true, true, true] },
  { label: 'Hosting server 1 Year Free', cells: [true, true, true] },
  { label: 'Free domain value', cells: [null, '₹ 749.00', '₹749.00'] },
  { label: 'Custom website design & development', cells: [true, true, true] },
  { label: 'Pre-built or fully custom templates', cells: [true, true, true] },
  { label: 'AI-powered design tools', cells: [null, null, true] },
  { label: 'Drag & drop editor for easy customization', cells: [true, true, true] },
  { label: 'eCommerce-ready with full store setup', cells: [null, true, true] },
  { label: 'Fast-loading, high-performance websites Performance & Optimization', cells: [true, true, true] },
  { label: 'Smart auto-updates for security & speed', cells: [null, true, true] },
  { label: 'SEO-friendly structure with AI optimization', cells: [null, true, true] },
  { label: 'Advanced caching for better performance', cells: [null, null, true] },
  { label: 'Free SSL for secure browsing Security & Reliability', cells: [true, true, true] },
  { label: 'Advanced security firewall & malware protection', cells: [null, null, true] },
  { label: 'Weekly automated backups', cells: [true, true, true] },
  { label: '99.9% uptime for reliability', cells: [true, true, true] },
  { label: 'eCommerce-ready', cells: [null, true, true] },
  { label: 'Payment methods integration', cells: [null, true, true] },
  { label: 'AI-powered heatmaps & marketing tools', cells: [null, null, true] },
  { label: 'Multi-site support for business growth Technical & Advanced Features', cells: [null, true, true] },
  { label: 'Social accounts Intregation', cells: [null, null, true] },
  /* Source table: "AI ChatBot, Intregation" (with comma) — preserved. */
  { label: 'AI ChatBot, Intregation', cells: [null, null, true] },
  { label: 'CDN included', cells: [null, null, true] },
  { label: 'DNS & FTP management', cells: [true, true, true] },
  { label: '24/7 expert support', cells: [null, true, 'Priority support'] },
]

function Stars() {
  return (
    <div className="flex gap-0.5 text-flame-500" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden>
          ★
        </span>
      ))}
    </div>
  )
}

function Check() {
  return (
    <span className="text-accent-600" aria-label="Included">
      ✓
    </span>
  )
}

function RestaurantConcept({ theme, device }: { theme: (typeof BUILDER_TEMPLATES)[number]; device: 'desktop' | 'mobile' }) {
  const palettes: Record<string, { page: string; ink: string; surface: string; hero: string; muted: string; line: string; accent: string; glow: string }> = {
    'Modern Studio': { page: '#fff8f3', ink: '#291b17', surface: '#ffffff', hero: '#f2d9ca', muted: '#f5e7dc', line: '#ead4c6', accent: '#f06c63', glow: '#bd553d' },
    'Luxe Editorial': { page: '#f6f0e6', ink: '#251d18', surface: '#fffaf2', hero: '#211d1a', muted: '#e8dcc9', line: '#d6c5aa', accent: '#d5b47c', glow: '#a77a4e' },
    'Bold Impact': { page: '#f3f0ff', ink: '#17152a', surface: '#ffffff', hero: '#17152a', muted: '#e5e0ff', line: '#d2caf8', accent: '#c4bbff', glow: '#6759e8' },
    'Fresh Minimal': { page: '#edfaf6', ink: '#142923', surface: '#ffffff', hero: '#123b33', muted: '#d9f0e8', line: '#c3e2d6', accent: '#9ce0c6', glow: '#219b83' },
    'Urban Grid': { page: '#eef2f5', ink: '#15202b', surface: '#ffffff', hero: '#15202b', muted: '#dce5eb', line: '#c7d2dc', accent: '#a9c5d4', glow: '#26384a' },
    'Warm & Human': { page: '#fff5e9', ink: '#332014', surface: '#fffdf9', hero: '#422719', muted: '#f4e1c9', line: '#e6c8a4', accent: '#ffd08c', glow: '#e18b39' },
    'Digital Edge': { page: '#eef3ff', ink: '#131d38', surface: '#ffffff', hero: '#101a36', muted: '#dce6ff', line: '#c5d4f4', accent: '#a9c0ff', glow: '#3c69dc' },
    'Natural Balance': { page: '#f2f5ec', ink: '#20291d', surface: '#fcfdf9', hero: '#263421', muted: '#e2e9d8', line: '#d0dcc2', accent: '#c3d59d', glow: '#54764a' },
  }
  const palette = palettes[theme.name] ?? palettes['Modern Studio']
  const dishes = [
    { name: 'Wood-fired sourdough', detail: 'Whipped cultured butter · rosemary', price: '₹320', shape: 'rounded-[48%_52%_42%_58%]' },
    { name: 'Garden harvest bowl', detail: 'Seasonal greens · citrus dressing', price: '₹480', shape: 'rounded-[42%_58%_58%_42%]' },
    { name: 'Sunday roast plate', detail: 'Slow roast · market vegetables', price: '₹760', shape: 'rounded-[55%_45%_48%_52%]' },
  ]
  const services = ['Dinner & celebrations', 'Private chef at home', 'Seasonal tasting menu']
  return (
    <div className="transition-colors duration-500" style={{ backgroundColor: palette.page, color: palette.ink }}>
      <div className={`relative isolate overflow-hidden text-white transition-all duration-500 ${theme.name === 'Luxe Editorial' ? 'text-center' : ''}`} style={{ backgroundColor: palette.hero }}>
        <div className="absolute inset-0 -z-10 opacity-60 transition-all duration-700" style={{ background: `radial-gradient(ellipse at 78% 55%, ${palette.glow}bb, transparent 34%), radial-gradient(ellipse at 18% 5%, ${palette.accent}55, transparent 40%), linear-gradient(120deg,${palette.hero},${palette.glow} 60%,${palette.hero})` }}/>
        <div className={`grid items-center gap-5 px-6 py-10 transition-all duration-500 sm:px-10 sm:py-14 ${device === 'mobile' || theme.name === 'Luxe Editorial' ? 'grid-cols-1' : 'grid-cols-[1fr_.85fr]'} ${theme.name === 'Luxe Editorial' ? 'mx-auto max-w-3xl sm:py-20' : ''}`}>
          <div className={`relative z-10 ${theme.name === 'Luxe Editorial' ? 'mx-auto' : ''}`}><p className="text-[9px] font-bold uppercase tracking-[.28em]" style={{ color: palette.accent }}>A neighbourhood table · Est. 2018</p><h2 className={`mt-4 max-w-2xl font-serif leading-[.96] tracking-tight ${device === 'mobile' ? 'text-4xl' : 'text-4xl sm:text-5xl lg:text-6xl'}`}>Good food.<br/><span className="italic transition-colors duration-500" style={{ color: palette.accent }}>Good company.</span></h2><p className="mt-4 max-w-md text-xs leading-relaxed text-white/75 sm:text-sm">A little place for long lunches, candlelit dinners, and one more thing for the table.</p><div className={`mt-6 flex flex-wrap gap-2 ${theme.name === 'Luxe Editorial' ? 'justify-center' : ''}`}><button type="button" className="rounded-full px-4 py-2.5 text-[10px] font-bold shadow-lg transition-colors duration-500" style={{ backgroundColor: palette.accent, color: palette.hero }}>Reserve a table <span className="ml-2">↗</span></button><button type="button" className="rounded-full border border-white/30 px-4 py-2.5 text-[10px] font-semibold text-white">View the menu</button></div><div className={`mt-6 flex items-center gap-2 text-[9px] tracking-wide text-white/65 ${theme.name === 'Luxe Editorial' ? 'justify-center' : ''}`}><span style={{ color: palette.accent }}>★★★★★</span> A local favourite for slow evenings</div></div>
          <div className={`relative mx-auto w-full max-w-sm transition-all duration-500 ${device === 'mobile' ? 'h-44' : 'h-56 sm:h-64'} ${theme.name === 'Luxe Editorial' ? 'h-52 sm:h-60' : ''}`}><div className={`absolute inset-4 rounded-[2rem] border shadow-2xl transition-all duration-500 ${theme.name === 'Bold Impact' ? 'rotate-[-12deg]' : theme.name === 'Luxe Editorial' ? 'rotate-0' : 'rotate-[-7deg]'}`} style={{ borderColor: `${palette.accent}55`, background: `linear-gradient(135deg, ${palette.accent}, ${palette.glow} 55%, ${palette.hero})` }}/><div className={`absolute inset-7 rounded-[2rem] border border-white/20 shadow-2xl transition-all duration-500 ${theme.name === 'Bold Impact' ? 'rotate-[9deg]' : theme.name === 'Luxe Editorial' ? 'rotate-0' : 'rotate-[5deg]'}`} style={{ backgroundColor: `${palette.hero}ee` }}><div className="absolute inset-3 rounded-[1.5rem] border border-dashed" style={{ borderColor: `${palette.accent}66` }}/><div className="absolute inset-0 grid place-items-center"><div className="grid h-24 w-24 place-items-center rounded-full border border-white/15 text-4xl shadow-[inset_0_3px_12px_#fff5,0_12px_24px_#0008]" style={{ background: `linear-gradient(135deg, ${palette.glow}, ${palette.accent})` }}>✦</div><span className="absolute bottom-6 rounded-full bg-black/40 px-3 py-1.5 text-[9px] font-semibold tracking-[.18em]" style={{ color: palette.accent }}>FROM OUR KITCHEN</span></div></div><span className="absolute right-0 top-3 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[9px] text-white/80 backdrop-blur">Made fresh, served warm</span></div>
        </div>
        <div className="grid grid-cols-3 border-t border-white/10 bg-black/15 px-4 py-4 text-center sm:px-8">{['Seasonal ingredients', 'Made with patience', 'A seat for everyone'].map((item, i) => <div key={item} className="border-r border-white/10 px-1 last:border-0"><span className="text-sm" style={{ color: palette.accent }}>{['✳', '⌁', '◌'][i]}</span><p className="mt-1 text-[8px] font-semibold text-white/80 sm:text-[10px]">{item}</p></div>)}</div>
      </div>
      <section className="px-5 py-9 transition-colors duration-500 sm:px-9 sm:py-12"><div className="mx-auto max-w-3xl text-center"><p className="text-[9px] font-bold uppercase tracking-[.25em]" style={{ color: palette.glow }}>A little of what we love</p><h3 className="mt-2 font-serif text-2xl sm:text-3xl">Made for the middle of the table.</h3><p className="mx-auto mt-2 max-w-lg text-[10px] leading-relaxed opacity-70 sm:text-xs">Thoughtful plates, generous pours, and ingredients picked at their best.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{dishes.map((dish, i) => <motion.article key={dish.name} whileHover={{ y: -4 }} className="overflow-hidden rounded-2xl border shadow-[0_12px_30px_-25px_#382719] transition-colors duration-500" style={{ backgroundColor: palette.surface, borderColor: palette.line }}><div className="relative grid h-28 place-items-center overflow-hidden sm:h-32" style={{ background: `linear-gradient(135deg, ${palette.hero}, ${palette.glow} 55%, ${palette.accent})` }}><div className="absolute inset-0 opacity-50" style={{ background: `radial-gradient(circle at ${30 + i * 20}% 35%, ${palette.accent}99, transparent 40%)` }}/><div className={`relative grid h-20 w-24 place-items-center border-[5px] text-3xl shadow-[0_10px_22px_#0008] ${dish.shape}`} style={{ borderColor: palette.surface, background: `linear-gradient(135deg, ${palette.accent}, ${palette.surface})` }}>{['❋', '✿', '✦'][i]}<span className="absolute -right-2 top-3 h-3 w-3 rounded-full bg-[#79894f]"/><span className="absolute -left-1 bottom-3 h-2 w-5 rotate-45 rounded-full bg-[#a34836]"/></div><span className="absolute bottom-2 right-2 rounded-full bg-black/45 px-2 py-1 text-[8px] text-white/80">Chef’s pick</span></div><div className="p-3"><div className="flex items-start justify-between gap-2"><h4 className="text-[11px] font-bold">{dish.name}</h4><b className="shrink-0 text-[10px]" style={{ color: palette.glow }}>{dish.price}</b></div><p className="mt-1 text-[9px] opacity-65">{dish.detail}</p></div></motion.article>)}</div><div className="mt-5 text-center"><button type="button" className="rounded-full border px-4 py-2 text-[9px] font-bold transition-colors" style={{ borderColor: palette.glow, color: palette.ink }}>Explore all menus →</button></div></section>
      <section className="grid gap-4 px-5 py-8 transition-colors duration-500 sm:grid-cols-2 sm:px-9 sm:py-10" style={{ backgroundColor: palette.muted }}><div className="relative isolate flex min-h-36 flex-col justify-center overflow-hidden rounded-2xl p-5 text-white" style={{ backgroundColor: palette.hero }}><div className="absolute inset-0 -z-10 opacity-50" style={{ background: `radial-gradient(circle at 80% 20%, ${palette.glow}, transparent 55%)` }}/><p className="text-[9px] font-bold uppercase tracking-[.22em]" style={{ color: palette.accent }}>At your table or ours</p><h3 className="mt-2 max-w-sm font-serif text-xl">A dinner party worth staying in for.</h3><p className="mt-2 max-w-sm text-[9px] leading-relaxed text-white/70">Our chef brings the menu, the craft, and the little details to your home.</p><button type="button" className="mt-3 w-fit rounded-full bg-white/15 px-3 py-1.5 text-[9px] font-semibold">Discover private dining →</button></div><div className="grid grid-cols-3 gap-2">{services.map((service, i) => <div key={service} className="flex min-h-28 flex-col justify-between rounded-xl border p-2.5 transition-colors duration-500" style={{ borderColor: palette.line, backgroundColor: palette.surface }}><span className="grid h-7 w-7 place-items-center rounded-full text-xs text-white" style={{ backgroundColor: palette.glow }}>{['◷', '⌂', '✳'][i]}</span><p className="text-[9px] font-bold leading-tight">{service}</p><span className="text-[8px] opacity-60">Learn more ↗</span></div>)}</div></section>
      <section className="relative isolate overflow-hidden px-5 py-9 text-white transition-colors duration-500 sm:px-9 sm:py-12" style={{ backgroundColor: palette.hero }}><div className="absolute inset-0 -z-10 opacity-35" style={{ background: `radial-gradient(ellipse at 80% 50%, ${palette.glow}, transparent 55%)` }}/><div className="grid items-center gap-5 sm:grid-cols-[1fr_auto]"><div><p className="text-[9px] font-bold uppercase tracking-[.25em]" style={{ color: palette.accent }}>Come hungry, leave happy</p><h3 className="mt-2 font-serif text-2xl sm:text-3xl">Your table is waiting.</h3><p className="mt-2 max-w-md text-[10px] text-white/65">Dinner · Tuesday to Sunday · 5:00 pm – 10:30 pm</p></div><div className="rounded-xl border border-white/15 bg-white/5 p-3"><div className="grid grid-cols-3 gap-2">{['Date', 'Guests', 'Time'].map((label) => <div key={label} className="rounded-lg bg-black/25 px-2.5 py-2"><span className="block text-[8px] text-white/45">{label}</span><span className="mt-1 block text-[9px] font-semibold">Choose {label.toLowerCase()}</span></div>)}</div><button type="button" className="mt-2 w-full rounded-lg py-2.5 text-[9px] font-bold text-white transition-colors duration-500" style={{ backgroundColor: palette.glow }}>Find a table ↗</button></div></div><p className="mt-7 border-t border-white/10 pt-4 text-center text-[8px] tracking-[.15em] text-white/40">GOOD FOOD · GOOD COMPANY · ALWAYS ROOM FOR ONE MORE</p></section>
    </div>
  )
}

function GymConcept({ theme, device }: { theme: (typeof BUILDER_TEMPLATES)[number]; device: 'desktop' | 'mobile' }) {
  const palettes: Record<string, { page: string; card: string; ink: string; muted: string; accent: string; accent2: string; hero: string; line: string }> = {
    'Modern Studio': { page: '#f4eee8', card: '#fffaf5', ink: '#211c19', muted: '#e6ddd5', accent: '#ef5545', accent2: '#ff9975', hero: '#211916', line: '#d8ccc1' },
    'Luxe Editorial': { page: '#f2eee6', card: '#fcf9f2', ink: '#201e1b', muted: '#e3dacb', accent: '#bc9154', accent2: '#e4c48e', hero: '#24211d', line: '#d9cbb5' },
    'Bold Impact': { page: '#111114', card: '#1c1b20', ink: '#f8f6ff', muted: '#25232c', accent: '#a6f23a', accent2: '#d6ff79', hero: '#080809', line: '#34323a' },
    'Fresh Minimal': { page: '#f1f7f4', card: '#ffffff', ink: '#142721', muted: '#dcebe4', accent: '#169878', accent2: '#68d5b3', hero: '#12382f', line: '#c9ded5' },
    'Urban Grid': { page: '#edf0f2', card: '#ffffff', ink: '#131a20', muted: '#dce2e7', accent: '#e45b43', accent2: '#ff9a72', hero: '#10161b', line: '#cbd3da' },
    'Warm & Human': { page: '#fff5ea', card: '#fffdf9', ink: '#322014', muted: '#f0dfca', accent: '#e58b35', accent2: '#ffc878', hero: '#382316', line: '#e7d2b7' },
    'Digital Edge': { page: '#eef2fa', card: '#fbfcff', ink: '#111a2e', muted: '#dce4f4', accent: '#4b74f2', accent2: '#83a3ff', hero: '#10182c', line: '#cad5ec' },
    'Natural Balance': { page: '#f1f4ec', card: '#fcfdf8', ink: '#20291d', muted: '#e0e8d6', accent: '#658b45', accent2: '#afce79', hero: '#263421', line: '#cfdbc1' },
  }
  const palette = palettes[theme.name] ?? palettes['Modern Studio']
  const classes = [
    { name: 'Strength Lab', type: 'Strength · All levels', icon: '▰', tag: 'BUILD POWER' },
    { name: 'HIIT Circuit', type: 'Conditioning · 45 min', icon: 'ϟ', tag: 'MOVE FAST' },
    { name: 'Mobility Flow', type: 'Recovery · All levels', icon: '〰', tag: 'RESET WELL' },
  ]
  const coachNames = ['Maya Chen', 'Jordan Hayes', 'Sam Rivera', 'Ari Patel']
  const light = theme.name === 'Luxe Editorial' || theme.name === 'Fresh Minimal' || theme.name === 'Natural Balance'
  return (
    <div className="transition-colors duration-500" style={{ backgroundColor: palette.page, color: palette.ink }}>
      <div className="relative isolate overflow-hidden transition-colors duration-500" style={{ backgroundColor: palette.hero }}>
        <div className="absolute inset-0 -z-10 transition-all duration-700" style={{ background: `radial-gradient(ellipse at 78% 48%, ${palette.accent}66, transparent 36%), radial-gradient(ellipse at 25% 90%, ${palette.accent2}30, transparent 44%), linear-gradient(115deg,${palette.hero},${light ? palette.muted : '#08090b'} 62%,${palette.hero})` }}/>
        <div className="absolute right-[8%] top-[9%] -z-10 select-none text-[10rem] font-black italic leading-none opacity-[.045] sm:text-[17rem]">GO</div>
        <div className={`grid items-center gap-4 px-5 py-8 sm:px-9 sm:py-12 ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-[1fr_.95fr]'}`}>
          <div className="relative z-10"><div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[.2em]" style={{ color: palette.accent }}><span className="grid h-6 w-6 place-items-center rounded-md text-white" style={{ backgroundColor: palette.accent }}>M</span> Move better · feel stronger</div><h2 className={`mt-5 max-w-xl font-black uppercase leading-[.88] tracking-[-.045em] text-white ${device === 'mobile' ? 'text-4xl' : 'text-4xl sm:text-5xl lg:text-6xl'}`}>Train smarter.<br/>Transform <span style={{ color: palette.accent }}>faster.</span></h2><p className="mt-4 max-w-md text-[10px] leading-relaxed text-white/65 sm:text-xs">A training space built around your goals, your pace, and the strongest version of you.</p><div className="mt-5 flex flex-wrap gap-2"><button type="button" className="rounded-md px-4 py-2.5 text-[9px] font-black uppercase tracking-wide text-white shadow-lg transition-transform hover:-translate-y-0.5" style={{ backgroundColor: palette.accent }}>Start training ↗</button><button type="button" className="rounded-md border border-white/20 px-4 py-2.5 text-[9px] font-bold uppercase tracking-wide text-white">Explore classes</button></div><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[9px] font-semibold text-white/60"><span><b className="text-white">96%</b> member satisfaction</span><span><b className="text-white">24+</b> weekly classes</span><span><b className="text-white">1:1</b> expert coaching</span></div></div>
          <div className={`relative mx-auto w-full max-w-sm ${device === 'mobile' ? 'h-48' : 'h-56 sm:h-72'}`}><div className="absolute inset-x-[10%] bottom-0 top-[12%] rounded-[46%_46%_18%_18%] border border-white/10" style={{ background: `linear-gradient(145deg, ${palette.accent}77, ${palette.hero} 70%)` }}/><div className="absolute inset-x-[16%] bottom-0 top-[18%] overflow-hidden rounded-[45%_45%_12%_12%]" style={{ background: `linear-gradient(145deg, ${palette.accent}55, ${palette.hero})` }}><div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(ellipse at 52% 34%, ${palette.accent2}, transparent 43%)` }}/><div className="absolute left-1/2 top-[14%] h-12 w-12 -translate-x-1/2 rounded-full border-4 border-white/20 bg-gradient-to-br from-[#deb99c] to-[#735446] shadow-lg sm:h-14 sm:w-14"/><div className="absolute left-1/2 top-[36%] h-[60%] w-[48%] -translate-x-1/2 rounded-t-[45%] bg-gradient-to-br from-white/60 via-white/15 to-black/30"/><div className="absolute left-[7%] top-[49%] h-2 w-[34%] -rotate-[28deg] rounded-full bg-white/45"/><div className="absolute right-[7%] top-[49%] h-2 w-[34%] rotate-[28deg] rounded-full bg-white/45"/><div className="absolute left-[3%] top-[45%] h-8 w-8 rounded-md border-2 border-white/40 bg-black/35"/><div className="absolute right-[3%] top-[45%] h-8 w-8 rounded-md border-2 border-white/40 bg-black/35"/><div className="absolute bottom-0 left-[16%] h-[38%] w-[20%] -rotate-3 rounded-t-xl bg-gradient-to-b from-[#8f8f94] to-[#29292e]"/><div className="absolute bottom-0 right-[16%] h-[38%] w-[20%] rotate-3 rounded-t-xl bg-gradient-to-b from-[#8f8f94] to-[#29292e]"/></div><motion.span animate={{ y: [0, -7, 0], opacity: [.65, 1, .65] }} transition={{ duration: 3.2, repeat: Infinity }} className="absolute right-0 top-[16%] rounded-full border border-white/15 bg-black/50 px-3 py-2 text-[8px] font-bold uppercase tracking-wider text-white backdrop-blur">Your next level ↗</motion.span><div className="absolute bottom-1 left-0 rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-[8px] text-white/75 backdrop-blur"><span className="font-bold text-white">COACH’S NOTE</span><br/>Progress beats perfect.</div></div>
        </div>
        <div className="grid grid-cols-3 border-t border-white/10 bg-black/20 px-3 py-3 text-center sm:px-8">{[['12+', 'years of movement'], ['27K+', 'stronger sessions'], ['60+', 'weekly classes']].map(([value, label]) => <div key={label} className="border-r border-white/10 last:border-0"><b className="text-sm text-white sm:text-base" style={{ color: palette.accent }}>{value}</b><p className="mt-1 text-[8px] font-semibold text-white/55 sm:text-[9px]">{label}</p></div>)}</div>
      </div>
      <section className="px-4 py-8 sm:px-8 sm:py-10"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[8px] font-black uppercase tracking-[.22em]" style={{ color: palette.accent }}>Find your training rhythm</p><h3 className="mt-1 text-xl font-black uppercase sm:text-2xl">Train your way.</h3></div><button type="button" className="rounded-md border px-3 py-2 text-[8px] font-bold uppercase" style={{ borderColor: palette.line }}>All classes ↗</button></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{classes.map((item, i) => <motion.article key={item.name} whileHover={{ y: -4 }} className="overflow-hidden rounded-xl border transition-colors duration-500" style={{ backgroundColor: palette.card, borderColor: palette.line }}><div className="relative grid h-24 place-items-center overflow-hidden" style={{ background: `linear-gradient(130deg,${palette.hero},${palette.accent}88)` }}><div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at ${25 + i * 25}% 30%, ${palette.accent2}, transparent 42%)` }}/><span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-white/25 bg-black/25 text-2xl font-black text-white shadow-xl">{item.icon}</span><span className="absolute left-3 top-3 rounded-full bg-black/35 px-2 py-1 text-[7px] font-black tracking-widest text-white">{item.tag}</span></div><div className="p-3"><h4 className="text-[11px] font-black uppercase">{item.name}</h4><p className="mt-1 text-[9px] opacity-60">{item.type}</p><div className="mt-3 flex items-center justify-between border-t pt-2" style={{ borderColor: palette.line }}><span className="text-[8px] font-semibold opacity-60">Coach-led · Book in app</span><span className="text-xs" style={{ color: palette.accent }}>↗</span></div></div></motion.article>)}</div></section>
      <section className="grid gap-4 px-4 pb-8 sm:grid-cols-[.9fr_1.1fr] sm:px-8"><div className="rounded-xl p-4 text-white" style={{ backgroundColor: palette.hero }}><p className="text-[8px] font-black uppercase tracking-[.22em]" style={{ color: palette.accent }}>Coaching that gets you</p><h3 className="mt-2 max-w-sm text-lg font-black uppercase leading-tight">Real people.<br/>Real progress.</h3><p className="mt-2 max-w-sm text-[9px] leading-relaxed text-white/60">Meet coaches who make a plan around your life, keep you accountable, and celebrate every win.</p><div className="mt-4 grid grid-cols-4 gap-2">{coachNames.map((name, i) => <div key={name} className="text-center"><div className="mx-auto grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-sm font-black text-white" style={{ background: `linear-gradient(145deg, ${palette.accent}${i === 0 ? 'bb' : '66'}, #222)` }}>{name.split(' ').map((part) => part[0]).join('')}</div><span className="mt-1 block truncate text-[7px] text-white/65">{name}</span></div>)}</div></div><div className="grid grid-cols-2 gap-2">{[['01', 'Choose your goal', 'Strength, energy, or a fresh start.'], ['02', 'Meet your coach', 'A plan made for your real life.'], ['03', 'Track your wins', 'See the work add up every week.'], ['04', 'Keep moving', 'Build a routine that sticks.']].map(([n, title, body]) => <div key={n} className="rounded-xl border p-3 transition-colors duration-500" style={{ borderColor: palette.line, backgroundColor: palette.card }}><span className="text-[9px] font-black" style={{ color: palette.accent }}>{n} /</span><h4 className="mt-2 text-[9px] font-black uppercase">{title}</h4><p className="mt-1 text-[8px] leading-relaxed opacity-60">{body}</p></div>)}</div></section>
      <section className="relative isolate overflow-hidden px-5 py-7 text-white sm:px-8 sm:py-9" style={{ backgroundColor: palette.hero }}><div className="absolute inset-0 -z-10 opacity-30" style={{ background: `radial-gradient(ellipse at 80% 20%, ${palette.accent}, transparent 55%)` }}/><div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]"><div><p className="text-[8px] font-black uppercase tracking-[.22em]" style={{ color: palette.accent }}>Start where you are</p><h3 className="mt-1 text-xl font-black uppercase">Your stronger starts today.</h3><p className="mt-1 text-[9px] text-white/60">Tour the gym. Meet the coaches. Find your plan.</p></div><button type="button" className="rounded-md px-5 py-3 text-[9px] font-black uppercase tracking-wide text-white shadow-lg" style={{ backgroundColor: palette.accent }}>Claim a free visit ↗</button></div></section>
    </div>
  )
}

function HospitalConcept({ theme, device }: { theme: (typeof BUILDER_TEMPLATES)[number]; device: 'desktop' | 'mobile' }) {
  const palettes: Record<string, { page: string; surface: string; ink: string; muted: string; hero: string; accent: string; secondary: string; line: string }> = {
    'Modern Studio': { page: '#f5fafb', surface: '#ffffff', ink: '#142b36', muted: '#e5f1f3', hero: '#d7edf2', accent: '#087e9a', secondary: '#e97762', line: '#d2e4e8' },
    'Luxe Editorial': { page: '#f8f3f8', surface: '#ffffff', ink: '#291e35', muted: '#eee5f0', hero: '#321c45', accent: '#9654b6', secondary: '#fa8b66', line: '#e3d5e8' },
    'Bold Impact': { page: '#f1f4ff', surface: '#ffffff', ink: '#111a35', muted: '#e3eaff', hero: '#111a35', accent: '#456ff0', secondary: '#34c9dc', line: '#d3dcf5' },
    'Fresh Minimal': { page: '#eff9f7', surface: '#ffffff', ink: '#12312c', muted: '#dbf0ea', hero: '#d7eee8', accent: '#168c79', secondary: '#55c7b3', line: '#cbe5de' },
    'Urban Grid': { page: '#eff3f6', surface: '#ffffff', ink: '#152534', muted: '#dfe8ee', hero: '#19344a', accent: '#2477aa', secondary: '#4eb9c4', line: '#cedde6' },
    'Warm & Human': { page: '#fff7ef', surface: '#fffdf9', ink: '#332317', muted: '#f4e8d9', hero: '#f1dfc9', accent: '#c36e3d', secondary: '#e89d72', line: '#ead8c4' },
    'Digital Edge': { page: '#f0f4ff', surface: '#ffffff', ink: '#111e3a', muted: '#e0e9ff', hero: '#d7e3ff', accent: '#3568db', secondary: '#49b9e5', line: '#ccd9f4' },
    'Natural Balance': { page: '#f3f7ef', surface: '#ffffff', ink: '#202d22', muted: '#e4eddd', hero: '#e0ebd7', accent: '#59834d', secondary: '#8fbe8b', line: '#d4e1ca' },
  }
  const palette = palettes[theme.name] ?? palettes['Modern Studio']
  const departments = [
    { name: 'Heart & Vascular', icon: '♡', note: 'Cardiology' },
    { name: 'Family Medicine', icon: '✚', note: 'Primary care' },
    { name: 'Diagnostics', icon: '⌕', note: 'Imaging & labs' },
    { name: 'Women’s Health', icon: '✿', note: 'Specialist care' },
  ]
  const doctors = ['Dr. Ava Morgan', 'Dr. Noah Bennett', 'Dr. Mia Chen']
  return (
    <div className="transition-colors duration-500" style={{ backgroundColor: palette.page, color: palette.ink }}>
      <div className="relative isolate overflow-hidden transition-colors duration-500" style={{ backgroundColor: palette.hero }}>
        <div className="absolute inset-0 -z-10 opacity-80 transition-colors duration-500" style={{ background: `radial-gradient(ellipse at 78% 35%, ${palette.secondary}66, transparent 38%), linear-gradient(115deg,${palette.hero},${palette.page})` }}/>
        <div className={`grid items-center gap-6 px-5 py-8 sm:px-9 sm:py-12 ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-[1fr_.9fr]'}`}>
          <div className="relative z-10"><div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.18em]" style={{ color: palette.accent, borderColor: `${palette.accent}33`, backgroundColor: `${palette.surface}bb` }}><span className="grid h-5 w-5 place-items-center rounded-md text-white" style={{ backgroundColor: palette.accent }}>✚</span> Here for your health</div><h2 className={`mt-4 max-w-xl font-semibold leading-[1.02] tracking-tight ${device === 'mobile' ? 'text-4xl' : 'text-4xl sm:text-5xl lg:text-6xl'}`}>Care that moves<br/>you <span className="italic" style={{ color: palette.accent }}>forward.</span></h2><p className="mt-3 max-w-md text-[10px] leading-relaxed opacity-70 sm:text-xs">Trusted doctors. Thoughtful treatment. A team that sees the whole you.</p><div className="mt-5 flex flex-wrap gap-2"><button type="button" className="rounded-lg px-4 py-2.5 text-[9px] font-bold text-white shadow-lg" style={{ backgroundColor: palette.accent }}>Book an appointment ↗</button><button type="button" className="rounded-lg border px-4 py-2.5 text-[9px] font-bold" style={{ borderColor: `${palette.accent}55`, color: palette.ink }}>Explore services</button></div><div className="mt-5 flex items-center gap-3"><div className="flex -space-x-2">{['#e4b9a4', '#c88e78', '#f1d1b1'].map((color, i) => <span key={color} className="grid h-7 w-7 place-items-center rounded-full border-2 text-[8px] font-bold text-white" style={{ borderColor: palette.hero, background: `linear-gradient(145deg,${color},${palette.accent})` }}>{['A', 'J', 'M'][i]}</span>)}</div><div className="text-[8px] leading-tight"><b>Care from people who care</b><span className="mt-0.5 block opacity-60">Appointments available this week</span></div></div></div>
          <div className={`relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border shadow-2xl ${device === 'mobile' ? 'h-48' : 'h-56 sm:h-72'}`} style={{ background: `linear-gradient(145deg,${palette.secondary},${palette.accent} 55%,${palette.hero})`, borderColor: `${palette.surface}aa` }}><div className="absolute inset-0 opacity-45" style={{ background: `radial-gradient(ellipse at 54% 28%, ${palette.surface}, transparent 40%)` }}/><div className="absolute left-1/2 top-[13%] h-12 w-12 -translate-x-1/2 rounded-full border-4 bg-gradient-to-br from-[#eed0bd] to-[#986e63] shadow-md" style={{ borderColor: `${palette.surface}88` }}/><div className="absolute left-1/2 top-[35%] h-[70%] w-[54%] -translate-x-1/2 rounded-t-[44%] bg-gradient-to-br from-white via-[#e9f0f0] to-[#a4b9c0] shadow-[0_10px_35px_#1235]"/><div className="absolute left-[27%] top-[39%] h-16 w-3 rotate-12 rounded-full" style={{ backgroundColor: palette.accent }}/><div className="absolute left-[29%] top-[48%] h-12 w-12 rounded-full border-[5px] bg-transparent" style={{ borderColor: palette.surface }}/><div className="absolute left-[34%] top-[53%] h-10 w-1 rounded-full" style={{ backgroundColor: palette.surface }}/><div className="absolute right-3 top-3 rounded-xl border bg-white/80 px-3 py-2 text-[8px] shadow-lg backdrop-blur" style={{ borderColor: palette.line, color: palette.ink }}><span className="font-bold">TODAY’S CARE</span><br/><span className="opacity-60">A healthier you starts here</span></div><div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[8px] font-bold shadow-lg" style={{ color: palette.accent }}><span className="grid h-5 w-5 place-items-center rounded-full text-white" style={{ backgroundColor: palette.accent }}>+</span> Compassion in every visit</div></div>
        </div>
        <div className="grid grid-cols-3 border-t bg-white/50 px-3 py-3 text-center backdrop-blur" style={{ borderColor: `${palette.accent}22` }}>{[['25+', 'years of care'], ['90%', 'patient satisfaction'], ['135K+', 'patients supported']].map(([value, label]) => <div key={label} className="border-r last:border-0" style={{ borderColor: palette.line }}><b className="text-lg sm:text-2xl" style={{ color: palette.accent }}>{value}</b><p className="mt-1 text-[8px] font-semibold opacity-60">{label}</p></div>)}</div>
      </div>
      <section className="grid gap-5 px-5 py-8 sm:grid-cols-[.8fr_1.2fr] sm:px-9 sm:py-10"><div><p className="text-[8px] font-bold uppercase tracking-[.2em]" style={{ color: palette.accent }}>Care, connected</p><h3 className="mt-2 text-xl font-bold leading-tight">The right care,<br/>all in one place.</h3><p className="mt-2 text-[9px] leading-relaxed opacity-65">From everyday checkups to specialist support, our teams work together around you.</p><button type="button" className="mt-4 rounded-lg px-3 py-2 text-[8px] font-bold text-white" style={{ backgroundColor: palette.accent }}>View all departments ↗</button><div className="mt-5 grid grid-cols-2 gap-2">{[['90%', 'patient satisfaction'], ['24/7', 'urgent support']].map(([value, label]) => <div key={label} className="rounded-lg border p-2.5" style={{ borderColor: palette.line, backgroundColor: palette.surface }}><b className="text-sm" style={{ color: palette.accent }}>{value}</b><span className="mt-1 block text-[8px] opacity-60">{label}</span></div>)}</div></div><div className="grid grid-cols-2 gap-2">{departments.map((item, i) => <motion.article key={item.name} whileHover={{ y: -3 }} className="rounded-xl border p-3 transition-colors duration-500" style={{ borderColor: palette.line, backgroundColor: palette.surface }}><span className="grid h-9 w-9 place-items-center rounded-xl text-lg text-white" style={{ background: `linear-gradient(145deg,${palette.accent},${palette.secondary})` }}>{item.icon}</span><h4 className="mt-3 text-[9px] font-bold">{item.name}</h4><p className="mt-1 text-[8px] opacity-55">{item.note}</p><span className="mt-3 block text-[8px] font-bold" style={{ color: palette.accent }}>{['Learn more', 'Meet a doctor', 'See services', 'Get support'][i]} ↗</span></motion.article>)}</div></section>
      <section className="px-5 py-7 sm:px-9" style={{ backgroundColor: palette.muted }}><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[8px] font-bold uppercase tracking-[.2em]" style={{ color: palette.accent }}>A team you can trust</p><h3 className="mt-1 text-xl font-bold">Meet your care team.</h3></div><button type="button" className="rounded-lg border bg-white px-3 py-2 text-[8px] font-bold" style={{ borderColor: palette.line }}>All specialists ↗</button></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{doctors.map((doctor, i) => <article key={doctor} className="flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: palette.line, backgroundColor: palette.surface }}><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg text-white" style={{ background: `linear-gradient(145deg,${palette.secondary},${palette.accent})` }}>{['👩‍⚕️', '👨‍⚕️', '👩‍⚕️'][i]}</div><div className="min-w-0"><h4 className="truncate text-[9px] font-bold">{doctor}</h4><p className="mt-1 text-[8px] opacity-60">{['Cardiology', 'Family medicine', 'Diagnostics'][i]}</p><span className="mt-1 block text-[8px] font-bold" style={{ color: palette.accent }}>View profile ↗</span></div></article>)}</div></section>
      <section className="px-5 py-7 sm:px-9 sm:py-9"><div className="grid items-center gap-4 rounded-2xl p-4 text-white sm:grid-cols-[1fr_auto] sm:p-6" style={{ background: `linear-gradient(115deg,${palette.accent},${palette.secondary})` }}><div><p className="text-[8px] font-bold uppercase tracking-[.2em] text-white/75">We’re here when you need us</p><h3 className="mt-1 text-xl font-bold">Let’s find the right appointment.</h3><p className="mt-1 text-[9px] text-white/75">Choose a service and a time that works for you.</p></div><div className="flex flex-wrap gap-2 rounded-xl bg-white/15 p-2"><span className="rounded-lg bg-white/90 px-3 py-2 text-[8px] font-semibold text-slate-600">Select a service⌄</span><span className="rounded-lg bg-white/90 px-3 py-2 text-[8px] font-semibold text-slate-600">Choose a date⌄</span><button type="button" className="rounded-lg px-3 py-2 text-[8px] font-bold text-white" style={{ backgroundColor: palette.ink }}>Book appointment ↗</button></div></div></section>
      <div className="px-5 pb-6 text-center text-[8px] font-semibold opacity-45 sm:px-9">COMPASSIONATE CARE · EXPERT TEAMS · HEALTHIER COMMUNITIES</div>
    </div>
  )
}

function IndustryConcept({ businessIndex, theme, device }: { businessIndex: number; theme: (typeof BUILDER_TEMPLATES)[number]; device: 'desktop' | 'mobile' }) {
  const business = BUILDER_BUSINESSES[businessIndex]
  const palettes = [
    ['#fff5f0', '#241d1a', '#ffffff', '#e96351', '#f5c8b7'],
    ['#f6f2ec', '#29231e', '#fffdf9', '#a77a4e', '#dfc9ac'],
    ['#f5eff9', '#251b2c', '#ffffff', '#9a5bc2', '#ddc4ed'],
    ['#eef8f5', '#17312a', '#ffffff', '#238d75', '#b9e3d5'],
    ['#eff3f7', '#172431', '#ffffff', '#2b6284', '#bfd3e0'],
    ['#fff5e9', '#352419', '#fffdf9', '#dc8334', '#f5d2a5'],
    ['#eef3ff', '#17213b', '#ffffff', '#426fe0', '#c5d4fb'],
    ['#f2f5ed', '#222d20', '#fcfdf9', '#668449', '#d2dfc1'],
  ]
  const [page, ink, surface, accent, soft] = palettes[BUILDER_TEMPLATES.findIndex((item) => item.name === theme.name)] ?? palettes[0]
  const content = {
    fashion: {
      eyebrow: 'A considered collection', title: 'Pieces to make<br/>your own.', body: 'Thoughtful shapes, beautiful details, and everyday pieces that feel like you.', action: 'Shop new arrivals', section: 'The new season, in good company.', labels: ['New in', 'Clothing', 'Accessories'], cards: [['The Sunday Shirt', 'Relaxed cotton · 4 colours', '₹2,400'], ['Everyday Tote', 'Soft leather · 3 colours', '₹3,800'], ['The Studio Trouser', 'Easy tailoring · 5 sizes', '₹4,200']], panel: 'Find the pieces you’ll reach for again.'
    },
    property: {
      eyebrow: 'Find your place', title: 'A home for<br/>what comes next.', body: 'Explore thoughtfully selected homes in the neighbourhoods you love.', action: 'Explore homes', section: 'Spaces with a story to tell.', labels: ['For sale', 'For rent', 'Neighbourhoods'], cards: [['The Garden House', '3 beds · 2 baths · Greenview', '₹1.8 Cr'], ['Lightwell Apartment', '2 beds · 2 baths · Riverside', '₹92 L'], ['The Corner Residence', '4 beds · 3 baths · Old Town', '₹2.4 Cr']], panel: 'Tell us what home means to you.'
    },
    salon: {
      eyebrow: 'A little time for you', title: 'Feel good<br/>in your own skin.', body: 'Personalised treatments, thoughtful hands, and a moment to reset.', action: 'Book your visit', section: 'Your ritual, your way.', labels: ['Hair', 'Skin', 'Nails'], cards: [['The Signature Cut', '45 min · Includes consultation', '₹1,200'], ['Glow Facial', '60 min · A fresh-skin reset', '₹2,400'], ['Soft Gel Manicure', '50 min · Shape & colour', '₹1,500']], panel: 'A good day can start with an appointment.'
    },
    education: {
      eyebrow: 'Learn at your pace', title: 'Make room<br/>to grow.', body: 'Practical courses, generous mentors, and skills you can put to work.', action: 'Explore courses', section: 'A good place to begin.', labels: ['Popular', 'New courses', 'For teams'], cards: [['Design Foundations', '8 lessons · Beginner', '4.9 ★'], ['Build with Data', '12 lessons · Intermediate', '4.8 ★'], ['Confident Communication', '6 lessons · All levels', '5.0 ★']], panel: 'One small lesson can change what’s possible.'
    },
    professional: {
      eyebrow: 'Thoughtful work, real outcomes', title: 'Clarity for<br/>what’s next.', body: 'A trusted partner for the complicated decisions and important next steps.', action: 'Book a consultation', section: 'Good work starts with listening.', labels: ['Strategy', 'Operations', 'Growth'], cards: [['A clearer direction', 'Brand strategy · 6 weeks', 'Case study'], ['Room to scale', 'Operations · 3 months', 'Case study'], ['Built for what’s next', 'Digital growth · 8 weeks', 'Case study']], panel: 'Let’s make a plan that fits your business.'
    },
  }[(['fashion', 'property', 'salon', 'education', 'professional'][businessIndex - 3] ?? 'fashion') as 'fashion' | 'property' | 'salon' | 'education' | 'professional']
  const isProperty = businessIndex === 4
  const isFashion = businessIndex === 3
  const isSalon = businessIndex === 5
  const isEducation = businessIndex === 6
  const buttonLabel = isSalon ? 'Choose a time' : isEducation ? 'View course' : isFashion ? 'View details' : isProperty ? 'View property' : 'Read the story'
  return (
    <div className="transition-colors duration-500" style={{ backgroundColor: page, color: ink }}>
      <div className="relative isolate overflow-hidden px-5 py-8 sm:px-9 sm:py-12" style={{ background: `linear-gradient(120deg,${soft},${surface} 58%,${accent}20)` }}>
        <div className="absolute -right-10 -top-16 -z-10 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: accent }}/>
        <div className={`grid items-center gap-5 ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-[1fr_.9fr]'}`}>
          <div><p className="text-[8px] font-bold uppercase tracking-[.22em]" style={{ color: accent }}>{content.eyebrow} · {theme.style} edit</p><h2 className={`mt-3 max-w-xl font-bold leading-[1.02] tracking-tight ${device === 'mobile' ? 'text-4xl' : 'text-4xl sm:text-5xl'}`} dangerouslySetInnerHTML={{ __html: content.title }}/><p className="mt-3 max-w-md text-[10px] leading-relaxed opacity-65 sm:text-xs">{content.body}</p>
            {isProperty && <div className="mt-4 flex flex-wrap gap-1.5 rounded-xl border p-2" style={{ backgroundColor: surface, borderColor: `${accent}35` }}><span className="w-full px-2 pb-1 text-[8px] font-semibold opacity-50">Find a home by neighbourhood, features, or feeling</span>{['Location⌄', 'Price⌄', 'Beds⌄'].map((filter) => <span key={filter} className="rounded-lg px-2.5 py-2 text-[8px] font-semibold" style={{ backgroundColor: page }}>{filter}</span>)}<button type="button" className="rounded-lg px-3 py-2 text-[8px] font-bold text-white" style={{ backgroundColor: accent }}>Search homes</button></div>}
            <div className="mt-4 flex flex-wrap gap-2"><button type="button" className="rounded-lg px-4 py-2.5 text-[9px] font-bold text-white shadow-md transition-transform hover:-translate-y-0.5" style={{ backgroundColor: accent }}>{content.action} ↗</button>{isFashion && <button type="button" className="rounded-lg border px-4 py-2.5 text-[9px] font-semibold" style={{ borderColor: `${accent}55` }}>Our story</button>}</div>
            <div className="mt-4 flex flex-wrap gap-2">{content.labels.map((label) => <span key={label} className="rounded-full border px-2.5 py-1 text-[8px] font-semibold" style={{ borderColor: `${accent}35`, color: accent }}>{label}</span>)}</div>
          </div>
          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .45 }} className="relative mx-auto grid h-44 w-full max-w-sm place-items-center overflow-hidden rounded-2xl border shadow-lg sm:h-52" style={{ background: `linear-gradient(145deg,${accent},${soft} 55%,${page})`, borderColor: `${accent}25` }}>
            <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1.5 text-[8px] font-bold" style={{ color: accent }}>{business.name}</span>
            {isFashion ? <div className="relative h-32 w-24 rounded-t-[45%] rounded-b-2xl shadow-xl" style={{ background: `linear-gradient(145deg,${surface},${soft})` }}><div className="absolute -left-3 top-0 h-14 w-8 -rotate-12 rounded-full" style={{ backgroundColor: surface }}/><div className="absolute -right-3 top-0 h-14 w-8 rotate-12 rounded-full" style={{ backgroundColor: surface }}/><span className="absolute inset-x-0 top-8 text-center text-lg" style={{ color: accent }}>✳</span></div> : isProperty ? <div className="relative h-28 w-40 rounded-xl border-4 border-white/70 shadow-xl" style={{ background: `linear-gradient(145deg,${surface},${soft})` }}><div className="absolute inset-x-0 bottom-0 h-12" style={{ backgroundColor: `${accent}55` }}/><div className="absolute bottom-0 left-7 h-14 w-12 border-x-4 border-t-4 border-white/80"/><div className="absolute bottom-3 left-10 h-6 w-6 rounded-t-full" style={{ backgroundColor: accent }}/><div className="absolute right-4 top-4 h-8 w-8 rounded-lg border-4 border-white/70" style={{ backgroundColor: `${accent}55` }}/></div> : isSalon ? <div className="relative grid h-28 w-28 place-items-center rounded-full border-[10px] border-white/60 text-5xl shadow-xl" style={{ background: `linear-gradient(145deg,${surface},${soft})`, color: accent }}>✿<span className="absolute -right-7 top-2 grid h-12 w-12 place-items-center rounded-full border-4 border-white/60 text-xl" style={{ backgroundColor: soft }}>✦</span></div> : isEducation ? <div className="relative w-40 rounded-xl border border-white/70 bg-white/90 p-3 shadow-xl"><div className="flex gap-1"><i className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }}/><i className="h-1.5 w-1.5 rounded-full bg-slate-200"/><i className="h-1.5 w-1.5 rounded-full bg-slate-200"/></div><b className="mt-3 block text-[10px]">Your learning path</b><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full w-[68%] rounded-full" style={{ backgroundColor: accent }}/></div><span className="mt-1 block text-[8px] opacity-50">68% course progress</span><span className="mt-3 grid h-10 place-items-center rounded-lg text-lg text-white" style={{ backgroundColor: accent }}>▶</span></div> : <div className="relative w-40 rounded-xl border border-white/70 bg-white/90 p-4 shadow-xl"><span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: accent }}>The work, together</span><div className="mt-3 space-y-2"><i className="block h-2 w-4/5 rounded-full" style={{ backgroundColor: `${accent}55` }}/><i className="block h-2 w-3/5 rounded-full bg-slate-200"/><i className="block h-2 w-2/3 rounded-full bg-slate-100"/></div><div className="mt-4 flex items-end gap-1"><i className="h-5 w-4 rounded-t" style={{ backgroundColor: `${accent}66` }}/><i className="h-8 w-4 rounded-t" style={{ backgroundColor: accent }}/><i className="h-6 w-4 rounded-t" style={{ backgroundColor: `${accent}99` }}/><i className="h-10 w-4 rounded-t" style={{ backgroundColor: accent }}/></div></div>}
            <span className="absolute bottom-3 right-3 rounded-lg bg-white/85 px-2.5 py-1.5 text-[8px] font-bold shadow" style={{ color: accent }}>{theme.name} · Live</span>
          </motion.div>
        </div>
      </div>
      <section className="px-4 py-7 sm:px-8 sm:py-9"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[8px] font-bold uppercase tracking-[.2em]" style={{ color: accent }}>{isProperty ? 'A few places to start' : isSalon ? 'Our most-loved services' : isEducation ? 'Start learning today' : isFashion ? 'The latest edit' : 'A few things we’ve made possible'}</p><h3 className="mt-1 text-lg font-bold sm:text-xl">{content.section}</h3></div><span className="text-[8px] font-semibold opacity-50">Thoughtfully selected · Updated often</span></div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">{content.cards.map(([title, detail, price], i) => <motion.article key={title} whileHover={{ y: -4 }} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: i * .07 }} className="overflow-hidden rounded-xl border shadow-sm" style={{ borderColor: `${accent}25`, backgroundColor: surface }}>
          <div className="relative grid h-24 place-items-center overflow-hidden sm:h-28" style={{ background: `linear-gradient(135deg,${soft},${accent}35)` }}><span className="absolute left-3 top-3 rounded-full bg-white/80 px-2 py-1 text-[7px] font-bold uppercase tracking-wider" style={{ color: accent }}>{isProperty ? 'Featured home' : isSalon ? 'Guest favourite' : isEducation ? 'Popular course' : isFashion ? 'Just arrived' : 'Selected work'}</span>
            {isFashion ? <div className={`grid h-16 w-14 place-items-center rounded-t-[45%] rounded-b-lg border border-white/70 text-xl shadow-lg ${i === 1 ? 'rotate-6' : i === 2 ? '-rotate-6' : ''}`} style={{ backgroundColor: [soft, '#ded5cb', '#d2d8c8'][i], color: accent }}>✳</div> : isProperty ? <div className="relative h-14 w-24 rounded-lg border-2 border-white/80 shadow-lg" style={{ backgroundColor: surface }}><div className="absolute bottom-0 left-5 h-9 w-12 border-2 border-b-0 border-white/70" style={{ backgroundColor: `${accent}40` }}/><i className="absolute bottom-2 left-8 h-3 w-3 rounded-full" style={{ backgroundColor: accent }}/><i className="absolute right-2 top-2 h-4 w-4 rounded border-2 border-white/70" style={{ backgroundColor: `${accent}50` }}/></div> : isSalon ? <span className="grid h-14 w-14 place-items-center rounded-full border-4 border-white/70 text-2xl shadow-lg" style={{ color: accent, backgroundColor: surface }}>{['✂', '✿', '◇'][i]}</span> : isEducation ? <div className="w-28 rounded-lg border border-white/70 bg-white/80 p-2 shadow-lg"><span className="block h-2 w-2/3 rounded-full" style={{ backgroundColor: accent }}/><span className="mt-2 block h-1.5 w-full rounded-full bg-slate-200"/><span className="mt-1 block h-1.5 w-4/5 rounded-full bg-slate-100"/><span className="mt-2 block h-5 rounded" style={{ backgroundColor: `${accent}55` }}/></div> : <div className="w-28 rounded-lg border border-white/70 bg-white/80 p-2 shadow-lg"><span className="text-[7px] font-bold" style={{ color: accent }}>OUTCOME {String(i + 1).padStart(2, '0')}</span><span className="mt-2 block h-2 w-full rounded-full bg-slate-200"/><span className="mt-1 block h-2 w-3/4 rounded-full" style={{ backgroundColor: `${accent}55` }}/><span className="mt-2 block h-5 w-10 rounded" style={{ backgroundColor: accent }}/></div>}
          </div>
          <div className="p-3"><div className="flex items-start justify-between gap-2"><h4 className="text-[10px] font-bold">{title}</h4><b className="shrink-0 text-[9px]" style={{ color: accent }}>{price}</b></div><p className="mt-1 text-[8px] opacity-60">{detail}</p>{isFashion && <div className="mt-2 flex items-center gap-1"><span className="text-[7px] opacity-50">COLOURS</span>{[accent, ink, soft].map((color) => <i key={color} className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: color }}/>)}</div>}{isSalon && <div className="mt-2 flex flex-wrap gap-1">{['Today', 'Tomorrow', 'This week'].map((slot) => <span key={slot} className="rounded-full px-2 py-1 text-[7px] font-semibold" style={{ backgroundColor: soft, color: accent }}>{slot}</span>)}</div>}{isEducation && <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100"><span className="block h-full w-[62%] rounded-full" style={{ backgroundColor: accent }}/></div>}<button type="button" className="mt-3 w-full rounded-lg border px-2 py-2 text-[8px] font-bold transition-colors hover:text-white" style={{ borderColor: `${accent}55`, color: accent }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}>{buttonLabel} ↗</button></div>
        </motion.article>)}</div>
      </section>
      <section className="px-4 pb-7 sm:px-8"><div className="grid items-center gap-4 rounded-2xl p-4 sm:grid-cols-[1fr_auto] sm:p-6" style={{ backgroundColor: ink, color: surface }}><div><p className="text-[8px] font-bold uppercase tracking-[.2em]" style={{ color: soft }}>{content.eyebrow}</p><h3 className="mt-1 text-lg font-bold">{content.panel}</h3><p className="mt-1 max-w-md text-[8px] opacity-65">A warm, personal experience with the details people need to take their next step.</p></div><button type="button" className="rounded-lg px-4 py-2.5 text-[8px] font-bold text-white" style={{ backgroundColor: accent }}>{content.action} ↗</button></div></section>
    </div>
  )
}

/* --------------------------------- sections -------------------------------- */

/** Wireframe website screens that scroll through the cinematic film. */
function CineScreens() {
  return (
    <>
      {/* hero-style page: header, big titles, copy, trust badges, CTAs, visual */}
      <div className="relative min-h-0 flex-1 overflow-hidden border-b border-line bg-white">
        <div className="flex h-full flex-col p-[4.5%]">
          <div className="flex items-center gap-[2%]">
            <span className="h-4 w-[12%] rounded-md bg-ink-950 sm:h-5" />
            <span className="h-2.5 w-[7%] rounded-full bg-ink-950/18" />
            <span className="h-2.5 w-[7%] rounded-full bg-ink-950/18" />
            <span className="h-2.5 w-[7%] rounded-full bg-ink-950/18" />
            <span className="h-2.5 w-[7%] rounded-full bg-ink-950/18" />
            <span className="ml-auto h-7 w-[9%] rounded-full border border-ink-950/25" />
            <span className="h-7 w-[9%] rounded-full bg-accent-400" />
          </div>
          <div className="mt-[4%] flex min-h-0 flex-1 gap-[3.5%]">
            <div className="flex w-[57%] flex-col justify-center gap-[5%]">
              <span className="block h-[14%] w-[96%] rounded-md bg-ink-950" />
              <div className="flex h-[14%] w-[80%] gap-[3%]">
                <span className="h-full w-[62%] rounded-md bg-ink-950" />
                <span className="h-full flex-1 rounded-md bg-accent-400" />
              </div>
              <span className="block h-[5%] w-[90%] rounded-full bg-ink-950/18" />
              <span className="block h-[5%] w-[78%] rounded-full bg-ink-950/18" />
              <span className="block h-[5%] w-[64%] rounded-full bg-ink-950/18" />
              <div className="flex gap-[3%]">
                {['x', 'y', 'z'].map((k) => (
                  <span key={k} className="flex h-7 items-center gap-1.5 rounded-full border border-line bg-white px-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                    <span className="h-2 w-8 rounded-full bg-ink-950/15" />
                  </span>
                ))}
              </div>
              <div className="flex gap-[4%]">
                <span className="h-7 w-[36%] rounded-full bg-ink-950 sm:h-9" />
                <span className="h-7 w-[30%] rounded-full border border-ink-950/30 sm:h-9" />
              </div>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-gradient-to-br from-accent-400 to-accent-600">
              <span className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-white/35 blur-xl" />
              <span className="absolute left-[10%] top-[14%] flex w-[62%] flex-col gap-2 rounded-lg bg-white/95 p-3 shadow-card">
                <span className="block h-2.5 w-[80%] rounded-full bg-ink-950/70" />
                <span className="block h-2 w-[60%] rounded-full bg-ink-950/25" />
                <span className="block h-5 w-[46%] rounded-full bg-accent-400/80" />
              </span>
              <span className="absolute bottom-3 left-3 h-[10%] w-[44%] rounded-full bg-white/70" />
              <span className="absolute bottom-3 left-[52%] h-[10%] w-[28%] rounded-full bg-ink-950/70" />
            </div>
          </div>
        </div>
      </div>

      {/* full-width dark title section — cinematic "titles form" */}
      <div className="relative min-h-0 flex-1 overflow-hidden border-b border-line bg-ink-950">
        <div className="flex h-full flex-col p-[4.5%]">
          <div className="flex items-center gap-[2%]">
            <span className="h-4 w-[12%] rounded-md bg-white/95 sm:h-5" />
            <span className="h-2.5 w-[7%] rounded-full bg-white/35" />
            <span className="h-2.5 w-[7%] rounded-full bg-white/35" />
            <span className="h-2.5 w-[7%] rounded-full bg-white/35" />
            <span className="ml-auto h-7 w-[9%] rounded-full bg-accent-400" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-[5%]">
            <span className="h-2.5 w-[15%] rounded-full bg-accent-400" />
            <span className="block h-[15%] w-[86%] rounded-lg bg-white/95" />
            <div className="flex h-[15%] w-[64%] gap-[3%]">
              <span className="h-full w-[52%] rounded-lg bg-accent-400" />
              <span className="h-full flex-1 rounded-lg bg-white/95" />
            </div>
            <span className="block h-[5%] w-[72%] rounded-full bg-white/30" />
            <span className="block h-[5%] w-[56%] rounded-full bg-white/30" />
            <div className="flex gap-[4%]">
              <span className="h-7 w-[28%] rounded-full bg-white/95 sm:h-9" />
              <span className="h-7 w-[24%] rounded-full border border-white/45 sm:h-9" />
            </div>
          </div>
          <div className="flex items-center gap-[4%]">
            {['1', '2', '3'].map((k) => (
              <span key={k} className="flex h-7 flex-1 items-center gap-2 rounded-full border border-white/20 px-4">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                <span className="h-2 w-[46%] rounded-full bg-white/30" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* cards + stats page */}
      <div className="relative min-h-0 flex-1 overflow-hidden border-b border-line bg-paper">
        <div className="flex h-full flex-col gap-[3.5%] p-[4.5%]">
          <div className="flex items-center gap-[3%]">
            <span className="block h-[13%] w-[42%] rounded-md bg-ink-950" />
            <span className="block h-[5%] w-[22%] rounded-full bg-ink-950/18" />
            <span className="ml-auto h-6 w-[12%] rounded-full bg-accent-400/80" />
          </div>
          <div className="flex min-h-0 flex-1 gap-[3%]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="flex flex-1 flex-col justify-between rounded-xl border border-line bg-white p-[7%]"
              >
                <span className="flex items-center gap-[8%]">
                  <span className="aspect-square h-[34%] rounded-md bg-accent-400/70" />
                  <span className="h-[38%] flex-1 rounded-full bg-ink-950/14" />
                </span>
                <span className="flex flex-col gap-[7%]">
                  <span className="block h-[8%] w-[86%] rounded-full bg-ink-950/70" />
                  <span className="block h-[7%] w-full rounded-full bg-ink-950/12" />
                  <span className="block h-[7%] w-[76%] rounded-full bg-ink-950/12" />
                  <span className="mt-[4%] block h-[8%] w-[44%] rounded-full bg-accent-400/70" />
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-[4%] rounded-xl bg-paper px-[4%] py-[2.5%]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="block h-3.5 w-[46%] rounded-sm bg-ink-950" />
                <span className="block h-2 w-[64%] rounded-full bg-ink-950/15" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* dark section */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-ink-950">
        <div className="flex h-full flex-col p-[4.5%]">
          <div className="flex items-center gap-[2%]">
            <span className="h-4 w-[12%] rounded-md bg-white/95 sm:h-5" />
            <span className="h-2.5 w-[7%] rounded-full bg-white/35" />
            <span className="h-2.5 w-[7%] rounded-full bg-white/35" />
            <span className="h-2.5 w-[7%] rounded-full bg-white/35" />
            <span className="ml-auto h-7 w-[9%] rounded-full bg-accent-400" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-[5%]">
            <span className="block h-[14%] w-[76%] rounded-lg bg-white/95" />
            <div className="flex h-[14%] w-[58%] gap-[3%]">
              <span className="h-full w-[58%] rounded-lg bg-accent-400" />
              <span className="h-full flex-1 rounded-lg bg-white/95" />
            </div>
            <span className="block h-[4.5%] w-[66%] rounded-full bg-white/30" />
            <span className="block h-[4.5%] w-[52%] rounded-full bg-white/30" />
            <div className="flex gap-[4%]">
              <span className="h-7 w-[26%] rounded-full bg-white/95" />
              <span className="h-7 w-[22%] rounded-full border border-white/40" />
            </div>
          </div>
          <div className="flex items-center gap-[4%]">
            <span className="h-2 w-[16%] rounded-full bg-white/25" />
            <span className="h-2 w-[12%] rounded-full bg-white/25" />
            <span className="h-2 w-[14%] rounded-full bg-white/25" />
            <span className="ml-auto h-6 w-[12%] rounded-full bg-accent-400/80" />
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Full-bleed cinematic background — a website film scrolls upward while
 * the camera cuts through wide / title-zoom / dutch-angle / close shots.
 */
function HeroCinematic() {
  return (
    <div className="absolute inset-0 overflow-hidden [perspective:1400px]" aria-hidden>
      <div className="cine-camera absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[320%] w-[150%] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-white shadow-[0_0_80px_rgba(5,12,95,0.12)]">
          <div className="cine-track absolute inset-0">
            <div className="absolute inset-x-0 top-0 flex h-1/2 flex-col">
              <CineScreens />
            </div>
            <div className="absolute inset-x-0 top-1/2 flex h-1/2 flex-col">
              <CineScreens />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,#050c5f1f)]" />
    </div>
  )
}

function HeroSection() {
  return (
    <section id="website-solutions" className="section-dark relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
      <HeroCinematic />
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/78 to-white/55 lg:bg-gradient-to-r lg:from-white/94 lg:via-white/72 lg:via-55% lg:to-transparent"
        aria-hidden
      />
      <div className="container-page relative z-10">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow">Website Development</p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
              Grow Your Brand with Expert{' '}
              <span className="text-gradient">Website Development + Marketing</span> Solutions
            </h1>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
                Talk to sales
              </a>
              <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">
                Live Chat
              </a>
              <a href="#Pricing" className="btn btn-ghost-dark btn-md">
                Get Started
              </a>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="container-page relative z-10 mt-12">
        <Reveal delay={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-line bg-white/85 px-6 py-4 text-sm text-ink-300 backdrop-blur-sm sm:px-8">
            <span className="font-semibold text-ink-950">Recommended by WordPress.org</span>
            {HERO_RATINGS.map((r) => (
              <span key={r.name}>
                {r.name}{' '}
                <strong className="text-ink-950">
                  {r.label} {r.score} {r.reviews}
                </strong>{' '}
                reviews
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function StoryCardsSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page grid gap-5 lg:grid-cols-3">
        {STORY_CARDS.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.08} className="card flex h-full flex-col p-6 sm:p-7">
            <Stars />
            <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-300">{s.quote}</p>
            <div className="mt-6 border-t border-line pt-4">
              <h4 className="font-bold text-ink-950">{s.name}</h4>
              <p className="text-sm text-ink-400">{s.role}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function DevProcessSection() {
  const why = [
    ['Expert Developers', 'Our team of seasoned professionals brings years of experience in web development, ensuring your website is built to the highest standards.'],
    ['Innovative Solutions', 'We stay ahead of the curve by leveraging the latest technologies and trends to deliver cutting-edge websites that stand out.'],
    ['Customized Designs', 'Every website we create is tailored to your brand’s unique needs, ensuring a seamless and personalized user experience.'],
    ['Scalable & Future-Ready', 'We build websites that grow with your business, equipped with features that adapt to your evolving requirements.'],
  ]
  const process = [
    ['Collaborative Planning', 'We work closely with you to understand your vision, goals, and target audience.'],
    ['Creative Design', 'Our designers craft visually appealing layouts that align with your brand identity.'],
    ['Precision Development', 'Our developers bring the design to life with clean, efficient, and responsive coding.'],
    ['Rigorous Testing', 'We ensure your website is bug-free, fast, and optimized for all devices.'],
    ['Ongoing Support', 'Even after launch, we’re here to provide maintenance and updates to keep your website running smoothly.'],
  ]
  return (
    <section id="development-process" className="section-dark py-20 sm:py-24">
      <div className="container-page grid items-start gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Why MyR</p>
          <h2 className="mt-3 text-3xl font-bold text-ink-950 sm:text-4xl">
            Your Website, Built by Skilled Developers &amp; Innovations
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-300">
            <RichText>
              At **Myr Advance Solution**, we believe your website is more than just a digital presence—it’s a reflection of your brand’s identity and a gateway to your success. Our team of **skilled developers** combines technical expertise with innovative solutions to create websites that are not only visually stunning but also highly functional and user-friendly.
            </RichText>
          </p>
          <h3 className="mt-8 text-xl font-bold text-ink-950">Why Choose Myr Advance Solution?</h3>
          <ul className="mt-4 space-y-3">
            {why.map(([t, b]) => (
              <li key={t} className="flex gap-3 rounded-xl border border-line bg-ink-950/[0.04] p-4 text-sm text-ink-200">
                <span className="text-accent-600" aria-hidden>✦</span>
                <span>
                  <strong className="text-ink-950">{t}:</strong> {b}
                </span>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 text-xl font-bold text-ink-950">Our Development Process:</h3>
          <ul className="mt-4 space-y-3">
            {process.map(([t, b]) => (
              <li key={t} className="flex gap-3 rounded-xl border border-line bg-ink-950/[0.04] p-4 text-sm text-ink-200">
                <span className="text-accent-600" aria-hidden>✦</span>
                <span>
                  <strong className="text-ink-950">{t}:</strong> {b}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.12} className="lg:sticky lg:top-24">
          <img
            src="/assets/2025-02-website-design-MyR-Advance-Solution-3.png"
            alt="Website design process at MyR Advance Solution"
            loading="lazy"
            className="w-full rounded-[2rem] border border-line object-cover shadow-card"
            width={1280}
            height={800}
          />
        </Reveal>
      </div>
    </section>
  )
}

function SupportSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SupportBlock
            heading="24/7 support for your website's success."
            bullets={[
              <>
                Access expert support whenever you need it via <strong className="text-ink-950">live chat and email</strong>
              </>,
              <>
                Our specialists are adept at handling diverse needs, so you can be sure communication and support will be{' '}
                <strong className="text-ink-950">seamless.</strong>
              </>,
              <>
                Spend less time waiting, our speedy support team typically responds in under{' '}
                <strong className="text-ink-950">a few minutes</strong>
              </>,
            ]}
            ctaLabel="👋Got Questions? Chat Now!"
            image="/assets/2025-02-web-support.jpg"
          />
        </Reveal>
      </div>
    </section>
  )
}

function TrustpilotBlurbsSection() {
  return (
    <section className="section-dark border-y border-line py-16">
      <div className="container-page grid gap-5 md:grid-cols-3">
        {TRUSTPILOT_QUOTES.map((q, i) => (
          <Reveal key={i} delay={i * 0.08} className="card p-6">
            <p className="text-sm font-semibold text-accent-600">Trustpilot</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">{q}</p>
          </Reveal>
        ))}
      </div>
      <div className="container-page mt-12">
        <Reveal>
          <div className="card p-6 sm:p-8">
            <p className="text-lg font-bold text-ink-950">Enjoy all this. At no extra cost.</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ENJOY_FREE.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-200">
                  <Check /> {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          title="Trusted by 3K+ website owners"
          /* 3K+ claim preserved as-is (flag §7 customer-count claims coexist). */
          sub="Real stories from website owners who chose MyR Advance Solution."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="card flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt=""
                  loading="lazy"
                  className="h-14 w-14 rounded-full border border-line object-cover"
                  width={500}
                  height={500}
                />
                <div>
                  <h3 className="font-bold text-ink-950">{t.name}</h3>
                  <p className="text-sm text-ink-400">{t.role}</p>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-300">{t.quote}</p>
              <div className="mt-5">
                <Stars />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function IncludedTablet({ activeIndex }: { activeIndex: number }) {
  const item = INCLUDED[activeIndex]
  const details = [
    { label: 'Launch your website', value: 'Ready to grow', bars: ['w-[86%]', 'w-[64%]', 'w-[76%]'] },
    { label: 'Security status', value: 'Protected', bars: ['w-[72%]', 'w-[88%]', 'w-[58%]'] },
    { label: 'Service availability', value: '99.9%', bars: ['w-[92%]', 'w-[82%]', 'w-[88%]'] },
    { label: 'Website overview', value: 'All in one place', bars: ['w-[66%]', 'w-[84%]', 'w-[72%]'] },
    { label: 'Support team', value: 'Online 24/7', bars: ['w-[78%]', 'w-[60%]', 'w-[90%]'] },
  ][activeIndex]

  return (
    <div className="relative mx-auto w-full max-w-[640px] rounded-[1.5rem] border-[4px] border-slate-800 bg-slate-800 p-1 shadow-[0_35px_80px_-32px_rgba(15,23,42,.65)] sm:rounded-[2rem] sm:border-[6px] sm:p-1.5">
      <div className="absolute left-1/2 top-[2px] z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-600" />
      <div className="relative aspect-[1.28] overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-slate-50 via-white to-orange-50/70 p-[7%] sm:rounded-[1.6rem]">
        <div className="mb-[5%] flex items-center justify-between border-b border-slate-200 pb-[3%]">
          <span className="flex items-center gap-2 text-[clamp(9px,1.15vw,14px)] font-bold text-slate-900"><span className="grid h-5 w-5 place-items-center rounded-md bg-orange-500 text-[10px] text-white">M</span> MYR Studio</span>
          <span className="h-2 w-[20%] rounded-full bg-slate-200" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="h-[82%]"
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <span className="text-[clamp(8px,.9vw,11px)] font-bold uppercase tracking-[.18em] text-orange-600">Included feature 0{activeIndex + 1}</span>
                <h3 className="mt-[2%] max-w-[90%] text-[clamp(18px,2.6vw,32px)] font-bold leading-tight text-slate-950">{item.title}</h3>
                <p className="mt-[2%] max-w-[80%] text-[clamp(9px,1.1vw,14px)] leading-relaxed text-slate-500">{item.body}</p>
              </div>
              <div className="grid grid-cols-[1.1fr_.9fr] gap-[4%]">
                <div className="rounded-xl border border-slate-200 bg-white p-[6%] shadow-sm">
                  <span className="block text-[clamp(8px,.85vw,11px)] text-slate-400">{details.label}</span>
                  <strong className="mt-1 block text-[clamp(13px,1.7vw,21px)] text-slate-900">{details.value}</strong>
                  <div className="mt-[8%] space-y-[5%]">
                    {details.bars.map((width, i) => <span key={i} className={`block h-1.5 rounded-full bg-slate-100 ${width}`}><i className={`block h-full rounded-full ${i === 0 ? 'bg-orange-400' : 'bg-slate-200'} ${i === 0 ? 'w-[72%]' : 'w-full'}`} /></span>)}
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 p-[7%] text-white shadow-sm">
                  <span className="text-[clamp(8px,.85vw,11px)] text-white/80">Your plan</span>
                  <span className="text-[clamp(13px,1.8vw,22px)] font-bold">All set <span aria-hidden>✓</span></span>
                  <span className="h-1.5 w-[56%] rounded-full bg-white/55" />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function IncludedSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const featureListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = featureListRef.current
    if (!root) return
    const features = Array.from(root.querySelectorAll<HTMLElement>('[data-included-feature]'))
    const observer = new IntersectionObserver((entries) => {
      const centered = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (centered) setActiveIndex(Number((centered.target as HTMLElement).dataset.includedFeature))
    }, { rootMargin: '-38% 0px -38% 0px', threshold: [0, 0.2, 0.5, 0.8, 1] })
    features.forEach((feature) => observer.observe(feature))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Every plan" title="Included with every plan" />
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div ref={featureListRef} className="order-2 lg:order-1">
            {INCLUDED.map((item, index) => (
              <article
                key={item.title}
                data-included-feature={index}
                className="flex min-h-[26vh] items-center py-3 sm:min-h-[30vh]"
              >
                <div className={`card w-full p-6 transition duration-500 sm:p-8 ${activeIndex === index ? 'border-orange-400/60 shadow-xl shadow-orange-950/10' : 'opacity-75'}`}>
                  <span className="text-xs font-bold uppercase tracking-[.18em] text-accent-600">0{index + 1} / 0{INCLUDED.length}</span>
                  <h3 className="mt-3 text-xl font-bold text-ink-950 sm:text-2xl">{item.title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-400 sm:text-base">{item.body}</p>
                  <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.45 }} className="mt-5 lg:hidden">
                    <IncludedTablet activeIndex={index} />
                  </motion.div>
                </div>
              </article>
            ))}
            <div className="py-8">
              <a href="#Pricing" className="btn btn-primary btn-lg w-full">Get Started</a>
            </div>
          </div>
          <div className="hidden lg:order-2 lg:sticky lg:top-[20vh] lg:block lg:self-start">
            <IncludedTablet activeIndex={activeIndex} />
          </div>
        </div>
      </div>
    </section>
  )
}

function ComparePlansSection() {
  const { add } = useCart()
  const navigate = useNavigate()
  const price2765 = useCatalogPrice(2765, 14499)
  const price2766 = useCatalogPrice(2766, 24499)
  const price2767 = useCatalogPrice(2767, 59499)
  const currentPrices = [price2765, price2766, price2767]

  const buy = (productId: number) => {
    const plan = WEBSITE_PLANS.find((p) => p.productId === productId)
    if (!plan) return
    add({ id: productId, qty: 1, price: currentPrices[WEBSITE_PLANS.indexOf(plan)], name: plan.name })
    navigate('/checkout/')
  }

  const prices: [string, string, string] = [`₹30,000 ${inr(price2765, { paise: false })}`, `₹60,699 ${inr(price2766, { paise: false })}`, `₹75,000 ${inr(price2767, { paise: false })}`]

  return (
    <section id="viewallfeatures" className="section-light py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          tone="light"
          eyebrow="Plans"
          title="Compare our plans"
          sub="See at a glance what each plan costs and what you get for your money."
        />
        <Reveal className="mt-12 overflow-x-auto rounded-2xl border border-ink-900/10 bg-white shadow-[0_24px_60px_-45px_rgb(2_6_23/0.4)]">
          <p className="border-b border-ink-900/8 px-4 py-2 text-xs font-medium text-ink-500 sm:hidden">
            ← Swipe to compare plans →
          </p>
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/10">
                <th className="sticky left-0 z-10 w-[36%] bg-white p-4 text-xs font-bold uppercase tracking-wide text-ink-500" />
                {WEBSITE_PLANS.map((p) => (
                  <th key={p.productId} className="p-4 text-center">
                    {p.tag?.tone === 'popular' && (
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-accent-600">
                        Most Popular
                      </span>
                    )}
                    <span className="block font-bold text-ink-900">{p.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink-900/8">
                <td className="sticky left-0 z-10 bg-white p-4" />
                {prices.map((price, i) => (
                  <td key={i} className="p-4 text-center font-display text-lg font-bold text-ink-900">
                    {price}
                  </td>
                ))}
              </tr>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-ink-900/8 last:border-0">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-white p-4 text-left align-top text-xs font-medium text-ink-600"
                  >
                    {row.label}
                  </th>
                  {row.cells.map((cell, i) => (
                    <td key={i} className="p-4 text-center align-top text-ink-700">
                      {cell === true ? <Check /> : cell === null || cell === '' ? '' : cell}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-ink-900/10">
                <td className="sticky left-0 z-10 bg-white p-4" />
                {WEBSITE_PLANS.map((p) => (
                  <td key={p.productId} className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => buy(p.productId)}
                      className="btn btn-primary btn-sm"
                    >
                      Buy Now
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  )
}

function FaqSection() {
  /* Website-development page FAQs — 6 questions, verbatim from this page's manifest. */
  const items = [
    {
      q: 'How much does website development cost in India or the US?',
      a: (
        <p>
          <RichText>
            Business websites start around **₹15,000 for India-based clients** and near **$1,000 for US clients**, scaling with design, pages and integrations. Ecommerce and custom web apps are quoted individually, with a **fixed, itemised estimate in INR or USD** before work starts.
          </RichText>
        </p>
      ),
    },
    {
      q: 'How long does it take to build my website?',
      a: (
        <p>
          <RichText>
            Your website goes **live with a maintenance or coming soon page within 24 hours**. The full development is completed within **15-20 days**, based on content and requirements.
          </RichText>
        </p>
      ),
    },
    {
      q: 'Will my website rank on Google and appear in AI search results?',
      a: (
        <p>
          <RichText>
            Every build includes **technical SEO**: semantic HTML, schema markup, sitemap and robots setup, and **Core Web Vitals optimisation**. Content structure is designed for **Google's AI Overviews** and answer engines such as ChatGPT, and advanced SEO campaigns for India, the US or global markets are available as add-on plans.
          </RichText>
        </p>
      ),
    },
    {
      q: 'Will my website be mobile-friendly and fast?',
      a: (
        <p>
          <RichText>
            Yes. All our websites are **fully responsive** and are built to pass modern **Core Web Vitals targets** for speed and stability, tested on both mobile and desktop devices.
          </RichText>
        </p>
      ),
    },
    {
      q: "Can I update my website after it's live?",
      a: (
        <p>
          Yes. We provide easy-to-use tools and support so you can manage updates effortlessly, and
          our team is available for any changes you would rather outsource.
        </p>
      ),
    },
    {
      q: 'What support do I get after my website is launched?',
      a: (
        <p>
          <RichText>
            We provide **24/7 support via [live chat,](https://1367.3cx.cloud/myradvancesolutionpr) a dedicated WhatsApp group and phone**, while email queries are answered within **24 hours**. Maintenance, backups and content updates can be bundled with your plan.
          </RichText>
        </p>
      ),
    },
  ]

  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="FAQS"
          title="Website Development (FAQs)"
          sub="Answers to common questions about building your website with MyR Advance Solution."
        />
        <div className="mt-12">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export function WebsiteDevelopmentPage() {
  return (
    <>
      <HeroSection />
      <LiveBuilder />
      <PricingPlans
        id="Pricing"
        eyebrow="Pick your perfect plan"
        title="Pick your perfect plan"
        sub="Get started in complete confidence. Our 30-day money-back guarantee means it’s risk-free."
      />
      <StoryCardsSection />
      <DevProcessSection />
      <SupportSection />
      <TrustpilotBlurbsSection />
      <TestimonialsSection />
      <IncludedSection />
      <ComparePlansSection />
      <FaqSection />
    </>
  )
}
