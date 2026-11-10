/** Verified navigation data — source: analysis §3.1–3.4 (audit home.html/header). */

export type NavLink = { label: string; to: string; badge?: string; external?: boolean }

export const PRIMARY_NAV: NavLink[] = [
  { label: 'Launch Your Website', to: '/website-development/' },
  { label: 'CRM', to: '/crm/' },
  { label: 'HRM Solutions', to: '/hrm-solutions/' },
  { label: 'Smart IPBX Solutions', to: '/ipbx-solution/' },
  { label: 'Partner', to: '/partner/' },
  { label: 'Contact Us', to: '/contact-us/' },
]

/** Inner-page header nav (Elementor header variant) */
export const INNER_NAV: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/tech-store/' },
  { label: 'Launch Your Website', to: '/website-development/' },
  { label: 'CRM', to: '/crm/' },
  { label: 'HRM', to: '/hrm-solutions/' },
  { label: 'Education ERP', to: '/education-erp/' },
  { label: 'Partner', to: '/partner/' },
  { label: 'Contact Us', to: '/contact-us/' },
]

/** "All Services" dropdown (inner header) — source items */
export const SERVICES_DROPDOWN: NavLink[] = [
  { label: 'AI Digital Marketing', to: '/digital-marketing/' },
  { label: 'Scalable IPBX Systems', to: '/ipbx-solution/' },
  { label: 'CCTV Solution & Installation', to: '/cctv-solution/' },
  { label: 'Get Your 1800 Number', to: '/1800-number/' },
]

/** Off-canvas "Our Core Services" panel items (homepage header) */
export const OFFCANVAS_SERVICES: NavLink[] = [
  { label: 'Web Development', to: '/website-development/', badge: 'Featured' },
  { label: 'CRM Development', to: '/crm-development/' },
  { label: 'HRM Solutions', to: '/hrm-solutions/' },
  { label: 'Education ERP', to: '/education-erp/' },
  { label: 'AI Digital Marketing', to: '/digital-marketing/' },
  { label: 'Networking Solution', to: '/network-solution/' },
  { label: 'IPBX Solution', to: '/ipbx-solution/' },
  { label: 'CCTV Solution', to: '/cctv-solution/', badge: 'Book Now' },
  { label: 'Toll-Free 1800 XXX 8899 Number', to: '/1800-number/' },
]

/** Sub-items shown under each primary nav item in the mobile dropdown menu.
 * Mirrors the mega-menu sub-links so every section expands like Education ERP
 * (School ERP / College ERP / Coaching ERP). */
export const MOBILE_SUB_ITEMS: Record<string, { label: string; to: string }[]> = {
  '/website-development/': [
    { label: 'Website solutions', to: '/website-development/#website-solutions' },
    { label: 'Development process', to: '/website-development/#development-process' },
    { label: 'Included features', to: '/website-development/#viewallfeatures' },
    { label: 'Pricing plans', to: '/website-development/#Pricing' },
  ],
  '/crm/': [
    { label: 'Lead management', to: '/crm/#lead-management' },
    { label: 'Features', to: '/crm/#crm-features' },
    { label: '30-second setup', to: '/crm/#quick-setup' },
    { label: 'Plans & pricing', to: '/crm/#privyrpricing' },
  ],
  '/crm-development/': [
    { label: 'Custom CRM development', to: '/crm-development/' },
    { label: 'Get Quote', to: '/crm-development/#crm-quote' },
  ],
  '/hrm-solutions/': [
    { label: 'People management', to: '/hrm-solutions/#hrm-workspace' },
    { label: 'Attendance & leave', to: '/hrm-solutions/#hrm-workspace' },
    { label: 'Payroll & hiring', to: '/hrm-solutions/#hrm-workspace' },
    { label: 'Talk to our team', to: '/contact-us/?interest=hrm#contact-form' },
  ],
  '/education-erp/': [
    { label: 'School ERP', to: '/education-erp/school/' },
    { label: 'College ERP', to: '/education-erp/college/' },
    { label: 'Coaching ERP', to: '/education-erp/coaching/' },
    { label: 'Modules & features', to: '/education-erp/modules/' },
  ],
  '/ipbx-solution/': [
    { label: 'IPBX systems', to: '/ipbx-solution/' },
    { label: 'MYRLINK IP100 V3', to: '/product/myrlink-ip-pbx-ip100-v3/' },
  ],
  '/partner/': [
    { label: 'Become a partner', to: '/partner/' },
    { label: 'Partner earnings', to: '/partner/' },
  ],
  '/contact-us/': [
    { label: 'Contact options', to: '/contact-us/#contact-options' },
    { label: 'Send us a message', to: '/contact-us/#contact-form' },
    { label: 'Our offices', to: '/contact-us/#our-offices' },
  ],
  '/': [
    { label: 'Services', to: '/#services' },
    { label: 'Shop', to: '/#E-Commerce' },
    { label: 'Plans', to: '/#pricing' },
    { label: 'Contact', to: '/#contact' },
  ],
  '/tech-store/': [
    { label: 'Browse categories', to: '/tech-store/#store-browse' },
    { label: 'Popular products & plans', to: '/tech-store/#store-products' },
    { label: 'IP telephony', to: '/tech-store/#store-categories' },
    { label: 'Contact our team', to: '/tech-store/#store-contact' },
  ],
  '/digital-marketing/': [
    { label: 'AI Digital Marketing', to: '/digital-marketing/' },
  ],
  '/network-solution/': [
    { label: 'Networking Solutions', to: '/network-solution/' },
  ],
  '/cctv-solution/': [
    { label: 'CCTV Solutions', to: '/cctv-solution/' },
  ],
  '/1800-number/': [
    { label: 'Toll-Free 1800 Numbers', to: '/1800-number/' },
  ],
  '/services/': [
    { label: 'Browse All Services', to: '/services/' },
  ],
}

export const SOCIALS: NavLink[] = [
  { label: 'Facebook', to: 'https://www.facebook.com/myrnetwork', external: true },
  { label: 'Instagram', to: 'https://www.instagram.com/myr_solution/', external: true },
  { label: 'Linkedin', to: 'https://www.linkedin.com/in/myr-advance-solution-04b1151a6/', external: true },
  { label: 'Whatsapp', to: 'https://wa.me/+917408443341', external: true },
  { label: 'X-twitter', to: 'https://x.com/myrnetwork', external: true },
]

export const FOOTER_QUICK_LINKS: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Shop Page', to: '/tech-store/' },
  { label: 'Services', to: '/services/' },
  { label: 'Careers — Join Our Team', to: '/careers/' },
  { label: 'Blog & Insights', to: '/blogs/' },
  { label: 'Privacy Policy', to: '/privacy-policy/' },
  { label: 'Shipping Policy', to: '/shipping-policy/' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions/' },
  { label: 'Refund & Return Policy', to: '/refund-and-return-policy/' },
]

/** Resources column: careers portal, blog and evergreen help/content pages. */
export const FOOTER_RESOURCES: NavLink[] = [
  { label: 'Careers Portal — Jobs at MYR', to: '/careers/' },
  { label: 'Blog & IT Insights', to: '/blogs/' },
  { label: 'Knowledge Base & Support', to: '/knowledge-base/' },
  { label: 'How We Help Your Business', to: '/how-we-help-your-business/' },
  { label: 'Our Products Benefit', to: '/our-products-benefit/' },
  { label: 'Solution Comparisons', to: '/evercompare/' },
]

/** High-intent market keywords (India + US) mapped to existing service pages. */
export const FOOTER_MARKETS: NavLink[] = [
  { label: 'Business Software & IT Services India', to: '/services/' },
  { label: 'CRM Software for India & US Teams', to: '/crm/' },
  { label: 'HRMS / HR Software India & US', to: '/hrm-solutions/' },
  { label: 'School, College & Coaching ERP', to: '/education-erp/' },
  { label: 'Ecommerce Website Development', to: '/ecommerce-solutions/' },
  { label: 'IP PBX & VoIP Phone Systems', to: '/ipbx-solution/' },
  { label: 'CCTV Security & Installation', to: '/cctv-solution/' },
  { label: 'AI Digital Marketing & SEO', to: '/digital-marketing/' },
  { label: 'Toll-Free 1800 Business Number', to: '/1800-number/' },
]

export const FOOTER_SERVICES: NavLink[] = [
  { label: 'Web Development', to: '/website-development/' },
  { label: 'CRM Development', to: '/crm-development/' },
  { label: 'Ecommerce Solutions', to: '/ecommerce-solutions/' },
  { label: 'Education ERP', to: '/education-erp/' },
  { label: 'AI Digital Marketing', to: '/digital-marketing/' },
  { label: 'IPBX Solution', to: '/ipbx-solution/' },
  { label: 'CCTV', to: '/cctv-solution/' },
  { label: 'Toll Free 1800 XXX -', to: '/1800-number/' },
  { label: 'More services', to: '/services/' },
]

export const FOOTER_COMPANY: NavLink[] = [
  { label: 'About Myr Advance Solution', to: '/about-us/' },
  { label: 'Careers & Job Openings', to: '/careers/' },
  { label: 'Roadmap', to: '/roadmap/' },
  { label: 'Contact Us', to: '/contact-us/' },
  { label: 'Talk to sales', to: '/talk-to-sales/' },
]

export const BASMALA = 'Basmala'
export const CHAT_SUPPORT = 'https://1367.3cx.cloud/myradvancesolutionpr'
export const CHAT_SALES = 'https://1367.3cx.cloud/myrsolution'
export const CHAT_ABUSE = 'https://1367.3cx.cloud/eli'
export const WHATSAPP = 'https://wa.me/917408443341'

export const FOOTER_BLURB =
  'We Can Take Your Business To The Next Level. Elevate your business with our comprehensive suite of IT services and solutions, encompassing IPBX systems, CCTV security, computer networking, CRM development, AI digital marketing, website development and design, billing solutions and more.'

export const COPYRIGHT =
  '© 2016-2026 myradvancesolution.com - Premium website development, CRM, IP PBX & telephone system and More'
