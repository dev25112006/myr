import { Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { HomePage } from '@/pages/HomePage'
import { ServicesPage } from '@/pages/ServicesPage'
import { WebsiteDevelopmentPage } from '@/pages/WebsiteDevelopmentPage'
import { CrmDevelopmentPage } from '@/pages/CrmDevelopmentPage'
import { HRMSolutionsPage } from '@/pages/HRMSolutionsPage'
import { EcommerceSolutionsPage } from '@/pages/EcommerceSolutionsPage'
import { EducationErpPage } from '@/pages/EducationErpPage'
import { SchoolErpPage } from '@/pages/education/SchoolErpPage'
import { CollegeErpPage } from '@/pages/education/CollegeErpPage'
import { CoachingErpPage } from '@/pages/education/CoachingErpPage'
import { ModulesPage } from '@/pages/education/ModulesPage'
import { DigitalMarketingPage } from '@/pages/DigitalMarketingPage'
import { NetworkSolutionPage } from '@/pages/NetworkSolutionPage'
import { IpBxSolutionPage } from '@/pages/IpBxSolutionPage'
import { CctvSolutionPage } from '@/pages/CctvSolutionPage'
import { Number1800Page } from '@/pages/Number1800Page'
import { PrivyrPage } from '@/pages/PrivyrPage'
import { ContactUsPage } from '@/pages/ContactUsPage'
import { TechStorePage } from '@/pages/TechStorePage'
import { DigitalMarketingProductPage, Ip100ProductPage, ProductCategoryPage, WebsitePlanProductPage } from '@/pages/StoreCatalogPages'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AccountPage } from '@/pages/AccountPage'
import { AdminPage } from '@/pages/AdminPage'
import { ManagerPage } from '@/pages/ManagerPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { AccountRecoveryPage, VerifyEmailPage } from '@/pages/AccountRecoveryPage'
import { CartPage } from '@/pages/CartPage'
import { PolicyPage } from '@/pages/PolicyPages'
import { AboutPage, BookingPage, CRMPanelPage, CustomerPanelPage, InformationPage, RoadmapPage, TalkToSalesPage } from '@/pages/RemainingPages'

/** All verified routes from audit/inventory.json. Order: exact → dynamic 404. */
export function AppRoutes() {
  return (
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
        <Route path="/ipbx-solution/" element={<IpBxSolutionPage />} />
        <Route path="/cctv-solution/" element={<CctvSolutionPage />} />
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
  )
}
