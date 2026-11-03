import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { COLLEGE_SEGMENT } from '@/content/education/segments'
import { COLLEGE_TOUR, collegeModules } from '@/content/education/segments'
import { TourProvider } from '@/components/education/TourProvider'
import { useTour } from '@/components/education/useTour'
import { TourShell } from '@/components/education/TourShell'
import { ErpHero } from '@/components/education/ErpHero'
import { BuyShowcase } from '@/components/commerce/BuyShowcase'
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
        primaryCta={{ label: 'Enter Smart Campus', to: '/education-erp/college/#modules' }}
        secondaryCta={{ label: 'Enter Virtual College', onClick: () => tour.open('intro') }}
        roleCards={['College Administrator', 'Principal', 'Faculty']}
        connected={true}
      />

      {/* Buy */}
      <BuyShowcase
        id={6002}
        name="College ERP"
        desc="Departments, semesters, placements and institutional oversight in one view."
        fallbackPrice={7000}
        monthly
        image="/assets/2025-02-it-expert-2.png"
        heading="Build a Connected Campus"
        sub="Admin-controlled pricing. Buy now and go live fast."
        features={['Departments & semesters', 'Exams & results', 'Placements', 'Fee & finance']}
      />

      {/* 2 · Virtual tour */}
      <CampusTourSection identity={seg.identity} config={COLLEGE_TOUR} />

      {/* 3 · Roles */}
      <RoleSection
        roles={COLLEGE_TOUR.roles}
        sub="Admin, teachers, parents and the accounts desk each work inside their own view of the same student, class and fee records."
      />

      {/* 4 · Modules */}
      <div id="modules">
        <ModuleShowcase
          modules={collegeModules}
          eyebrow="College ERP modules"
          title={
            <>
              Sixteen modules, <span className="text-accent-600">each with its real screen.</span>
            </>
          }
          sub="No icon grids. Every module opens a preview of the working screen. Green means the workflow runs in the MYR workspace today; grey means configurable scope."
        />
      </div>

      {/* 5 · Missions */}
      <MissionsBoard config={COLLEGE_TOUR} />

      {/* 6 · Closing + FAQ + conversion */}
      <ClosingSection
        headline={seg.closingHeadline}
        body="Build a Connected Campus. Manage Every Academic Journey. One dashboard, every screen your college carries. The accounts desk on a desktop, a teacher with a phone in the corridor, a student checking at home."
        journeyLabel="Explore College ERP"
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