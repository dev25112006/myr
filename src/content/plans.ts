/** Website plan data — verified from homepage + website-development page manifests. */

export type WebsitePlan = {
  productId: number
  name: string
  tag?: { label: string; tone: 'deal' | 'popular' | 'save' }
  saveLabel?: string
  price: number
  was: number
  renewal: string
  blurb: string
  bullets: string[]
  featureTitle: string
  features: string[]
}

export const WEBSITE_PLANS: WebsitePlan[] = [
  {
    productId: 2765,
    name: 'NewBiz Essentials',
    tag: { label: 'Save 51%', tone: 'save' },
    saveLabel: 'Save 51%',
    price: 14499,
    was: 30000,
    renewal: '₹599.00/mo when you renew hosting*',
    blurb: 'Classic, timeless designs to establish a strong online presence.',
    bullets: [
      '1 Customized premium website',
      '50 GB SSD storage',
      '1 mailbox',
      'Mobile-Friendly & Responsive Design',
    ],
    featureTitle: 'What you get:',
    features: ['1 Year Free Hosting', 'Unlimited SSL', 'Weekly backups'],
  },
  {
    productId: 2766,
    name: 'RevampCommerce Lite',
    tag: { label: 'MOST POPULAR', tone: 'popular' },
    saveLabel: 'Save 60%',
    price: 24499,
    was: 60999,
    renewal: '₹1649.00/mo when you renew hosting*',
    blurb: 'Modern custom design + integrated e-commerce functionality.',
    bullets: [
      '1 Customized premium website',
      '100 GB SSD storage',
      '100 mailboxes',
      'Mobile-Friendly & Responsive Design',
    ],
    featureTitle: 'All the benefits of NewBiz, plus:',
    features: [
      'Domain included (₹749.00 value)',
      'Payment Gateway Intregation',
      'E-Commerce Functionality',
    ],
  },
  {
    productId: 2767,
    name: 'EliteCustom Suite',
    tag: { label: 'SAVE 20%', tone: 'save' },
    saveLabel: 'Save 20%',
    price: 59499,
    was: 75000,
    renewal: '₹2499.00/mo when you renew hosting*',
    blurb: 'Tailored designs, advanced features, and seamless functionality.',
    bullets: [
      '1 Customized premium website',
      '200 GB NVMe storage',
      '100 mailboxes',
      'Mobile-Friendly & Responsive Design',
    ],
    featureTitle: 'All the goodness of Revamp, plus:',
    features: [
      'Daily and on-demand backups',
      'Social accounts Intregation',
      'Agent live chat & telephony',
      'AI ChatBot Intregation',
      'CDN included',
    ],
  },
]
