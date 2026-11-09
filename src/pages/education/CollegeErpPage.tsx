import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { COLLEGE_SEGMENT } from '@/content/education/segments'
import { COLLEGE_TOUR, collegeModules } from '@/content/education/segments'
import { TourProvider } from '@/components/education/TourProvider'
import { useTour } from '@/components/education/useTour'
import { TourShell } from '@/components/education/TourShell'
import { ErpHero } from '@/components/education/ErpHero'
import { SubscriptionPlans } from '@/components/commerce/SubscriptionPlans'
import {
  CampusTourSection,
  ClosingSection,
  MissionsBoard,
  ModuleShowcase,
  RoleSection,
} from '@/components/education/sections'

/** `?tour=1` opens the virtual tour on load. */
function TourDeepLink() {
  const tour = useTour()
  const [params] = useSearchParams()
  useEffect(() => {
    if (params.get('tour') === '1') tour.open('intro')
  }, [params, tour])
  return null
}

function CollegeErpContent() {
  const tour = useTour()
  const seg = COLLEGE_SEGMENT

  return (
    <main>
      <TourDeepLink />

      {/* 1 · Hero */}
      <ErpHero
        identity={seg.identity}
        badge={seg.hero.badge}
        headline={seg.hero.titleBefore + seg.hero.titleAccent}
        sub={seg.hero.sub}
        primaryCta={{ label: 'Explore College ERP', to: '/education-erp/college/#modules' }}
        secondaryCta={{ label: 'Enter Virtual College', onClick: () => tour.open('intro') }}
        roleCards={['College Administrator', 'Principal', 'Faculty']}
        connected={true}
      />

      {/* Buy */}
      <SubscriptionPlans
        productId={6002}
        name="College ERP"
        heading="Build a Connected Campus"
        sub="Choose a plan that fits your institution. Every plan includes departments, semesters, placements and institutional oversight."
      />

      {/* 2 · Virtual tour */}
      <CampusTourSection identity={seg.identity} config={COLLEGE_TOUR} />

      {/* 3 · Roles */}
      <RoleSection
        roles={COLLEGE_TOUR.roles}
        sub="Administrators, directors, HODs, faculty and service teams get role-specific views across departments, while students see their own academic, attendance, result and fee records."
      />

      {/* 4 · Modules */}
      <div id="modules">
        <ModuleShowcase
          modules={collegeModules}
          eyebrow="MODULES INVOLVED"
          title="College workflows, connected"
          sub="Explore the academic, student-service and administrative workflows involved in running a college. Preview screens use sample data; status labels distinguish live workflows from configurable scope."
        />
      </div>

      {/* 5 · Missions */}
      <MissionsBoard config={COLLEGE_TOUR} />

      {/* 6 · Closing + FAQ + conversion */}
      <ClosingSection
        headline={seg.closingHeadline}
        body="Build a Connected Campus. Manage Every Academic Journey. One dashboard, every screen your college carries. The accounts desk on a desktop, a teacher with a phone in the corridor, a student checking at home."
        journeyLabel="Start Your College ERP Journey"
        journeyTo="/education-erp/modules/"
        demoLabel="Book College ERP Demo"
        tourLabel="Enter Virtual College"
        faq={seg.faq}
      />

      <TourShell segment="college" />
    </main>
  )
}

export function CollegeErpPage() {
  return (
    <TourProvider config={COLLEGE_TOUR}>
      <CollegeErpContent />
    </TourProvider>
  )
}