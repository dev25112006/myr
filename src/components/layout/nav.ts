/** Verified navigation data — source: analysis §3.1–3.4 (audit home.html/header). */

export type NavLink = { label: string; to: string; badge?: string; external?: boolean }

export const PRIMARY_NAV: NavLink[] = [
  { label: 'Launch Your Website', to: '/website-development/' },
  { label: 'All-in-One Lead CRM', to: '/privyr/' },
  { label: 'Smart IPBX Solutions', to: '/ipbx-solution/' },
  { label: 'Contact Us', to: '/contact-us/' },
]

/** Inner-page header nav (Elementor header variant) */
export const INNER_NAV: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/tech-store/' },
  { label: 'Launch Your Website', to: '/website-development/' },
  { label: 'All-in-One Lead CRM', to: '/privyr/' },
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
  { label: 'AI Digital Marketing', to: '/digital-marketing/' },
  { label: 'Networking Solution', to: '/network-solution/' },
  { label: 'IPBX Solution', to: '/ipbx-solution/' },
  { label: 'CCTV Solution', to: '/cctv-solution/', badge: 'Book Now' },
  { label: 'Toll-Free 1800 XXX 8899 Number', to: '/1800-number/' },
]

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
  { label: 'Privacy Policy', to: '/privacy-policy/' },
  { label: 'Shipping Policy', to: '/shipping-policy/' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions/' },
  { label: 'Refund & Return Policy', to: '/refund-and-return-policy/' },
]

export const FOOTER_SERVICES: NavLink[] = [
  { label: 'Web Development', to: '/website-development/' },
  { label: 'CRM Development', to: '/crm-development/' },
  { label: 'AI Digital Marketing', to: '/digital-marketing/' },
  { label: 'IPBX Solution', to: '/ipbx-solution/' },
  { label: 'CCTV', to: '/cctv-solution/' },
  { label: 'Toll Free 1800 XXX -', to: '/1800-number/' },
  { label: 'More', to: '/services/' },
]

export const FOOTER_COMPANY: NavLink[] = [
  { label: 'About Myr Advance Solution', to: '/about-us/' },
  { label: 'Roadmap', to: '/roadmap/' },
  { label: 'Contact Us', to: '/contact-us/' },
  { label: 'Talk to sales', to: '/talk-to-sales/' },
]

export const BASMALA = 'Basmala'
export const CHAT_SUPPORT = 'https://1367.3cx.cloud/myradvancesolutionpr'
export const CHAT_SALES = 'https://1367.3cx.cloud/myrsolution'
export const CHAT_ABUSE = 'https://1367.3cx.cloud/eli'
export const WHATSAPP = 'https://wa.me/+917408443341'

export const FOOTER_BLURB =
  'We Can Take Your Business To The Next Level. Elevate your business with our comprehensive suite of IT services and solutions, encompassing IPBX systems, CCTV security, computer networking, CRM development, AI digital marketing, website development and design, billing solutions and more.'

export const COPYRIGHT =
  '© 2016-2025 myradvancesolution.com - Premium website development, CRM, IP PBX & telephone system and More'
