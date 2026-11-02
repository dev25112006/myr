import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { HomePage } from '@/pages/HomePage'

const ServicesPage = lazy(() => import('@/pages/ServicesPage').then((m) => ({ default: m.ServicesPage })))
const WebsiteDevelopmentPage = lazy(() => import('@/pages/WebsiteDevelopmentPage').then((m) => ({ default: m.WebsiteDevelopmentPage })))
const CrmDevelopmentPage = lazy(() => import('@/pages/CrmDevelopmentPage').then((m) => ({ default: m.CrmDevelopmentPage })))
const HRMSolutionsPage = lazy(() => import('@/pages/HRMSolutionsPage').then((m) => ({ default: m.HRMSolutionsPage })))
const EcommerceSolutionsPage = lazy(() => import('@/pages/EcommerceSolutionsPage').then((m) => ({ default: m.EcommerceSolutionsPage })))
const EducationErpPage = lazy(() => import('@/pages/EducationErpPage').then((m) => ({ default: m.EducationErpPage })))
const SchoolErpPage = lazy(() => import('@/pages/education/SchoolErpPage').then((m) => ({ default: m.SchoolErpPage })))
const CollegeErpPage = lazy(() => import('@/pages/education/CollegeErpPage').then((m) => ({ default: m.CollegeErpPage })))
const CoachingErpPage = lazy(() => import('@/pages/education/CoachingErpPage').then((m) => ({ default: m.CoachingErpPage })))
const ModulesPage = lazy(() => import('@/pages/education/ModulesPage').then((m) => ({ default: m.ModulesPage })))
const DigitalMarketingPage = lazy(() => import('@/pages/DigitalMarketingPage').then((m) => ({ default: m.DigitalMarketingPage })))
const NetworkSolutionPage = lazy(() => import('@/pages/NetworkSolutionPage').then((m) => ({ default: m.NetworkSolutionPage })))
const IpBxSolutionPage = lazy(() => import('@/pages/IpBxSolutionPage').then((m) => ({ default: m.IpBxSolutionPage })))
const CctvSolutionPage = lazy(() => import('@/pages/CctvSolutionPage').then((m) => ({ default: m.CctvSolutionPage })))
const NetworkProductsPage = lazy(() => import('@/pages/NetworkProductsPage').then((m) => ({ default: m.NetworkProductsPage })))
const PartnershipPage = lazy(() => import('@/pages/PartnershipPage').then((m) => ({ default: m.PartnershipPage })))
const Number1800Page = lazy(() => import('@/pages/Number1800Page').then((m) => ({ default: m.Number1800Page })))
const PrivyrPage = lazy(() => import('@/pages/PrivyrPage').then((m) => ({ default: m.PrivyrPage })))
const ContactUsPage = lazy(() => import('@/pages/ContactUsPage').then((m) => ({ default: m.ContactUsPage })))
const TechStorePage = lazy(() => import('@/pages/TechStorePage').then((m) => ({ default: m.TechStorePage })))
const ProductCategoryPage = lazy(() => import('@/pages/StoreCatalogPages').then((m) => ({ default: m.ProductCategoryPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const AccountPage = lazy(() => import('@/pages/AccountPage').then((m) => ({ default: m.AccountPage })))
const AdminPage = lazy(() => import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })))
const ManagerPage = lazy(() => import('@/pages/ManagerPage').then((m) => ({ default: m.ManagerPage })))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
const AccountRecoveryPage = lazy(() => import('@/pages/AccountRecoveryPage').then((m) => ({ default: m.AccountRecoveryPage })))
const VerifyEmailPage = lazy(() => import('@/pages/AccountRecoveryPage').then((m) => ({ default: m.VerifyEmailPage })))
const CartPage = lazy(() => import('@/pages/CartPage').then((m) => ({ default: m.CartPage })))
const PolicyPage = lazy(() => import('@/pages/PolicyPages').then((m) => ({ default: m.PolicyPage })))
const AboutPage = lazy(() => import('@/pages/RemainingPages').then((m) => ({ default: m.AboutPage })))
const BookingPage = lazy(() => import('@/pages/RemainingPages').then((m) => ({ default: m.BookingPage })))
const CRMPanelPage = lazy(() => import('@/pages/RemainingPages').then((m) => ({ default: m.CRMPanelPage })))
const CustomerPanelPage = lazy(() => import('@/pages/RemainingPages').then((m) => ({ default: m.CustomerPanelPage })))
const InformationPage = lazy(() => import('@/pages/RemainingPages').then((m) => ({ default: m.InformationPage })))
const RoadmapPage = lazy(() => import('@/pages/RemainingPages').then((m) => ({ default: m.RoadmapPage })))
const TalkToSalesPage = lazy(() => import('@/pages/RemainingPages').then((m) => ({ default: m.TalkToSalesPage })))
const WebsitePlanProductPage = lazy(() => import('@/pages/StoreCatalogPages').then((m) => ({ default: m.WebsitePlanProductPage })))
const DigitalMarketingProductPage = lazy(() => import('@/pages/StoreCatalogPages').then((m) => ({ default: m.DigitalMarketingProductPage })))
const Ip100ProductPage = lazy(() => import('@/pages/StoreCatalogPages').then((m) => ({ default: m.Ip100ProductPage })))

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <span className="text-sm font-medium text-ink-400">Loading…</span>
    </div>
  )
}

/** All verified routes from audit/inventory.json. Order: exact → dynamic 404. */
export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<Layout />}>
          {/* Phase 1 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/myr" element={<HomePage />} />

          {/* Phase 2 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/myr" element={<HomePage />} />

          {/* Phase 2 */}
          <Route path="/services/" element={<ServicesPage />} />
          <Route path="/website-development/" element={<WebsiteDevelopmentPage />} />
          <Route path="/crm-development/" element={<CrmDevelopmentPage />} />
          <Route path="/hrm-solutions/" element={<HRMSolutionsPage />} />
          <Route path="/ecommerce-solutions/" element={<EcommerceSolutionsPage />} />
          <Route path="/education-erp/" element={<EducationErpPage />} />
          <Route path="/education-erp/school/" element={<SchoolErpPage />} />
          <Route path="/education-erp/college/" element={<CollegeErpPage />} />
          <Route path="/education-erp/coaching/" element={<CoachingErpPage />} />
          <Route path="/education-erp/modules/" element={<ModulesPage />} />
          <Route path="/digital-marketing/" element={<DigitalMarketingPage />} />

          {/* Phase 3 */}
          <Route path="/network-solution/" element={<NetworkSolutionPage />} />
          <Route path="/network-product/" element={<NetworkProductsPage />} />
          <Route path="/ipbx-solution/" element={<IpBxSolutionPage />} />
          <Route path="/ip-pbx/" element={<IpBxSolutionPage />} />
          <Route path="/cctv-solution/" element={<CctvSolutionPage />} />
          <Route path="/cctv-solutions/" element={<CctvSolutionPage />} />
          <Route path="/partner/" element={<PartnershipPage />} />
          <Route path="/partnership/" element={<PartnershipPage />} />
          <Route path="/1800-number/" element={<Number1800Page />} />
          <Route path="/privyr/" element={<PrivyrPage />} />

          {/* Phase 4 */}
          <Route path="/about-us/" element={<AboutPage />} />
          <Route path="/roadmap/" element={<RoadmapPage />} />
          <Route path="/contact-us/" element={<ContactUsPage />} />
          <Route path="/talk-to-sales/" element={<TalkToSalesPage />} />
          <Route path="/booking/" element={<BookingPage />} />
          <Route path="/how-we-help-your-business/" element={<InformationPage pathname="/how-we-help-your-business/" />} />
          <Route path="/our-products-benefit/" element={<InformationPage pathname="/our-products-benefit/" />} />
          <Route path="/knowledge-base/" element={<InformationPage pathname="/knowledge-base/" />} />
          <Route path="/lets-keep-in-touch/" element={<InformationPage pathname="/lets-keep-in-touch/" />} />
          <Route path="/evercompare/" element={<InformationPage pathname="/evercompare/" />} />

          {/* Phase 5 */}
          <Route path="/tech-store/" element={<TechStorePage />} />
          <Route path="/shop/" element={<TechStorePage />} />
          <Route path="/product/website-development/" element={<ProductCategoryPage kind="website" />} />
          <Route path="/product/newbiz-essentials/" element={<WebsitePlanProductPage productId={2765} />} />
          <Route path="/product/revampcommerce-lite/" element={<WebsitePlanProductPage productId={2766} />} />
          <Route path="/product/elitecustom-suite/" element={<WebsitePlanProductPage productId={2767} />} />
          <Route path="/product/digital-marketing/" element={<DigitalMarketingProductPage />} />
          <Route path="/product/myrlink-ip-pbx-ip100-v3/" element={<Ip100ProductPage />} />
          <Route path="/product-category/website-development/" element={<ProductCategoryPage kind="website" />} />
          <Route path="/product-category/website-development/website/" element={<ProductCategoryPage kind="website" />} />
          <Route path="/product-category/website-development/website-design/" element={<ProductCategoryPage kind="website" />} />
          <Route path="/product-category/digital-marketing/" element={<ProductCategoryPage kind="digital" />} />
          <Route path="/product-category/ip-pbx/" element={<ProductCategoryPage kind="pbx" />} />
          <Route path="/product-category/it-products/" element={<ProductCategoryPage kind="it" />} />
          <Route path="/product-category/pbx/" element={<ProductCategoryPage kind="pbx" />} />
          <Route path="/cart/" element={<CartPage />} />
          <Route path="/checkout/" element={<CheckoutPage />} />
          <Route path="/my-account/" element={<AccountPage />} />
          <Route path="/admin/" element={<AdminPage />} />
          <Route path="/manager/" element={<ManagerPage />} />
          <Route path="/my-account/lost-password/" element={<AccountRecoveryPage />} />
          <Route path="/my-account/reset-password/" element={<AccountRecoveryPage />} />
          <Route path="/my-account/verify-email/" element={<VerifyEmailPage />} />

          {/* Phase 6 */}
          <Route path="/privacy-policy/" element={<PolicyPage pathname="/privacy-policy/" />} />
          <Route path="/shipping-policy/" element={<PolicyPage pathname="/shipping-policy/" />} />
          <Route path="/terms-and-conditions/" element={<PolicyPage pathname="/terms-and-conditions/" />} />
          <Route path="/refund-and-return-policy/" element={<PolicyPage pathname="/refund-and-return-policy/" />} />
          <Route path="/refund-request-form/" element={<PolicyPage pathname="/refund-request-form/" />} />
          <Route path="/crm-dashboard/" element={<CRMPanelPage pathname="/crm-dashboard/" />} />
          <Route path="/my-leads/" element={<CRMPanelPage pathname="/my-leads/" />} />
          <Route path="/crm-reports/" element={<CRMPanelPage pathname="/crm-reports/" />} />
          <Route path="/crm-tasks/" element={<CRMPanelPage pathname="/crm-tasks/" />} />
          <Route path="/my-profile/" element={<CRMPanelPage pathname="/my-profile/" />} />
          <Route path="/import-leads/" element={<CRMPanelPage pathname="/import-leads/" />} />
          <Route path="/crm-login/" element={<CRMPanelPage pathname="/crm-login/" />} />
          <Route path="/team-chat/" element={<CRMPanelPage pathname="/team-chat/" />} />
          <Route path="/team-panel/" element={<CRMPanelPage pathname="/team-panel/" />} />
          <Route path="/customer-panel/" element={<CustomerPanelPage />} />

          {/* Source 404s + catch-all (Phase 7 keeps verifying) */}
          <Route path="/not-found/" element={<NotFoundPage />} />
          <Route path="/services/web-development/" element={<NotFoundPage />} />
          <Route path="/product-category/networking-devices/" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
