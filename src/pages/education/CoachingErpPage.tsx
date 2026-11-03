import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { COACHING_SEGMENT } from '@/content/education/segments'
import { TourProvider } from '@/components/education/TourProvider'
import { useTour } from '@/components/education/useTour'
import { TourShell } from '@/components/education/TourShell'
import { ErpHero } from '@/components/education/ErpHero'
import { BuyShowcase } from '@/components/commerce/BuyShowcase'
import { DemoBadge } from '@/components/education/DemoBadge'
import {
  CampusTourSection,
  ClosingSection,
  MissionsBoard,
} from '@/components/education/sections'

const seg = COACHING_SEGMENT

/** `?tour=1` opens the virtual tour on load. */
function TourDeepLink() {
  const tour = useTour()
  const [params] = useSearchParams()
  useEffect(() => {
    if (params.get('tour') === '1') tour.open('intro')
  }, [params, tour])
  return null
}

function CoachingErpContent() {
  const tour = useTour()
  const seg = COACHING_SEGMENT

  return (
    <main>
      <TourDeepLink />

      {/* 1 · Hero */}
      <ErpHero
        identity={seg.identity}
        badge={seg.hero.badge}
        headline={seg.hero.titleBefore + seg.hero.titleAccent}
        sub={seg.hero.sub}
        primaryCta={{ label: 'Enter Coaching Command Centre', to: '/education-erp/coaching/#modules' }}
        secondaryCta={{ label: 'Explore Coaching ERP', onClick: () => tour.open('intro') }}
        roleCards={['Institute Owner', 'Counsellor', 'Faculty', 'Student']}
      />

      {/* Buy */}
      <BuyShowcase
        id={6003}
        name="Coaching ERP"
        desc="Enquiries, batches, test series and fee follow-ups for coaching institutes."
        fallbackPrice={4000}
        monthly
        image="/assets/2024-08-start-mission-success-strategy-beginning-concept.png"
        heading="Spend Less Time Managing. More Time Teaching."
        sub="Admin-controlled pricing. Buy now and go live fast."
        features={['Batches & attendance', 'Test series & results', 'Fees & follow-ups', 'Student portal']}
      />

      {/* 2 · Virtual Coaching Institute */}
      <CampusTourSection identity={seg.identity} config={seg.tour!} />

      {/* 3 · Role-Based Dashboard Experience */}
      <section className="section-white px-5 py-20 sm:px-8" aria-labelledby="roles-heading">
        <div className="mx-auto max-w-7xl">
          <h2 id="roles-heading" className="text-2xl font-bold leading-tight text-ink-950 sm:text-3xl">
            Role-Based Dashboard Experience
          </h2>
          <p className="mt-4 text-ink-500">
            Platform architecture designed for each stakeholder in a coaching institute.
          </p>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            <div
              key="owner"
              className="rounded-xl border border-line bg-paper/40 p-4 hover:border-flame-600 transition-colors"
            >
              <h3 className="text-sm font-semibold text-flame-600 uppercase tracking-wider">Platform Administrator</h3>
              <p className="mt-2 text-[11px] text-ink-500 line-clamp-3">Institute registration, approval, workspace activation, subscription management, platform revenue, institutional monitoring, support tickets, platform-wide analytics.</p>
            </div>
            <div
              key="counsellor"
              className="rounded-xl border border-line bg-paper/40 p-4 hover:border-flame-600 transition-colors"
            >
              <h3 className="text-sm font-semibold text-flame-600 uppercase tracking-wider">Institution Administrator</h3>
              <p className="mt-2 text-[11px] text-ink-500 line-clamp-3">Dashboard and institution overview, courses and subjects, classes and batches, student management, teacher management, admission enquiries and follow-ups, timetable management, attendance, examination management, question bank, assignments and study materials, student fee management, payroll, branch and operational management, reports and notifications.</p>
            </div>
            <div
              key="faculty"
              className="rounded-xl border border-line bg-paper/40 p-4 hover:border-flame-600 transition-colors"
            >
              <h3 className="text-sm font-semibold text-flame-600 uppercase tracking-wider">Teacher</h3>
              <p className="mt-2 text-[11px] text-ink-500 line-clamp-3">Assigned batches, assigned subjects, timetable, student attendance, MCQ tests, manual examinations, marks entry, assignments, study material, salary information.</p>
            </div>
            <div
              key="student"
              className="rounded-xl border border-line bg-paper/40 p-4 hover:border-flame-600 transition-colors"
            >
              <h3 className="text-sm font-semibold text-flame-600 uppercase tracking-wider">Student</h3>
              <p className="mt-2 text-[11px] text-ink-500 line-clamp-3">Personal dashboard, enrolled courses, batch information, timetable, attendance history, MCQ assessments, examination marks, assignments, study materials, fee and payment information, notifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Coaching ERP Feature Storytelling */}
      <section className="section-white px-5 py-20 sm:px-8" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl">
          <h2 id="features-heading" className="text-2xl font-bold leading-tight text-ink-950 sm:text-3xl">
            Coaching ERP Feature Storytelling
          </h2>
          <p className="mt-4 text-ink-500">
            Individual animated feature showcases for the core modules of the coaching ERP platform.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Admission CRM</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Enquiry capture and admission pipeline - A walk-in enters the pipeline with a stage and a date. The counsellor sees their list every morning instead of reconstructing it from a diary.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Running in workspace</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Course Management</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Courses, subjects, batches and sections - Manage the full academic lifecycle from course creation to section allocation.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Class & Batch Management</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Batch schedules and faculty allocation - Create batches, assign teachers, manage timetables and seat planning across multiple branches.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Scope</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Student Management</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Student profiles, guardians and documents - Complete student records with guardian contact, document storage, and progress tracking.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Teacher Management</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Faculty workload tracking, batch attendance, tests, results, and day-to-day class operations management.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Attendance Management</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">One mark per student per date. The system rejects duplicates instead of quietly corrupting a record. Batch-wise attendance summaries and reports.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Timetable Management</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Create and manage batch schedules, faculty allocation, and classroom assignments across all branches.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Scope</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">MCQ Examination System</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Create MCQ tests using the question bank, set maximum marks, enter results per student, and publish after review.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Manual Examination System</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Schedule manual examinations, enter marks, and publish results with full performance tracking.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Question Bank</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Central repository of test questions, organized by subject and topic, with answer keys and difficulty levels.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Assignments & Homework</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Assignments management with delivery tracking, submission status, and performance insights per student and batch.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Study Material Management</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Upload, organize, and distribute study materials by course and batch. Students access via the learning portal.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Student Fees & Payments</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Course fees, instalments, scholarships, receipts, outstanding balances, and fee follow-ups. Batch-wise revenue reports.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Payroll Management</h3>
                <span className="text-xs font-semibold text-flame-600">Scope</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Teacher salary information, batch-wise payment tracking, and payroll processing for the coaching institute.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Scope</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Branch Management</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Multi-branch support with independent workspaces. Fees, attendance and reports scope per branch, while enrolment and collections roll up across all.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Leave & Expense Management</h3>
                <span className="text-xs font-semibold text-flame-600">Scope</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Teacher and staff leave tracking, expense submission and reimbursement, and operational cost tracking across branches.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Scope</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Certificates & ID Cards</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Generate and issue course completion certificates, participation certificates, and student ID cards with verification codes.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Notifications</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Send announcements, reminders, and alerts to students, parents, teachers, and staff across all branches via the platform.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Reports & Analytics</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Institutional performance dashboards, batch-wise revenue and attendance reports, exam result analysis, and fee collection reports.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Role-Based Access Control</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Platform-wide permission system defining what each role (owner, counsellor, faculty, student/guardian) can view and modify within the coaching institute.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
            <article className="card flex h-full flex-col p-5 reveal">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-ink-950">Multi-Tenant Institution Management</h3>
                <span className="text-xs font-semibold text-flame-600">Live</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">Independent institution workspaces within a single MYR platform. Each institution has its own users, roles, data, and permissions while platform-level administration provides centralized monitoring.</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] leading-relaxed text-ink-400">Status: Live</span>
                <DemoBadge className="shrink-0" />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 5 · Interactive Coaching Missions */}
      <MissionsBoard config={seg.tour!} />

      {/* 6 · Multi-Tenant Architecture Visualization */}
      <section className="section-deep px-5 py-20 sm:px-8" aria-labelledby="multi-tenant-heading">
        <div className="mx-auto max-w-7xl">
          <h2 id="multi-tenant-heading" className="text-2xl font-bold leading-tight text-ink-950 sm:text-3xl">
            Multi-Tenant Architecture Visualization
          </h2>
          <p className="mt-4 text-ink-500">
            Each institution on the MYR platform has its own isolated workspace with separate users, roles, and data.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card reveal">
              <h3 className="text-xl font-bold text-ink-950 mb-4">MYR Platform</h3>
              <p className="text-ink-500 mb-6">Central platform providing shared infrastructure, administration tools, and cross-institution analytics.</p>
              <div className="space-y-3">
                <div className="rounded-xl border border-flame-500/20 bg-flame-500/10 p-4">
                  <h4 className="text-sm font-semibold text-flame-600">Institution A</h4>
                  <p className="text-xs text-ink-400">Independent workspace with its own students, batches, faculty and fees.</p>
                </div>
                <div className="rounded-xl border border-flame-500/20 bg-flame-500/10 p-4">
                  <h4 className="text-sm font-semibold text-flame-600">Institution B</h4>
                  <p className="text-xs text-ink-400">Isolated data and users, separate from Institution A.</p>
                </div>
                <div className="rounded-xl border border-flame-500/20 bg-flame-500/10 p-4">
                  <h4 className="text-sm font-semibold text-flame-600">Institution C</h4>
                  <p className="text-xs text-ink-400">Isolated data and users, separate from A and B.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card reveal">
              <h3 className="text-xl font-bold text-ink-950 mb-4">Institution A</h3>
              <p className="text-ink-500 mb-6">Fully isolated workspace with independent users, roles, and data.</p>
              <ul className="space-y-2 text-sm text-ink-600">
                <li>Own students and batches</li>
                <li>Own faculty assignments</li>
                <li>Own fee collections</li>
                <li>Own attendance records</li>
                <li>Own examination results</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card reveal">
              <h3 className="text-xl font-bold text-ink-950 mb-4">Institution B</h3>
              <p className="text-ink-500 mb-6">Fully isolated workspace with independent users, roles, and data.</p>
              <ul className="space-y-2 text-sm text-ink-600">
                <li>Own students and batches</li>
                <li>Own faculty assignments</li>
                <li>Own fee collections</li>
                <li>Own attendance records</li>
                <li>Own examination results</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card reveal">
              <h3 className="text-xl font-bold text-ink-950 mb-4">Institution C</h3>
              <p className="text-ink-500 mb-6">Fully isolated workspace with independent users, roles, and data.</p>
              <ul className="space-y-2 text-sm text-ink-600">
                <li>Own students and batches</li>
                <li>Own faculty assignments</li>
                <li>Own fee collections</li>
                <li>Own attendance records</li>
                <li>Own examination results</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7 · Closing Section */}
      <ClosingSection
        headline="Spend Less Time Managing. More Time Teaching."
        body="Build a smarter coaching institute. Manage students, batches, faculty, attendance, examinations, fees and institutional operations from a connected platform. Spend less time managing and more time teaching."
        journeyLabel="Explore Coaching ERP"
        journeyTo="/education-erp/coaching/"
        demoLabel="Book a Coaching ERP Demo"
        tourLabel="Enter Virtual Coaching Institute"
        faq={seg.faq}
      />

      <TourShell segment="coaching" />
    </main>
  )
}

export function CoachingErpPage() {
  return (
    <TourProvider config={seg.tour!}>
      <CoachingErpContent />
    </TourProvider>
  )
}