import { useEffect, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { CHAT_SALES } from '@/components/layout/nav'
import { SubscriptionPlans } from '@/components/commerce/SubscriptionPlans'
const MODULES = [
  { name: 'People directory', short: 'People', icon: '◎', eyebrow: 'ONE PEOPLE VIEW', headline: 'Every person, connected.', text: 'Bring employee details, roles, documents, and important moments together in one clear home.' },
  { name: 'Time & attendance', short: 'Attendance', icon: '◷', eyebrow: 'TIME, MADE SIMPLE', headline: 'Know who’s in, at a glance.', text: 'Keep schedules, leave requests, and attendance updates visible to the whole team.' },
  { name: 'Payroll & benefits', short: 'Payroll', icon: '₹', eyebrow: 'PAYDAY WITHOUT THE CHASE', headline: 'Make every pay cycle smoother.', text: 'Organize payroll inputs, benefits, and approvals in a consistent monthly workflow.' },
  { name: 'Hiring & onboarding', short: 'Hiring', icon: '↗', eyebrow: 'FROM OFFER TO FIRST DAY', headline: 'Give new teammates a warm welcome.', text: 'Track applicants, offers, documents, and onboarding steps from one shared pipeline.' },
  { name: 'Performance & growth', short: 'Growth', icon: '✳', eyebrow: 'GROW WITH YOUR PEOPLE', headline: 'Make progress part of the routine.', text: 'Set goals, share feedback, and plan development conversations with less admin.' },
]

const PEOPLE = [
  { name: 'Aarav Mehta', role: 'Product design', initials: 'AM', color: '#f7c7a5', status: 'Working' },
  { name: 'Maya Sharma', role: 'People operations', initials: 'MS', color: '#d9ccff', status: 'Working' },
  { name: 'Rohan Kapoor', role: 'Sales team', initials: 'RK', color: '#b8e2d5', status: 'On leave' },
]

const MODULE_SCREENS = [
  { metrics: [['Team members', '128', '+8 this month'], ['At work today', '96', '76% of team'], ['Onboarding', '12', '4 starting soon']], table: 'Team directory', insight: 'People pulse', rows: ['Aarav Mehta · Product design', 'Maya Sharma · People operations'] },
  { metrics: [['Present today', '96', 'On schedule'], ['On leave', '08', 'Across 4 teams'], ['Pending requests', '03', 'Needs review']], table: 'Today’s attendance', insight: 'Weekly coverage', rows: ['Aarav Mehta · Checked in 9:02', 'Maya Sharma · Checked in 8:48'] },
  { metrics: [['Payroll cycle', 'Ready', 'November preview'], ['To approve', '04', 'Manager review'], ['Benefits enrolled', '112', '87% of team']], table: 'Payroll checklist', insight: 'Monthly summary', rows: ['Salary changes · 2 to review', 'New joiners · 4 to include'] },
  { metrics: [['Open roles', '06', 'Across 3 teams'], ['In interview', '14', 'Next 7 days'], ['New starters', '04', 'This month']], table: 'Hiring pipeline', insight: 'Candidate stages', rows: ['Senior designer · Final round', 'People associate · Interview'] },
  { metrics: [['Goals in progress', '42', 'Across all teams'], ['Check-ins booked', '18', 'This month'], ['Growth plans', '27', 'Recently updated']], table: 'Team development', insight: 'Goal progress', rows: ['Product team · Q4 goals', 'People team · Monthly check-in'] },
]

function DashboardPreview({ activeModule, tablet = false }: { activeModule: number; tablet?: boolean }) {
  const module = MODULES[activeModule]
  const screen = MODULE_SCREENS[activeModule]
  return (
    <div className={`overflow-hidden border border-white/70 bg-[#f5f7fb] text-slate-800 ${tablet ? 'h-full rounded-[1.35rem] shadow-none' : 'rounded-2xl shadow-[0_28px_90px_-34px_rgba(15,23,42,.55)]'}`}>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5 sm:px-4"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-600 text-xs font-black text-white">h</span><b className="text-[10px] sm:text-xs">people<span className="text-indigo-600">.space</span></b></div><div className="hidden items-center gap-1 text-[8px] text-slate-400 sm:flex"><span>My workspace</span><span>/</span><span className="font-semibold text-slate-600">{module.short}</span></div><div className="flex items-center gap-2"><span className="hidden text-[8px] text-slate-400 sm:block">Monday, 28 October</span><span className="grid h-7 w-7 place-items-center rounded-full bg-orange-100 text-[8px] font-bold text-orange-700">AM</span></div></div>
      <div className={`grid grid-cols-[44px_1fr] sm:grid-cols-[145px_1fr] ${tablet ? 'h-[calc(100%-43px)] min-h-[205px]' : 'min-h-[250px] sm:min-h-[300px]'}`}>
        <aside className="bg-slate-950 p-1.5 text-white sm:p-3"><p className="hidden px-2 py-2 text-[7px] font-bold uppercase tracking-widest text-slate-500 sm:block">Workspace</p>{['Overview', 'People', 'Attendance', 'Payroll', 'Hiring'].map((item, i) => <div key={item} className={`mt-1 grid min-h-8 place-items-center rounded-lg text-[7px] sm:flex sm:justify-start sm:gap-2 sm:px-2 sm:text-[9px] ${i === activeModule ? 'bg-indigo-500/25 font-semibold text-indigo-200' : 'text-slate-400'}`}><span className="text-xs">{['▦', '◎', '◷', '₹', '↗'][i]}</span><span className="hidden sm:inline">{item}</span></div>)}</aside>
        <div className="min-w-0 overflow-y-auto p-2.5 sm:p-4"><div className="flex items-start justify-between gap-2"><div><p className="text-[7px] font-bold uppercase tracking-[.16em] text-indigo-600 sm:text-[8px]">{module.eyebrow}</p><h3 className="mt-1 text-[13px] font-bold leading-tight sm:text-lg">{module.headline}</h3><p className="mt-1 max-w-sm text-[7px] leading-relaxed text-slate-500 sm:text-[9px]">{module.text}</p></div><button type="button" className="shrink-0 rounded-md bg-indigo-600 px-2 py-1.5 text-[7px] font-semibold text-white sm:px-3 sm:text-[8px]">+ Add</button></div>
          <AnimatePresence mode="wait"><motion.div key={activeModule} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .2 }}>
            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:gap-2">{screen.metrics.map(([label, value, detail], i) => <motion.div key={label} initial={{ opacity: 0, y: 8, rotateX: -5 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: .32, delay: i * .055 }} style={{ transformPerspective: 700 }} className="rounded-lg border border-slate-200 bg-white p-1.5 shadow-[0_4px_10px_-8px_rgba(15,23,42,.35)] sm:p-2.5"><span className="block truncate text-[6px] text-slate-400 sm:text-[8px]">{label}</span><b className="mt-1 block text-[11px] sm:text-base">{value}</b><span className={`mt-0.5 block truncate text-[6px] sm:text-[7px] ${i === 2 ? 'text-indigo-500' : 'text-emerald-600'}`}>{detail}</span></motion.div>)}</div>
            <div className="mt-2 grid gap-2 sm:mt-3 sm:grid-cols-[1.1fr_.9fr]"><motion.div initial={{ opacity: 0, y: 9, rotateY: -4 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} transition={{ duration: .36, delay: .12 }} style={{ transformPerspective: 850 }} className="rounded-lg border border-slate-200 bg-white p-2 shadow-[0_6px_14px_-12px_rgba(15,23,42,.45)] sm:p-3"><div className="flex items-center justify-between"><b className="text-[7px] sm:text-[9px]">{screen.table}</b><span className="text-[6px] text-indigo-600 sm:text-[7px]">View all →</span></div>{screen.rows.map((row, index) => <motion.div key={row} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .18 + index * .07 }} className="mt-2 flex items-center gap-1.5 border-t border-slate-100 pt-1.5"><span className="grid h-5 w-5 place-items-center rounded-full text-[6px] font-bold text-slate-700 sm:h-6 sm:w-6" style={{ backgroundColor: PEOPLE[index].color }}>{PEOPLE[index].initials}</span><div className="min-w-0 flex-1"><b className="block truncate text-[6px] sm:text-[8px]">{row.split(' · ')[0]}</b><span className="block truncate text-[6px] text-slate-400 sm:text-[7px]">{row.split(' · ')[1]}</span></div><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/></motion.div>)}</motion.div><motion.div initial={{ opacity: 0, y: 9, rotateY: 4 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} transition={{ duration: .36, delay: .18 }} style={{ transformPerspective: 850 }} className="rounded-lg border border-slate-200 bg-white p-2 shadow-[0_6px_14px_-12px_rgba(15,23,42,.45)] sm:p-3"><div className="flex items-center justify-between"><b className="text-[7px] sm:text-[9px]">{screen.insight}</b><span className="text-[6px] text-slate-400 sm:text-[7px]">This week⌄</span></div><div className="mt-2 flex h-12 items-end gap-1 sm:h-16">{[35, 60, 42, 78, 55, 88, 69, 96, 72, 84, 63, 100].map((height, i) => <motion.i key={i} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: .4, delay: .22 + i * .025 }} className="flex-1 rounded-t-sm bg-indigo-400"/>)}</div><div className="mt-1 flex justify-between text-[6px] text-slate-400"><span>Mon</span><span>Wed</span><span>Fri</span></div></motion.div></div>
          </motion.div></AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function TabletFeatureShowcase({ activeModule, onSelect, reduceMotion }: { activeModule: number; onSelect: (index: number) => void; reduceMotion: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-[920px] [perspective:1600px]">
      <motion.div whileHover={reduceMotion ? undefined : { rotateX: 1.5, rotateY: -1.5, y: -3 }} transition={{ type: 'spring', stiffness: 180, damping: 22 }} style={{ transformStyle: 'preserve-3d' }} className="relative rounded-[2.1rem] border border-slate-500/40 bg-gradient-to-br from-slate-500 via-slate-800 to-slate-600 p-[6px] shadow-[0_35px_75px_-32px_rgba(15,23,42,.55)] sm:rounded-[2.7rem] sm:p-3">
        <div className="rounded-[1.75rem] bg-[#090b14] p-1.5 sm:rounded-[2.25rem] sm:p-2.5">
          <div className="relative overflow-hidden rounded-[1.3rem] bg-slate-100 aspect-[1.28] sm:rounded-[1.8rem] sm:aspect-[1.45] lg:aspect-[1.55]">
            <span className="absolute left-1/2 top-1 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-slate-500 shadow-[0_0_0_2px_#151722] sm:top-1.5"/>
            <DashboardPreview activeModule={activeModule} tablet/>
          </div>
        </div>
        <span className="absolute bottom-[3px] left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-300/70 sm:bottom-1 sm:w-14" aria-hidden/>
      </motion.div>
      <div className="mt-4 flex items-center justify-center gap-1.5 overflow-x-auto pb-1 sm:gap-2" role="tablist" aria-label="HRM tablet feature screen">
        {MODULES.map((module, index) => <button key={module.name} type="button" role="tab" aria-selected={activeModule === index} onClick={() => onSelect(index)} className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[9px] font-semibold transition sm:px-3.5 ${activeModule === index ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700'}`}><span className="text-xs">{module.icon}</span><span>{module.short}</span></button>)}
      </div>
      <p className="mt-2 text-center text-[9px] text-slate-400">Select a feature to change what’s on the tablet screen</p>
    </div>
  )
}

export function HRMSolutionsPage() {
  const [activeModule, setActiveModule] = useState(0)
  const [heroModule, setHeroModule] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const tiltX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18, mass: .7 })
  const tiltY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18, mass: .7 })
  const resetTilt = () => { tiltX.set(0); tiltY.set(0) }
  const handleDashboardPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    tiltX.set((.5 - y) * 9)
    tiltY.set((x - .5) * 11)
  }
  useEffect(() => {
    if (reduceMotion || heroPaused) return
    const timer = window.setInterval(() => setHeroModule((current) => (current + 1) % MODULES.length), 4600)
    return () => window.clearInterval(timer)
  }, [heroPaused, reduceMotion])
  return (
    <div className="overflow-hidden bg-[#f8f9fc] text-slate-900">
      <section className="relative isolate overflow-hidden bg-[#101225] py-16 text-white sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_25%,rgba(99,102,241,.3),transparent_38%),radial-gradient(ellipse_at_15%_90%,rgba(236,72,153,.11),transparent_38%)]"/>
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[.12] [background-image:radial-gradient(rgba(255,255,255,.5)_0.7px,transparent_0.7px)] [background-size:22px_22px]"/>
        {!reduceMotion && <motion.div aria-hidden className="pointer-events-none absolute -right-32 top-8 -z-10 h-80 w-80 rounded-full border border-indigo-300/15" animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}/>}
        <div className="container-page grid items-center gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-indigo-200"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none"/>People-first HRM</span>
            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">Make work feel a little more <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">human.</span></h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">Bring people, attendance, hiring, payroll, and growth into one calm workspace—so your team can spend less time chasing admin and more time doing meaningful work.</p>
            <div className="mt-7 flex flex-wrap gap-3"><a href="#hrm-workspace" className="inline-flex min-h-11 items-center rounded-xl bg-indigo-500 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:-translate-y-0.5 hover:bg-indigo-400">Explore the HRM workspace <span className="ml-2">↓</span></a><a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10">Talk to our team ↗</a></div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[10px] text-slate-400"><span><b className="text-white">01</b> Shared people data</span><span><b className="text-white">02</b> Clear team workflows</span><span><b className="text-white">03</b> Useful at every size</span></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30, scale: .98 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: .7, delay: .15 }} className="relative [perspective:1200px]" onPointerMove={handleDashboardPointer} onPointerEnter={() => setHeroPaused(true)} onPointerLeave={() => { setHeroPaused(false); resetTilt() }} onFocusCapture={() => setHeroPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeroPaused(false) }}>
            <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200, transformStyle: 'preserve-3d' }} animate={reduceMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="relative z-10 will-change-transform"><AnimatePresence mode="wait"><motion.div key={heroModule} initial={reduceMotion ? false : { opacity: 0, x: 14, rotateY: 3, scale: .99 }} animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, x: -10, rotateY: -2, scale: .995 }} transition={{ duration: reduceMotion ? 0 : .42, ease: [.22, 1, .36, 1] }} style={{ transformPerspective: 1100, transformStyle: 'preserve-3d' }}><DashboardPreview activeModule={heroModule}/></motion.div></AnimatePresence></motion.div>
            <div className="relative z-20 mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[.06] px-3 py-2 backdrop-blur-sm" aria-label="Automatic HRM feature preview"><span className="flex min-w-0 items-center gap-2 text-[9px] text-slate-300"><i className={`h-1.5 w-1.5 shrink-0 rounded-full ${heroPaused || reduceMotion ? 'bg-indigo-300' : 'animate-pulse bg-emerald-400 motion-reduce:animate-none'}`}/><span className="truncate">{heroPaused ? 'Preview paused' : reduceMotion ? 'Feature preview' : 'Now showing'} · <b className="text-white">{MODULES[heroModule].short}</b></span></span><div className="flex shrink-0 items-center gap-1">{MODULES.map((module, index) => <button key={module.short} type="button" onClick={() => setHeroModule(index)} aria-label={`Show ${module.name} preview`} aria-pressed={heroModule === index} className={`h-1.5 rounded-full transition-all duration-300 ${heroModule === index ? 'w-5 bg-indigo-300' : 'w-1.5 bg-white/30 hover:bg-white/60'}`}/>)}</div></div>
            {!reduceMotion && <><motion.div aria-hidden animate={{ y: [0, -7, 0], rotate: [-4, -2, -4] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="pointer-events-none absolute -right-4 top-8 -z-0 hidden h-24 w-20 rounded-2xl border border-white/15 bg-gradient-to-br from-indigo-400/25 to-white/5 shadow-2xl backdrop-blur sm:block"/><motion.div aria-hidden animate={{ y: [0, 6, 0], rotate: [3, 1, 3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: .7 }} className="pointer-events-none absolute -bottom-5 right-8 -z-0 hidden h-16 w-28 rounded-xl border border-white/15 bg-gradient-to-r from-violet-300/20 to-white/5 shadow-xl backdrop-blur sm:block"/></>}
            <motion.div initial={reduceMotion ? false : { opacity: 0, scale: .9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .65, type: 'spring', stiffness: 180, damping: 18 }} className="absolute -bottom-5 -left-2 z-20 hidden rounded-xl border border-white/70 bg-white/95 p-3 text-slate-800 shadow-[0_16px_45px_-18px_rgba(15,23,42,.55)] sm:block"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-sm text-emerald-700">✓</span><span><b className="block text-[10px]">Onboarding complete</b><small className="text-[8px] text-slate-400">Welcome to the team, Maya!</small></span></div></motion.div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, scale: .9, x: 8 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: .95, type: 'spring', stiffness: 180, damping: 18 }} className="absolute -right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-xl border border-white/70 bg-white/95 p-3 text-slate-800 shadow-[0_16px_45px_-18px_rgba(15,23,42,.55)] md:block"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-sm text-indigo-600">◷</span><span><b className="block text-[10px]">Leave approved</b><small className="text-[8px] text-slate-400">Aarav · 2 days</small></span></div></motion.div>
          </motion.div>
        </div>
      </section>

      <SubscriptionPlans
        productId={6005}
        name="HRM Software"
        heading="Ready to make people operations simpler?"
        sub="Choose a plan that fits your team. Every plan includes people directory, time & attendance, payroll and hiring."
      />

      <section id="hrm-workspace" className="scroll-mt-20 py-16 sm:py-20">
        <div className="container-page"><div className="mx-auto max-w-2xl text-center"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-indigo-600">One connected employee journey</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">People operations, with room to breathe.</h2><p className="mt-3 text-sm leading-relaxed text-slate-500">Choose a workspace area to see how everyday HR work can feel more connected.</p></div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{MODULES.map((module, i) => <motion.button key={module.name} type="button" onClick={() => setActiveModule(i)} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .45, delay: i * .07 }} whileHover={reduceMotion ? undefined : { y: -5, rotateX: 2, rotateY: i % 2 ? -2 : 2 }} whileTap={{ scale: .98 }} style={{ transformPerspective: 800 }} className={`rounded-2xl border p-4 text-left transition-colors ${activeModule === i ? 'border-indigo-300 bg-white shadow-lg shadow-indigo-100 ring-1 ring-indigo-200' : 'border-slate-200 bg-white/70 hover:border-indigo-200'}`} aria-pressed={activeModule === i}><span className={`grid h-10 w-10 place-items-center rounded-xl text-lg transition-transform duration-300 ${activeModule === i ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>{module.icon}</span><b className="mt-3 block text-xs">{module.name}</b><span className="mt-1 block text-[9px] text-slate-500">Explore module ↗</span></motion.button>)}</div>
          <div className="mt-6 grid items-center gap-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-[.72fr_1.28fr]"><AnimatePresence mode="wait"><motion.div key={activeModule} initial={reduceMotion ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? undefined : { opacity: 0, x: 12 }} transition={{ duration: reduceMotion ? 0 : .22 }}><p className="text-[9px] font-bold uppercase tracking-[.18em] text-indigo-600">{MODULES[activeModule].eyebrow}</p><h3 className="mt-2 text-2xl font-bold leading-tight">{MODULES[activeModule].headline}</h3><p className="mt-3 text-sm leading-relaxed text-slate-500">{MODULES[activeModule].text}</p><ul className="mt-4 space-y-2 text-xs text-slate-600">{['A shared source of truth for your team', 'Clear actions, owners, and next steps', 'Flexible workflows that grow with you'].map((item, i) => <motion.li key={item} initial={reduceMotion ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : i * .07 }} className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-[9px] font-bold text-emerald-600">✓</span>{item}</motion.li>)}</ul></motion.div></AnimatePresence><TabletFeatureShowcase activeModule={activeModule} onSelect={setActiveModule} reduceMotion={Boolean(reduceMotion)}/></div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20"><div className="container-page"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-indigo-600">Designed around real work</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">From first hello to a thriving team.</h2><p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-500">A good HRM system should make the important moments easier to coordinate, easier to understand, and more personal for everyone.</p><a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-indigo-600">Plan your HRM setup ↗</a></div><div className="grid gap-3 sm:grid-cols-2">{[{ n: '01', title: 'Bring your people data together', body: 'Keep roles, team details, policies, and records easy to find.' }, { n: '02', title: 'Give managers a clear view', body: 'Make attendance, leave, and approvals easier to coordinate.' }, { n: '03', title: 'Make joining feel welcoming', body: 'Help new teammates know what to do before day one.' }, { n: '04', title: 'Support growth over time', body: 'Create space for goals, feedback, and development.' }].map((item, i) => <motion.article key={item.n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ delay: i * .08 }} className="rounded-2xl border border-slate-200 bg-[#fafbfe] p-5"><span className="text-xs font-bold text-indigo-500">{item.n} /</span><h3 className="mt-3 text-sm font-bold">{item.title}</h3><p className="mt-2 text-xs leading-relaxed text-slate-500">{item.body}</p></motion.article>)}</div></div></div></section>

      <section className="relative isolate overflow-hidden bg-[#111326] py-16 text-white sm:py-20"><div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_10%,rgba(99,102,241,.3),transparent_40%)]"/><div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-indigo-300">Let’s build a better workday</p><h2 className="mt-2 max-w-2xl text-3xl font-bold sm:text-4xl">Ready to make people operations simpler?</h2><p className="mt-3 max-w-xl text-sm text-slate-300">Tell us about your team and the HR workflows you want to improve.</p></div><a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center rounded-xl bg-indigo-500 px-5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-400">Talk to our team ↗</a></div></section>
    </div>
  )
}
