import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SCHOOL_SEGMENT } from '@/content/education/segments'
import { SCHOOL_TOUR, schoolModules } from '@/content/education/school'
import { TourProvider } from '@/components/education/TourProvider'
import { useTour } from '@/components/education/useTour'
import { TourShell } from '@/components/education/TourShell'
import { ErpHero } from '@/components/education/ErpHero'
import { ProductBuyCard } from '@/components/commerce/ProductBuyCard'
import {
  CampusTourSection,
  ClosingSection,
  MissionsBoard,
  ModuleShowcase,
  RoleSection,
} from '@/components/education/sections'
import type { SegmentConfig } from '@/content/education/segments'

/** `?tour=1` opens the virtual tour on load. */
function TourDeepLink() {
  const tour = useTour()
  const [params] = useSearchParams()
  useEffect(() => {
    if (params.get('tour') === '1') tour.open('intro')
  }, [params, tour])
  return null
}

const seg: SegmentConfig = SCHOOL_SEGMENT

function SchoolErpContent() {
  const tour = useTour()

  return (
    <main>
      <TourDeepLink />

      {/* 1 · Hero */}
      <ErpHero
        identity={seg.identity}
        badge={seg.hero.badge}
        headline={seg.hero.titleBefore + seg.hero.titleAccent}
        sub={seg.hero.sub}
        primaryCta={{ label: 'Explore School ERP', to: '/education-erp/school/#modules' }}
        secondaryCta={{ label: 'Enter Virtual School', onClick: () => tour.open('intro') }}
        roleCards={['Administrator', 'Principal', 'Teacher', 'Student', 'Parent', 'Accountant', 'Transport Manager']}
      />

      {/* 2 · Virtual tour */}
      <CampusTourSection identity={seg.identity} config={SCHOOL_TOUR} />

      {/* 3 · Role-Based Experience */}
      <RoleSection
        roles={SCHOOL_TOUR.roles}
        sub="Admin, teachers, parents and the accounts desk each work inside their own view of the same student, class and fee records."
      />

      {/* 4 · School ERP Module Showcase */}
      <div id="modules">
        <ModuleShowcase
          modules={schoolModules}
          eyebrow="School ERP modules"
          title={
            <>
              Fourteen modules, <span className="text-teal-700">each with its real screen.</span>
            </>
          }
          sub="No icon grids. Every module opens a preview of the working screen. Green means the workflow runs in the MYR workspace today; grey means configurable scope."
        />
      </div>

      {/* 5 · Interactive Missions */}
      <MissionsBoard config={SCHOOL_TOUR} />

      {/* Buy */}
      <section className="section-light py-14 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-md">
            <ProductBuyCard
              id={6001}
              name="School ERP"
              desc="Admissions, attendance, exams, fees and campus operations for schools."
              fallbackPrice={5000}
              monthly
              image="/assets/2024-09-website-designing-service-7.png"
              to="/education-erp/school/"
              badge="Popular"
            />
          </div>
        </div>
      </section>

      {/* 6 · Closing Section + FAQ + conversion */}
      <ClosingSection
        headline={seg.closingHeadline}
        body="One dashboard, every screen your school carries. The accounts desk on a desktop, a teacher with a phone in the corridor, a parent checking at home."
        journeyLabel="Start Your School ERP Journey"
        journeyTo="/education-erp/modules/"
        demoLabel="Book a School ERP Demo"
        tourLabel="Enter Virtual School"
        faq={seg.faq}
      />

      <TourShell segment="school" />
    </main>
  )
}

export function SchoolErpPage() {
  return (
    <TourProvider config={SCHOOL_TOUR}>
      <SchoolErpContent />
    </TourProvider>
  )
}