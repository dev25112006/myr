import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Reveal, SectionHeading, Stagger, StaggerItem } from '@/components/ui'

type SchoolERPFeatures = {
  title: string
  modules: string[]
}

const schoolERPFeatures: SchoolERPFeatures[] = [
  {
    title: 'Student Administration',
    modules: ['Admissions & enquiry tracking', 'Student and guardian records', 'Class, section & academic year setup', 'Attendance, leave & late arrivals', 'Timetable & substitute planning', 'Transport routes & vehicle records', 'Library, inventory & asset tracking', 'Hostel and house management']
  },
  {
    title: 'Teaching & Assessment',
    modules: ['Subjects, lesson plans & homework', 'Exams, gradebooks & report cards', 'Online tests and assignment tracking', 'Certificates, ID cards & transfer records', 'Academic calendar, events & notices']
  },
  {
    title: 'Fees & Family Communication',
    modules: ['Fee structures, concessions & instalments', 'Invoices, receipts, dues & reminders', 'Parent, student & teacher portals', 'Announcements via app, email or SMS', 'Progress, attendance & finance reports']
  },
  {
    title: 'Library & Asset Tracking',
    modules: ['Book issue & return records', 'Inventory management', 'Asset condition tracking', 'Maintenance scheduling']
  },
  {
    title: 'Hostel Management',
    modules: ['Room allocation', 'Fee management', 'Leave applications', 'Visitor tracking']
  }
]

const schoolERPStats = [
  ['Enrolled students', '2,486'],
  ['Present today', '94.2%'],
  ['Fee collection', '82%']
]

const institutionSegments = [
  { type: 'School', icon: '🏫', summary: 'Coordinate admissions, academics, fees and family communication across your school.', to: '/products/school-erp/school/' },
  { type: 'College', icon: '🎓', summary: 'Connect departments, semester operations, campus services and institutional reporting.', to: '/products/school-erp/college/' },
  { type: 'Coaching', icon: '🧑‍🏫', summary: 'Manage enquiries, batches, learning and fee follow-ups together.', to: '/products/school-erp/coaching/' }
]

const portalRoles = [
  ['Administrator', 'Operations, approvals, fee status and institution-wide reports.'],
  ['Teacher / Faculty', 'Assigned classes, timetables, attendance, assessments and student lists.'],
  ['Student', 'Schedule, assignments, attendance, learning resources, fees and results.'],
  ['Parent / Guardian', 'Child attendance, progress, notices, fee details and school updates.'],
]

function SchoolErpProductPage() {
  return (
    <section className="section-deep py-14 sm:py-16">
      <div className="container-page">
        <SectionHeading title="School ERP Software" sub="Manage your institution efficiently with our comprehensive ERP solution." />
        
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {institutionSegments.map((segment) => (
            <div key={segment.type} className="group rounded-xl border border-line bg-white p-4 hover:border-accent-400/50 hover:bg-ink-950/[0.03] transition">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-accent-600">{segment.type}</span>
              <p className="mt-2 line-clamp-3 text-sm text-ink-500">{segment.summary}</p>
              <Link to={segment.to} className="btn btn-primary btn-sm mt-4 block">Explore →</Link>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-ink-900">Key Features</h2>
          <ul className="mt-6 space-y-3 text-sm text-ink-500">
            {schoolERPFeatures.map((features, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5 text-accent-600">•</span>
                <span>{features.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-ink-900">School ERP Stats</h2>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {schoolERPStats.map(([label, value]) => (
              <div className="text-center">
                <p className="text-3xl font-bold font-display text-ink-950">{value}</p>
                <p className="text-xs text-ink-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Link to="/contact-us/?interest=school-erp" className="btn btn-primary">Talk to our team about School ERP ↗</Link>
        </div>
      </div>
    </section>
  )
}

export default SchoolErpProductPage
