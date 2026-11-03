/**
 * JSON-LD structured data — schema.org, only verified facts from the audit.
 * Site-wide: Organization + WebSite. Per-route: Breadcrumb, Service, FAQ, Product.
 */

const SITE = typeof window !== 'undefined' ? window.location.origin : ''
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
      name: 'How to buy a product?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Browse products/services on our website on the Shop Page and select the desired product. Add it to your cart and proceed to checkout. Enter billing and payment information and complete the purchase. Receive confirmation and delivery/access details. If you need assistance, simply raise a query on our Contact Us page for a demo or any other support needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to send a custom query?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Visit our website and navigate to the Contact Us page. Fill out the query form with your contact information, including your name, email address, and phone number. In the message section, provide details of your query or request. Click on the Submit or Send button. You will receive a confirmation message acknowledging receipt of your query, and our team will respond promptly.',
      },
    },
    {
      '@type': 'Question',
      name: 'How Does the Support Policy Work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scope covers product functionality, usage, and troubleshooting. Channels: email, phone, or live chat. Response time: assistance within minutes on phone/live chat; email response within 24 hours. Support hours: Mon-Fri, 10 AM to 6 PM (excluding holidays). A ticketing system ensures efficient tracking, with severity levels, escalation, regular updates, and advance notice of end of support.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can send a refund request?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to the My Account section on our website and select Orders. Locate the order for which you would like to request a refund. Click on Request Refund, select the appropriate reason, and click Submit to send your request.',
      },
    },
    {
      '@type': 'Question',
      name: 'My account blocked what can I do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If your account is blocked, reach out to Customer Chat Support or email support@myradvancesolution.com. Provide the necessary information related to your account, understand the reason for the block, follow the provided instructions, review our account policies, ask for clarification if anything is unclear, and please be patient while we resolve the issue.',
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
      name: 'How long does it take to build my website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your website goes live with a maintenance or coming soon page within 24 hours. The full development is completed within 15-20 days, based on content and requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer custom website designs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We create unique, tailored designs to match your brand and business needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will my website be mobile-friendly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! All our websites are fully responsive and optimized for mobile devices.',
      },
    },
    {
      '@type': 'Question',
      name: "Can I update my website after it's live?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We provide easy-to-use tools and support so you can manage updates effortlessly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer SEO optimization?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We provide basic SEO with every website to ensure a strong foundation. For advanced SEO strategies, you can choose from our SEO plans at an additional cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I need support after my website is launched?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We provide 24/7 support via live chat, WhatsApp dedicated group, and phone, while email queries are responded to within 24 hours.',
      },
    },
  ],
}

export const FAQ_SERVICES = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_HOME.mainEntity.slice(0, 1).concat([
    FAQ_HOME.mainEntity[1],
    {
      '@type': 'Question',
      name: 'How work the support policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scope: covers assistance for product functionality, usage, and troubleshooting. Channels: email, phone, or live chat during specified hours. Response time: within 72 hours during business hours. Support hours: Monday to Friday, 10 Am to 6 Pm excluding holidays. Includes ticketing, severity levels, escalation, regular updates, and advance notice of end of support.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can send a refund request?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Visit our website's Refund request page and fill out the query form with your details. Clearly state your refund request in the message, provide purchase details and reason for the refund, and click Submit or Send. To raise your refund, please visit the refund policy page and read carefully for detailed instructions.",
      },
    },
    {
      '@type': 'Question',
      name: 'My account blocked what can I do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If your account is blocked, contact Customer Support at +91 7408443341, provide necessary information, understand the reason for the block, follow instructions to resolve, review policies, seek clarification if needed, and be patient for resolution.',
      },
    },
  ]),
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
  return out
}
