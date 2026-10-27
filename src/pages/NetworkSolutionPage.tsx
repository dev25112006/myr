import { CHAT_SUPPORT, CHAT_SALES } from '@/components/layout/nav'
import { Reveal, SectionHeading, Stagger, StaggerItem, SupportBlock, TestimonialCard, type Story } from '@/components/ui'

/* ------------------------------- source data ------------------------------ */

const SOLUTIONS = [
  {
    title: 'IT Infrastructure Management',
    body: '“From servers to data centers, we manage your entire IT ecosystem, optimizing performance, enhancing scalability, and minimizing costs..”',
  },
  {
    title: 'Network Design & Implementation',
    body: '“We architect and implement custom network infrastructures, ensuring your business enjoys high performance, reliability, and scalability.”',
  },
  {
    title: 'Managed Network Services',
    body: '“Eliminate downtime with our 24/7 proactive monitoring and support. We keep your network running smoothly, so you can focus on growing your business.”',
  },
  {
    title: 'Wireless Network Solutions',
    body: '“Empower your team with seamless, high-speed wireless connectivity that ensures productivity, whether in the office or on the go.”',
  },
  {
    title: 'Security Solutions',
    body: '“Safeguard your network with cutting-edge security features like encrypted VPNs, firewalls, and intrusion detection systems to keep threats at bay.”',
  },
  {
    title: 'Structured Cabling',
    body: '“Efficiently organized cabling infrastructure for enhanced network reliability, easy management, and future scalability.”',
  },
  {
    title: 'Cloud Networking',
    body: '“Our flexible cloud networking solutions allow your business to scale effortlessly while maintaining security and efficiency.”',
  },
]

const WHY_CHOOSE =
  'Our certified IT engineers combine deep technical expertise with industry-leading tools to design, implement, and manage IT infrastructure and network solutions that are scalable, secure, and future-proof. With round-the-clock support, we ensure that your business never misses a beat, providing bespoke solutions for companies of all sizes across various industries. Let us handle your IT backbone so you can focus on driving your business forward.'

const STORIES: Story[] = [
  {
    name: 'Anil Sharma',
    role: 'IT Director, Technology Sector',
    image: '/assets/2024-08-male-icon.jpg',
    quote:
      '"MYR ADVANCE SOLUTION completely transformed our IT infrastructure. The team implemented a robust and secure network that has increased our efficiency and minimized downtime. Their support is always prompt and professional, which has been crucial to our operations."',
  },
  {
    name: 'Neha Jain',
    role: 'Operations Manager, Fashion Retail Industry',
    image: '/assets/2024-08-female-icon.jpg',
    quote:
      '"We needed a scalable network solution to support our growing business, and MYR ADVANCE SOLUTION delivered. Their team designed a network that perfectly suits our needs, and their 24/7 support gives us peace of mind. I highly recommend them."',
  },
  {
    name: 'Vikram Deshmukh',
    role: 'CEO, Manufacturing Industry',
    image: '/assets/2024-08-male-icon.jpg',
    quote:
      '"The wireless network solution implemented by MYR ADVANCE SOLUTION has been a game-changer for us. We now have uninterrupted connectivity across all departments, which has boosted productivity significantly. Their team’s professionalism and expertise really stood out."',
  },
  {
    name: 'Priya Sinha',
    role: 'CIO, Healthcare Industry',
    image: '/assets/2024-08-female-icon.jpg',
    quote:
      '"MYR ADVANCE SOLUTION’s network solutions were exactly what we needed to upgrade our outdated infrastructure. Their structured cabling and cloud networking services have made our internal communication seamless and efficient."',
  },
  {
    name: 'Rohan Kapoor',
    role: 'IT Head, Retail Industry',
    image: '/assets/2024-08-male-icon.jpg',
    quote:
      '"We approached MYR ADVANCE SOLUTION for a complete network overhaul, and they exceeded our expectations. Their team was highly professional, delivering on time with a flawless setup. Our network is now faster, more secure, and incredibly reliable."',
  },
  {
    name: 'Sonal Mehta',
    role: 'COO, Trade & Export Industry',
    image: '/assets/2024-08-female-icon.jpg',
    quote:
      '"Their approach to designing and implementing a secure, high-performance network for our company was nothing short of professional. MYR ADVANCE SOLUTION provided excellent service from start to finish. Our entire system is now much more efficient, and their ongoing support has been a lifesaver."',
  },
]

/* --------------------------------- sections -------------------------------- */

function HeroSection() {
  return (
    <section className="section-dark grid-noise relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow">Network Solution</p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
              Seamless IT Infrastructure & Network Solutions for{' '}
              <span className="text-gradient">Unmatched Connectivity</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
              Empowering Businesses with Reliable, High-Performance Network Infrastructure
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
                Talk to sales
              </a>
              <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">
                Live Chat
              </a>
              {/* FLAG §7.16: source links `#dm` — no such anchor exists on the page (dead in original). */}
              <a href="#dm" className="btn btn-ghost-dark btn-md" title="Source link points to #dm — no target on page (flagged)">
                Book Free Consultation
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="relative">
          <div className="absolute inset-6 rounded-[2.5rem] bg-accent-400/12 blur-3xl" aria-hidden />
          <img
            src="/assets/2024-09-cloud-networking.png"
            alt="Cloud networking infrastructure"
            className="relative w-full rounded-[2rem] border border-line object-cover shadow-card"
            width={2000}
            height={1333}
          />
        </Reveal>
      </div>
    </section>
  )
}

function IntroSection() {
  return (
    <section className="section-dark border-y border-line py-14">
      <div className="container-page">
        <Reveal>
          <h2 className="text-2xl font-bold text-ink-950 sm:text-3xl">At MYR ADVANCE SOLUTION PVT. LTD.,</h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-ink-300">
            We know that in today’s digitally-driven landscape, your business’s backbone lies in its
            IT infrastructure and networking. Whether you’re a budding startup or an established
            enterprise, seamless connectivity, top-tier performance, and robust security are essential
            to stay competitive. We specialize in crafting IT infrastructure and network solutions that
            are not just reliable, but also tailored to meet the unique needs of your business, keeping
            you connected and secure, around the clock.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function SolutionsSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Our IT Infrastructure & Network Solutions Include:" />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <StaggerItem key={s.title} className="card flex h-full flex-col p-6">
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent-400/12 text-lg text-accent-600" aria-hidden>
                ◆
              </span>
              <h3 className="text-lg font-bold text-ink-950">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{s.body}</p>
            </StaggerItem>
          ))}
          <StaggerItem className="flex flex-col justify-center rounded-[1.5rem] border border-accent-400/30 bg-gradient-to-br from-accent-400/12 to-transparent p-6">
            <p className="text-lg font-bold text-ink-950">Need a custom network design?</p>
            <div className="mt-4 flex flex-col gap-2">
              <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
                Talk to sales
              </a>
              <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">
                Live Chat
              </a>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}

function WhyChooseSection() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Why Choose us ?" /* sic spacing preserved */ />
        <Reveal className="mx-auto mt-10 max-w-4xl">
          <blockquote className="rounded-[1.75rem] border border-line bg-ink-950/[0.04] p-6 text-base leading-relaxed text-ink-300 sm:p-8 sm:text-lg">
            {WHY_CHOOSE}
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}

function StoriesSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Our Success Stories Speak for Themselves" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {STORIES.map((s) => (
            <TestimonialCard key={s.name} story={s} />
          ))}
        </div>
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

export function NetworkSolutionPage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <SolutionsSection />
      <WhyChooseSection />
      <StoriesSection />
      <SupportSection />
    </>
  )
}
