import { Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { HomePage } from '@/pages/HomePage'
import { ServicesPage } from '@/pages/ServicesPage'
import { WebsiteDevelopmentPage } from '@/pages/WebsiteDevelopmentPage'
import { CrmDevelopmentPage } from '@/pages/CrmDevelopmentPage'
import { DigitalMarketingPage } from '@/pages/DigitalMarketingPage'
import { NetworkSolutionPage } from '@/pages/NetworkSolutionPage'
import { IpBxSolutionPage } from '@/pages/IpBxSolutionPage'
import { CctvSolutionPage } from '@/pages/CctvSolutionPage'
import { Number1800Page } from '@/pages/Number1800Page'
import { PrivyrPage } from '@/pages/PrivyrPage'
import { ContactUsPage } from '@/pages/ContactUsPage'
import { TechStorePage } from '@/pages/TechStorePage'
import { DigitalMarketingProductPage, Ip100ProductPage, ProductCategoryPage } from '@/pages/StoreCatalogPages'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { Pending } from '@/pages/Pending'
import { AccountPage } from '@/pages/AccountPage'
import { AdminPage } from '@/pages/AdminPage'
import { ManagerPage } from '@/pages/ManagerPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { AccountRecoveryPage, VerifyEmailPage } from '@/pages/AccountRecoveryPage'

/** Segment ownership hints for pending routes (see prompts/00-PROMPT-MAP.md). */
const SEGMENT: Record<string, string> = {
  '/network-solution/': 'S06',
  '/ipbx-solution/': 'S07',
  '/cctv-solution/': 'S08',
  '/1800-number/': 'S09',
  '/privyr/': 'S10',
  '/about-us/': 'S11',
  '/roadmap/': 'S11',
  '/contact-us/': 'S12',
  '/talk-to-sales/': 'S12',
  '/booking/': 'S12',
  '/how-we-help-your-business/': 'S13',
  '/our-products-benefit/': 'S13',
  '/knowledge-base/': 'S13',
  '/lets-keep-in-touch/': 'S13',
  '/evercompare/': 'S13',
  '/tech-store/': 'S14',
  '/shop/': 'S14',
  '/product/website-development/': 'S15',
  '/product/newbiz-essentials/': 'S15',
  '/product/revampcommerce-lite/': 'S15',
  '/product/elitecustom-suite/': 'S15',
  '/product/digital-marketing/': 'S15',
  '/product/myrlink-ip-pbx-ip100-v3/': 'S15',
  '/product-category/website-development/': 'S15',
  '/product-category/website-development/website/': 'S15',
  '/product-category/website-development/website-design/': 'S15',
  '/product-category/digital-marketing/': 'S15',
  '/product-category/ip-pbx/': 'S15',
  '/product-category/it-products/': 'S15',
  '/product-category/pbx/': 'S15',
  '/cart/': 'S16',
  '/checkout/': 'S16',
  '/my-account/': 'S16',
  '/my-account/lost-password/': 'S16',
  '/privacy-policy/': 'S17',
  '/shipping-policy/': 'S17',
  '/terms-and-conditions/': 'S17',
  '/refund-and-return-policy/': 'S17',
  '/refund-request-form/': 'S17',
  '/crm-dashboard/': 'S18',
  '/my-leads/': 'S18',
  '/crm-reports/': 'S18',
  '/crm-tasks/': 'S18',
  '/my-profile/': 'S18',
  '/import-leads/': 'S18',
  '/crm-login/': 'S18',
  '/team-chat/': 'S18',
  '/team-panel/': 'S18',
  '/customer-panel/': 'S18',
}

function pending(path: keyof typeof SEGMENT) {
  return <Pending segment={SEGMENT[path]} />
}

/** All verified routes from audit/inventory.json. Order: exact → dynamic 404. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Phase 1 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/myr" element={<HomePage />} />

        {/* Phase 2 */}
        <Route path="/services/" element={<ServicesPage />} />
        <Route path="/website-development/" element={<WebsiteDevelopmentPage />} />
        <Route path="/crm-development/" element={<CrmDevelopmentPage />} />
        <Route path="/digital-marketing/" element={<DigitalMarketingPage />} />

        {/* Phase 3 */}
        <Route path="/network-solution/" element={<NetworkSolutionPage />} />
        <Route path="/ipbx-solution/" element={<IpBxSolutionPage />} />
        <Route path="/cctv-solution/" element={<CctvSolutionPage />} />
        <Route path="/1800-number/" element={<Number1800Page />} />
        <Route path="/privyr/" element={<PrivyrPage />} />

        {/* Phase 4 */}
        <Route path="/about-us/" element={pending('/about-us/')} />
        <Route path="/roadmap/" element={pending('/roadmap/')} />
        <Route path="/contact-us/" element={<ContactUsPage />} />
        <Route path="/talk-to-sales/" element={pending('/talk-to-sales/')} />
        <Route path="/booking/" element={pending('/booking/')} />
        <Route path="/how-we-help-your-business/" element={pending('/how-we-help-your-business/')} />
        <Route path="/our-products-benefit/" element={pending('/our-products-benefit/')} />
        <Route path="/knowledge-base/" element={pending('/knowledge-base/')} />
        <Route path="/lets-keep-in-touch/" element={pending('/lets-keep-in-touch/')} />
        <Route path="/evercompare/" element={pending('/evercompare/')} />

        {/* Phase 5 */}
        <Route path="/tech-store/" element={<TechStorePage />} />
        <Route path="/shop/" element={pending('/shop/')} />
        <Route path="/product/website-development/" element={pending('/product/website-development/')} />
        <Route path="/product/newbiz-essentials/" element={pending('/product/newbiz-essentials/')} />
        <Route path="/product/revampcommerce-lite/" element={pending('/product/revampcommerce-lite/')} />
        <Route path="/product/elitecustom-suite/" element={pending('/product/elitecustom-suite/')} />
        <Route path="/product/digital-marketing/" element={<DigitalMarketingProductPage />} />
        <Route path="/product/myrlink-ip-pbx-ip100-v3/" element={<Ip100ProductPage />} />
        <Route path="/product-category/website-development/" element={<ProductCategoryPage kind="website" />} />
        <Route path="/product-category/website-development/website/" element={pending('/product-category/website-development/website/')} />
        <Route path="/product-category/website-development/website-design/" element={pending('/product-category/website-development/website-design/')} />
        <Route path="/product-category/digital-marketing/" element={pending('/product-category/digital-marketing/')} />
        <Route path="/product-category/ip-pbx/" element={pending('/product-category/ip-pbx/')} />
        <Route path="/product-category/it-products/" element={<ProductCategoryPage kind="it" />} />
        <Route path="/product-category/pbx/" element={<ProductCategoryPage kind="pbx" />} />
        <Route path="/cart/" element={pending('/cart/')} />
        <Route path="/checkout/" element={<CheckoutPage />} />
        <Route path="/my-account/" element={<AccountPage />} />
        <Route path="/admin/" element={<AdminPage />} />
        <Route path="/manager/" element={<ManagerPage />} />
        <Route path="/my-account/lost-password/" element={<AccountRecoveryPage />} />
        <Route path="/my-account/reset-password/" element={<AccountRecoveryPage />} />
        <Route path="/my-account/verify-email/" element={<VerifyEmailPage />} />

        {/* Phase 6 */}
        <Route path="/privacy-policy/" element={pending('/privacy-policy/')} />
        <Route path="/shipping-policy/" element={pending('/shipping-policy/')} />
        <Route path="/terms-and-conditions/" element={pending('/terms-and-conditions/')} />
        <Route path="/refund-and-return-policy/" element={pending('/refund-and-return-policy/')} />
        <Route path="/refund-request-form/" element={pending('/refund-request-form/')} />
        <Route path="/crm-dashboard/" element={pending('/crm-dashboard/')} />
        <Route path="/my-leads/" element={pending('/my-leads/')} />
        <Route path="/crm-reports/" element={pending('/crm-reports/')} />
        <Route path="/crm-tasks/" element={pending('/crm-tasks/')} />
        <Route path="/my-profile/" element={pending('/my-profile/')} />
        <Route path="/import-leads/" element={pending('/import-leads/')} />
        <Route path="/crm-login/" element={pending('/crm-login/')} />
        <Route path="/team-chat/" element={pending('/team-chat/')} />
        <Route path="/team-panel/" element={pending('/team-panel/')} />
        <Route path="/customer-panel/" element={pending('/customer-panel/')} />

        {/* Source 404s + catch-all (Phase 7 keeps verifying) */}
        <Route path="/not-found/" element={<NotFoundPage />} />
        <Route path="/services/web-development/" element={<NotFoundPage />} />
        <Route path="/product-category/networking-devices/" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
