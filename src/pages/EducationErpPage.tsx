import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Reveal, SectionHeading, Stagger, StaggerItem } from '@/components/ui'

type Institution = 'School' | 'College' | 'Coaching'

const institutionContent: Record<Institution, { title: string; subtitle: string; stats: [string, string][]; rows: [string, string, string][]; groups: { title: string; icon: string; modules: string[] }[] }> = {
  School: {
    title: 'School ERP', subtitle: 'Classes, families and daily campus operations in sync.',
    stats: [['Enrolled students', '2,486'], ['Present today', '94.2%'], ['Fee collection', '82%']],
    rows: [['Class 10 · Mathematics', '09:00 AM', 'In progress'], ['Class 8 · Science', '10:15 AM', 'Next up'], ['Class 6 · English', '11:30 AM', 'Upcoming']],
    groups: [
      { title: 'Student & campus administration', icon: '01', modules: ['Admissions & enquiry tracking', 'Student and guardian records', 'Class, section & academic year setup', 'Attendance, leave & late arrivals', 'Timetable & substitute planning', 'Transport routes & vehicle records', 'Library, inventory & asset tracking', 'Hostel and house management'] },
      { title: 'Teaching & assessment', icon: '02', modules: ['Subjects, lesson plans & homework', 'Exams, gradebooks & report cards', 'Online tests and assignment tracking', 'Certificates, ID cards & transfer records', 'Academic calendar, events & notices'] },
      { title: 'Fees & family communication', icon: '03', modules: ['Fee structures, concessions & instalments', 'Invoices, receipts, dues & reminders', 'Parent, student & teacher portals', 'Announcements via app, email or SMS', 'Progress, attendance & finance reports'] },
    ],
  },
  College: {
    title: 'College ERP', subtitle: 'A connected view across departments, semesters and services.',
    stats: [['Active learners', '8,240'], ['Departments', '18'], ['Attendance today', '91.6%']],
    rows: [['BSc Computer Science · Lecture', '09:30 AM', 'In progress'], ['BCom · Semester IV', '11:00 AM', 'Next up'], ['MBA · Seminar room 2', '01:15 PM', 'Upcoming']],
    groups: [
      { title: 'Admissions & academic structure', icon: '01', modules: ['Online applications & admission workflow', 'Programs, departments, courses & electives', 'Semester, credit & subject registration', 'Student lifecycle, documents & transfers', 'Faculty, workload & department records', 'Timetable, rooms & resource scheduling', 'Attendance, leave & academic eligibility'] },
      { title: 'Exams, learning & campus life', icon: '02', modules: ['Exam planning, hall tickets & seating', 'Marks, grading, transcripts & results', 'Learning materials, assignments & LMS links', 'Library catalog, issue & return records', 'Hostel, transport & campus facilities', 'Placement, internship & alumni records'] },
      { title: 'Finance & institutional oversight', icon: '03', modules: ['Tuition, scholarships & payment schedules', 'Receipts, dues, refunds & reconciliation', 'Faculty HR, payroll & leave workflows', 'Purchasing, inventory & asset registers', 'Role-based approvals & audit history', 'Department, accreditation & outcome reports'] },
    ],
  },
  Coaching: {
    title: 'Coaching ERP', subtitle: 'Manage enquiries, batches, learning and fee follow-ups together.',
    stats: [['Active learners', '1,860'], ['Running batches', '42'], ['Tests this week', '16']],
    rows: [['JEE Advanced · Batch A', '08:00 AM', 'Live class'], ['NEET Biology · Batch C', '10:30 AM', 'Test review'], ['Class 10 Maths · Evening', '04:00 PM', 'Upcoming']],
    groups: [
      { title: 'Enquiries & batch operations', icon: '01', modules: ['Enquiry capture & admission pipeline', 'Courses, subjects, batches & sections', 'Batch schedules, rooms & faculty allocation', 'Student profiles, guardians & documents', 'Attendance for classroom and online sessions', 'Multi-branch, classroom & seat planning'] },
      { title: 'Teaching, testing & progress', icon: '02', modules: ['Live class links and recorded lesson library', 'Study notes, assignments & doubt tracking', 'Online tests, test series & answer keys', 'Objective test auto-evaluation workflows', 'Results, rank lists & topic-wise performance', 'Student and parent learning portal'] },
      { title: 'Collections & student engagement', icon: '03', modules: ['Course fees, instalments & scholarships', 'Dues, receipts & scheduled reminders', 'Batch-wise enrolment & revenue reports', 'Class, test and schedule notifications', 'Counsellor follow-ups & conversion tracking', 'Content access by course or enrolled batch'] },
    ],
  },
}

const portalRoles = [
  ['Administrator', 'Operations, approvals, fee status and institution-wide reports.'],
  ['Teacher / Faculty', 'Assigned classes, timetables, attendance, assessments and student lists.'],
  ['Student', 'Schedule, assignments, attendance, learning resources, fees and results.'],
  ['Parent / Guardian', 'Child attendance, progress, notices, fee details and school updates.'],
]

const whiteLabelProducts = [
  { icon: '🏫', title: 'White Label School ERP', price: '₹5,000/mo', to: '/education-erp/school/' },
  { icon: '🎓', title: 'White Label College ERP', price: '₹7,000/mo', to: '/education-erp/college/' },
  { icon: '📚', title: 'White Label Coaching ERP', price: '₹4,000/mo', to: '/education-erp/coaching/' },
  { icon: '🤝', title: 'White Label CRM', price: '₹8,000/mo', to: '/crm-development/' },
  { icon: '👥', title: 'White Label HRM', price: '₹3,000/mo', to: '/hrm-solutions/' },
]

export function EducationErpPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedType = searchParams.get('type')?.toLowerCase()
  const [activeType, setActiveType] = useState<Institution>(requestedType === 'college' ? 'College' : requestedType === 'coaching' ? 'Coaching' : 'School')
  const [activeModule, setActiveModule] = useState(0)
  const reduceMotion = useReducedMotion()
  const data = institutionContent[activeType]
  useEffect(() => {
    if (requestedType === 'school' || requestedType === 'college' || requestedType === 'coaching') {
      const next = requestedType === 'school' ? 'School' : requestedType === 'college' ? 'College' : 'Coaching'
      setActiveType(next)
    }
  }, [requestedType])
  const changeInstitution = (type: Institution) => { setActiveType(type); setActiveModule(0); setSearchParams({ type: type.toLowerCase() }, { replace: true }) }

  return <div className="overflow-hidden bg-paper text-ink-100">
    {/* ── Hero ── */}
    <section className="section-dark grid-noise relative overflow-hidden py-14 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_76%_30%,rgba(232,117,42,.18),transparent_36%),radial-gradient(ellipse_at_12%_90%,rgba(5,12,95,.08),transparent_34%)]" />
      <div className="container-page grid items-center gap-12 lg:grid-cols-[.84fr_1.16fr] lg:gap-10">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-flame-500/30 bg-flame-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.17em] text-flame-600"><i className="h-1.5 w-1.5 rounded-full bg-flame-500" /> MYR EDUCATION ERP</span>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">One calmer way to run your <span className="text-gradient">institution.</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-ink-400 sm:text-base">A configurable education management solution for schools, colleges and coaching institutes. Bring academic workflows, finance and communication into a connected operating view.</p>
          <div className="mt-7 flex flex-wrap gap-3"><a href="#institution-types" className="btn btn-primary btn-md">Explore institution modules ↓</a><Link to="/contact-us/?interest=education-erp#contact-form" className="btn btn-ghost-dark btn-md">Request a discussion ↗</Link></div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-medium text-ink-400 sm:text-xs"><span>Role-based access</span><span>Campus-to-class workflows</span><span>Responsive portals</span></div>
        </Reveal>

        <div className="relative [perspective:1400px]">
          <motion.div initial={reduceMotion ? false : { opacity: 0, rotateY: -13, rotateX: 4, y: 24 }} animate={{ opacity: 1, rotateY: -4, rotateX: 1, y: 0 }} transition={{ duration: .8, ease: 'easeOut' }} whileHover={reduceMotion ? undefined : { rotateY: 0, rotateX: 0, scale: 1.01 }} className="relative rounded-2xl border border-line bg-white p-2 shadow-[0_35px_100px_-28px_rgba(5,12,95,.45)] sm:rounded-3xl sm:p-3">
            <div className="overflow-hidden rounded-xl border border-line bg-white text-ink-800 sm:rounded-2xl">
              <header className="flex items-center justify-between border-b border-line px-3 py-2.5 sm:px-5 sm:py-3"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-flame-500 text-[10px] font-black text-white">M</span><b className="text-[10px] sm:text-xs">myr<span className="text-flame-600">campus</span></b></div><span className="hidden text-[9px] text-ink-400 sm:block">Academic year 2026–27 · Term 2</span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-bold text-emerald-700">● All systems ready</span></header>
              <div className="grid min-h-[270px] grid-cols-[45px_1fr] sm:min-h-[355px] sm:grid-cols-[145px_1fr]">
                <aside className="space-y-1 bg-ink-950 p-1.5 text-[7px] text-white sm:p-3 sm:text-[9px]"><b className="hidden px-2 py-2 text-[8px] uppercase tracking-widest text-flame-400 sm:block">Workspace</b>{['Overview', 'Students', 'Academics', 'Attendance', 'Fees', 'Exams', 'Reports'].map((item,i)=><div key={item} className={`rounded-md px-1.5 py-2 sm:px-2 ${i===activeModule?'bg-white/15 font-semibold text-flame-300':'text-white/65'}`}><span className="sm:hidden">{['▦','◎','▤','◷','₹','✳','▥'][i]}</span><span className="hidden sm:inline">{item}</span></div>)}</aside>
                <div className="min-w-0 bg-paper p-2.5 sm:p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-[8px] font-bold uppercase tracking-wider text-flame-600 sm:text-[9px]">Institution dashboard</p><h2 className="mt-1 text-sm font-bold text-ink-950 sm:text-lg">Good morning, Dr. Sharma</h2><p className="text-[8px] text-ink-400 sm:text-[10px]">Here's your {activeType.toLowerCase()} at a glance.</p></div><span className="rounded-lg bg-flame-500 px-2.5 py-1.5 text-[8px] font-semibold text-white">+ New admission</span></div>
                  <AnimatePresence mode="wait" initial={false}><motion.div key={activeType} initial={reduceMotion?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={reduceMotion?undefined:{opacity:0,y:-6}} transition={{duration:.2}}>
                    <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:gap-2">{data.stats.map(([label,value],i)=><div key={label} className="rounded-lg border border-line bg-white p-2 shadow-sm sm:p-3"><p className="truncate text-[7px] text-ink-400 sm:text-[9px]">{label}</p><p className="mt-1 text-xs font-bold text-ink-950 sm:text-lg">{value}</p><span className="text-[7px] text-emerald-700 sm:text-[8px]">{i===0?'↑ 4.2% this term':'Updated today'}</span></div>)}</div>
                    <div className="mt-2 rounded-lg border border-line bg-white p-2.5 shadow-sm sm:mt-3 sm:p-3"><div className="flex items-center justify-between"><b className="text-[8px] text-ink-950 sm:text-[10px]">Today's schedule</b><span className="text-[7px] text-flame-600 sm:text-[8px]">View timetable →</span></div>{data.rows.map(([item,time,status])=><div key={item} className="mt-2 grid grid-cols-[1fr_auto] items-center gap-1 border-t border-line pt-2 text-[7px] sm:grid-cols-[1fr_auto_auto] sm:text-[9px]"><span className="truncate font-medium text-ink-800">{item}</span><span className="text-ink-400">{time}</span><span className="hidden rounded-full bg-flame-500/10 px-2 py-0.5 text-flame-600 sm:block">{status}</span></div>)}</div>
                  </motion.div></AnimatePresence>
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-flame-500/10 px-2.5 py-2 text-[7px] sm:mt-3 sm:px-3 sm:text-[8px]"><span className="font-semibold text-flame-600">Role-based access active</span><span className="text-ink-400">Admin · Faculty · Student · Parent</span></div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div animate={reduceMotion?undefined:{y:[0,-8,0],rotate:[0,1,0]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}} className="absolute -left-2 top-[20%] rounded-xl border border-line bg-white p-2.5 text-ink-950 shadow-xl sm:-left-7 sm:p-3.5"><span className="text-[8px] text-ink-400">TERM ATTENDANCE</span><p className="mt-1 text-sm font-bold sm:text-lg">94.2% <span className="text-flame-600">↗</span></p></motion.div>
        </div>
      </div>
    </section>

    {/* ── Institution type tabs + module groups ── */}
    <section id="institution-types" className="scroll-mt-20 py-14 sm:py-20"><div className="container-page">
      <div className="mx-auto max-w-2xl text-center"><p className="eyebrow">One platform, different academic realities</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">Built around how your institution works.</h2><p className="mt-3 text-sm leading-6 text-ink-500 sm:text-base">Choose a profile to see a tailored dashboard preview and the core workflows it can bring together.</p></div>
      <div className="mt-7 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Education institution type">{(['School','College','Coaching'] as Institution[]).map((type)=><button type="button" role="tab" aria-selected={activeType===type} key={type} onClick={()=>changeInstitution(type)} className={`min-h-11 rounded-full border px-5 text-sm font-semibold transition ${activeType===type?'border-flame-500 bg-flame-500 text-white shadow-lg shadow-flame-500/15':'border-line bg-white text-ink-500 hover:border-flame-400/50 hover:text-flame-600'}`}>{type==='Coaching'?'Coaching Institute':`${type} ERP`}</button>)}</div>
      <AnimatePresence mode="wait" initial={false}><motion.div key={activeType} initial={reduceMotion?false:{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={reduceMotion?undefined:{opacity:0,y:-8}} transition={{duration:.3}} className="mt-8 rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-flame-600">{activeType} management</p><h3 className="mt-2 text-2xl font-bold text-ink-950 sm:text-3xl">{data.title}</h3><p className="mt-2 text-sm text-ink-500">{data.subtitle}</p></div><span className="rounded-full bg-flame-500/10 px-3 py-1.5 text-[10px] font-semibold text-flame-600">Configurable module groups</span></div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">{data.groups.map((group,i)=><motion.article key={group.title} initial={reduceMotion?false:{opacity:0,y:18,rotateX:5}} animate={{opacity:1,y:0,rotateX:0}} transition={{duration:.38,delay:i*.07}} whileHover={reduceMotion?undefined:{y:-5,rotateY:1}} className="rounded-2xl border border-line bg-paper p-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-flame-500/10 text-xs font-black text-flame-600">{group.icon}</span><h4 className="mt-4 text-base font-bold text-ink-950">{group.title}</h4><ul className="mt-4 space-y-2.5">{group.modules.map((module)=><li key={module} className="flex gap-2 text-xs leading-5 text-ink-500"><span className="mt-0.5 text-flame-600">✓</span><span>{module}</span></li>)}</ul></motion.article>)}</div>
      </motion.div></AnimatePresence>
    </div></section>

    {/* ── Roles ── */}
    <section id="erp-modules" className="scroll-mt-20 border-y border-line bg-white py-14 sm:py-20"><div className="container-page">
      <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-14"><Reveal><p className="eyebrow">A connected campus ecosystem</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">The modules work better when they work together.</h2><p className="mt-4 text-sm leading-7 text-ink-500">Shared records help reduce duplicate entry between departments. Access can be organized by role, campus and responsibility, so people see the workflows relevant to them.</p><Link to="/contact-us/?interest=education-erp#contact-form" className="btn btn-primary btn-md mt-6">Scope your ERP setup ↗</Link></Reveal>
        <div className="grid gap-3 sm:grid-cols-2">{portalRoles.map(([role,description],i)=><motion.article key={role} initial={reduceMotion?false:{opacity:0,x:14}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.2}} transition={{delay:i*.06,duration:.4}} className="rounded-2xl border border-line bg-paper p-5"><span className="text-[10px] font-bold uppercase tracking-widest text-flame-600">0{i+1} · Role view</span><h3 className="mt-2 font-bold text-ink-950">{role}</h3><p className="mt-2 text-xs leading-5 text-ink-500">{description}</p></motion.article>)}</div></div>
    </div></section>

    {/* ── White-label segments ── */}
    <section id="white-label" className="scroll-mt-20 py-14 sm:py-20"><div className="container-page">
      <SectionHeading title="Get a White Label solution under your own brand" sub="School ERP, College ERP, Coaching ERP, CRM, HRM and more — fully white-labelled with your pricing." />
      <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {whiteLabelProducts.map((p) => (
          <StaggerItem key={p.title} className="card group flex h-full flex-col p-5 text-center transition hover:-translate-y-1 hover:shadow-xl">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-flame-500/10 text-2xl transition group-hover:bg-flame-500/20" aria-hidden>{p.icon}</span>
            <h3 className="mt-3 text-sm font-bold text-ink-950">{p.title}</h3>
            <span className="mt-2 text-xs font-bold text-flame-600">{p.price}</span>
            <Link to={p.to} className="mt-3 inline-flex items-center justify-center gap-1 text-xs font-bold text-flame-600 group-hover:underline">View →</Link>
          </StaggerItem>
        ))}
      </Stagger>
      <Reveal className="mt-8 rounded-2xl border border-flame-500/25 bg-gradient-to-br from-flame-500/10 to-transparent p-6 text-center">
        <p className="text-sm text-ink-500">Interested in white-labelling? <Link to="/partner/#partner-contact" className="font-bold text-flame-600 underline">Contact our partnership team →</Link></p>
      </Reveal>
    </div></section>

    {/* ── CTA ── */}
    <section className="py-14 sm:py-20"><div className="container-page"><div className="grid items-center gap-8 rounded-3xl bg-ink-950 p-6 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-flame-400">Make the next term simpler</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">Let's map the right modules to your institution.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">Share your school, college or coaching workflows and we can discuss the implementation scope, integrations and rollout sequence.</p></div><Link to="/contact-us/?interest=education-erp#contact-form" className="btn btn-primary btn-md">Talk to our team ↗</Link></div></div></section>
  </div>
}
