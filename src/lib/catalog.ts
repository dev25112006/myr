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
}

/** Resolve `?add-to-cart=ID` style links. Returns undefined for unknown ids. */
export function resolveAddToCart(id: number): CatalogProduct | undefined {
  return CATALOG[id]
}
