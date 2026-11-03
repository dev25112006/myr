import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePopup } from '@/lib/stores'
import { Reveal, SectionHeading, Stagger, StaggerItem, CountUp, TestimonialCard, type Story } from '@/components/ui'
import type { ReactNode } from 'react'

/* ------------------------------- source data ------------------------------ */

const AUDIENCES: { title: string; icon: ReactNode }[] = [
  {
    title: 'Real Estate Agents',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <path d="M3 10.5 12 3l9 7.5V21H3z" strokeLinejoin="round" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    title: 'Financial Advisors',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <path d="M4 19V9m5 10V5m5 14v-7m5 7V8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Trainers & Coaches',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <path d="M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Marketing Agencies',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <path d="M3 10v4h4l7 4V6l-7 4H3zM18 9a4 4 0 0 1 0 6" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Direct Sales Agents',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M16 7h5m-2.5-2.5v5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Wedding Planners',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.5 12 20 12 20z" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const LEAD_SOURCES = [
  { name: 'WhatsApp', img: '/assets/2024-12-WhatsApp-1.jpg' },
  { name: 'Facebook', img: '/assets/2024-12-Facebook.jpg' },
  { name: 'TikTok', img: '/assets/2024-12-TikTok.jpg' },
  { name: 'Phone Call', img: '/assets/2024-12-PhoneCall.jpg' },
  { name: 'LinkedIn', img: '/assets/2024-12-Linkedin.jpg' },
  { name: 'ClickFunnels', img: '/assets/2024-12-ClickFunnels.jpg' },
  { name: 'Google', img: '/assets/2024-12-Google.jpg' },
  { name: 'Gmail', img: '/assets/2024-12-Gmail.jpg' },
  { name: 'SMS', img: '/assets/2024-12-SMS.jpg' },
  { name: 'Wordpress', img: '/assets/2024-12-Wordpress.jpg' },
  { name: 'Jotform', img: '/assets/2024-12-Jotform.jpg' },
  { name: 'iMessage', img: '/assets/2024-12-iMessage.jpg' },
]

const FEATURES = [
  // High-resolution Pexels photos (free use): Monstera Production, Kampus Production,
  // and Ivan S. Source pages: pexels.com/photo/woman-using-phone-9488833,
  // pexels.com/photo/a-woman-using-smartphone-8171169,
  // pexels.com/photo/colleagues-working-together-on-a-project-5428994.
  {
    title: 'Instant New Lead Alerts',
    body: 'Receive your leads instantly through the Privyr app and email. Access contact details, personalized responses, and ad campaign insights with just a tap.',
    closer: 'No more hassle of downloading CSV files just to track your leads.',
    image: '/assets/privyr-lead-alerts.jpg',
  },
  {
    title: 'Contact Your Leads in Seconds',
    body: 'Effortlessly send auto-personalized introductions through WhatsApp, SMS, or email using the one-touch QUICK RESPONSE feature—no typing, copying, pasting, or saving contacts required.',
    closer: 'Keeping up with your leads has never been simpler.',
    image: '/assets/privyr-quick-contact.jpg',
  },
  {
    title: 'Distribute Leads to Your Clients and Teammates',
    body: 'Easily share leads via email, even with those who don’t use Privyr. Add multiple recipients for each lead source and decide whether to forward leads to all or assign them evenly using a round-robin method.',
    closer: 'Leads are delivered instantly to everyone, with no manual forwarding required.',
    image: '/assets/privyr-team-distribution.jpg',
  },
  {
    title: 'Manage Leads from your Phone',
    body: 'Effortlessly manage new leads and existing clients with notes, follow-up reminders, client timelines, trackable files and pages, bulk sending, and more. With Privyr’s lightweight mobile CRM, your relationships are always just a tap away.',
    closer: 'Never miss a lead again.',
    image: '/assets/privyr-crm-phone.svg',
  },
]

const STORIES: Story[] = [
  {
    name: 'Emily Davis',
    role: 'Sales Manager',
    image: '/assets/2024-08-female-icon.jpg',
    quote:
      '"This CRM has been a lifesaver for managing both new and existing clients. The ability to track leads and set reminders has significantly improved our team\'s efficiency. We\'ve definitely seen a boost in sales and productivity."',
  },
  {
    name: 'Vikram Singh',
    role: 'Entrepreneur',
    image: '/assets/2024-08-male-icon.jpg',
    quote:
      '"I’ve tried several CRMs, but none compare to this one. It’s easy to use, integrates effortlessly with all my lead sources, and saves me so much time. The auto-personalized responses and follow-up reminders are key to staying on top of leads!"',
  },
  {
    name: 'David Johnson',
    role: 'Digital Marketing Specialist',
    image: '/assets/2024-08-male-icon.jpg',
    quote:
      '"Since using this CRM, my lead conversion rate has dramatically increased. The seamless integration with multiple platforms and quick response feature have made follow-ups so much easier. It\'s been a total game-changer for my business!"',
  },
]

const APP_QUOTES = [
  '“… If you’re a business owner, this is a must-try!”',
  '“Excellent! Lead nurturing is now effortless and smooth!”',
  '“A must-have app for every business owner!”',
]

const ROCKET_LINE =
  'Skyrocket your sales and productivity today 🚀 Capture, engage, and manage every lead from your phone.'

/* --------------------------------- sections -------------------------------- */

function HeroSection() {
  const { setOpen } = usePopup()
  return (
    <section className="section-dark grid-noise relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow">All-in-One Lead CRM</p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
              Transform Your Leads into Loyal Clients,{' '}
              <span className="text-shimmer">Right from Your Phone</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
              Boost your sales with instant lead notifications, automated personalized content,
              interest monitoring, seamless follow-ups, and efficient lead management—all
              conveniently accessible from your phone in just seconds.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#privyrpricing" className="btn btn-primary btn-md">
                View Pricing
              </a>
              <button type="button" onClick={() => setOpen('privyr-signup')} className="btn btn-ghost-dark btn-md">
                Get Started
              </button>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} duration={0.8} once={false} variant="right" className="relative">
          <div className="absolute inset-6 rounded-[2.5rem] bg-accent-400/12 blur-3xl" aria-hidden />
          <img
            src="/assets/privyr-hero-notifications.jpg"
            alt="Businesswoman checking her phone while working on a laptop"
            className="relative w-full rounded-[2rem] border border-line object-cover shadow-card"
            width={1600}
            height={1000}
          />
        </Reveal>
      </div>
    </section>
  )
}

type DemoLead = { name: string; company: string; source: string; stage: string; value: string; initials: string; color: string }

const CRM_INDUSTRIES = [
  { name: 'Real Estate', focus: 'Property enquiries', entity: 'Property', sources: ['Property portal', 'Website', 'Referral'] },
  { name: 'Healthcare', focus: 'Patient enquiries', entity: 'Appointment', sources: ['Website', 'Phone', 'Referral'] },
  { name: 'Retail & Ecommerce', focus: 'Customer orders', entity: 'Order', sources: ['Online store', 'Instagram', 'WhatsApp'] },
  { name: 'Education', focus: 'Student admissions', entity: 'Enrollment', sources: ['Course page', 'Open day', 'Referral'] },
  { name: 'Fitness & Wellness', focus: 'Member enquiries', entity: 'Membership', sources: ['Instagram', 'Website', 'Walk-in'] },
  { name: 'Professional Services', focus: 'Client enquiries', entity: 'Project', sources: ['Website', 'LinkedIn', 'Referral'] },
  { name: 'Hospitality', focus: 'Guest enquiries', entity: 'Booking', sources: ['Website', 'Phone', 'Travel partner'] },
  { name: 'Other Business', focus: 'New opportunities', entity: 'Deal', sources: ['Website', 'Email', 'Referral'] },
]

const DEMO_LEADS: DemoLead[] = [
  { name: 'Olivia Chen', company: 'Northstar Group', source: 'Website', stage: 'New', value: '₹1,25,000', initials: 'OC', color: '#e9d5ff' },
  { name: 'Arjun Mehta', company: 'Mehta & Co.', source: 'WhatsApp', stage: 'Contacted', value: '₹84,000', initials: 'AM', color: '#bfdbfe' },
  { name: 'Maya Patel', company: 'Patel Ventures', source: 'Referral', stage: 'Qualified', value: '₹2,10,000', initials: 'MP', color: '#bbf7d0' },
  { name: 'Noah Williams', company: 'Willow House', source: 'Instagram', stage: 'Proposal', value: '₹96,500', initials: 'NW', color: '#fed7aa' },
  { name: 'Sara Khan', company: 'Khan Studio', source: 'Website', stage: 'Won', value: '₹1,65,000', initials: 'SK', color: '#fecdd3' },
]

const INDUSTRY_DEMO_LEADS: DemoLead[][] = [
  DEMO_LEADS,
  [
    { name: 'Dr. Olivia Chen', company: 'Northstar Family Clinic', source: 'Website', stage: 'New', value: 'First visit', initials: 'OC', color: '#e9d5ff' },
    { name: 'Arjun Mehta', company: 'Cardiology consultation', source: 'Phone', stage: 'Contacted', value: 'Follow-up', initials: 'AM', color: '#bfdbfe' },
    { name: 'Maya Patel', company: 'Willow Health Centre', source: 'Referral', stage: 'Qualified', value: 'Specialist', initials: 'MP', color: '#bbf7d0' },
    { name: 'Noah Williams', company: 'Diagnostics enquiry', source: 'Website', stage: 'Proposal', value: 'Lab booking', initials: 'NW', color: '#fed7aa' },
    { name: 'Sara Khan', company: 'Lakeside Dental', source: 'WhatsApp', stage: 'Won', value: 'Appointment', initials: 'SK', color: '#fecdd3' },
  ],
  [
    { name: 'Olivia Chen', company: 'Everyday Linen · 2 items', source: 'Online store', stage: 'New', value: '₹8,400', initials: 'OC', color: '#e9d5ff' },
    { name: 'Arjun Mehta', company: 'Studio Carry · Cart query', source: 'WhatsApp', stage: 'Contacted', value: '₹4,200', initials: 'AM', color: '#bfdbfe' },
    { name: 'Maya Patel', company: 'Sunday Form · Repeat buyer', source: 'Instagram', stage: 'Qualified', value: '₹12,600', initials: 'MP', color: '#bbf7d0' },
    { name: 'Noah Williams', company: 'The Good Edit · Bulk order', source: 'Email', stage: 'Proposal', value: '₹28,500', initials: 'NW', color: '#fed7aa' },
    { name: 'Sara Khan', company: 'Softline · New collection', source: 'Online store', stage: 'Won', value: '₹6,800', initials: 'SK', color: '#fecdd3' },
  ],
  [
    { name: 'Olivia Chen', company: 'Oakridge Academy · Grade 8', source: 'Course page', stage: 'New', value: 'Application', initials: 'OC', color: '#e9d5ff' },
    { name: 'Arjun Mehta', company: 'Brightpath · Data course', source: 'Open day', stage: 'Contacted', value: 'Campus tour', initials: 'AM', color: '#bfdbfe' },
    { name: 'Maya Patel', company: 'Northstar Learning · MBA', source: 'Referral', stage: 'Qualified', value: 'Documents', initials: 'MP', color: '#bbf7d0' },
    { name: 'Noah Williams', company: 'Skill Foundry · UX cohort', source: 'Website', stage: 'Proposal', value: 'Offer sent', initials: 'NW', color: '#fed7aa' },
    { name: 'Sara Khan', company: 'Little Steps · Nursery', source: 'Phone', stage: 'Won', value: 'Enrolled', initials: 'SK', color: '#fecdd3' },
  ],
  [
    { name: 'Olivia Chen', company: 'Northstar Fitness · Trial', source: 'Instagram', stage: 'New', value: 'Trial class', initials: 'OC', color: '#e9d5ff' },
    { name: 'Arjun Mehta', company: 'Form Studio · Personal training', source: 'Walk-in', stage: 'Contacted', value: 'Consultation', initials: 'AM', color: '#bfdbfe' },
    { name: 'Maya Patel', company: 'Goodbody Club · Renewal', source: 'Website', stage: 'Qualified', value: 'Annual plan', initials: 'MP', color: '#bbf7d0' },
    { name: 'Noah Williams', company: 'Peak Movement · Group class', source: 'WhatsApp', stage: 'Proposal', value: 'Class pack', initials: 'NW', color: '#fed7aa' },
    { name: 'Sara Khan', company: 'Sunday Yoga · Intro pass', source: 'Instagram', stage: 'Won', value: 'Member', initials: 'SK', color: '#fecdd3' },
  ],
  [
    { name: 'Olivia Chen', company: 'Northstar Advisory · Strategy', source: 'LinkedIn', stage: 'New', value: 'Discovery', initials: 'OC', color: '#e9d5ff' },
    { name: 'Arjun Mehta', company: 'Mehta & Co. · Operations', source: 'Referral', stage: 'Contacted', value: '₹84,000', initials: 'AM', color: '#bfdbfe' },
    { name: 'Maya Patel', company: 'Patel Ventures · Retainer', source: 'Website', stage: 'Qualified', value: '₹2,10,000', initials: 'MP', color: '#bbf7d0' },
    { name: 'Noah Williams', company: 'Willow House · Brand work', source: 'LinkedIn', stage: 'Proposal', value: '₹96,500', initials: 'NW', color: '#fed7aa' },
    { name: 'Sara Khan', company: 'Khan Studio · Consulting', source: 'Email', stage: 'Won', value: '₹1,65,000', initials: 'SK', color: '#fecdd3' },
  ],
  [
    { name: 'Olivia Chen', company: 'The Garden House · 2 guests', source: 'Website', stage: 'New', value: 'Dinner booking', initials: 'OC', color: '#e9d5ff' },
    { name: 'Arjun Mehta', company: 'Field & Fork · Private event', source: 'Phone', stage: 'Contacted', value: '18 guests', initials: 'AM', color: '#bfdbfe' },
    { name: 'Maya Patel', company: 'Room Nine · Weekend stay', source: 'Travel partner', stage: 'Qualified', value: '2 nights', initials: 'MP', color: '#bbf7d0' },
    { name: 'Noah Williams', company: 'Wildflower Hall · Wedding', source: 'Website', stage: 'Proposal', value: 'Venue quote', initials: 'NW', color: '#fed7aa' },
    { name: 'Sara Khan', company: 'Sunday Table · Celebration', source: 'WhatsApp', stage: 'Won', value: 'Confirmed', initials: 'SK', color: '#fecdd3' },
  ],
  [
    { name: 'Olivia Chen', company: 'Northstar Group', source: 'Website', stage: 'New', value: '₹1,25,000', initials: 'OC', color: '#e9d5ff' },
    { name: 'Arjun Mehta', company: 'Mehta & Co.', source: 'Email', stage: 'Contacted', value: '₹84,000', initials: 'AM', color: '#bfdbfe' },
    { name: 'Maya Patel', company: 'Patel Ventures', source: 'Referral', stage: 'Qualified', value: '₹2,10,000', initials: 'MP', color: '#bbf7d0' },
    { name: 'Noah Williams', company: 'Willow House', source: 'Website', stage: 'Proposal', value: '₹96,500', initials: 'NW', color: '#fed7aa' },
    { name: 'Sara Khan', company: 'Khan Studio', source: 'WhatsApp', stage: 'Won', value: '₹1,65,000', initials: 'SK', color: '#fecdd3' },
  ],
]

function CrmLiveDashboard() {
  const [open, setOpen] = useState(false)
  const [industryIndex, setIndustryIndex] = useState(0)
  const [view, setView] = useState('Overview')
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('All leads')
  const [leads, setLeads] = useState(INDUSTRY_DEMO_LEADS[0])
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [doneTasks, setDoneTasks] = useState<number[]>([])
  const industry = CRM_INDUSTRIES[industryIndex]
  const metricsByIndustry = [
    [['New enquiries', '24', '+12%'], ['Pipeline value', '₹8.4L', '+8%'], ['Closed this month', '18', '+5'], ['Follow-ups due', '7', 'Today']],
    [['New patients', '18', '+9%'], ['Visits to confirm', '12', '+4'], ['Appointments booked', '46', '+11'], ['Follow-ups due', '5', 'Today']],
    [['New orders', '32', '+16%'], ['Order value', '₹4.8L', '+12%'], ['Repeat customers', '68', '+8'], ['Open queries', '9', 'Today']],
    [['New applicants', '21', '+14%'], ['Applications', 'Active', 'This term'], ['Enrolments', '38', '+7'], ['Follow-ups due', '6', 'Today']],
    [['New members', '16', '+11%'], ['Membership value', '₹2.4L', '+8%'], ['Trials booked', '28', '+10'], ['Follow-ups due', '4', 'Today']],
    [['New enquiries', '14', '+10%'], ['Project pipeline', '₹8.4L', '+8%'], ['Clients won', '18', '+5'], ['Follow-ups due', '7', 'Today']],
    [['New bookings', '29', '+18%'], ['Booking value', '₹3.2L', '+14%'], ['Confirmed stays', '41', '+9'], ['Guest requests', '8', 'Today']],
    [['New leads', '24', '+12%'], ['Open pipeline', '₹8.4L', '+8%'], ['Converted', '18', '+5'], ['Tasks due', '7', 'Today']],
  ][industryIndex]
  const tasksByIndustry = [
    ['Call Priya about the 3-bedroom home', 'Arrange viewing at Garden House', 'Send listing options to new buyer'],
    ['Confirm Olivia’s first appointment', 'Send care instructions to Arjun', 'Review new clinic enquiries'],
    ['Reply to cart question from Olivia', 'Confirm Maya’s order details', 'Review today’s new orders'],
    ['Call Olivia about the campus tour', 'Send course details to Arjun', 'Review new student applications'],
    ['Check in after Maya’s trial class', 'Confirm Arjun’s trainer consultation', 'Follow up with new member leads'],
    ['Follow up with Olivia about strategy', 'Send proposal to Noah', 'Review new client enquiries'],
    ['Confirm Olivia’s dinner booking', 'Send event quote to Arjun', 'Check in with new guest enquiries'],
    ['Follow up with Olivia Chen', 'Share proposal with Noah', 'Review new website leads'],
  ][industryIndex]
  const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won']
  const navItems = ['Overview', 'Leads', 'Pipeline', 'Tasks']
  const filtered = leads.filter((lead) => {
    const matchesSearch = `${lead.name} ${lead.company} ${lead.source}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (stageFilter === 'All leads' || lead.stage === stageFilter)
  })
  const addLead = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = newName.trim()
    if (!name) return
    setLeads((current) => [{ name, company: newCompany.trim() || industry.focus, source: industry.sources[0], stage: 'New', value: industry.entity, initials: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(), color: '#c7d2fe' }, ...current])
    setNewName('')
    setNewCompany('')
    setShowAdd(false)
    setView('Leads')
  }
  const moveLead = (name: string) => setLeads((current) => current.map((lead) => lead.name === name ? { ...lead, stage: stages[Math.min(stages.indexOf(lead.stage) + 1, stages.length - 1)] } : lead))
  const changeIndustry = (index: number) => {
    setIndustryIndex(index)
    setLeads(INDUSTRY_DEMO_LEADS[index])
    setStageFilter('All leads')
    setSearch('')
    setDoneTasks([])
  }

  return (
    <>
      <section className="section-deep relative isolate overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-24 top-0 -z-10 h-80 w-80 rounded-full bg-accent-400/15 blur-3xl" />
        <div className="container-page grid items-center gap-8 lg:grid-cols-1">
          <div><p className="eyebrow">A CRM that fits your work</p><h2 className="mt-3 text-3xl font-bold leading-tight text-ink-950 sm:text-4xl">One clear view of every customer relationship.</h2><p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-400">Explore the complete CRM workspace for sales, service, and follow-ups. Switch industries to see different sample contacts, records, metrics, and tasks in the full desktop dashboard.</p><button type="button" onClick={() => setOpen(true)} className="btn btn-primary btn-md mt-6">Open full desktop CRM <span className="ml-2">↗</span></button><p className="mt-3 text-xs text-ink-400">Interactive demo · Industry-specific sample data · No account needed</p></div>
          <button type="button" onClick={() => setOpen(true)} className="group rounded-2xl border border-white/10 bg-[#111827] p-2.5 text-left shadow-[0_28px_90px_-35px_rgba(2,6,23,.7)] transition hover:-translate-y-1 sm:p-3" aria-label="Open live CRM dashboard demo">
            <div className="flex items-center justify-between gap-2 px-1 pb-2 text-[9px] text-slate-400"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-rose-400"/><i className="h-2 w-2 rounded-full bg-amber-300"/><i className="h-2 w-2 rounded-full bg-emerald-400"/> myr.crm / overview</span><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-300">● Live preview</span></div>
            <div className="grid min-h-60 grid-cols-[62px_1fr] overflow-hidden rounded-xl bg-slate-50 sm:min-h-72 sm:grid-cols-[110px_1fr] lg:min-h-[380px] lg:grid-cols-[170px_1fr]">
              <div className="bg-slate-950 p-2.5 text-white sm:p-4"><b className="text-[9px] sm:text-xs">myr<span className="text-orange-400">CRM</span></b>{['Home', 'Leads', 'Pipeline', 'Tasks'].map((item, i) => <div key={item} className={`mt-3 rounded-md px-1.5 py-1.5 text-[7px] sm:text-[9px] ${i === 0 ? 'bg-white/15 text-white' : 'text-slate-500'}`}>{item}</div>)}</div>
              <div className="p-3 sm:p-5"><div className="flex items-center justify-between"><div><b className="text-[11px] text-slate-900 sm:text-sm">Good morning, Alex</b><p className="mt-1 text-[7px] text-slate-400 sm:text-[9px]">Here’s your relationship snapshot</p></div><span className="rounded-md bg-orange-500 px-2 py-1.5 text-[7px] font-bold text-white sm:text-[9px]">+ Add lead</span></div><div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:gap-2">{[['New leads', '24', '+12%'], ['In pipeline', '₹8.4L', '+8%'], ['Won this month', '18', '+5%']].map(([label, value, trend]) => <div key={label} className="rounded-lg border border-slate-200 bg-white p-2 sm:p-3"><span className="block text-[6px] text-slate-400 sm:text-[8px]">{label}</span><b className="mt-1 block text-[11px] text-slate-900 sm:text-base">{value}</b><span className="text-[6px] font-semibold text-emerald-600 sm:text-[8px]">↗ {trend}</span></div>)}</div><div className="mt-2 grid gap-2 sm:mt-3 sm:grid-cols-[1.2fr_.8fr]"><div className="rounded-lg border border-slate-200 bg-white p-2.5"><div className="flex justify-between text-[7px] font-bold text-slate-700 sm:text-[9px]">Pipeline activity <span className="font-normal text-slate-400">This month⌄</span></div><div className="mt-3 flex h-16 items-end gap-1 sm:h-20">{[34, 49, 42, 66, 52, 78, 62, 91, 70, 85, 74, 100].map((height, i) => <i key={i} className="flex-1 rounded-t-sm bg-orange-400/80 transition-all group-hover:bg-orange-500" style={{ height: `${height}%` }}/>)}</div></div><div className="rounded-lg border border-slate-200 bg-white p-2.5"><div className="text-[7px] font-bold text-slate-700 sm:text-[9px]">Next up</div>{['Call Olivia', 'Send proposal', 'Team check-in'].map((item, i) => <p key={item} className="mt-2 flex items-center gap-1.5 text-[6px] text-slate-500 sm:text-[8px]"><i className={`h-2 w-2 rounded-sm border ${i === 0 ? 'border-orange-400 bg-orange-100' : 'border-slate-300'}`}/>{item}</p>)}</div></div></div>
            </div>
            <div className="flex items-center justify-between px-1 pt-2 text-[8px] text-slate-400"><span>Tap to explore the dashboard</span><span className="transition-transform group-hover:translate-x-1">↗</span></div>
          </button>
        </div>
      </section>

      <AnimatePresence>
        {open && <motion.div className="fixed inset-0 z-[110] overflow-y-auto bg-[#f4f6fa] text-slate-900" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex min-h-14 max-w-[1600px] items-center justify-between gap-2 px-3 sm:min-h-16 sm:px-6"><div className="flex min-w-0 items-center gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-950 text-xs font-black text-white">m<span className="text-orange-400">.</span></span><span className="hidden text-sm font-bold sm:inline">MYR CRM <span className="font-normal text-slate-400">/ Workspace</span></span><span className="truncate text-xs font-bold sm:hidden">MYR CRM Workspace</span></div><label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] sm:px-3 sm:text-xs"><span className="hidden text-slate-400 sm:inline">Industry</span><select value={industryIndex} onChange={(e) => changeIndustry(Number(e.target.value))} className="max-w-32 bg-transparent font-semibold outline-none sm:max-w-none">{CRM_INDUSTRIES.map((item, i) => <option key={item.name} value={i}>{item.name}</option>)}</select></label><button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] font-semibold hover:bg-slate-50 sm:px-3 sm:text-xs">← <span className="hidden sm:inline">Back to page</span><span className="sm:hidden">Back</span></button></div></header>
          <section aria-label="Interactive CRM dashboard" className="mx-auto grid max-w-[1600px] gap-4 px-3 py-4 sm:px-6 sm:py-6 lg:grid-cols-[210px_minmax(0,1fr)]">
            <aside className="hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:block"><div className="px-2 py-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">Workspace</div>{navItems.map((item, i) => <button key={item} type="button" onClick={() => setView(item)} className={`mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold ${view === item ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50'}`}><span className="w-5 text-center">{['▦', '◉', '⌁', '✓'][i]}</span>{item}</button>)}<div className="mt-6 rounded-xl bg-orange-50 p-3"><p className="text-[10px] font-bold text-slate-800">Industry workspace</p><p className="mt-1 text-[9px] leading-relaxed text-slate-500">Showing {industry.focus.toLowerCase()} for {industry.name}.</p></div><div className="mt-4 border-t border-slate-100 pt-3 text-[9px] text-slate-400">Demo mode · Sample records</div></aside>
            <section className="min-w-0">
              <div className="mb-3 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm lg:hidden">{navItems.map((item) => <button key={item} type="button" onClick={() => setView(item)} className={`min-w-max flex-1 rounded-lg px-3 py-2 text-[10px] font-semibold ${view === item ? 'bg-slate-950 text-white' : 'text-slate-600'}`}>{item}</button>)}</div>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><div className="flex items-center gap-2"><h1 className="text-xl font-bold sm:text-2xl">{view === 'Overview' ? 'Good morning, Alex' : view}</h1><span className="rounded-full bg-amber-50 px-2 py-1 text-[8px] font-bold text-amber-700">DEMO DATA</span></div><p className="mt-1 text-xs text-slate-500">{view === 'Overview' ? `A quick look at ${industry.focus.toLowerCase()} and what needs your attention.` : `${industry.name} · ${industry.focus}`}</p></div><div className="flex gap-2"><div className="relative"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search records…" aria-label="Search records" className="h-9 w-36 rounded-lg border border-slate-200 bg-white px-3 text-[10px] outline-none focus:border-orange-400 sm:w-48 sm:text-xs"/></div><button type="button" onClick={() => setShowAdd(true)} className="h-9 rounded-lg bg-orange-500 px-3 text-[10px] font-bold text-white shadow-sm hover:bg-orange-600 sm:px-4 sm:text-xs">+ <span className="hidden sm:inline">Add lead</span><span className="sm:hidden">Add</span></button></div></div>
              {view === 'Overview' && <>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{metricsByIndustry.map(([label, value, note], i) => <motion.article key={`${industryIndex}-${label}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"><p className="text-[9px] font-medium text-slate-500 sm:text-[10px]">{label}</p><b className="mt-2 block text-xl sm:text-2xl">{i === 0 && label.toLowerCase().includes('lead') || i === 0 && label.toLowerCase().includes('enquir') ? leads.filter((l) => l.stage === 'New').length + 19 : value}</b><span className={`mt-1 block text-[8px] font-semibold ${i === 3 ? 'text-amber-600' : 'text-emerald-600'}`}>{i === 3 ? `${Math.max(0, Number.parseInt(value, 10) - doneTasks.length)} ${note.toLowerCase()}` : note}</span></motion.article>)}</div>
                <div className="mt-3 grid gap-3 xl:grid-cols-[1.35fr_.65fr]"><article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="text-xs font-bold sm:text-sm">Pipeline overview</h2><p className="mt-1 text-[9px] text-slate-400">Opportunities by stage · this month</p></div><button type="button" className="text-[9px] font-semibold text-slate-500">Monthly⌄</button></div><div className="mt-5 flex h-32 items-end gap-2 border-b border-slate-100 px-1 sm:h-40">{[36, 48, 42, 68, 58, 75, 64, 88, 73, 95, 80, 100].map((height, i) => <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: .55, delay: i * .025 }} className="flex-1 rounded-t-md" style={{ background: `linear-gradient(to top, #f97316, ${i > 8 ? '#fdba74' : '#fed7aa'})` }}/>)}</div><div className="mt-2 flex justify-between text-[8px] text-slate-400"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div></article>
                  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-xs font-bold sm:text-sm">Today’s priorities</h2><p className="mt-1 text-[9px] text-slate-400">Keep good conversations moving</p>{tasksByIndustry.map((task, i) => <button key={`${industryIndex}-${task}`} type="button" onClick={() => setDoneTasks((current) => current.includes(i) ? current.filter((x) => x !== i) : [...current, i])} className="mt-3 flex w-full items-start gap-2 text-left"><span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border text-[9px] ${doneTasks.includes(i) ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent'}`}>✓</span><span className={`text-[9px] leading-relaxed ${doneTasks.includes(i) ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task}<small className="mt-0.5 block text-[8px] text-slate-400">{['10:30 AM · Call', '1:00 PM · Follow-up', '4:00 PM · Review'][i]}</small></span></button>)}</article></div>
                <article className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><div><h2 className="text-xs font-bold sm:text-sm">Recent {industry.focus.toLowerCase()}</h2><p className="mt-1 text-[9px] text-slate-400">Sample contacts across your channels</p></div><button type="button" onClick={() => setView('Leads')} className="text-[9px] font-bold text-orange-600">View all →</button></div><LeadTable leads={leads.slice(0, 4)} onMove={moveLead} compact/></article>
              </>}
              {view === 'Leads' && <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-sm font-bold">All leads</h2><p className="mt-1 text-[9px] text-slate-400">{filtered.length} sample records · {industry.focus}</p></div><select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-2 text-[9px]"><option>All leads</option>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></div><LeadTable leads={filtered} onMove={moveLead}/></article>}
              {view === 'Pipeline' && <div className="flex gap-3 overflow-x-auto pb-3">{stages.map((stage) => <div key={stage} className="w-64 shrink-0 rounded-xl border border-slate-200 bg-slate-100/70 p-2.5"><div className="flex items-center justify-between px-1 py-1.5"><h2 className="text-[10px] font-bold">{stage}</h2><span className="rounded-full bg-white px-2 py-0.5 text-[8px] text-slate-500">{leads.filter((lead) => lead.stage === stage).length}</span></div>{leads.filter((lead) => lead.stage === stage && `${lead.name} ${lead.company}`.toLowerCase().includes(search.toLowerCase())).map((lead) => <motion.article layout key={lead.name} className="mt-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full text-[8px] font-bold" style={{ backgroundColor: lead.color }}>{lead.initials}</span><div className="min-w-0"><b className="block truncate text-[9px]">{lead.name}</b><span className="block truncate text-[8px] text-slate-400">{lead.company}</span></div></div><div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2"><span className="text-[9px] font-bold">{lead.value}</span><button type="button" onClick={() => moveLead(lead.name)} disabled={stage === 'Won'} className="text-[8px] font-bold text-orange-600 disabled:text-slate-300">{stage === 'Won' ? 'Complete' : 'Move →'}</button></div></motion.article>)}</div>)}</div>}
              {view === 'Tasks' && <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-sm font-bold">Follow-up tasks</h2><p className="mt-1 text-[9px] text-slate-400">A simple list to keep every conversation warm</p>{[...tasksByIndustry, 'Review new enquiries from today', 'Prepare notes for the team'].map((task, i) => <button key={`${industryIndex}-${task}`} type="button" onClick={() => setDoneTasks((current) => current.includes(i + 3) ? current.filter((x) => x !== i + 3) : [...current, i + 3])} className="flex w-full items-center gap-3 border-b border-slate-100 py-3 text-left last:border-0"><span className={`grid h-5 w-5 place-items-center rounded border text-[10px] ${doneTasks.includes(i + 3) ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent'}`}>✓</span><span className={`flex-1 text-[10px] ${doneTasks.includes(i + 3) ? 'text-slate-400 line-through' : 'font-medium'}`}>{task}<small className="mt-1 block text-[8px] text-slate-400">{['Today · 10:30 AM', 'Today · 1:00 PM', 'Today · 3:15 PM', 'Tomorrow · 9:00 AM', 'Friday · 11:00 AM'][i]}</small></span><span className="rounded-full bg-orange-50 px-2 py-1 text-[8px] font-semibold text-orange-700">{i < 3 ? 'Today' : 'Upcoming'}</span></button>)}</article>}
              <p className="mt-3 text-center text-[8px] text-slate-400">This interactive preview uses sample records only; it does not connect to a CRM account.</p>
            </section>
          </section>
          <AnimatePresence>{showAdd && <motion.div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/45 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.form onSubmit={addLead} initial={{ y: 12, scale: .98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 8, scale: .98 }} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-lg font-bold">Add a lead</h2><p className="mt-1 text-xs text-slate-500">Add a sample {industry.focus.toLowerCase()} record.</p></div><button type="button" onClick={() => setShowAdd(false)} aria-label="Close" className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100">✕</button></div><label className="mt-5 block text-xs font-semibold">Contact name<input autoFocus required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Jamie Lee" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-orange-400"/></label><label className="mt-3 block text-xs font-semibold">{industry.entity} or company<input value={newCompany} onChange={(e) => setNewCompany(e.target.value)} placeholder="e.g. Northstar Group" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-orange-400"/></label><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setShowAdd(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold">Cancel</button><button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-bold text-white">Save lead</button></div></motion.form></motion.div>}</AnimatePresence>
        </motion.div>}
      </AnimatePresence>
    </>
  )
}

function LeadTable({ leads, onMove, compact = false }: { leads: DemoLead[]; onMove: (name: string) => void; compact?: boolean }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[560px] border-collapse text-left"><thead><tr className="text-[8px] font-semibold uppercase tracking-wider text-slate-400"><th className="pb-2 pl-2">Contact</th><th className="pb-2">Source</th><th className="pb-2">Status</th><th className="pb-2">Value</th><th className="pb-2 text-right">Next step</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.name} className="border-t border-slate-100 text-[9px]"><td className="py-2.5 pl-2"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full text-[8px] font-bold" style={{ backgroundColor: lead.color }}>{lead.initials}</span><span><b className="block">{lead.name}</b><small className="text-slate-400">{lead.company}</small></span></div></td><td className="py-2.5 text-slate-500">{lead.source}</td><td className="py-2.5"><span className="rounded-full bg-slate-100 px-2 py-1 text-[8px] font-semibold">{lead.stage}</span></td><td className="py-2.5 font-semibold">{lead.value}</td><td className="py-2.5 text-right"><button type="button" onClick={() => onMove(lead.name)} disabled={lead.stage === 'Won'} className="rounded-md px-2 py-1 font-bold text-orange-600 hover:bg-orange-50 disabled:text-slate-300">{compact ? 'Open →' : lead.stage === 'Won' ? 'Done' : 'Move stage →'}</button></td></tr>)}</tbody></table>{leads.length === 0 && <p className="py-8 text-center text-xs text-slate-400">No matching leads. Try another search or stage.</p>}</div>
}

function AudienceSection() {
  return (
    <section id="lead-management" className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          title="Designed for Small Businesses, Marketers, and Solopreneurs"
          sub="Privyr caters to sales and marketing professionals who rely on online lead generation. It provides a hassle-free solution to connect, manage, and convert leads directly from your phone or laptop. Trusted by professionals across countless industries, Privyr is your go-to tool for streamlined success."
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <StaggerItem key={a.title} className="card flex h-full items-center gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-400/12 text-accent-600">
                {a.icon}
              </span>
              <h3 className="text-base font-bold text-ink-950 sm:text-lg">{a.title}</h3>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mx-auto mt-12 max-w-4xl text-center">
          <p className="text-base leading-relaxed text-ink-300">
            The mobile CRM seamlessly connects with popular lead sources like Facebook, TikTok,
            Google, and WordPress, while integrating smoothly with WhatsApp, SMS, iMessage, email,
            and phone calls.
          </p>
        </Reveal>
        <Stagger className="mt-8 flex flex-wrap items-center justify-center gap-3" stagger={0.04}>
          {LEAD_SOURCES.map((l, i) => (
            <StaggerItem key={l.name}>
              <Reveal as="span" once={false} duration={0.55} variant={i % 2 === 0 ? 'right' : 'left'} className="block">
                <img
                  src={l.img}
                  alt={l.name}
                  loading="lazy"
                  width={50}
                  height={50}
                  className="h-12 w-12 rounded-xl border border-line object-cover transition hover:-translate-y-1 hover:border-accent-400/50"
                />
              </Reveal>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats: { value: ReactNode; caption: string }[] = [
    { value: <CountUp to={250000} locale="en-US" />, caption: 'Businesses' },
    { value: <CountUp to={100} suffix="+" />, caption: 'Countries' },
    { value: <>100 Million</>, caption: 'Leads RECEIVED' },
    { value: <CountUp to={300} prefix="+" suffix="%" />, caption: 'Sales Improvement' },
  ]
  return (
    <section className="section-dark border-y border-line py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          title="Trusted by over 250,000 businesses across 100+ countries"
          sub="Privyr has empowered sales and marketing professionals globally to receive, engage, and convert more than 100 million leads."
        />
        {/* FLAG §7.2: 250,000/100+ differ from homepage "9,000+ customers" — both preserved. */}
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.caption} className="card p-6 text-center">
              <p className="font-display text-3xl font-bold text-ink-950 sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-accent-600">
                {s.caption}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function CrmPhoneMockup() {
  return (
    <div
      role="img"
      aria-label="Phone showing a CRM app with lead counts, contact records, and follow-up statuses"
      className="flex aspect-[4/3] min-h-[360px] w-full items-center justify-center overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-br from-orange-50 via-white to-violet-100 p-4 sm:p-6"
    >
      <div className="relative h-[94%] max-h-[520px] w-auto max-w-[58%] flex-none aspect-[.48] rounded-[2.25rem] border-[8px] border-slate-800 bg-slate-950 p-1.5 shadow-[0_24px_55px_-20px_rgba(15,23,42,.65)]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.7rem] bg-slate-50 px-3 pb-3 pt-5 text-slate-900 sm:px-4 sm:pb-4 sm:pt-6">
          <span className="absolute left-1/2 top-1.5 h-2 w-14 -translate-x-1/2 rounded-full bg-slate-950" />
          <div className="flex items-center justify-between text-[9px] font-semibold sm:text-[10px]"><span>9:41</span><span>●●●  Wi-Fi</span></div>
          <div className="mt-5 flex items-center justify-between">
            <div><h4 className="text-base font-bold sm:text-lg">My Leads</h4><p className="mt-0.5 text-[9px] text-slate-500 sm:text-[10px]">Good morning, Alex</p></div>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-700">AM</span>
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">New leads</p>
            <div className="mt-1 flex items-end justify-between"><strong className="text-2xl leading-none">128</strong><span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-700">+12 today</span></div>
          </div>
          <div className="mt-3 flex items-center justify-between"><h5 className="text-[11px] font-bold">Follow up</h5><span className="text-[9px] font-semibold text-orange-600">View all</span></div>
          <div className="mt-1.5 space-y-1.5">
            {[
              ['PS', 'Priya Sharma', 'Website enquiry · 10:42', 'FOLLOW UP', 'bg-blue-100 text-blue-700', 'bg-amber-100 text-amber-700'],
              ['RK', 'Rahul Khanna', 'Facebook lead · 9:18', 'NEW LEAD', 'bg-pink-100 text-pink-700', 'bg-blue-100 text-blue-700'],
              ['AM', 'Anita Mehra', 'WhatsApp · Yesterday', 'QUALIFIED', 'bg-emerald-100 text-emerald-700', 'bg-emerald-100 text-emerald-700'],
            ].map(([initials, name, source, status, avatarTone, statusTone]) => (
              <div key={name} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[8px] font-bold ${avatarTone}`}>{initials}</span>
                <span className="min-w-0 flex-1"><strong className="block truncate text-[9px]">{name}</strong><small className="block truncate text-[7px] text-slate-500">{source}</small></span>
                <span className={`rounded-full px-1.5 py-1 text-[6px] font-bold ${statusTone}`}>{status}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-white">
            <span className="block text-[7px] font-semibold tracking-wide text-white/80">TODAY'S ACTIVITY</span>
            <span className="mt-0.5 block text-[11px] font-bold">8 leads to follow up</span>
          </div>
          <div className="mt-2 flex justify-around border-t border-slate-200 pt-2 text-[8px] font-semibold text-orange-700"><span>● Leads</span><span className="text-slate-400">Messages</span><span className="text-slate-400">Profile</span></div>
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  return (
    <section id="crm-features" className="section-deep py-20 sm:py-24">
      <div className="container-page space-y-14">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
          >
            <Reveal variant={i % 2 === 0 ? 'left' : 'right'} className="min-w-0">
              <h3 className="text-2xl font-bold text-ink-950 sm:text-3xl">{f.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-ink-300">{f.body}</p>
              <p className="mt-4 text-base font-semibold text-accent-600">{f.closer}</p>
            </Reveal>
            <Reveal delay={0.1} duration={0.8} once={false} variant={i % 2 === 0 ? 'right' : 'left'} className="min-w-0">
              {f.title === 'Manage Leads from your Phone' ? (
                <CrmPhoneMockup />
              ) : (
                <img
                  src={f.image}
                  alt={f.title}
                  loading="lazy"
                  width={1600}
                  height={1200}
                  className="aspect-[4/3] w-full rounded-[1.75rem] border border-line object-cover"
                />
              )}
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  )
}

function SetupSection() {
  return (
    <section id="quick-setup" className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Effortless 30-Second Setup" align="left" className="max-w-3xl" />
        <Reveal className="mt-8 max-w-3xl">
          <div className="space-y-4 text-base leading-relaxed text-ink-300">
            <p>
              The mobile CRM connects directly to lead sources like Facebook Lead Ads, TikTok Lead
              Generation, Google Ad Lead Forms, WordPress contact forms, and more—no need to set up
              or manage another platform to access your leads.
            </p>
            <p>
              It also works instantly with{' '}
              <strong className="text-ink-950">WhatsApp, SMS, iMessage, email, and phone calls.</strong>
            </p>
            <p className="font-semibold text-accent-600">You’ll be ready to go in just 30 seconds!</p>
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
          title="See what our customers have to say."
          sub="On average, users experience a 300% boost in sales and productivity."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STORIES.map((s) => (
            <TestimonialCard key={s.name} story={s} once={false} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AppDownloadsSection() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page text-center">
        <SectionHeading title="More than 100,000 app downloads" />
        <Stagger className="mx-auto mt-8 flex max-w-3xl flex-col gap-2" stagger={0.06}>
          {APP_QUOTES.map((q) => (
            <StaggerItem key={q}>
              <p className="text-base italic text-ink-300">{q}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Reveal as="span" once={false} duration={0.7} variant="left" className="block">
            <img
              src="/assets/2024-12-Google_Play_logo.png"
              alt="Get it on Google Play"
              loading="lazy"
              className="h-16 w-auto"
            />
          </Reveal>
          <Reveal as="span" once={false} duration={0.7} variant="right" className="block">
            <img
              src="/assets/2024-12-Download_on_the_App_Store_RGB_blk.svg.png"
              alt="Download on the App Store"
              loading="lazy"
              className="h-16 w-auto rounded-lg"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SelectPlan({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="btn btn-primary btn-md w-full justify-center"
      title="Contact MYR about this plan"
    >
      {children}
    </a>
  )
}

function PricingSection() {
  return (
    <section id="privyrpricing" className="section-deep py-20 sm:py-24 scroll-mt-24">
      <div className="container-page">
        <SectionHeading title="Flexible plans for teams of all sizes" />

        {/* Desktop/tablet — source widget `elementor-hidden-mobile` (₹1,599 / ₹1,439). */}
        <Reveal className="mx-auto mt-12 hidden max-w-4xl md:block">
          <div className="card overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="border-b border-r border-line p-5 text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-ink-300">MONTHLY PLAN</p>
              </div>
              <div className="relative border-b border-line p-5 text-center">
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-950">
                  SAVE 10%
                </span>
                <p className="text-sm font-bold uppercase tracking-wider text-ink-300">ANNUAL PLAN</p>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-line">
              <div className="p-6 text-center">
                <p className="font-display text-4xl font-bold text-ink-950">
                  ₹1,599<span className="text-lg font-medium text-ink-400">/month</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-400">{ROCKET_LINE}</p>
                <p className="mt-3 text-sm text-accent-600">+₹ 1,449 per team account per month</p>
                <div className="mt-5">
                  <SelectPlan href="/contact-us/">ENQUIRE ABOUT THIS PLAN</SelectPlan>
                </div>
              </div>
              <div className="p-6 text-center">
                <p className="font-display text-4xl font-bold text-ink-950">
                  ₹1,439<span className="text-lg font-medium text-ink-400">/month</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-400">{ROCKET_LINE}</p>
                <p className="mt-3 text-sm text-accent-600">+₹ 1,305 per team account per month</p>
                <div className="mt-5">
                  <SelectPlan href="/contact-us/">ENQUIRE ABOUT THIS PLAN</SelectPlan>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Mobile-only — source widgets `elementor-hidden-desktop/tablet` (₹1,449 / ₹1,305).
            FLAG §7.15: mobile prices differ from desktop — both preserved exactly. */}
        <div className="mt-10 grid gap-5 md:hidden">
          <Reveal className="card p-6 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-ink-300">MONTHLY PLAN</p>
            <p className="mt-3 font-display text-4xl font-bold text-ink-950">
              ₹1,449<span className="text-lg font-medium text-ink-400">/month</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-400">{ROCKET_LINE}</p>
            <p className="mt-3 text-sm text-accent-600">+₹ 1,449 per team account per month</p>
            <div className="mt-5">
              <SelectPlan href="/contact-us/">ENQUIRE ABOUT THIS PLAN</SelectPlan>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="card relative p-6 text-center">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
              SAVE 10%
            </span>
            <p className="text-sm font-bold uppercase tracking-wider text-ink-300">ANNUAL PLAN</p>
            <p className="mt-3 font-display text-4xl font-bold text-ink-950">
              ₹1,305<span className="text-lg font-medium text-ink-400">/month</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-400">{ROCKET_LINE}</p>
            <p className="mt-3 text-sm text-accent-600">+₹ 1,305 per team account per month</p>
            <div className="mt-5">
              <SelectPlan href="/contact-us/">ENQUIRE ABOUT THIS PLAN</SelectPlan>
            </div>
            <p className="mt-3 text-xs text-ink-400">Automatic renewal. Cancel anytime</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function PrivacySection() {
  const cards = [
    {
      title: 'PRIVATE',
      body: 'Your data is fully protected and will never be sold, shared, or made available to any third parties. You retain complete control and privacy at all times.',
    },
    {
      title: 'SECURE',
      body: 'Your data is securely encrypted both in transit (using TLS 1.2 via HTTPS) and at rest in the database (with 256-bit Advanced Encryption Standard).',
    },
  ]
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page text-center">
        <h3 className="text-2xl font-bold text-ink-950 sm:text-3xl">Built with Privacy at the Core</h3>
        <Reveal className="mx-auto mt-4 max-w-3xl">
          <p className="text-base leading-relaxed text-ink-300">
            Your data remains fully private by default, ensuring you always have complete control and
            security over it.
          </p>
        </Reveal>
        <Stagger className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
          {cards.map((c) => (
            <StaggerItem key={c.title} className="card p-6 text-left">
              <p className="font-display text-xl font-bold uppercase tracking-wider text-accent-600">
                {c.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">{c.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function FinalCtaSection() {
  const { setOpen } = usePopup()
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page text-center">
        <SectionHeading title="Ready to get started?" />
        <Reveal delay={0.1} className="mt-6">
          <p className="text-base text-ink-300">
            Begin using the app and unlock all its features today!
          </p>
          <button type="button" onClick={() => setOpen('privyr-signup')} className="btn btn-primary btn-lg mt-6">
            Try Now
          </button>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export function PrivyrPage() {
  return (
    <>
      <HeroSection />
      <CrmLiveDashboard />
      <AudienceSection />
      <StatsSection />
      <FeaturesSection />
      <SetupSection />
      <TestimonialsSection />
      <AppDownloadsSection />
      <PricingSection />
      <PrivacySection />
      <FinalCtaSection />
    </>
  )
}
