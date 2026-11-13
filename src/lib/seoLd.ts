/**
 * JSON-LD structured data — schema.org, only verified facts from the audit.
 * Site-wide: Organization + WebSite. Per-route: Breadcrumb, Service, FAQ, Product.
 */

import { SEGMENT_LIST, MODULES_FAQ, type FaqItem } from '@/content/education/segments'

const SITE = typeof window !== 'undefined' ? window.location.origin : ''
export const SITE_ORIGIN = SITE
const WHATSAPP = '+917408443341'

export const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'MYR ADVANCE SOLUTION PVT. LTD.',
  alternateName: 'MyR Advance Solution',
  url: `${SITE}/`,
  logo: `${SITE}/assets/2024-08-MYR-ADVANCE-SOLUTION.png`,
  foundingDate: '2016',
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United States' },
  ],
  sameAs: [
    'https://www.facebook.com/myrnetwork',
    'https://www.instagram.com/myr_solution/',
    'https://www.linkedin.com/in/myr-advance-solution-04b1151a6/',
    'https://x.com/myrnetwork',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: WHATSAPP,
    contactType: 'customer support',
    availableLanguage: ['English', 'Hindi'],
  },
}

export const WEBSITE_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: `${SITE}/`,
  name: 'MyR Advance Solution',
  publisher: { '@id': `${SITE}/#organization` },
}

export function breadcrumbLd(path: string, pageTitle: string) {
  const segments = path.split('/').filter(Boolean)
  const items = [{ name: 'Home', position: 1, item: `${SITE}/` }]
  let acc = ''
  segments.forEach((seg, i) => {
    acc += `/${seg}/`
    const last = i === segments.length - 1
    items.push({
      name: last ? pageTitle.replace(/\s*[-|]\s*MyR.*$/i, '') || seg : seg.replace(/-/g, ' '),
      position: i + 2,
      item: `${SITE}${acc}`,
    })
  })
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it) => ({
      '@type': 'ListItem',
      position: it.position,
      name: it.name,
      item: it.item,
    })),
  }
}

/** Service schema for the primary software and infrastructure service routes. */
const SERVICES: Record<string, { name: string; desc: string }> = {
  '/website-development/': {
    name: 'Website Development',
    desc: 'Professional website design & development with custom features, SEO, and mobile-friendly design.',
  },
  '/crm-development/': {
    name: 'CRM Development',
    desc: 'Custom CRM solutions tailored to your business to boost sales and convert leads.',
  },
  '/privyr/': {
    name: 'Lead Management CRM Software',
    desc: 'Mobile CRM workflows for enquiry capture, contact management, sales follow-up, and lead pipeline visibility.',
  },
  '/crm/': {
    name: 'Lead Management CRM Software',
    desc: 'Mobile CRM workflows for enquiry capture, contact management, sales follow-up, and lead pipeline visibility.',
  },
  '/hrm-solutions/': {
    name: 'Human Resource Management Software',
    desc: 'HRMS implementation planning for employee records, hiring, onboarding, attendance, leave, payroll workflows, and employee self service.',
  },
  '/education-erp/': {
    name: 'Education ERP Software',
    desc: 'Education ERP planning for schools, colleges, and coaching institutes, including admissions, academics, attendance, fees, exams, and portals.',
  },
  '/ecommerce-solutions/': {
    name: 'Ecommerce Website Development',
    desc: 'Responsive ecommerce website development with product catalogs, checkout planning, payment integration, inventory workflows, and SEO foundations.',
  },
  '/digital-marketing/': {
    name: 'Digital Marketing',
    desc: 'SEO, Lead Generation, Digital Marketing Strategies, and More.',
  },
  '/network-solution/': {
    name: 'Network Solutions',
    desc: 'Comprehensive IT infrastructure services including network solutions, data security, and system support.',
  },
  '/ipbx-solution/': {
    name: 'IP PBX Systems',
    desc: 'Reliable PBX systems for business communication with advanced call management.',
  },
  '/cctv-solution/': {
    name: 'CCTV Installation and Surveillance Systems',
    desc: 'CCTV system planning and installation, including 16, 32 and 64-channel options for business premises in India.',
  },
  '/1800-number/': {
    name: 'Toll-Free 1800 Number',
    desc: 'Exclusive 1-800 toll-free number service with IVR for unparalleled customer engagement.',
  },
}

export function serviceLd(path: string) {
  const s = SERVICES[path]
  if (!s) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.desc,
    provider: { '@id': `${SITE}/#organization` },
    areaServed: path === '/1800-number/'
      ? { '@type': 'Country', name: 'India' }
      : [
          { '@type': 'Country', name: 'India' },
          { '@type': 'Country', name: 'United States' },
        ],
    serviceType: s.name,
  }
}

/** FAQPage JSON-LD — question/answer pairs verbatim from page manifests. */
export const FAQ_HOME = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What IT services does MYR Advance Solution provide for businesses in India and the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We deliver end-to-end IT services for startups, SMBs and enterprises across India, the United States and worldwide — website and ecommerce development, custom CRM and ERP software, cloud IP PBX and business telephony, CCTV security, networking, digital marketing, and IT hardware. Every engagement is scoped to your market, so pricing, compliance and timelines fit whether you operate in India or the US.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a website or software project cost in India vs the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Costs depend on scope, integrations and design. As a guide, a business website in India typically starts around ₹15,000, while a comparable project for a US business usually starts near $1,000; custom software, ERP and CRM builds are quoted individually. You get a fixed, itemised quote in INR or USD before work begins — request one on our Contact Us page.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to launch a website or software project?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most websites go live within 24 hours with a maintenance or coming-soon page and are fully completed in 15–20 working days. Custom software, CRM and ERP implementations follow a milestone plan agreed up front, so you always know what ships next and when.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will my website rank on Google and AI search engines like ChatGPT?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — every site we build ships with technical SEO fundamentals: semantic HTML, schema markup, sitemaps, Core Web Vitals optimisation and mobile-first performance. Content is structured so Google's AI Overviews and answer engines like ChatGPT and Perplexity can cite it, and our digital marketing team can run ongoing SEO campaigns for India, the US or global audiences.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is my business data secure and compliant with privacy laws?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We build with encryption in transit and at rest, role-based access and audit logs, and we align implementations with India's DPDP Act and frameworks used by US clients such as GDPR and CCPA. Education deployments additionally follow student-data-minimisation practices. Compliance requirements for your region are reviewed before build, not after.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get started or book a free demo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Share your requirement on the Contact Us page — you'll get a reply within one business day. Browse ready-to-buy products on the Tech Store. Prefer to talk? Chat with our team on WhatsApp or email contact@myradvancesolution.com.",
      },
    },
  ],
}

export const FAQ_CAREERS = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I apply for a job at MYR Advance Solution?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anyone can apply — no login required. Fill out the application form on the Careers page, complete the Turnstile human verification, and submit your resume, cover note, and optional portfolio. Applications are reviewed by the hiring team and you will receive a reply within one business day.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who can apply for positions at MYR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All positions are open to freshers and experienced candidates from India, the United States, or anywhere in the world. No sign‑up is needed to apply or to view open positions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What documents are needed for the application?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Typical documents include an updated resume, a brief cover note (optional but recommended), and a portfolio or LinkedIn profile (optional). References are contacted only if shortlisted.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to hear back after applying?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The hiring team aims to reply within one business day of application submission. If you do not hear back, you may follow up via the contact form or WhatsApp.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I apply for multiple positions at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You may submit one application per open position. Each application is evaluated independently based on the role\'s requirements.',
      },
    },
  ],
}

export const FAQ_BLOG = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What kind of topics are covered in the MYR blog?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The blog covers practical guides on school and college ERP, CRM, HRM, website development cost, AI digital marketing, IP PBX phone systems, and other IT business solutions from the MYR team.',
      },
    },
    {
      '@type': 'Question',
      name: 'How often are new blog posts published?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'New guides are published roughly twice per month. You can subscribe to updates or follow the blog category that interests you most.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I read older blog articles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All past articles are archived under /blogs/ and organized by category (ERP, CRM, IP PBX, Digital Marketing, Website Development). You can use the search and filter tools to find older content.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do the blog articles include JSON‑LD structured data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Each blog post ships with BlogPosting schema.org markup, including headline, description, author, publish date, and reading time, so search engines and AI answer engines can cite the content.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I search for a specific topic in the blog?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use the category filter on the /blogs/ index page, or press ⌘/Ctrl + F to search within any article. Tags at the top of each post also link to related topics.',
      },
    },
  ],
}

export const FAQ_WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does website development cost in India or the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Business websites start around ₹15,000 for India-based clients and near $1,000 for US clients, scaling with design, pages and integrations. Ecommerce and custom web apps are quoted individually, with a fixed, itemised estimate in INR or USD before work starts.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to build my website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your website goes live with a maintenance or coming soon page within 24 hours. The full development is completed within 15-20 days, based on content and requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will my website rank on Google and appear in AI search results?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Every build includes technical SEO: semantic HTML, schema markup, sitemap and robots setup, and Core Web Vitals optimisation. Content structure is designed for Google's AI Overviews and answer engines such as ChatGPT, and advanced SEO campaigns for India, the US or global markets are available as add-on plans.",
      },
    },
    {
      '@type': 'Question',
      name: 'Will my website be mobile-friendly and fast?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All our websites are fully responsive and are built to pass modern Core Web Vitals targets for speed and stability, tested on both mobile and desktop devices.',
      },
    },
    {
      '@type': 'Question',
      name: "Can I update my website after it's live?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We provide easy-to-use tools and support so you can manage updates effortlessly, and our team is available for any changes you would rather outsource.',
      },
    },
    {
      '@type': 'Question',
      name: 'What support do I get after my website is launched?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We provide 24/7 support via live chat, a dedicated WhatsApp group and phone, while email queries are answered within 24 hours. Maintenance, backups and content updates can be bundled with your plan.',
      },
    },
  ],
}

export const FAQ_SERVICES = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Which service should I choose — website, CRM, ERP or digital marketing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with your bottleneck: a new or outdated online presence calls for website development; scattered customer data and slow follow-ups call for CRM; multi-department operations call for ERP; low visibility and lead flow call for digital marketing. Each service section on this page links to a dedicated page, or contact the team and we will map the right starting point for your business.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you add AI features to CRM, ERP and marketing projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Current builds include AI-assisted lead scoring and reply drafting in CRM, AI marketing tools for campaign variants and keyword clustering, and reporting with AI summaries. We use AI where it measurably saves time and keep human review on anything customer-facing.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does cloud IP PBX telephony work for teams in India and the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A cloud IP PBX routes calls over the internet instead of legacy phone lines: extensions, IVR menus, ring groups, call recording and CRM screen-pops are configured in software. India offices connect through SIP trunks, and US teams can run toll-free 1800 numbers. The same system serves multi-location and remote teams.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you work with clients outside India — the US and worldwide?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We serve clients in the United States and worldwide with remote-first delivery, IST/EST-overlap meetings, WhatsApp and live-chat support, and quotes in INR or USD. Discovery, demos and handovers happen online, so timezone differences do not slow delivery.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are your payment terms and accepted payment methods?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Projects are billed in INR with a GST invoice, or in USD for applicable regions. Typical terms are an advance to begin with milestone payments through delivery. Hardware and ready-made products can be purchased directly through the Tech Store checkout, and subscriptions renew per the agreed billing cycle.',
      },
    },
    {
      '@type': 'Question',
      name: "How fast is MYR's support response?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Phone and live chat get assistance within minutes during support hours, and email queries are answered within 24 hours. Support runs Monday to Friday, 10 AM to 6 PM IST, with a ticketing system, severity-based prioritisation and escalation for critical issues.',
      },
    },
  ],
}

/** Product JSON-LD for verified catalog IDs (exact prices from audit). */
const PRODUCTS: Record<
  string,
  { name: string; price: number; desc: string; sku: string }
> = {
  '/product/newbiz-essentials/': { name: 'NewBiz Essentials', price: 14499, desc: 'Classic, timeless designs to establish a strong online presence.', sku: '2765' },
  '/product/revampcommerce-lite/': { name: 'RevampCommerce Lite', price: 24499, desc: 'Modern custom design + integrated e-commerce functionality.', sku: '2766' },
  '/product/elitecustom-suite/': { name: 'EliteCustom Suite', price: 59499, desc: 'Tailored designs, advanced features, and seamless functionality.', sku: '2767' },
  '/product/website-development/': { name: 'Website Development', price: 0, desc: 'Custom website development with variable plan options.', sku: '2424' },
  '/product/digital-marketing/': { name: 'Digital Marketing', price: 0, desc: 'Digital marketing services with plan options.', sku: '2768' },
  '/product/myrlink-ip-pbx-ip100-v3/': { name: 'MYRLINK IP PBX IP100 V3', price: 65499, desc: 'Business IP PBX system with unlimited concurrent calls and SIP trunk support.', sku: '3056' },
}

export function productLd(path: string) {
  const p = PRODUCTS[path]
  if (!p) return null
  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.desc,
    sku: p.sku,
    brand: { '@type': 'Brand', name: 'MyR Advance Solution' },
    offers: {
      '@type': 'Offer',
      url: `${SITE}${path}`,
      priceCurrency: 'INR',
      ...(p.price > 0 ? { price: p.price } : {}),
      availability: 'https://schema.org/InStock',
    },
  }
  return node
}

/** FAQPage node from plain {q, a} pairs (education segments). */
function faqPageLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

/** Per-route extra structured data. */
export function pageLd(path: string): object[] {
  const out: object[] = []
  const svc = serviceLd(path)
  if (svc) out.push(svc)
  const prod = productLd(path)
  if (prod) out.push(prod)
  if (path === '/') out.push(FAQ_HOME)
  if (path === '/website-development/') out.push(FAQ_WEBSITE)
  if (path === '/services/') out.push(FAQ_SERVICES)
  const eduSegment = SEGMENT_LIST.find((s) => s.path === path)
  if (eduSegment) out.push(faqPageLd(eduSegment.faq))
  if (path === '/education-erp/' || path === '/education-erp/modules/') out.push(faqPageLd(MODULES_FAQ))
  if (path === '/careers/') out.push(FAQ_CAREERS)
  if (path === '/blogs/') out.push(FAQ_BLOG)
  return out
}

/** Shape from src/lib/blogs.tsx (`Blog`) — kept structural so this stays decoupled. */
export function blogPostingLd(blog: {
  title: string
  slug: string
  excerpt: string
  category?: string
  tags?: string[]
  author?: string
  coverImage?: string
  readingMinutes?: number
  createdAt: string
  updatedAt?: string
}) {
  const url = `${SITE}/blogs/${blog.slug}/`
  const image = blog.coverImage
    ? blog.coverImage.startsWith('http') ? blog.coverImage : `${SITE}${blog.coverImage}`
    : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    ...(image ? { image } : {}),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: { '@type': 'Organization', name: blog.author || 'MYR Editorial Team', url: `${SITE}/` },
    publisher: { '@id': `${SITE}/#organization` },
    ...(blog.category ? { articleSection: blog.category } : {}),
    keywords: (blog.tags || []).join(', '),
    timeRequired: `PT${Math.max(1, blog.readingMinutes || 3)}M`,
    inLanguage: 'en',
  }
}

/** Blog + schema for the /blogs/ index page. */
export function blogIndexLd(blogs: Array<{ title: string; slug: string; excerpt: string; createdAt: string; category?: string; tags?: string[]; readingMinutes?: number }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'MyR Advance Solution Blog',
    description: 'Guides and insights on ERP software, CRM, HRM, website development, digital marketing, IP PBX and CCTV from the MYR team.',
    url: `${SITE}/blogs/`,
    publisher: { '@id': `${SITE}/#organization` },
    blogPost: blogs.map((blog, index) => ({
      '@type': 'BlogPosting',
      headline: blog.title,
      url: `${SITE}/blogs/${blog.slug}/`,
      description: blog.excerpt,
      datePublished: blog.createdAt,
      position: index + 1,
    })),
  }
}
