import React, { useState } from 'react'
import { CHAT_SUPPORT, CHAT_SALES } from '@/components/layout/nav'
import {
  Reveal,
  SectionHeading,
  Stagger,
  StaggerItem,
  TiltCard,
  TestimonialCard,
  type Story,
} from '@/components/ui'
import { SubscriptionPlans } from '@/components/commerce/SubscriptionPlans'
import type { ReactNode } from 'react'

/* ------------------------------- source data ------------------------------ */


/* ============================ SEO META ============================ */
const PAGE_TITLE = "CRM Software Development Company | MYR Advance Solution";
const PAGE_DESCRIPTION = "MYR Advance Solution custom CRM development for India and US teams. Organize leads, customer records, sales pipelines, follow-ups and reporting around your workflow.";

/* ============================ DATA ============================ */
const PILLARS = [
  {
    title: 'Understanding Your Business:',
    body: '“Every business is unique, and so are its challenges. Our process begins with a thorough understanding of your business operations, customer base, and market dynamics. This allows us to design a CRM system that not only meets your current needs but also scales as your business grows.”',
  },
  {
    title: 'Customization at Its Best:',
    body: '“We don’t believe in one-size-fits-all. Our CRM solutions are highly customizable, ensuring that the system you get is tailored to your specific workflows. Whether it’s sales automation, customer support, or marketing management, our CRMs integrate seamlessly with your existing processes.”',
  },
  {
    title: 'User-Friendly Interface:',
    body: '“A CRM system should be a tool that enhances productivity, not a burden. Our CRMs feature intuitive, user-friendly interfaces that require minimal training. This ensures quick adoption across your organization, so you can start reaping the benefits immediately.”',
  },
  {
    title: 'Scalable and Secure:',
    body: '“As your business expands, your CRM should be able to grow with you. Our CRM systems are built to be scalable, accommodating more users, data, and features as needed. Security is paramount; we employ the latest encryption technologies and secure access protocols to protect your customer data.”',
  },
  {
    title: 'Ongoing Innovation:',
    body: '“We stay ahead of the curve by continuously integrating the latest technologies and industry trends into our CRM solutions. This ensures that your business benefits from the most advanced features, keeping you competitive and efficient in an ever-evolving market.”',
  },
]

const PROCESS = [
  {
    title: 'Consultation & Requirements Gathering:',
    body: '“We begin by engaging in detailed discussions to understand your business requirements, challenges, and goals. This phase involves analyzing your current processes, identifying pain points, and determining the features and functionalities that will best support your business operations.”',
  },
  {
    title: 'Design & Prototype:',
    body: '“Based on the gathered requirements, our design team creates a visual blueprint of your CRM system. This includes user interface (UI) designs and process flows that are tailored to how your business operates. We present these prototypes to you for feedback and make necessary adjustments to ensure the design meets your expectations.”',
  },
  {
    title: 'Development & Customization:',
    body: '“With the design approved, our development team starts building your CRM system. We use the latest technologies and coding practices to create a robust, scalable, and secure CRM that is customized to your specific needs. Whether it’s custom dashboards, workflows, or integrations with other tools, we ensure that your CRM functions exactly as you need it to.”',
  },
  {
    title: 'Testing & Quality Assurance:',
    body: '“Before the CRM goes live, we conduct thorough testing to ensure that every feature works seamlessly. Our quality assurance process includes functional testing, performance testing, and security testing to ensure that your CRM system is reliable and ready to use.”',
  },
  {
    title: 'Deployment & Training:',
    body: '“Once testing is complete and the CRM is approved, we deploy the system in your live environment. To ensure your team can maximize the CRM’s potential, we provide comprehensive training sessions, user manuals, and ongoing support to help your employees get up to speed quickly.”',
  },
  {
    title: 'Ongoing Support & Optimization:',
    body: '“Our relationship doesn’t end at deployment. We offer ongoing support and maintenance to address any issues that arise, implement updates, and optimize the CRM as your business grows and evolves. We’re here to ensure that your CRM continues to deliver value over time.”',
  },
]

/* ------------------------------- old CRM content (from /privyr/) ------------------------------ */

const AUDIENCES: { title: string; icon: ReactNode }[] = [
  {
    title: 'Real Estate Agents',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <path d="M3 10.5 12 3l9 7.5V21H3 z" strokeLinejoin="round" />
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
        <path d="M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4 zM20 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7 z" strokeLinejoin="round" />
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
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeLinejoin="round" />
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
  {
    title: 'Instant New Lead Alerts',
    body: 'Receive your leads instantly through the CRM app and email. Access contact details, personalized responses, and ad campaign insights with just a tap.',
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
    body: 'Easily share leads via email, even with those who don’t use the CRM. Add multiple recipients for each lead source and decide whether to forward leads to all or assign them evenly using a round-robin method.',
    closer: 'Leads are delivered instantly to everyone, with no manual forwarding required.',
    image: '/assets/privyr-team-distribution.jpg',
  },
  {
    title: 'Manage Leads from your Phone',
    body: 'Effortlessly manage new leads and existing clients with notes, follow-up reminders, client timelines, trackable files and pages, bulk sending, and more. With the lightweight mobile CRM, your relationships are always just a tap away.',
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

/* --------------------------------- sections -------------------------------- */

function HeroSection() {
  return (
    <section className="section-dark grid-noise relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow">CRM Development</p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
              Your Business, Your CRM –{' '}
              <span className="text-gradient">Tailored for Success.</span>
            </h1>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
                Talk to sales
              </a>
              <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">
                Live Chat
              </a>
              <a href="#crm-dashboard" className="btn btn-ghost-dark btn-md">
                Live Dashboard
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="relative">
          <div className="absolute inset-6 rounded-[2.5rem] bg-accent-400/12 blur-3xl" aria-hidden />
          <TiltCard className="relative">
            <img
              src="/assets/2024-09-crm-development.png"
              alt="Custom CRM development by MyR Advance Solution"
              className="w-full rounded-[2rem] border border-line object-cover shadow-card"
              width={1280}
              height={800}
            />
          </TiltCard>
        </Reveal>
      </div>
    </section>
  )
}

function ApproachSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          title="Our Approach to CRM Development"
          sub="In today’s competitive landscape, customer relationships are at the heart of every successful business. MYR ADVANCE SOLUTION PVT. LTD., with over a 8 years of experience, specializes in crafting customized CRM systems designed to streamline your business operations, enhance customer interactions, and drive growth. Our CRM solutions are not just tools but strategic assets that align perfectly with your business needs."
        />
        <Stagger className="mt-12 grid gap-5 lg:grid-cols-2">
          {PILLARS.map((p) => (
            <StaggerItem key={p.title} className="card h-full p-6 sm:p-7">
              <h3 className="text-lg font-bold text-ink-950">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">{p.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-10 flex flex-wrap gap-3">
          <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
            Talk to sales
          </a>
          <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">
            Live Chat
          </a>
        </Reveal>
        <Reveal delay={0.1} className="mt-12">
          <img
            src="/assets/2024-09-crm-Flowchart.png"
            alt="CRM development flowchart"
            loading="lazy"
            className="mx-auto w-full max-w-3xl rounded-2xl border border-line object-contain"
            width={1000}
            height={350}
          />
        </Reveal>
        <Reveal delay={0.15} className="mt-8 text-center">
          <p className="text-ink-300">
            <a
              href="https://app.jetcrm.in/register/myrsignup"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent-600 underline underline-offset-2"
            >
              Registered | Login
            </a>{' '}
            or{' '}
            <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-600 underline underline-offset-2">
              Talk to sales
            </a>{' '}
            or{' '}
            <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-600 underline underline-offset-2">
              Live Chat
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          title="Crafting Custom CRM Solutions That Drive Your Business Forward"
          sub="A proven process from consultation through ongoing optimization."
        />
        <Stagger as="ol" className="mt-12 space-y-5" stagger={0.07}>
          {PROCESS.map((step, i) => (
            <StaggerItem as="li" key={step.title} className="card flex gap-5 p-6 sm:p-7">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-400/15 font-display text-lg font-bold text-accent-600"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-ink-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-300">{step.body}</p>
                </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal delay={0.2} className="mt-10 grid gap-6 lg:grid-cols-2">
          <img
            src="/assets/2024-09-customized-crm-development.png"
            alt="Customized CRM development"
            loading="lazy"
            className="w-full rounded-2xl border border-line object-cover"
            width={1024}
            height={682}
          />
          <img
            src="/assets/2024-09-crm-custom-developement-scaled.jpg"
            alt="CRM custom development team at work"
            loading="lazy"
            className="w-full rounded-2xl border border-line object-cover"
            width={2560}
            height={1707}
          />
        </Reveal>
        <Reveal delay={0.1} className="mt-10 text-center">
          <a
            href={CHAT_SUPPORT}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost-dark btn-md"
          >
            Still Have Questions ? Live Chat Now
          </a>
          <p className="mt-5">
            <a
              href="https://app.jetcrm.in/register/myrsignup"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-md"
            >
              Registered &amp; Get Free Trial
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function AudiencesSection() {
  return (
    <section className="section-light py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          title="Who Uses the CRM"
          sub="Built for teams that capture, engage and convert leads from every channel."
          tone="light"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {AUDIENCES.map((audience) => (
            <div key={audience.title} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-line bg-white">
              <div className="h-12 w-12 rounded-xl bg-ink-950/5 flex items-center justify-center text-accent-600">
                {audience.icon}
              </div>
              <span className="text-xs sm:text-sm font-medium text-ink-700 text-center leading-tight">{audience.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LeadSourcesSection() {
  return (
    <section className="section-deep py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Lead Sources</p>
          <h2 className="mt-2 text-3xl font-bold text-ink-950 sm:text-4xl">Capture leads from every channel</h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-ink-600">
            Connect all your lead sources in one place. WhatsApp, Facebook, TikTok, phone calls,
            LinkedIn, Google ads, email, SMS, websites and more — every lead lands in your CRM
            automatically.
          </p>
        </div>
        <div className="mt-10 overflow-hidden">
          <div className="group relative mask-[linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            <div
              className="flex w-max items-center animate-[var(--animate-marquee)] gap-12 sm:gap-16 group-hover:[animation-play-state:paused]"
              style={{ width: 'max-content' }}
            >
              {[...LEAD_SOURCES, ...LEAD_SOURCES].map((source, i) => (
                <div
                  key={i}
                  className="shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border border-line bg-white transition hover:border-accent-400/50 cursor-pointer"
                >
                  <img
                    src={source.img}
                    alt={source.name}
                    loading="lazy"
                    className="h-10 w-10 rounded-lg object-cover sm:h-12 sm:w-12"
                  />
                  <span className="text-[10px] sm:text-sm font-medium text-ink-700 text-center leading-tight">
                    {source.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section className="section-light py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          title="Everything you need to win more leads"
          sub="Instant alerts, auto-personalized messaging, team distribution and mobile management — all in one CRM."
          tone="light"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-line bg-white p-6 sm:p-7 hover:border-accent-400/50 transition">
              {feature.image && (
                <div className="h-32 rounded-lg bg-paper mb-4 overflow-hidden">
                  <img src={feature.image} alt={feature.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}
              <h3 className="text-lg font-bold text-ink-950">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{feature.body}</p>
              <p className="mt-2 text-sm font-semibold text-accent-600">{feature.closer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StoriesSection() {
  return (
    <section className="section-deep py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          title="Trusted by teams that sell"
          sub="Real stories from businesses that grew with our CRM."
          tone="light"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((story) => (
            <TestimonialCard key={story.name} story={story} />
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {APP_QUOTES.map((q, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full border border-line bg-white text-sm text-ink-600 font-medium">
              {q}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function CrmLiveDashboard() {
  const [industryIndex, setIndustryIndex] = useState(0)
  const [view, setView] = useState<'overview' | 'pipeline' | 'leads' | 'analytics' | 'workflow' | 'ai'>('overview')
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<'All leads' | 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won'>('All leads')
  const [leads, setLeads] = useState(INDUSTRY_DEMO_LEADS[0])
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [aiInput, setAiInput] = useState('')
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: "Hi! I'm your CRM AI assistant. Ask me about pipeline health, top deals, follow-ups, or workflow automation." },
  ])

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
  }
  const moveLead = (name: string) => setLeads((current) => current.map((lead) => lead.name === name ? { ...lead, stage: stages[Math.min(stages.indexOf(lead.stage) + 1, stages.length - 1)] } : lead))
  const changeIndustry = (index: number) => {
    setIndustryIndex(index)
    setLeads(INDUSTRY_DEMO_LEADS[index])
    setStageFilter('All leads')
    setSearch('')
  }
  const sendAiMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim()) return
    const userText = aiInput.trim()
    setAiMessages((prev) => [...prev, { role: 'user', text: userText }])
    setAiInput('')
    const reply = aiReply(userText)
    setTimeout(() => setAiMessages((prev) => [...prev, { role: 'assistant', text: reply }]), 600)
  }
  const aiReply = (text: string) => {
    const t = text.toLowerCase()
    if (t.includes('pipeline') || t.includes('deal')) return `Your current pipeline for ${industry.name} shows ${leads.filter((l) => l.stage === 'Proposal').length} proposals and ${leads.filter((l) => l.stage === 'Won').length} closed wins this month. Want me to prioritize follow-ups?`
    if (t.includes('follow') || t.includes('task')) return `You have ${leads.filter((l) => l.stage === 'New').length} new leads needing first contact and ${leads.filter((l) => l.stage === 'Contacted').length} awaiting follow-up. Shall I create tasks for them?`
    if (t.includes('workflow') || t.includes('automat')) return 'I can help design an automated workflow: lead capture → qualification → proposal → negotiation → closed-won. Would you like me to set up auto-assignment and reminders?'
    if (t.includes('analytics') || t.includes('report')) return `Conversion rate for ${industry.name}: ${Math.round((leads.filter((l) => l.stage === 'Won').length / leads.length) * 100)}%. Average deal value: ₹${Math.round(850000 / Math.max(1, leads.filter((l) => l.stage === 'Won').length))}.`
    return `Got it — "${text}". I can help with pipeline analytics, follow-up tasks, workflow design, and deal forecasting. What would you like to explore?`
  }

  return (
    <section id="crm-dashboard" className="section-deep py-16 sm:py-24">
      <div className="container-page">
        {/* Dashboard Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="eyebrow">Live CRM Dashboard</p>
            <h2 className="mt-2 text-3xl font-bold text-ink-950 sm:text-4xl">Manage your pipeline in real time</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-600">
              Analytics, workflow design, AI assistant and lead management — all with live dummy data you can interact with.
            </p>
          </div>
        </div>

        {/* Global Metrics */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricsByIndustry.map(([label, value, detail]) => (
            <div key={label} className="rounded-2xl border border-line bg-white p-5 sm:p-6 hover:shadow-sm transition">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{label}</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-ink-950">{value}</span>
                <span className="text-xs text-emerald-600 mt-0.5 block">{detail}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Industry Switcher */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CRM_INDUSTRIES.map((ind, i) => (
            <button
              key={ind.name}
              type="button"
              onClick={() => changeIndustry(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                industryIndex === i ? 'bg-accent-400 text-ink-950' : 'bg-white border border-line text-ink-600 hover:border-accent-400/50'
              }`}
            >
              {ind.name}
            </button>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-1 border-b border-line">
          {([
            { key: 'overview', label: 'Overview' },
            { key: 'pipeline', label: 'Pipeline' },
            { key: 'leads', label: 'Leads' },
            { key: 'analytics', label: 'Analytics' },
            { key: 'workflow', label: 'Workflow Design' },
            { key: 'ai', label: 'AI Assistant' },
          ] as const).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setView(item.key)}
              className={`px-5 py-3 text-xs font-semibold border-b-2 transition ${
                view === item.key
                  ? 'border-accent-600 text-accent-700 bg-accent-50'
                  : 'border-transparent text-ink-500 hover:text-ink-900 hover:bg-ink-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {view === 'overview' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Top task today</p>
              <p className="mt-1 text-lg font-bold text-ink-950">{tasksByIndustry[0]}</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Pipeline snapshot</p>
              <p className="mt-1 text-lg font-bold text-ink-950">{leads.filter((l) => l.stage === 'Won').length} of {leads.length} leads won</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Industry</p>
              <p className="mt-1 text-lg font-bold text-ink-950">{industry.name}</p>
            </div>
          </div>
        )}

        {/* Pipeline / Kanban Tab */}
        {view === 'pipeline' && (
          <>
            <div className="grid gap-6 sm:grid-cols-5">
              {stages.map((stage) => {
                const stageLeads = leads.filter((l) => l.stage === stage)
                const colors: Record<string, string> = {
                  New: 'bg-ink-100 text-ink-700',
                  Contacted: 'bg-blue-100 text-blue-700',
                  Qualified: 'bg-emerald-100 text-emerald-700',
                  Proposal: 'bg-amber-100 text-amber-700',
                  Won: 'bg-emerald-600 text-white',
                }
                return (
                  <div
                    key={stage}
                    className="flex flex-col gap-3 min-w-[220px] lg:min-w-[260px]"
                  >
                    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-line bg-white/50">
                      <span className={`text-xs font-bold ${colors[stage]}`}>{stage}</span>
                      <span className="text-[10px] font-bold text-ink-400">{stageLeads.length}</span>
                    </div>
                    <div className="flex-1 min-h-[300px] rounded-2xl border border-line bg-ink-50 p-3 overflow-y-auto">
                      {stageLeads.map((lead) => (
                        <div
                          key={lead.name}
                          className="mb-3 p-3 rounded-lg border border-white bg-white shadow-sm hover:shadow-md transition cursor-pointer group"
                          onClick={() => moveLead(lead.name)}
                        >
                          <div className="h-8 w-8 rounded-full flex shrink-0 items-center justify-center text-xs font-bold" style={{ backgroundColor: lead.color }}>
                            {lead.initials}
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-semibold text-ink-950 truncate group-hover:underline">{lead.name}</p>
                            <p className="text-xs text-ink-500 truncate">{lead.company}</p>
                            <p className="text-[10px] text-ink-400">{lead.value}</p>
                          </div>
                        </div>
                      ))}
                      {stageLeads.length === 0 && (
                        <p className="mt-6 text-center text-[10px] text-ink-400 italic">No leads</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-4 text-xs text-ink-500 text-center">Click a lead card to move it to the next pipeline stage</p>
          </>
        )}

        {/* Leads Tab */}
        {view === 'leads' && (
          <div className="rounded-2xl border border-line bg-white overflow-hidden">
            <div className="p-4 border-b border-line flex flex-wrap items-center gap-2 sm:px-6 sm:py-3">
              <input
                type="text"
                placeholder="Search leads…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input w-full sm:w-80"
              />
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value as any)}
                className="input"
              >
                <option>All leads</option>
                {stages.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {showAdd ? (
                <form onSubmit={addLead} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Lead name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input w-40"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="input w-40"
                  />
                  <button type="submit" className="btn btn-primary btn-sm">Add</button>
                  <button type="button" onClick={() => setShowAdd(false)} className="text-xs text-ink-500 underline">Cancel</button>
                </form>
              ) : (
                <button type="button" onClick={() => setShowAdd(true)} className="text-xs font-medium text-accent-600 underline hover:text-accent-700">+ Add lead</button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line bg-ink-50">
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-ink-400">Lead</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-ink-400">Company</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-ink-400">Source</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-ink-400">Value</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-ink-400">Stage</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-ink-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((lead) => (
                    <tr key={lead.name} className="hover:bg-ink-25 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full flex shrink-0 items-center justify-center text-sm font-bold" style={{ backgroundColor: lead.color }}>
                            {lead.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-ink-950">{lead.name}</p>
                            <p className="text-xs text-ink-500">{lead.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-700">{lead.company}</td>
                      <td className="px-6 py-4 text-sm text-ink-700">{lead.source}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-ink-950">{lead.value}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${lead.stage === 'Won' ? 'bg-emerald-100 text-emerald-700' : lead.stage === 'Proposal' ? 'bg-amber-100 text-amber-700' : lead.stage === 'Qualified' ? 'bg-blue-100 text-blue-700' : 'bg-ink-100 text-ink-700'}`}
                        >
                          {lead.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => moveLead(lead.name)}
                          className="text-xs text-accent-600 underline hover:text-accent-700 font-medium"
                        >
                          Move →
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-ink-500 text-sm">No leads found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {view === 'analytics' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400 mb-3">Conversion Rate</p>
              <div className="text-3xl font-bold text-ink-950 mb-1">
                {Math.round((leads.filter((l) => l.stage === 'Won').length / leads.length) * 100)}%
              </div>
              <p className="text-xs text-ink-500">{leads.filter((l) => l.stage === 'Won').length} of {leads.length} leads converted</p>
              <div className="mt-6 h-12 w-full bg-ink-100 rounded-full overflow-hidden">
                <div className="h-full bg-accent-600" style={{ width: `${Math.round((leads.filter((l) => l.stage === 'Won').length / leads.length) * 100)}%` }} />
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400 mb-3">Pipeline Value</p>
              <div className="text-3xl font-bold text-ink-950 mb-1">
                {metricsByIndustry[1][1]}
              </div>
              <p className="text-xs text-ink-500">Across all active stages</p>
              <div className="mt-6 grid gap-4">
                {[['Proposal', leads.filter((l) => l.stage === 'Proposal').length], ['Qualified', leads.filter((l) => l.stage === 'Qualified').length], ['Contacted', leads.filter((l) => l.stage === 'Contacted').length]].map(([stage, count]) => (
                  <div key={stage} className="flex items-center justify-between text-sm">
                    <span className="text-ink-600">{stage}</span>
                    <span className="text-ink-950 font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6 sm:p-8 lg:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400 mb-3">Lead Sources Breakdown</p>
              <div className="grid gap-3">
                {industry.sources.map((source) => {
                  const count = leads.filter((l) => l.source === source).length
                  return (
                    <div key={source} className="flex items-center justify-between p-3 rounded-xl border border-line bg-white">
                      <span className="text-sm text-ink-700">{source}</span>
                      <div className="w-full sm:w-40 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-600" style={{ width: `${Math.round((count / leads.length) * 100)}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-ink-950">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Workflow Design Tab */}
        {view === 'workflow' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Lead Capture', desc: 'WhatsApp, web, social & phone leads auto-enter pipeline', icon: '📥', color: 'bg-blue-500' },
              { title: 'Auto-Qualify', desc: 'AI scores leads by source, value and intent', icon: '⚡', color: 'bg-emerald-500' },
              { title: 'Assign Owner', desc: 'Round-robin or skill-based rep assignment', icon: '👤', color: 'bg-purple-500' },
              { title: 'Follow-up Tasks', desc: 'Automated reminders & next-step prompts', icon: '⏰', color: 'bg-amber-500' },
              { title: 'Proposal Sent', desc: 'Auto-generate & track proposal delivery', icon: '📄', color: 'bg-indigo-500' },
              { title: 'Negotiation', desc: 'Track status & renewal dates per deal', icon: '🤝', color: 'bg-pink-500' },
              { title: 'Closed Won', desc: 'Deal won — trigger onboarding & invoicing', icon: '✅', color: 'bg-emerald-600' },
              { title: 'Analytics', desc: 'Conversion, revenue & rep performance reports', icon: '📊', color: 'bg-cyan-500' },
            ].map((step) => (
              <div key={step.title} className="rounded-2xl border border-line bg-white p-5 sm:p-6 flex flex-col items-center text-center">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-lg mb-3 ${step.color}`}>{step.icon}</div>
                <h4 className="text-sm font-bold text-ink-950 mb-1">{step.title}</h4>
                <p className="text-xs text-ink-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* AI Assistant Tab */}
        {view === 'ai' && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 rounded-2xl border border-line bg-white flex flex-col h-[500px] sm:h-[600px]">
              <div className="p-4 border-b border-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">AI</div>
                  <div>
                    <p className="text-sm font-bold text-ink-950">MYR AI Assistant</p>
                    <p className="text-[10px] text-ink-400">Live CRM assistant</p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className="h-8 w-8 rounded-full flex shrink-0 items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: msg.role === 'user' ? '#6366f1' : '#10b981' }}>
                      {msg.role === 'user' ? 'Y' : 'A'}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user' ? 'bg-accent-600 text-white' : 'bg-ink-50 text-ink-800 border border-line'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 animate-pulse">
                  <div className="h-8 w-8 rounded-full flex shrink-0 items-center justify-center text-[10px] font-bold text-white bg-ink-200">A</div>
                  <div className="h-4 w-24 bg-ink-100 rounded-full" />
                </div>
              </div>
              <div className="p-4 border-t border-line flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask about pipeline, deals, follow-ups…"
                  className="flex-1 input"
                  onKeyDown={(e) => e.key === 'Enter' && sendAiMessage(e)}
                />
                <button
                  type="button"
                  onClick={sendAiMessage}
                  className="px-4 py-2 rounded-xl bg-accent-600 text-white text-sm font-semibold hover:bg-accent-700 transition disabled:opacity-50"
                  disabled={!aiInput.trim()}
                >
                  Send
                </button>
              </div>
            </div>
            <div className="lg:w-[340px] rounded-2xl border border-line bg-white p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400 mb-3">Quick actions</p>
              <div className="space-y-3">
                {[
                  'Show my pipeline health',
                  'Create follow-up tasks for new leads',
                  'Design an automated workflow',
                  'Forecast this month revenue',
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => { setAiInput(q); sendAiMessage({ preventDefault: () => {} } as React.FormEvent) }}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-line bg-white text-left text-sm text-ink-700 hover:bg-ink-25 transition"
                  >
                    <span>{q}</span>
                    <span className="text-[10px]">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export function CrmDevelopmentPage() {
  return (
    <>
      <HeroSection />
      <SubscriptionPlans
        productId={6004}
        name="CRM Software"
        heading="Your Business, Your CRM – Tailored for Success"
        sub="Choose a plan that fits your team. Every plan includes pipeline management, customer tracking and sales automation."
      />
      <ApproachSection />
      <ProcessSection />
      <AudiencesSection />
      <LeadSourcesSection />
      <FeaturesSection />
      <StoriesSection />
      <CrmLiveDashboard />
    </>
  )
}
