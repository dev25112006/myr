import { CHAT_SUPPORT, CHAT_SALES } from '@/components/layout/nav'
import { Reveal, SectionHeading, Stagger, StaggerItem, TiltCard } from '@/components/ui'
import { BuyShowcase } from '@/components/commerce/BuyShowcase'
import { SmartForm, type FormConfig } from '@/components/forms/SmartForm'

/* ------------------------------- source data ------------------------------ */

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
    body: '“Before the CRM goes live, we conduct thorough testing to ensure that every feature works seamlessly. Our quality assurance process includes functional testing, performance testing, and security testing to ensure that your CRM system is reliable and ready for use.”',
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

/** Extended lead form — exact fields from crm-development.links.md + original form HTML. */
const LEAD_FORM: FormConfig = {
  id: 'crm-dev-lead',
  inboxType: 'lead',
  inboxSubject: 'CRM development inquiry',
  submitLabel: 'Submit',
  successMessage:
    'Thank you! Your request was received on this demo build. UNVERIFIED: the original site stores submissions via WPForms on the live server.',
  fields: [
    {
      kind: 'text',
      name: 'name',
      label: 'Name',
      required: true,
      placeholder: '(Please enter your full name) [Name Input Field]',
      autocomplete: 'name',
    },
    {
      kind: 'email',
      name: 'email',
      label: 'Email',
      required: true,
      placeholder: '(Please provide your email address for correspondence)',
      autocomplete: 'email',
    },
    {
      kind: 'tel',
      name: 'phone',
      label: 'Phone Number',
      required: true,
      placeholder: '(We may contact you for further details)',
      autocomplete: 'tel',
    },
    {
      kind: 'text',
      name: 'company',
      label: 'Company Name',
      required: true,
      placeholder: '(Tell us about your business)',
    },
    {
      kind: 'select',
      name: 'industry',
      label: 'Industry Type',
      required: true,
      half: true,
      options: ['Fashion', 'Healthcare', 'Real Estate', 'Retail', 'Manufacturing', 'IT Services', 'Others'],
    },
    {
      kind: 'select',
      name: 'crmType',
      label: 'CRM Type',
      required: true,
      half: true,
      options: ['Standard CRM', 'Advanced Customized CRM', 'Not Sure / Need Consultation'],
    },
    {
      kind: 'text',
      name: 'typePhone',
      label: 'Name: Type: Phone',
      placeholder: undefined,
      half: true,
    },
    {
      kind: 'number',
      name: 'users',
      label: 'Expected Number of Users',
      required: true,
      placeholder: '(How many team members will use the CRM?)',
      half: true,
    },
    {
      kind: 'checkbox-group',
      name: 'features',
      label: 'Core Features Required',
      required: true,
      options: [
        'Sales Management',
        'Customer Support',
        'Inventory Management',
        'Email Campaigns',
        'Lead Tracking',
        'Other (Please specify)',
      ],
    },
    {
      kind: 'select',
      name: 'contactMethod',
      label: 'Preferred Contact Method',
      required: true,
      options: ['Phone', 'Email', 'WhatsApp'],
    },
    {
      kind: 'textarea',
      name: 'details',
      label: 'Additional Information',
      placeholder: '(Feel free to add any other details about your project)',
    },
  ],
}

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
              <a href="#crm-quote" className="btn btn-ghost-dark btn-md">
                Get Quote
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

function LeadFormSection() {
  return (
    <section id="crm-quote" className="section-deep py-20 sm:py-24">
      <div className="container-page grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <p className="eyebrow">Get Quote</p>
          <h2 className="mt-3 text-3xl font-bold text-ink-950 sm:text-4xl">
            Tell us about your CRM needs
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-300">
            Share a few details about your business and our team will get back to you with a tailored
            quote. Fields match the original Get Quote form.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://app.jetcrm.in/register/myrsignup"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-md"
            >
              Registered &amp; Get Free Trial
            </a>
            <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">
              Talk to sales
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="card p-6 sm:p-8">
            <SmartForm config={LEAD_FORM} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export function CrmDevelopmentPage() {
  return (
    <>
      <HeroSection />
      <BuyShowcase
        id={6004}
        name="CRM Software"
        desc="Tailored CRM — pipeline management, customer tracking and sales automation."
        fallbackPrice={8000}
        monthly
        image="/assets/2024-09-customized-crm-development.png"
        heading="Your Business, Your CRM – Tailored for Success"
        sub="Admin-controlled pricing. Buy now and go live fast."
        features={['Pipeline management', 'Customer tracking', 'Sales automation', 'Custom workflows']}
      />
      <ApproachSection />
      <ProcessSection />
      <LeadFormSection />
    </>
  )
}
