/**
 * Catalog — WooCommerce product IDs + names/prices VERIFIED from source HTML
 * (product pages `add-to-cart` values, tech-store `data-product_id`, homepage
 * plan links). Never invent entries: extend only from audit manifests.
 *
 * Note: ID 2765 is referenced by BOTH the homepage NewBiz "Choose plan"
 * (₹14,499) and the tech-store deal banner (₹11,988) — source conflict,
 * flagged in analysis §7.3. Call sites pass the price shown next to their
 * own CTA so both preserved.
 */
export type CatalogProduct = {
  id: number
  name: string
  slug: string
  price: number
  compareAt?: number
  image?: string
  type: 'simple' | 'variable'
  category: string
  /** Plan configuration for subscription products */
  plans?: PlanConfig[]
}

export type PlanTier = 'basic' | 'pro' | 'userbased'

export type PlanConfig = {
  tier: PlanTier
  name: string
  monthly: { price: number; compareAt?: number }
  yearly: { price: number; compareAt?: number }
  description: string
  features: string[]
  isMostPopular?: boolean
}

export const CATALOG: Record<number, CatalogProduct> = {
  2765: {
    id: 2765,
    name: 'NewBiz Essentials',
    slug: '/product/newbiz-essentials/',
    price: 14499,
    compareAt: 30000,
    image: '/assets/2024-09-website-development.jpg',
    type: 'simple',
    category: 'Website Development',
  },
  2766: {
    id: 2766,
    name: 'RevampCommerce Lite',
    slug: '/product/revampcommerce-lite/',
    price: 24499,
    compareAt: 60999,
    type: 'simple',
    category: 'Website Development',
  },
  2767: {
    id: 2767,
    name: 'EliteCustom Suite',
    slug: '/product/elitecustom-suite/',
    price: 59499,
    compareAt: 75000,
    type: 'simple',
    category: 'Website Development',
  },
  5085: {
    id: 5085,
    name: 'NewBiz Essentials',
    slug: '/product/newbiz-essentials/',
    price: 14499,
    compareAt: 30000,
    image: '/assets/2024-09-website-development.jpg',
    type: 'simple',
    category: 'Website Development',
  },
  5088: {
    id: 5088,
    name: 'RevampCommerce Lite',
    slug: '/product/revampcommerce-lite/',
    price: 24499,
    compareAt: 60999,
    type: 'simple',
    category: 'Website Development',
  },
  5090: {
    id: 5090,
    name: 'EliteCustom Suite',
    slug: '/product/elitecustom-suite/',
    price: 59499,
    compareAt: 75000,
    type: 'simple',
    category: 'Website Development',
  },
  3056: {
    id: 3056,
    name: 'MYRLINK IP PBX IP100 V3',
    slug: '/product/myrlink-ip-pbx-ip100-v3/',
    price: 65499,
    compareAt: 150000,
    image: '/assets/2024-09-ip-pbx-1.png',
    type: 'simple',
    category: 'IP PBX Solution',
  },
  2424: {
    id: 2424,
    name: 'Website Development',
    slug: '/product/website-development/',
    price: 14499,
    type: 'variable',
    category: 'Website Development',
  },
  2768: {
    id: 2768,
    name: 'AI Digital Marketing',
    slug: '/product/digital-marketing/',
    price: 6999,
    type: 'variable',
    category: 'Digital Marketing',
  },
  2773: { id: 2773, name: 'AI Digital Marketing — Standard', slug: '/product/digital-marketing/', price: 7999, type: 'simple', category: 'Digital Marketing' },
  2774: { id: 2774, name: 'AI Digital Marketing — Pro+', slug: '/product/digital-marketing/', price: 16999, type: 'simple', category: 'Digital Marketing' },
  2775: { id: 2775, name: 'AI Digital Marketing — Standard', slug: '/product/digital-marketing/', price: 6999, type: 'simple', category: 'Digital Marketing' },
  2776: { id: 2776, name: 'AI Digital Marketing — Pro+', slug: '/product/digital-marketing/', price: 14999, type: 'simple', category: 'Digital Marketing' },
  6001: { id: 6001, name: 'School ERP', slug: '/education-erp/school/', price: 5000, type: 'simple', category: 'ERP', image: '/assets/2024-09-website-designing-service-7.png', plans: [
    { tier: 'basic', name: 'Starter', monthly: { price: 5000, compareAt: 10000 }, yearly: { price: 50000, compareAt: 60000 }, description: 'Basic school management for small campuses', features: ['Student admission', 'Attendance tracking', 'Fee management', '100 student limit'], isMostPopular: false },
    { tier: 'pro', name: 'Pro', monthly: { price: 8000, compareAt: 15000 }, yearly: { price: 80000, compareAt: 96000 }, description: 'Complete school management system', features: ['Exam management', 'Parent portal', 'Transport tracking', '300 student limit', 'Report card'], isMostPopular: true },
    { tier: 'userbased', name: 'Enterprise', monthly: { price: 12000, compareAt: 20000 }, yearly: { price: 120000, compareAt: 240000 }, description: 'School ERP priced per user', features: ['Unlimited students', 'Custom modules', 'SMS integration', 'Advanced analytics', 'API access'], isMostPopular: false }
  ]
},
  6002: { id: 6002, name: 'College ERP', slug: '/education-erp/college/', price: 7000, type: 'simple', category: 'ERP', image: '/assets/2025-02-it-expert-2.png', plans: [
    { tier: 'basic', name: 'Starter', monthly: { price: 7000, compareAt: 14000 }, yearly: { price: 70000, compareAt: 84000 }, description: 'College administration basics', features: ['Course enrollment', 'Grade tracking', 'Fee management', '200 student limit'], isMostPopular: false },
    { tier: 'pro', name: 'Pro', monthly: { price: 10000, compareAt: 18000 }, yearly: { price: 100000, compareAt: 216000 }, description: 'Full college management system', features: ['Exam management', 'Library management', 'Hostel management', '500 student limit', 'Alumni tracker'], isMostPopular: true },
    { tier: 'userbased', name: 'Enterprise', monthly: { price: 15000, compareAt: 25000 }, yearly: { price: 150000, compareAt: 300000 }, description: 'College ERP priced per user', features: ['Unlimited students', 'Custom integrations', 'Advanced analytics', 'SLA support', 'API access'], isMostPopular: false }
  ]
},
  6003: { id: 6003, name: 'Coaching ERP', slug: '/education-erp/coaching/', price: 4000, type: 'simple', category: 'ERP', image: '/assets/2024-08-start-mission-success-strategy-beginning-concept.png', plans: [
    { tier: 'basic', name: 'Starter', monthly: { price: 4000, compareAt: 8000 }, yearly: { price: 40000, compareAt: 48000 }, description: 'Coaching center basics', features: ['Student enrollment', 'Attendance tracking', 'Fee collection', '50 student limit'], isMostPopular: false },
    { tier: 'pro', name: 'Pro', monthly: { price: 6000, compareAt: 12000 }, yearly: { price: 60000, compareAt: 144000 }, description: 'Complete coaching management', features: ['Batch management', 'Attendance tracking', 'Fee collection', 'Progress tracking', '100 student limit'], isMostPopular: true },
    { tier: 'userbased', name: 'Enterprise', monthly: { price: 9000, compareAt: 15000 }, yearly: { price: 90000, compareAt: 180000 }, description: 'Coaching ERP priced per user', features: ['Unlimited students', 'Custom batches', 'Progress analytics', 'Parent portal', 'SLA support'], isMostPopular: false }
  ]
},
  6004: { id: 6004, name: 'CRM Software', slug: '/crm-development/', price: 8000, type: 'simple', category: 'CRM', image: '/assets/2024-09-customized-crm-development.png', plans: [
    { tier: 'basic', name: 'Basic', monthly: { price: 8000, compareAt: 15000 }, yearly: { price: 80000, compareAt: 180000 }, description: 'Core CRM features for small teams', features: ['Contact management', 'Basic pipeline tracking', 'Email integration', '5 user limit'], isMostPopular: false },
    { tier: 'pro', name: 'Pro', monthly: { price: 15000, compareAt: 25000 }, yearly: { price: 150000, compareAt: 300000 }, description: 'Advanced CRM for growing businesses', features: ['Advanced pipeline management', 'Workflow automation', 'AI-powered insights', '25 user limit', 'Phone support'], isMostPopular: true },
    { tier: 'userbased', name: 'Enterprise', monthly: { price: 25000, compareAt: 40000 }, yearly: { price: 250000, compareAt: 480000 }, description: 'Custom CRM priced per user', features: ['Unlimited users', 'Custom modules', 'Advanced analytics', 'Dedicated account manager', 'API access'], isMostPopular: false }
  ]
},
  6005: { id: 6005, name: 'HRM Software', slug: '/hrm-solutions/', price: 3000, type: 'simple', category: 'HRM', image: '/assets/2024-08-buy-time-attendance.png', plans: [
    { tier: 'basic', name: 'Starter', monthly: { price: 3000, compareAt: 8000 }, yearly: { price: 30000, compareAt: 96000 }, description: 'Basic HR management for small teams', features: ['Employee attendance', 'Leave management', 'Basic payroll', '10 user limit'], isMostPopular: false },
    { tier: 'pro', name: 'Pro', monthly: { price: 5000, compareAt: 10000 }, yearly: { price: 50000, compareAt: 120000 }, description: 'Full HR suite for growing businesses', features: ['Performance reviews', 'Shift scheduling', 'Advanced payroll', '30 user limit', 'Priority support'], isMostPopular: true },
    { tier: 'userbased', name: 'Enterprise', monthly: { price: 8000, compareAt: 12000 }, yearly: { price: 80000, compareAt: 144000 }, description: 'HRM priced per user license', features: ['Unlimited users', 'Payroll integration', 'Performance modules', 'Custom reporting', 'SLA support'], isMostPopular: false }
  ]
},
  6006: { id: 6006, name: 'E-commerce Website', slug: '/ecommerce-solutions/', price: 24999, type: 'simple', category: 'E-commerce', image: '/assets/2024-08-gradient-responsive-website-design.png', plans: [
    { tier: 'basic', name: 'Starter', monthly: { price: 24999, compareAt: 40000 }, yearly: { price: 249990, compareAt: 480000 }, description: 'Basic online store setup', features: ['Product catalog', 'Payment gateway', 'Order management', '50 product limit'], isMostPopular: false },
    { tier: 'pro', name: 'Growth', monthly: { price: 35000, compareAt: 55000 }, yearly: { price: 350000, compareAt: 660000 }, description: 'Scalable e-commerce platform', features: ['Unlimited products', 'Advanced analytics', 'SEO tools', '200 product limit', 'Email marketing'], isMostPopular: true },
    { tier: 'userbased', name: 'Premium', monthly: { price: 50000, compareAt: 70000 }, yearly: { price: 500000, compareAt: 840000 }, description: 'Enterprise e-commerce priced per user', features: ['Unlimited products', 'Multi-store', 'Advanced CRM', 'API access', 'Priority support'], isMostPopular: false }
  ]
},
  6007: { id: 6007, name: 'Billing Software', slug: '/contact-us/', price: 4999, type: 'simple', category: 'Billing', image: '/assets/2024-08-buy-restaurant-billing-software.png' },
}

/** Resolve `?add-to-cart=ID` style links. Returns undefined for unknown ids. */
export function resolveAddToCart(id: number): CatalogProduct | undefined {
  return CATALOG[id]
}
