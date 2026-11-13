/** 
 * Education ERP segment configuration.
 * 
 * Every module carries an honest status: 'live' means the workflow exists
 * in the MYR product today, 'scope' means configurable implementation
 * scope agreed with MYR. No customer counts, testimonials or statistics
 * are invented anywhere in this file.
 */

import type { TourConfig, SimPreview } from '@/components/education/types'

export type SegmentId = 'school' | 'college' | 'coaching'

export type ModuleStatus = 'live' | 'scope'

export type ModuleItem = { name: string; status: ModuleStatus }

export type ModuleGroup = { icon: string; title: string; items: ModuleItem[] }

export type FaqItem = { q: string; a: string }

export type RoleDef = { id: string; label: string; blurb: string; responsibilities?: { text: string; status: 'live' | 'scope' }[] }

export type SegmentIdentity = {
  accentText: string
  accentDot: string
  chip: string
  window: string
}

const SCHOOL: SegmentIdentity = {
  accentText: 'text-teal-700',
  accentDot: 'bg-teal-600',
  chip: 'bg-teal-50 text-teal-800',
  window: 'bg-teal-200/70',
}

const COLLEGE: SegmentIdentity = {
  accentText: 'text-accent-600',
  accentDot: 'bg-accent-500',
  chip: 'bg-accent-400/10 text-accent-600',
  window: 'bg-accent-300/60',
}

const COACHING: SegmentIdentity = {
  accentText: 'text-flame-600',
  accentDot: 'bg-flame-500',
  chip: 'bg-flame-500/10 text-flame-600',
  window: 'bg-flame-300/60',
}

export type SegmentConfig = {
  id: SegmentId
  name: string
  shortName: string
  path: string
  identity: SegmentIdentity
  hero: { badge: string; titleBefore: string; titleAccent: string; titleAfter: string; sub: string }
  story: { kicker: string; title: string; sub: string }
  groups: ModuleGroup[]
  roles: RoleDef[]
  benefits: { title: string; body: string }[]
  workflow: { kicker: string; title: string; steps: { title: string; body: string }[] }
  faq: FaqItem[]
  missionIds: string[]
  closingHeadline: string
  tour?: TourConfig
}

const BASE_FAQ: FaqItem[] = [
  {
    q: 'How much does MYR education ERP cost per student?',
    a: 'Pricing depends on your institution size, modules selected and regions you operate in. Indian schools and coaching centres are typically quoted per student per year in INR, while US and international institutions are quoted per campus in USD. Use Request pricing and you will get real commercial terms for your configuration.',
  },
  {
    q: 'Is student data compliant with India\'s DPDP Act and US privacy laws?',
    a: 'Access is role-based and tenant-scoped, sensitive fields are minimised by design, and every access change lands in the audit log. Implementations are aligned with India\'s DPDP Act, and region-specific requirements for US institutions such as FERPA-aligned handling are reviewed before build, not after.',
  },
  {
    q: 'Does the ERP work for institutions outside India?',
    a: 'Yes. Institutions in the US and worldwide run the same platform with cloud hosting appropriate to your region, INR or USD billing, and online training sessions scheduled across timezones.',
  },
  {
    q: 'What exactly is the Virtual Campus tour?',
    a: 'A walkthrough you can skip. It opens a simulated campus where you pick a location or a role and try short workflows like marking attendance or recording a fee receipt. Everything runs on sample data inside your browser. Nothing you click reaches MYR systems, and no real student record is involved.',
  },
  {
    q: 'Which parts work today?',
    a: 'The coaching workflows, the CRM pipeline and the HRM module are built and running in the MYR workspace right now. School and college specifics get configured per institution during implementation, and we label those clearly everywhere on these pages.',
  },
  {
    q: 'Do I need an account to look around?',
    a: 'No. The tour and every demo screen here work without signing up. Accounts and subscriptions only come into play when you decide to run the real product on your own data.',
  },
  {
    q: 'How do I see the real product or get pricing?',
    a: 'Hit Book a live demo on any of these pages or contact the team. The demo runs your own scenarios in the actual workspace. Pricing depends on your institution size and which modules you pick, so MYR quotes it directly rather than us printing numbers here.',
  },
]

export const SCHOOL_SEGMENT: SegmentConfig = {
  id: 'school',
  name: 'School ERP',
  shortName: 'School',
  path: '/education-erp/school/',
  identity: SCHOOL,
  hero: {
    badge: 'MYR School ERP',
    titleBefore: 'Every Classroom. Every Student. ',
    titleAccent: 'Every Operation. Connected.',
    titleAfter: '',
    sub: 'Manage your entire school ecosystem through one intelligent and connected platform.',
  },
  closingHeadline: 'Give Your School a Smarter Way to Grow.',
  story: {
    kicker: 'Built around the school day',
    title: 'Morning attendance to evening notice board, one thread.',
    sub: 'A school runs on small handoffs all day. Attendance feeds exam lists. Fee records feed reminders. A single student record keeps all of it pointing at the same child, so nobody re-types the same name into a third spreadsheet.',
  },
  groups: [
    {
      icon: '01',
      title: 'Student and campus administration',
      items: [
        { name: 'Admissions and enquiry tracking', status: 'scope' },
        { name: 'Student and guardian records', status: 'scope' },
        { name: 'Class, section and academic year setup', status: 'scope' },
        { name: 'Attendance, leave and late arrivals', status: 'live' },
        { name: 'Timetable and substitute planning', status: 'scope' },
        { name: 'Transport routes and vehicle records', status: 'scope' },
        { name: 'Library and asset tracking', status: 'scope' },
        { name: 'Hostel and house management', status: 'scope' },
      ],
    },
    {
      icon: '02',
      title: 'Teaching and assessment',
      items: [
        { name: 'Subjects, lesson plans and homework', status: 'scope' },
        { name: 'Exams, gradebooks and result publishing', status: 'live' },
        { name: 'Online tests and assignment tracking', status: 'scope' },
        { name: 'Certificates, ID cards and transfer records', status: 'scope' },
        { name: 'Academic calendar, events and notices', status: 'scope' },
      ],
    },
    {
      icon: '03',
      title: 'Fees and family communication',
      items: [
        { name: 'Fee structures, concessions and instalments', status: 'live' },
        { name: 'Invoices, receipts, dues and reminders', status: 'live' },
        { name: 'Parent, student and teacher portals', status: 'live' },
        { name: 'Announcements via app, email or SMS', status: 'scope' },
        { name: 'Progress, attendance and finance reports', status: 'live' },
      ],
    },
  ],
  roles: [
    { id: 'admin', label: 'Administrator', blurb: 'Operations, approvals, fee status, institution-wide reports.' },
    { id: 'teacher', label: 'Teacher', blurb: 'Own classes, timetables, attendance, assessments, student lists.' },
    { id: 'student', label: 'Student', blurb: 'Schedule, assignments, attendance, resources, fees, results.' },
    { id: 'guardian', label: 'Parent / Guardian', blurb: 'One child. Their attendance, progress, notices and fees.' },
  ],
  benefits: [
    { title: 'One record, many hands', body: 'Attendance, exams, fees and portal access all hang off the same student record. Change it once and every view downstream is right.' },
    { title: 'Access that matches the job', body: 'Teachers get their classes. Guardians get their child. Admins get the institution. Nobody shares a login, nobody sees a screen they should not.' },
    { title: 'Fees without spreadsheet archaeology', body: 'Payments, receipts and balances stay attached to the student. When a receipt is voided, the trail stays intact.' },
    { title: 'A term that starts calm', body: 'Admissions, classes and fee structures get set up once at the beginning of the year. The rest of the term runs off that setup.' },
  ],
  workflow: {
    kicker: 'One morning in the platform',
    title: 'Watch a routine flow end to end.',
    steps: [
      { title: '1 · Mark the roll', body: 'A teacher marks the class present, absent or late. One mark per student per day. Duplicates get rejected before they poison a report.' },
      { title: '2 · Clear the dues list', body: 'Accounts records a payment, a receipt number prints itself, and the balance moves from unpaid to partial or paid on its own.' },
      { title: '3 · Publish the assessment', body: 'Exams carry a date and a maximum. Marks go in per student. Results publish once review is done, not before.' },
      { title: '4 · Open the guardian view', body: 'Guardian access goes out by verified email and gets revoked the same way. Families see their own child, no screenshot forwarding needed.' },
      { title: '5 · Read the day back', body: 'Attendance and collection reports summarize what happened. Nobody rebuilds the day in a spreadsheet at 8pm.' },
    ],
  },
  faq: [
    {
      q: 'Is student data safe here?',
      a: 'Each workspace only sees its own data, and member access is role-based. We keep sensitive details like date of birth or health notes out of the initial modules on purpose. Staff documents are stored privately with retention controls.',
    },
    {
      q: 'Can we start small and add modules later?',
      a: 'Yes. Most schools begin with attendance and fees, then bring in exams and portals once the first term settles. What gets configured when is agreed with MYR before any build starts.',
    },
    ...BASE_FAQ,
  ],
  missionIds: ['attendance', 'fees', 'exam-publish', 'portal'],
}

/* College ERP */
export const COLLEGE_SEGMENT: SegmentConfig = {
  id: 'college',
  name: 'College ERP',
  shortName: 'College',
  path: '/education-erp/college/',
  identity: COLLEGE,
  hero: {
    badge: 'MYR College ERP',
    titleBefore: 'One Campus. Every Department. Complete Institutional Control.',
    titleAccent: '',
    titleAfter: '',
    sub: 'Connect academic operations, student services, administration and institutional management through one integrated ERP.',
  },
  closingHeadline: 'Build a Connected Campus. Manage Every Academic Journey.',
  story: {
    kicker: 'Built around departmental reality',
    title: 'Colleges do not fail at teaching. They fail at handoffs.',
    sub: 'Six departments, four semesters, one registrar chasing Excel files. The platform standardises the records while each department keeps running its own classes the way it always has.',
  },
  groups: [
    {
      icon: '01',
      title: 'Central Administration',
      items: [
        { name: 'Institution configuration', status: 'scope' },
        { name: 'Department management', status: 'scope' },
        { name: 'Course management', status: 'scope' },
        { name: 'Staff and student records', status: 'scope' },
        { name: 'Academic session management', status: 'scope' },
        { name: 'Branch management', status: 'scope' },
        { name: 'Accreditation reporting', status: 'scope' },
      ],
    },
    {
      icon: '02',
      title: 'Admissions Office',
      items: [
        { name: 'Enquiries', status: 'live' },
        { name: 'Admission applications', status: 'live' },
        { name: 'Follow-ups', status: 'scope' },
        { name: 'Document verification', status: 'scope' },
        { name: 'Admission conversion', status: 'scope' },
        { name: 'Prospective student pipeline', status: 'live' },
      ],
    },
    {
      icon: '03',
      title: 'Academic Departments',
      items: [
        { name: 'HOD management', status: 'scope' },
        { name: 'Faculty allocation', status: 'scope' },
        { name: 'Subject management', status: 'scope' },
        { name: 'Timetable coordination', status: 'scope' },
        { name: 'Department reports', status: 'live' },
        { name: 'Course offering optimization', status: 'scope' },
      ],
    },
    {
      icon: '04',
      title: 'Faculty Office',
      items: [
        { name: 'Assigned subjects', status: 'live' },
        { name: 'Student attendance', status: 'live' },
        { name: 'Assignments', status: 'scope' },
        { name: 'Internal assessments', status: 'live' },
        { name: 'Marks entry', status: 'live' },
        { name: 'Student progress tracking', status: 'scope' },
      ],
    },
    {
      icon: '05',
      title: 'Examination Cell',
      items: [
        { name: 'Examination scheduling', status: 'scope' },
        { name: 'Marks entry', status: 'live' },
        { name: 'Result publishing', status: 'live' },
        { name: 'Internal assessments', status: 'live' },
        { name: 'Topic-wise performance', status: 'scope' },
        { name: 'Transcript generation', status: 'scope' },
      ],
    },
    {
      icon: '06',
      title: 'Accounts Department',
      items: [
        { name: 'Fee structures', status: 'live' },
        { name: 'Semester-wise fees', status: 'live' },
        { name: 'Receipts', status: 'live' },
        { name: 'Pending payments', status: 'scope' },
        { name: 'Financial reporting', status: 'live' },
        { name: 'Fee concessions', status: 'scope' },
      ],
    },
    {
      icon: '07',
      title: 'Library',
      items: [
        { name: 'Catalog and issue/return', status: 'live' },
        { name: 'Digital resource links', status: 'scope' },
        { name: 'Stock availability', status: 'live' },
        { name: 'Overdue tracking', status: 'scope' },
        { name: 'Research support', status: 'scope' },
        { name: 'Academic material reserve', status: 'scope' },
      ],
    },
    {
      icon: '08',
      title: 'Placement & Career Centre',
      items: [
        { name: 'Company records', status: 'scope' },
        { name: 'Placement drives', status: 'scope' },
        { name: 'Student eligibility', status: 'scope' },
        { name: 'Placement applications', status: 'scope' },
        { name: 'Placement tracking', status: 'scope' },
        { name: 'Alumni connections', status: 'scope' },
      ],
    },
    {
      icon: '09',
      title: 'Student Services',
      items: [
        { name: 'Academic profile', status: 'live' },
        { name: 'Semester information', status: 'live' },
        { name: 'Course registration', status: 'live' },
        { name: 'Attendance', status: 'live' },
        { name: 'Assignments', status: 'scope' },
        { name: 'Fee status', status: 'live' },
      ],
    },
  ],
  roles: [
    {
      id: 'admin',
      label: 'College Administrator',
      blurb: 'Institution configuration, department management, course management, staff and student records, academic session management, branch management.',
      responsibilities: [
        { text: 'Institution configuration', status: 'scope' },
        { text: 'Department management', status: 'scope' },
        { text: 'Course management', status: 'scope' },
        { text: 'Staff and student records', status: 'scope' },
        { text: 'Academic session management', status: 'scope' },
        { text: 'Branch management', status: 'scope' },
      ],
    },
    {
      id: 'principal',
      label: 'Principal / Director',
      blurb: 'Institutional analytics, department performance, student statistics, fee and revenue reports, examination performance.',
      responsibilities: [
        { text: 'Institutional analytics', status: 'live' },
        { text: 'Department performance', status: 'scope' },
        { text: 'Student statistics', status: 'scope' },
        { text: 'Fee and revenue reports', status: 'live' },
        { text: 'Examination performance', status: 'live' },
      ],
    },
    {
      id: 'hod',
      label: 'HOD',
      blurb: 'Department management, faculty allocation, subject management, timetable coordination, department reports.',
      responsibilities: [
        { text: 'Department management', status: 'scope' },
        { text: 'Faculty allocation', status: 'scope' },
        { text: 'Subject management', status: 'scope' },
        { text: 'Timetable coordination', status: 'scope' },
        { text: 'Department reports', status: 'live' },
      ],
    },
    {
      id: 'faculty',
      label: 'Faculty',
      blurb: 'Assigned subjects, student attendance, assignments, internal assessments, marks entry, student progress.',
      responsibilities: [
        { text: 'Assigned subjects', status: 'live' },
        { text: 'Student attendance', status: 'live' },
        { text: 'Assignments', status: 'scope' },
        { text: 'Internal assessments', status: 'live' },
        { text: 'Marks entry', status: 'live' },
        { text: 'Student progress', status: 'scope' },
      ],
    },
    {
      id: 'student',
      label: 'Student',
      blurb: 'Academic profile, semester information, course registration, attendance, assignments, examination schedules, results, fee status.',
      responsibilities: [
        { text: 'Academic profile', status: 'live' },
        { text: 'Semester information', status: 'live' },
        { text: 'Course registration', status: 'scope' },
        { text: 'Attendance', status: 'live' },
        { text: 'Assignments', status: 'scope' },
        { text: 'Examination schedules', status: 'live' },
        { text: 'Results', status: 'live' },
        { text: 'Fee status', status: 'live' },
      ],
    },
    {
      id: 'accountant',
      label: 'Accountant',
      blurb: 'Fee structures, semester-wise fees, receipts, pending payments, financial reporting.',
      responsibilities: [
        { text: 'Fee structures', status: 'live' },
        { text: 'Semester-wise fees', status: 'live' },
        { text: 'Receipts', status: 'live' },
        { text: 'Pending payments', status: 'scope' },
        { text: 'Financial reporting', status: 'live' },
      ],
    },
    {
      id: 'counsellor',
      label: 'Admission Counsellor',
      blurb: 'Enquiries, admission applications, follow-ups, document verification, admission conversion.',
      responsibilities: [
        { text: 'Enquiries', status: 'live' },
        { text: 'Admission applications', status: 'live' },
        { text: 'Follow-ups', status: 'scope' },
        { text: 'Document verification', status: 'scope' },
        { text: 'Admission conversion', status: 'scope' },
      ],
    },
    {
      id: 'placement',
      label: 'Placement Officer',
      blurb: 'Company records, placement drives, student eligibility, applications, placement tracking.',
      responsibilities: [
        { text: 'Company records', status: 'scope' },
        { text: 'Placement drives', status: 'scope' },
        { text: 'Student eligibility', status: 'scope' },
        { text: 'Placement applications', status: 'scope' },
        { text: 'Placement tracking', status: 'scope' },
      ],
    },
  ],
  benefits: [
    { title: 'Autonomy without chaos', body: 'Each department runs its own classes and grading. Leadership still sees one rolled-up picture, without chasing anyone for files.' },
    { title: 'Attendance that holds up', body: 'Session-level attendance builds the record that eligibility rules and compliance reports depend on. It is defensible because it was captured once, at the source.' },
    { title: 'Tuition with a paper trail', body: 'Schedules, partial payments, receipts and balances sit on the student record. Void a receipt and the audit trail keeps it.' },
    { title: 'Roles that fit the hierarchy', body: 'Faculty see their own classes. Students see their own enrolment. The owner controls every role change, and each change is logged.' },
    { title: 'Placement that scales', body: 'Company records and student eligibility keep drives focused. Tracking rolls up across branches without duplicate entry.' },
  ],
  workflow: {
    kicker: 'One semester, one record',
    title: 'Follow a student through the academic cycle.',
    steps: [
      { title: '1 · Enrol', body: 'A student record gets created with program and batch details. Every attendance line, fee and result that follows points back to it.' },
      { title: '2 · Capture attendance per session', body: 'Faculty mark their own sessions. One mark per student per date keeps eligibility checks honest.' },
      { title: '3 · Run exams', body: 'Exams carry subjects and maximum marks. Results enter per student and publish after review.' },
      { title: '4 · Collect tuition', body: 'Fee records carry due dates and balances. Payments issue receipt numbers and update what is outstanding.' },
      { title: '5 · Open the portal', body: 'Verified-email access lets students and guardians check their own attendance, fees and published results. Revocable any time.' },
    ],
  },
  faq: [
    {
      q: 'How does multi-department access actually work?',
      a: 'Workspaces are tenant-scoped and role-based. A faculty member sees their own classes and students, an admin sees the whole institution, students and guardians see only themselves. The owner changes roles, and every change lands in the audit log.',
    },
    {
      q: 'Can departments keep their own processes?',
      a: 'Yes. The platform standardises records, not teaching methods. How each department runs its classes, grading and internal review is part of the implementation discussion with MYR.',
    },
    ...BASE_FAQ,
  ],
  missionIds: [],
}

/* Coaching ERP */
export const COACHING_SEGMENT: SegmentConfig = {
  id: 'coaching',
  name: 'Coaching ERP',
  shortName: 'Coaching',
  path: '/education-erp/coaching/',
  identity: COACHING,
  hero: {
    badge: 'MYR Coaching ERP',
    titleBefore: 'Enquiries, batches, tests and fees. ',
    titleAccent: 'One place, running today.',
    titleAfter: '',
    sub: 'A coaching institute platform for admission pipelines, batches, attendance, test series, results and fee follow-ups. The workflows behind this page are live in the MYR workspace right now.',
  },
  closingHeadline: 'Give Your Coaching Institute a Smarter Way to Scale.',
  story: {
    kicker: 'Built around the batch',
    title: 'The batch is the unit of work. Everything hangs off it.',
    sub: 'Walk-in enquiries, a batch schedule, a test series and three pending fee instalments, all on the same afternoon. The platform keeps the enquiry, the student, the tests and the money on one connected record.',
  },
  groups: [
    {
      icon: '01',
      title: 'Enquiries and batch operations',
      items: [
        { name: 'Enquiry capture and admission pipeline', status: 'live' },
        { name: 'Courses, subjects, batches and sections', status: 'live' },
        { name: 'Batch schedules and faculty allocation', status: 'scope' },
        { name: 'Student profiles, guardians and documents', status: 'live' },
        { name: 'Classroom and online session attendance', status: 'live' },
        { name: 'Multi-branch, classroom and seat planning', status: 'live' },
      ],
    },
    {
      icon: '02',
      title: 'Teaching, testing and progress',
      items: [
        { name: 'Live class links and recorded lesson library', status: 'scope' },
        { name: 'Study notes, assignments and doubt tracking', status: 'scope' },
        { name: 'Online tests, test series and answer keys', status: 'live' },
        { name: 'Result publishing and topic-wise performance', status: 'live' },
        { name: 'Rank lists across batches', status: 'scope' },
        { name: 'Student and parent learning portal', status: 'live' },
      ],
    },
    {
      icon: '03',
      title: 'Collections and engagement',
      items: [
        { name: 'Course fees, instalments and scholarships', status: 'live' },
        { name: 'Dues, receipts and fee follow-ups', status: 'live' },
        { name: 'Batch-wise enrolment and revenue reports', status: 'live' },
        { name: 'Class, test and schedule notifications', status: 'scope' },
        { name: 'Counsellor follow-ups and conversion tracking', status: 'live' },
        { name: 'Content access by course or enrolled batch', status: 'scope' },
      ],
    },
  ],
  roles: [
    { id: 'owner', label: 'Institute owner', blurb: 'Admissions, collections, branch performance, reports across every batch.' },
    { id: 'counsellor', label: 'Counsellor', blurb: 'Enquiry pipeline, follow-ups, demos, conversion to admissions.' },
    { id: 'faculty', label: 'Faculty', blurb: 'Batch attendance, tests, results, day-to-day class operations.' },
    { id: 'student', label: 'Student / Guardian', blurb: 'Schedule, attendance, tests, results, fees, institute updates.' },
  ],
  benefits: [
    { title: 'Follow-ups that do not depend on memory', body: 'A walk-in enters the pipeline with a stage and a date. The counsellor sees their list every morning instead of reconstructing it from a diary.' },
    { title: 'Dues lists that need no reconciliation', body: 'Instalments, receipts and balances live on the student record. The pending list is a report, not a weekend project.' },
    { title: 'Test cycles that keep moving', body: 'Exams per batch with maximum marks, entry, review, publish. Sheets stop piling up on a desk.' },
    { title: 'Every branch, one view', body: 'Branches and seats stay scoped per location, while enrolment and collections roll up across all of them.' },
  ],
  workflow: {
    kicker: 'Not a mock-up',
    title: 'These are the real coaching workflows, live today.',
    steps: [
      { title: '1 · Capture the enquiry', body: 'A walk-in or referral enters the CRM pipeline with a stage and a follow-up date. Same pipeline the MYR CRM product runs on.' },
      { title: '2 · Convert to student', body: 'On admission, a student record anchors attendance, fees, tests and portal access for everything that follows.' },
      { title: '3 · Take batch attendance', body: 'One mark per student per date. The system rejects duplicates instead of quietly corrupting a record.' },
      { title: '4 · Record fees', body: 'Payments sit against the fee and stop at the outstanding balance. Receipts get numbers. A voided receipt stays on file.' },
      { title: '5 · Run the test cycle', body: 'Schedule the exam, set the maximum, enter results per student, publish after review.' },
      { title: '6 · Open the portal, read the report', body: 'Guardian access activates when the invited email verifies. Collection and attendance reports roll up per branch without a single extra sheet.' },
    ],
  },
  faq: [
    {
      q: 'Can I try the coaching workflows myself?',
      a: 'The tour on this page simulates them, and the real workspace is one demo away. The difference: the tour runs on sample data in your browser, the workspace runs on your institute\'s data behind a subscription.',
    },
    {
      q: 'Does it handle multiple branches?',
      a: 'Branches are a real record, not a tag. Fees, attendance and reports scope per branch, and enrolment or collection reports roll up across all of them.',
    },
    {
      q: 'How do guardians get access?',
      a: 'An owner or admin sends an invite by email with a guardian or student role. Access activates when that email verifies its MYR account, and the owner can pull it any time. Both events are audited.',
    },
    ...BASE_FAQ,
  ],
  missionIds: ['pipeline', 'attendance', 'fees', 'exam-publish', 'portal', 'reports'],
  // Tour config for the interactive tour
  tour: {
    segmentId: 'coaching',
    title: 'MYR Coaching ERP Tour',
    intro: 'Welcome to the MYR Coaching Institute management platform. Take a guided tour of the features that power modern coaching institutes.',
    locations: [
      {
        id: 'reception',
        label: 'Reception & Admission Office',
        x: 15,
        y: 20,
        status: 'live',
        workflow: [
          'Greet walk-in enquirers and capture details in the CRM pipeline',
          'Assign admission stage and follow-up date',
          'Verify guardian/student MYR account before inviting',
        ],
        screen: {
          title: 'Reception & Admission',
          subtitle: 'Manage institute admissions',
          nav: ['Dashboard', 'Enquiries', 'Students', 'Batches'],
          active: 'Dashboard',
          stats: [
            { label: 'Active Enquiries', value: '47' },
            { label: 'Today\'s Admissions', value: '3' },
          ],
        },
      },
      {
        id: 'academic',
        label: 'Academic Administration',
        x: 35,
        y: 38,
        status: 'live',
        workflow: [
          'Create courses with subjects and academic details',
          'Set up batches and assign teachers',
          'Manage admission enquiries and follow-ups',
        ],
        screen: {
          title: 'Academic Administration',
          subtitle: 'Course and batch management',
          nav: ['Dashboard', 'Courses', 'Batches', 'Subjects'],
          active: 'Dashboard',
          stats: [
            { label: 'Active Courses', value: '12' },
            { label: 'Total Batches', value: '24' },
          ],
        },
      },
      {
        id: 'classrooms',
        label: 'Classrooms & Batches',
        x: 55,
        y: 22,
        status: 'live',
        workflow: [
          'Create new batches and assign teachers',
          'Mark attendance per student per date',
          'View batch schedules and faculty allocation',
        ],
        screen: {
          title: 'Classrooms & Batches',
          subtitle: 'Batch and timetable management',
          nav: ['Dashboard', 'Batches', 'Timetable', 'Attendance'],
          active: 'Dashboard',
          stats: [
            { label: 'Active Batches', value: '8' },
            { label: 'Students Enrolled', value: '247' },
          ],
        },
      },
      {
        id: 'faculty',
        label: 'Faculty Department',
        x: 75,
        y: 38,
        status: 'live',
        workflow: [
          'View assigned batches and subjects',
          'Mark attendance and take MCQ tests',
          'Enter marks and record assignments',
        ],
        screen: {
          title: 'Faculty Department',
          subtitle: 'Teacher workload and operations',
          nav: ['Dashboard', 'My Batches', 'Timetable', 'Attendance', 'Tests'],
          active: 'Dashboard',
          stats: [
            { label: 'My Batches', value: '3' },
            { label: 'Classes Today', value: '2' },
          ],
        },
      },
      {
        id: 'examinations',
        label: 'Examination Centre',
        x: 95,
        y: 20,
        status: 'live',
        workflow: [
          'Create MCQ tests using the question bank',
          'Schedule manual examinations',
          'Enter marks and publish results',
        ],
        screen: {
          title: 'Examination Centre',
          subtitle: 'Test and result management',
          nav: ['Dashboard', 'MCQ Tests', 'Manual Exams', 'Results'],
          active: 'Dashboard',
          stats: [
            { label: 'Pending Exams', value: '2' },
            { label: 'Published Results', value: '5' },
          ],
        },
      },
      {
        id: 'accounts',
        label: 'Accounts Department',
        x: 15,
        y: 55,
        status: 'live',
        workflow: [
          'Manage course fees, instalments and scholarships',
          'Generate receipts and track outstanding balances',
          'View batch-wise enrolment and revenue reports',
        ],
        screen: {
          title: 'Accounts Department',
          subtitle: 'Fee and payment management',
          nav: ['Dashboard', 'Fee Management', 'Receipts', 'Reports'],
          active: 'Dashboard',
          stats: [
            { label: 'Outstanding', value: '₹4.2L' },
            { label: 'Today\'s Collections', value: '₹1.8L' },
          ],
        },
      },
      {
        id: 'learning',
        label: 'Student Learning Centre',
        x: 35,
        y: 55,
        status: 'live',
        workflow: [
          'View personal dashboard and enrolled courses',
          'Check batch information and timetable',
          'View attendance history and MCQ assessments',
          'Access assignment and study materials',
          'View fee and payment information',
        ],
        screen: {
          title: 'Student Learning Centre',
          subtitle: 'Student portal overview',
          nav: ['Dashboard', 'Courses', 'Batch', 'Timetable', 'Attendance', 'Grades', 'Fees'],
          active: 'Dashboard',
          stats: [
            { label: 'Enrolled Courses', value: '5' },
            { label: 'Attendance', value: '92%' },
          ],
        },
      },
      {
        id: 'reports',
        label: 'Reports & Analytics Centre',
        x: 55,
        y: 55,
        status: 'live',
        workflow: [
          'Open institutional performance dashboard',
          'View batch-wise revenue and attendance reports',
          'Generate fee collection reports',
        ],
        screen: {
          title: 'Reports & Analytics',
          subtitle: 'Institutional performance dashboard',
          nav: ['Dashboard', 'Batch Reports', 'Revenue', 'Attendance', 'Exam Results'],
          active: 'Dashboard',
          stats: [
            { label: 'Revenue This Month', value: '₹12.5L' },
            { label: 'Batch Attendance Avg', value: '89%' },
          ],
        },
      },
    ],
    roles: [
      {
        id: 'owner',
        label: 'Institute Owner',
        blurb: 'Admissions, collections, branch performance, reports across every batch.',
        responsibilities: [
          { text: 'Institute registration and approval', status: 'live' },
          { text: 'Workspace activation', status: 'live' },
          { text: 'Subscription management', status: 'live' },
          { text: 'Platform revenue monitoring', status: 'live' },
          { text: 'Institutional monitoring', status: 'live' },
          { text: 'Support tickets', status: 'live' },
          { text: 'Platform-wide analytics', status: 'live' },
        ],
        screen: {
          title: 'Platform Administrator',
          subtitle: 'Full platform oversight',
          nav: ['Dashboard', 'Institutions', 'Branches', 'Users', 'Reports', 'Subscription'],
          active: 'Dashboard',
        },
      },
      {
        id: 'counsellor',
        label: 'Counsellor',
        blurb: 'Enquiry pipeline, follow-ups, demos, conversion to admissions.',
        responsibilities: [
          { text: 'Enquiry pipeline management', status: 'live' },
          { text: 'Follow-ups and demos', status: 'live' },
          { text: 'Conversion to admissions', status: 'live' },
        ],
        screen: {
          title: 'Counsellor',
          subtitle: 'Enquiry pipeline',
          nav: ['Dashboard', 'Enquiries', 'Students', 'Admissions'],
          active: 'Dashboard',
        },
      },
      {
        id: 'faculty',
        label: 'Faculty',
        blurb: 'Batch attendance, tests, results, day-to-day class operations.',
        responsibilities: [
          { text: 'Assigned batches', status: 'live' },
          { text: 'Assigned subjects', status: 'live' },
          { text: 'Timetable', status: 'live' },
          { text: 'Student attendance', status: 'live' },
          { text: 'MCQ tests', status: 'live' },
          { text: 'Manual examinations', status: 'live' },
          { text: 'Marks entry', status: 'live' },
          { text: 'Assignments', status: 'live' },
          { text: 'Study material', status: 'live' },
          { text: 'Salary information', status: 'scope' },
        ],
        screen: {
          title: 'Teacher',
          subtitle: 'Teacher dashboard',
          nav: ['Dashboard', 'My Batches', 'Timetable', 'Attendance', 'Tests', 'Marks', 'Assignments'],
          active: 'Dashboard',
        },
      },
      {
        id: 'student',
        label: 'Student / Guardian',
        blurb: 'Schedule, attendance, tests, results, fees, institute updates.',
        responsibilities: [
          { text: 'Personal dashboard', status: 'live' },
          { text: 'Enrolled courses', status: 'live' },
          { text: 'Batch information', status: 'live' },
          { text: 'Timetable', status: 'live' },
          { text: 'Attendance history', status: 'live' },
          { text: 'MCQ assessments', status: 'live' },
          { text: 'Examination marks', status: 'live' },
          { text: 'Assignments', status: 'live' },
          { text: 'Study materials', status: 'live' },
          { text: 'Fee and payment information', status: 'live' },
          { text: 'Notifications', status: 'live' },
        ],
        screen: {
          title: 'Student',
          subtitle: 'Personal learning dashboard',
          nav: ['Dashboard', 'Courses', 'Batch', 'Timetable', 'Attendance', 'Grades', 'Exams', 'Assignments', 'Fees', 'Notifications'],
          active: 'Dashboard',
        },
      },
    ],
    missions: [
      {
        id: 'pipeline',
        ordinal: 'Mission 01',
        title: 'Institution Setup',
        brief: 'Register an institute and demonstrate approval by the platform administrator.',
        status: 'live',
        xp: 100,
        badge: 'Institution Registered',
        kind: 'form',
        fields: [
          { name: 'instituteName', label: 'Institute Name', kind: 'text', required: true, placeholder: 'My Coaching Institute' },
          { name: 'address', label: 'Address', kind: 'text', placeholder: 'Street, City, State' },
          { name: 'contact', label: 'Contact Number', kind: 'text', placeholder: '+91 98765 43210' },
        ],
        successTitle: 'Institution Registered',
        successBody: 'Your institute has been registered and approved by the platform administrator.',
      },
      {
        id: 'course',
        ordinal: 'Mission 02',
        title: 'Create a Course',
        brief: 'Create a course with subjects and academic details.',
        status: 'live',
        xp: 150,
        badge: 'Course Created',
        kind: 'form',
        fields: [
          { name: 'courseName', label: 'Course Name', kind: 'text', required: true, placeholder: 'Physics Coaching' },
          { name: 'duration', label: 'Duration (months)', kind: 'number', required: true, placeholder: '12' },
          { name: 'subjects', label: 'Subjects', kind: 'select', options: [{ value: 'physics', label: 'Physics' }, { value: 'maths', label: 'Mathematics' }, { value: 'chemistry', label: 'Chemistry' }], required: true, placeholder: 'Select subjects' },
        ],
        successTitle: 'Course Created',
        successBody: 'Your course has been created with subjects and academic details.',
      },
      {
        id: 'batch',
        ordinal: 'Mission 03',
        title: 'Create a Batch',
        brief: 'Create a new batch and assign a teacher.',
        status: 'live',
        xp: 150,
        badge: 'Batch Created',
        kind: 'form',
        fields: [
          { name: 'batchName', label: 'Batch Name', kind: 'text', required: true, placeholder: 'Batch A - 2024' },
          { name: 'course', label: 'Course', kind: 'select', options: [{ value: 'physics', label: 'Physics' }, { value: 'maths', label: 'Mathematics' }, { value: 'chemistry', label: 'Chemistry' }], required: true, placeholder: 'Select course' },
          { name: 'teacher', label: 'Assigned Teacher', kind: 'text', required: true, placeholder: 'Mr. Sharma' },
        ],
        successTitle: 'Batch Created',
        successBody: 'Your new batch has been created and a teacher has been assigned.',
      },
      {
        id: 'admission',
        ordinal: 'Mission 04',
        title: 'Student Admission',
        brief: 'Register a new student and enrol them in the batch.',
        status: 'live',
        xp: 200,
        badge: 'Student Enrolled',
        kind: 'form',
        fields: [
          { name: 'studentName', label: 'Student Name', kind: 'text', required: true, placeholder: 'Arjun Patel' },
          { name: 'batch', label: 'Enrolled Batch', kind: 'select', required: true, placeholder: 'Batch A - 2024' },
          { name: 'guardianEmail', label: 'Guardian Email', kind: 'email', required: true, placeholder: 'guardian@example.com' },
        ],
        successTitle: 'Student Enrolled',
        successBody: 'The student has been registered and enrolled in the batch. Guardian access will activate upon email verification.',
      },
      {
        id: 'attendance',
        ordinal: 'Mission 05',
        title: 'Attendance',
        brief: 'Mark attendance and display an attendance summary.',
        status: 'live',
        xp: 100,
        badge: 'Attendance Marked',
        kind: 'roster',
        roster: [
          { id: 's1', name: 'Arjun Patel', meta: 'Batch A - 2024' },
          { id: 's2', name: 'Sneha Roy', meta: 'Batch A - 2024' },
          { id: 's3', name: 'Rohit Sharma', meta: 'Batch A - 2024' },
        ],
        successTitle: 'Attendance Updated',
        successBody: 'Attendance has been marked for the batch.',
      },
      {
        id: 'mcq-test',
        ordinal: 'Mission 06',
        title: 'MCQ Examination',
        brief: 'Create an MCQ test using the question bank.',
        status: 'live',
        xp: 200,
        badge: 'Test Published',
        kind: 'publish',
        exams: [
          { value: 'Physics Test', label: 'Physics Test', maxMarks: 50 },
          { value: 'Maths Quiz', label: 'Maths Quiz', maxMarks: 40 },
        ],
        pending: [
          { id: '1', name: 'Physics Test', marks: '45/50', max: '50' },
        ],
        successTitle: 'Test Published',
        successBody: 'The MCQ test has been created and results published.',
      },
      {
        id: 'result',
        ordinal: 'Mission 07',
        title: 'Result',
        brief: 'Show marks, performance and student progress.',
        status: 'live',
        xp: 150,
        badge: 'Results Published',
        kind: 'checklist',
        checklist: [
          { id: 'c1', text: 'Review topic-wise performance', meta: 'Compare across batches' },
          { id: 'c2', text: 'Publish results to students/guardians', meta: 'Activation required' },
          { id: 'c3', text: 'Generate performance reports', meta: 'Roll up per branch' },
        ],
        successTitle: 'Results Published',
        successBody: 'Marks, performance and student progress are now visible.',
      },
      {
        id: 'fee',
        ordinal: 'Mission 08',
        title: 'Fee Collection',
        brief: 'Generate a simulated student fee receipt.',
        status: 'live',
        xp: 150,
        badge: 'Receipt Generated',
        kind: 'receipt',
        fees: [
          { value: '₹5,000', label: 'Course Fee', outstanding: 0 },
          { value: '₹2,000', label: 'Examination Fee', outstanding: 500 },
        ],
        successTitle: 'Receipt Generated',
        successBody: 'A simulated student fee receipt has been generated.',
      },
      {
        id: 'faculty-ops',
        ordinal: 'Mission 09',
        title: 'Faculty Operations',
        brief: 'Show teacher workload and payroll information.',
        status: 'scope',
        xp: 100,
        badge: 'Faculty Workload',
        kind: 'form',
        fields: [
          { name: 'teacherName', label: 'Teacher Name', kind: 'text', required: true, placeholder: 'Mr. Rajesh Sharma' },
          { name: 'batches', label: 'Assigned Batches', kind: 'number', required: true, placeholder: '3' },
          { name: 'salary', label: 'Monthly Salary', kind: 'number', required: true, placeholder: '60000' },
        ],
        successTitle: 'Faculty Operations Updated',
        successBody: 'Teacher workload and payroll information has been updated.',
      },
      {
        id: 'analytics',
        ordinal: 'Mission 10',
        title: 'Institution Analytics',
        brief: 'Open a complete institutional performance dashboard.',
        status: 'live',
        xp: 250,
        badge: 'Analytics Opened',
        kind: 'chart',
        successTitle: 'Analytics Dashboard Opened',
        successBody: 'The complete institutional performance dashboard is now open.',
      },
    ],
  },
}

export const SEGMENTS: Record<SegmentId, SegmentConfig> = {
  school: SCHOOL_SEGMENT,
  college: COLLEGE_SEGMENT,
  coaching: COACHING_SEGMENT,
}

export const SEGMENT_LIST = [SCHOOL_SEGMENT, COLLEGE_SEGMENT, COACHING_SEGMENT]

/* Modules page matrix. */
export type PlatformGroup = { title: string; blurb: string; items: ModuleItem[] }

export const PLATFORM_GROUPS: PlatformGroup[] = [
  {
    title: 'Coaching ERP workspace',
    blurb: 'Running in the MYR product today. Book a demo and use it with your own data.',
    items: [
      { name: 'Student admissions and records', status: 'live' },
      { name: 'Branches with seat-level scoping', status: 'live' },
      { name: 'Fees, partial payments and receipts', status: 'live' },
      { name: 'Attendance, one mark per student per day', status: 'live' },
      { name: 'Exams and result publishing', status: 'live' },
      { name: 'Guardian and student portal access', status: 'live' },
      { name: 'Collection and attendance reports', status: 'live' },
    ],
  },
  {
    title: 'CRM (lead management)',
    blurb: 'The same pipeline the education admission flow runs on.',
    items: [
      { name: 'Lead records with pipeline stages', status: 'live' },
      { name: 'Follow-up scheduling', status: 'live' },
      { name: 'Appointment booking', status: 'live' },
      { name: 'Team assignment and conversion reports', status: 'live' },
    ],
  },
  {
    title: 'HRM (staff operations)',
    blurb: 'For teacher and staff administration.',
    items: [
      { name: 'Employee records and onboarding status', status: 'live' },
      { name: 'Shifts and leave requests', status: 'live' },
      { name: 'Private staff document storage', status: 'live' },
      { name: 'Headcount and department reports', status: 'live' },
    ],
  },
  {
    title: 'Platform foundation',
    blurb: 'The account, tenancy and billing layer everything sits on.',
    items: [
      { name: 'Verified-email accounts and role-based workspaces', status: 'live' },
      { name: 'Entitlements and plan limits', status: 'live' },
      { name: 'Invoices and billing history', status: 'live' },
      { name: 'Support tickets and knowledge base', status: 'live' },
    ],
  },
  {
    title: 'School-specific scope',
    blurb: 'Configured per institution with MYR. Not shipped features, and we do not present them as such.',
    items: [
      { name: 'Transport routes and fleet records', status: 'scope' },
      { name: 'Hostel and house management', status: 'scope' },
      { name: 'Library catalog and issue tracking', status: 'scope' },
      { name: 'Lesson plans, homework and notice boards', status: 'scope' },
      { name: 'Certificates, ID cards and transfer records', status: 'scope' },
    ],
  },
  {
    title: 'College-specific scope',
    blurb: 'Configured per institution with MYR. Not shipped features, and we do not present them as such.',
    items: [
      { name: 'Online Admission & Enquiry CRM', status: 'scope' },
      { name: 'Student Information System', status: 'scope' },
      { name: 'Department & Course Management', status: 'scope' },
      { name: 'Semester & Academic Management', status: 'scope' },
      { name: 'Faculty & Staff Management', status: 'scope' },
      { name: 'Attendance Management', status: 'scope' },
      { name: 'Timetable Management', status: 'scope' },
      { name: 'Examination & Result Management', status: 'live' },
      { name: 'Internal Assessment', status: 'live' },
      { name: 'Fee & Finance Management', status: 'live' },
      { name: 'Library Management', status: 'scope' },
      { name: 'Hostel Management', status: 'scope' },
      { name: 'Placement Management', status: 'scope' },
      { name: 'Certificates & Documents', status: 'scope' },
      { name: 'Student Portal', status: 'live' },
      { name: 'Reports & Analytics', status: 'live' },
    ],
  },
]

export const MODULES_FAQ: FaqItem[] = [
  {
    q: 'What does Live in workspace mean?',
    a: 'The workflow is built and running in the MYR product today. It sits behind a workspace subscription with tenant-scoped data, role-based access and an audit history. A demo shows it working with your own scenarios.',
  },
  {
    q: 'What does Configurable scope mean?',
    a: 'It is part of how MYR scopes and delivers an education ERP for a specific institution, agreed before build. These pages describe capability scope honestly. They are not claims about shipped software.',
  },
  {
    q: 'How does pricing work?',
    a: 'MYR quotes it against your institution size and module selection. We do not publish fixed numbers on these pages because the answer genuinely depends on what you need. Use Request pricing and you will get real commercial terms.',
  },
  ...BASE_FAQ,
]

export type SegmentLink = { href: string; ready: boolean }
export const SEGMENT_LINKS: Record<string, SegmentLink> = {
  school: { href: "/education-erp/school/", ready: true },
  college: { href: "/education-erp/college/", ready: true },
  coaching: { href: "/education-erp/#segment-coaching", ready: false },
  modules: { href: "/education-erp/modules/", ready: true },
}


export const COLLEGE_TOUR: TourConfig = {
  segmentId: "college",
  title: "Virtual College",
  intro: 'Pick a college department to explore its sample workflow. This tour runs entirely in your browser.',
  locations: [
    {
      id: 'admissions', label: 'Admissions & Registrar', x: 16, y: 22, status: 'live',
      workflow: ['Capture enquiries and applications in one admissions pipeline.', 'Track each applicant through review and enrollment stages.', 'Keep document verification and follow-up scope visible to the registrar.'],
      screen: {
        title: 'Admissions · Applicant pipeline', subtitle: 'Academic year 2026–27', nav: ['Overview', 'Enquiries', 'Applications', 'Documents', 'Reports'], active: 'Applications',
        stats: [{ label: 'New enquiries', value: '24' }, { label: 'In review', value: '12' }, { label: 'Enrolled', value: '38' }],
        table: { columns: ['Applicant', 'Program', 'Stage', 'Next step'], rows: [['Aarav Mehta', 'B.Tech · CSE', 'In review', 'Documents'], ['Ananya Iyer', 'B.Tech · EEE', 'Enquiry', 'Campus visit'], ['Dev Patel', 'MBA', 'Enrolled', 'Complete']] },
        note: 'Admissions records and the applicant pipeline use sample data in this preview.',
      },
    },
    {
      id: 'departments', label: 'Academic Departments', x: 38, y: 14, status: 'scope',
      workflow: ['Organize programs, departments, courses and academic sessions.', 'Review faculty assignments and department-level reports.', 'Agree institution-specific structure during implementation.'],
      screen: {
        title: 'Departments · Academic structure', subtitle: 'Session 2026–27', nav: ['Departments', 'Programs', 'Courses', 'Sessions', 'Reports'], active: 'Departments',
        stats: [{ label: 'Departments', value: '9' }, { label: 'Programs', value: '24' }, { label: 'Open reviews', value: '3' }],
        table: { columns: ['Department', 'HOD', 'Programs', 'Status'], rows: [['Computer Science', 'Dr. Rao', '6', 'Active'], ['Commerce', 'Prof. Shah', '4', 'Review'], ['Management', 'Dr. Nair', '3', 'Active']] },
        note: 'Department and academic-session setup is configurable scope.',
      },
    },
    {
      id: 'faculty', label: 'Faculty Workspace', x: 63, y: 17, status: 'live',
      workflow: ['Open assigned courses and class lists.', 'Record attendance for a course meeting.', 'Enter internal assessment marks for review.'],
      screen: {
        title: 'Faculty · My teaching day', subtitle: 'Prof. Sharma · CSE', nav: ['My day', 'Courses', 'Attendance', 'Assessments', 'Marks'], active: 'My day',
        stats: [{ label: 'Courses today', value: '5' }, { label: 'Attendance pending', value: '2' }, { label: 'Marks to review', value: '18' }],
        lines: [{ title: 'Data Structures · Sem III', meta: '09:00 AM · Room 204', status: 'Next' }, { title: 'Attendance · CSE-A', meta: '32 students', status: 'Pending' }, { title: 'Internal assessment', meta: 'Marks entry', status: 'Due today' }],
        note: 'Assigned subjects, attendance and marks entry are live workflows; the screen is a sample preview.',
      },
    },
    {
      id: 'examinations', label: 'Examination Cell', x: 84, y: 31, status: 'live',
      workflow: ['Schedule examinations and enter marks against a maximum.', 'Review pending results before publishing.', 'Make published results available in the student portal.'],
      screen: {
        title: 'Examinations · Result review', subtitle: 'Semester III · Term 1', nav: ['Schedule', 'Marks entry', 'Review', 'Results', 'Transcripts'], active: 'Review',
        stats: [{ label: 'Exams scheduled', value: '18' }, { label: 'Awaiting review', value: '6' }, { label: 'Published', value: '12' }],
        table: { columns: ['Course', 'Assessment', 'Entries', 'Status'], rows: [['Data Structures', 'Internal 1', '32 / 32', 'Review'], ['Economics', 'Mid-term', '28 / 30', 'In progress'], ['Accounting', 'Quiz 2', '45 / 45', 'Published']] },
        note: 'Marks, review and result publishing are live workflows; this sample uses fictional records.',
      },
    },
    {
      id: 'accounts', label: 'Accounts Office', x: 15, y: 58, status: 'live',
      workflow: ['Set fee records by program and semester.', 'Record payments against outstanding balances.', 'Issue receipts and review collection reports.'],
      screen: {
        title: 'Accounts · Semester collections', subtitle: 'Counter 1', nav: ['Overview', 'Fee records', 'Receipts', 'Dues', 'Reports'], active: 'Receipts',
        stats: [{ label: 'Collected today', value: '₹84,500' }, { label: 'Open dues', value: '₹1,26,000' }, { label: 'Receipts issued', value: '17' }],
        table: { columns: ['Receipt', 'Student', 'Fee head', 'Amount'], rows: [['RCPT-4TK21', 'Aarav Mehta', 'Semester fee', '₹12,000'], ['RCPT-7QL08', 'Myra Das', 'Library fee', '₹1,200'], ['RCPT-2NP54', 'Dev Patel', 'Semester fee', '₹8,500']] },
        note: 'Fee records, receipts and financial reporting use live workflows with sample data here.',
      },
    },
    {
      id: 'library', label: 'Library', x: 35, y: 68, status: 'live',
      workflow: ['Search the catalog and check copy availability.', 'Record an issue or return against a student.', 'Review circulation and overdue information.'],
      screen: {
        title: 'Library · Circulation desk', subtitle: 'Catalog and issue / return', nav: ['Catalog', 'Issue / Return', 'Overdue', 'Stock'], active: 'Issue / Return',
        stats: [{ label: 'Titles listed', value: '1,240' }, { label: 'Issued today', value: '34' }, { label: 'Overdue', value: '9' }],
        table: { columns: ['Accession', 'Title', 'Borrower', 'Due'], rows: [['ACC-2214', 'Database Systems', 'Aarav Mehta', '12 Nov'], ['ACC-0871', 'Microeconomics', 'Ananya Iyer', '10 Nov'], ['ACC-3390', 'Business Ethics', 'Dev Patel', '08 Nov']] },
        note: 'Library catalog and circulation screens are sample views of the live workflow.',
      },
    },
    {
      id: 'student-services', label: 'Student Services', x: 59, y: 70, status: 'live',
      workflow: ['Give students a scoped view of their academic profile and semester.', 'Show attendance, examination results and fee status together.', 'Keep each student’s records private to their own account.'],
      screen: {
        title: 'Student portal · My semester', subtitle: 'Myra Das · B.Com · Semester IV', nav: ['Home', 'Courses', 'Attendance', 'Results', 'Fees'], active: 'Home',
        stats: [{ label: 'Attendance', value: '92%' }, { label: 'Results posted', value: '3' }, { label: 'Fee status', value: 'Clear' }],
        lines: [{ title: 'Financial Accounting · Internal 1', meta: 'Published · 18 Oct', status: 'View result' }, { title: 'Semester fee receipt', meta: '₹12,000 · 28 Oct', status: 'Paid' }, { title: 'Course registration', meta: 'Semester IV', status: 'Complete' }],
        note: 'Academic profile, attendance, results and fee status are live student views.',
      },
    },
    {
      id: 'placements', label: 'Placement & Career Centre', x: 84, y: 57, status: 'scope',
      workflow: ['Maintain company and placement-drive information.', 'Review eligibility and student applications.', 'Track interviews and outcomes by drive.'],
      screen: {
        title: 'Placement · Drive overview', subtitle: 'Season 2026', nav: ['Drives', 'Companies', 'Eligibility', 'Applications', 'Outcomes'], active: 'Drives',
        stats: [{ label: 'Active drives', value: '5' }, { label: 'Company records', value: '47' }, { label: 'Applications', value: '126' }],
        table: { columns: ['Drive', 'Role', 'Applications', 'Stage'], rows: [['Autumn intake', 'Graduate trainee', '42', 'Shortlisting'], ['Campus hiring', 'Analyst', '31', 'Applications'], ['Internship week', 'Developer intern', '53', 'Scheduled']] },
        note: 'Placement and career workflows are configurable scope, confirmed with MYR during planning.',
      },
    },
  ],
  roles: [
    {
      id: 'admin',
      label: 'College Administrator',
      blurb: 'Institution configuration, department management, course management, staff and student records, academic session management, branch management.',
      responsibilities: [
        { text: 'Institution configuration', status: 'scope' },
        { text: 'Department management', status: 'scope' },
        { text: 'Course management', status: 'scope' },
        { text: 'Staff and student records', status: 'scope' },
        { text: 'Academic session management', status: 'scope' },
        { text: 'Branch management', status: 'scope' },
      ],
      screen: {
        title: 'Administrator · Institution overview',
        subtitle: 'Riverside College',
        nav: ['Dashboard', 'Departments', 'Courses', 'Staff', 'Sessions', 'Reports'],
        active: 'Dashboard',
        stats: [
          { label: 'Departments', value: '9' },
          { label: 'Faculty', value: '41' },
          { label: 'Students', value: '2,140' },
        ],
        table: {
          columns: ['Task', 'Owner', 'Due', 'Status'],
          rows: [
            ['Config init · IT', 'Admin desk', '04 Nov', 'In progress'],
            ['HOD allocation', 'Admin', '05 Nov', 'Open'],
            ['Session setup', 'Registrar', '07 Nov', 'Review'],
        ]},
      },
    },
    {
      id: 'principal',
      label: 'Principal / Director',
      blurb: 'Institutional analytics, department performance, student statistics, fee and revenue reports, examination performance.',
      responsibilities: [
        { text: 'Institutional analytics', status: 'live' },
        { text: 'Department performance', status: 'scope' },
        { text: 'Student statistics', status: 'scope' },
        { text: 'Fee and revenue reports', status: 'live' },
        { text: 'Examination performance', status: 'live' },
      ],
      screen: {
        title: 'Principal · College report',
        subtitle: 'Academic Year 2026–27',
        nav: ['Overview', 'Departments', 'Faculty', 'Finance', 'Exams'],
        active: 'Overview',
        stats: [
          { label: 'Departments active', value: '6' },
          { label: 'Faculty positions', value: '18' },
          { label: 'Students enrolled', value: '2,140' },
        ],
        table: {
          columns: ['Indicator', 'This Year', 'Last Year'],
          rows: [
            ['Student intake', '1,840', '1,760'],
            ['Course completion', '85%', '82%'],
            ['Fee collection progress', '87%', '82%'],
        ]},
      },
    },
    {
      id: 'hod',
      label: 'HOD',
      blurb: 'Department management, faculty allocation, subject management, timetable coordination, department reports.',
      responsibilities: [
        { text: 'Department management', status: 'scope' },
        { text: 'Faculty allocation', status: 'scope' },
        { text: 'Subject management', status: 'scope' },
        { text: 'Timetable coordination', status: 'scope' },
        { text: 'Department reports', status: 'live' },
      ],
      screen: {
        title: 'HOD · Department dashboard',
        subtitle: 'Computer Science Department',
        nav: ['Overview', 'Faculty', 'Subjects', 'Timetable', 'Reports'],
        active: 'Overview',
        stats: [
          { label: 'Faculty positions', value: '9 / 9' },
          { label: 'Courses running', value: '24' },
          { label: 'Students enrolled', value: '520' },
        ],
        table: {
          columns: ['Department', 'Faculty', 'Courses', 'Enrolled'],
          rows: [
            ['CSE', '8 / 8', '24', '520'],
            ['EEE', '5 / 5', '18', '340'],
            ['MBA', '3 / 3', '12', '180'],
        ]},
      },
    },
    {
      id: 'faculty',
      label: 'Faculty',
      blurb: 'Assigned subjects, student attendance, assignments, internal assessments, marks entry, student progress.',
      responsibilities: [
        { text: 'Assigned subjects', status: 'live' },
        { text: 'Student attendance', status: 'live' },
        { text: 'Assignments', status: 'scope' },
        { text: 'Internal assessments', status: 'live' },
        { text: 'Marks entry', status: 'live' },
        { text: 'Student progress', status: 'scope' },
      ],
      screen: {
        title: 'Faculty · My day',
        subtitle: 'Prof. Sharma · CSE dept',
        nav: ['My day', 'Classes', 'Attendance', 'Assignments', 'Marks'],
        active: 'My day',
        stats: [
          { label: 'Classes today', value: '5' },
          { label: 'Attendance pending', value: '2' },
          { label: 'Marks to enter', value: 'Maths' },
        ],
        lines: [
          { title: '8-B · Attendance', meta: 'Period 1', status: 'Done' },
          { title: '7-A · Attendance', meta: 'Period 3', status: 'Pending' },
          { title: 'Maths · Term test marks', meta: '8-B · 32 students', status: 'Due today' },
        ],
        note: 'Assigned classes, attendance and marks entry are live. Timetable and homework are implementation scope.',
      },
    },
    {
      id: 'student',
      label: 'Student',
      blurb: 'Academic profile, semester information, course registration, attendance, assignments, examination schedules, results, fee status.',
      responsibilities: [
        { text: 'Academic profile', status: 'live' },
        { text: 'Semester information', status: 'live' },
        { text: 'Course registration', status: 'scope' },
        { text: 'Attendance', status: 'live' },
        { text: 'Assignments', status: 'scope' },
        { text: 'Examination schedules', status: 'live' },
        { text: 'Results', status: 'live' },
        { text: 'Fee status', status: 'live' },
      ],
      screen: {
        title: 'Student · My dashboard',
        subtitle: 'Myra Das · Class 8-B',
        nav: ['Home', 'Attendance', 'Results', 'Fees', 'Notices'],
        active: 'Home',
        stats: [
          { label: 'Attendance', value: '96%' },
          { label: 'New results', value: '2' },
          { label: 'Fee status', value: 'Clear' },
        ],
        lines: [
          { title: 'Fee receipt RCPT-9KD04', meta: '28 Oct · ₹ 8,500', status: 'Paid' },
          { title: 'Attendance · October', meta: '22 of 23 days present', status: '96%' },
          { title: 'PTM invitation', meta: 'Saturday 9:30 AM', status: 'New' },
        ],
        note: 'Attendance, fee status and results views are live through portal access. Broadcast announcements are configurable scope.',
      },
    },
    {
      id: 'accountant',
      label: 'Accountant',
      blurb: 'Fee structures, semester-wise fees, receipts, pending payments, financial reporting.',
      responsibilities: [
        { text: 'Fee structures', status: 'live' },
        { text: 'Semester-wise fees', status: 'live' },
        { text: 'Receipts', status: 'live' },
        { text: 'Pending payments', status: 'scope' },
        { text: 'Financial reporting', status: 'live' },
      ],
      screen: {
        title: 'Accountant · Collection desk',
        subtitle: 'Counter 1',
        nav: ['Collect', 'Receipts', 'Dues', 'Concessions', 'Reports'],
        active: 'Collect',
        stats: [
          { label: 'Collected today', value: '₹ 84,500' },
          { label: 'Receipts', value: '17' },
          { label: 'Dues open', value: '₹ 1,26,000' },
        ],
        table: {
          columns: ['Student', 'Fee head', 'Outstanding', 'Action'],
          rows: [
            ['Aarav Mehta', 'Term fee', '₹ 3,500', 'Record payment'],
            ['Myra Das', 'Transport', '₹ 1,200', 'Record payment'],
            ['Dev Patel', 'Term fee', '₹ 0', 'Clear'],
        ]},
      },
    },
    {
      id: 'counsellor',
      label: 'Admission Counsellor',
      blurb: 'Enquiries, admission applications, follow-ups, document verification, admission conversion.',
      responsibilities: [
        { text: 'Enquiries', status: 'live' },
        { text: 'Admission applications', status: 'live' },
        { text: 'Follow-ups', status: 'scope' },
        { text: 'Document verification', status: 'scope' },
        { text: 'Admission conversion', status: 'scope' },
      ],
      screen: {
        title: 'Admission · Application pipeline',
        subtitle: 'Cycle 2026–27',
        nav: ['Overview', 'Enquiries', 'Applications', 'Follow-ups', 'Conversion'],
        active: 'Enquiries',
        stats: [
          { label: 'New enquiries today', value: '24' },
          { label: 'Applications in review', value: '12' },
          { label: 'Admissions confirmed', value: '38' },
        ],
        table: {
          columns: ['Applicant', 'Applied for', 'Stage', 'Follow-up'],
          rows: [
            ['Aarav Mehta', 'B. Tech CSE', 'In review', 'Documents pending'],
            ['Ananya Iyer', 'B. Tech EEE', 'Enquiry', 'Campus visit Fri'],
            ['Dev Patel', 'MBA', 'Enrolled', 'Complete'],
        ]},
      },
    },
    {
      id: 'placement',
      label: 'Placement Officer',
      blurb: 'Company records, placement drives, student eligibility, applications, placement tracking.',
      responsibilities: [
        { text: 'Company records', status: 'scope' },
        { text: 'Placement drives', status: 'scope' },
        { text: 'Student eligibility', status: 'scope' },
        { text: 'Placement applications', status: 'scope' },
        { text: 'Placement tracking', status: 'scope' },
      ],
      screen: {
        title: 'Placement · Drives',
        subtitle: 'Season 2026',
        nav: ['Drives', 'Company records', 'Eligibility', 'Applications', 'Tracking'],
        active: 'Drives',
        stats: [
          { label: 'Active drives', value: '5' },
          { label: 'Companies', value: '47' },
          { label: 'Students eligible', value: '1,840' },
        ],
        table: {
          columns: ['Drive', 'Company', 'Roles', 'Applications'],
          rows: [
            ['Drive 1', 'TechCorp', '5 roles', '30 applications'],
            ['Drive 2', 'FinanceInc', '3 roles', '12 applications'],
        ]},
      },
    },
  ],
  missions: [
    {
      id: 'college-admission', ordinal: 'Mission 1', title: 'Review a program application',
      brief: 'Add an applicant to the program pipeline and set the next review step.',
      status: 'scope', xp: 100, badge: 'Registrar', kind: 'form',
      fields: [
        { name: 'student', label: 'Applicant name', kind: 'text', required: true, placeholder: 'e.g. Aisha Kapoor' },
        { name: 'email', label: 'Applicant email', kind: 'email', required: true, placeholder: 'applicant@example.com' },
        { name: 'program', label: 'Program', kind: 'select', required: true, options: [{ value: 'cse', label: 'B.Tech · Computer Science' }, { value: 'commerce', label: 'B.Com · Accounting' }, { value: 'mba', label: 'MBA · Management' }] },
      ],
      successTitle: 'Application added to review',
      successBody: 'The sample applicant is attached to a program pipeline. Admissions setup and document review are configurable scope; this stays in your browser.',
    },
    {
      id: 'college-course-allocation', ordinal: 'Mission 2', title: 'Plan a department course',
      brief: 'Choose a department, course and faculty member for a sample semester plan.',
      status: 'scope', xp: 80, badge: 'Academic Planner', kind: 'form',
      fields: [
        { name: 'department', label: 'Department', kind: 'select', required: true, options: [{ value: 'cse', label: 'Computer Science' }, { value: 'commerce', label: 'Commerce' }, { value: 'management', label: 'Management' }] },
        { name: 'course', label: 'Course', kind: 'text', required: true, placeholder: 'e.g. Data Structures · Semester III' },
        { name: 'faculty', label: 'Faculty member', kind: 'text', required: true, placeholder: 'e.g. Prof. Sharma' },
      ],
      successTitle: 'Course plan saved in the demo',
      successBody: 'Department and faculty allocation are institution-specific configuration scope. No college record is created or sent to MYR.',
    },
    {
      id: 'college-attendance', ordinal: 'Mission 3', title: 'Mark course attendance',
      brief: 'Mark each student present, absent or late for a sample lecture.',
      status: 'live', xp: 120, badge: 'Attendance Keeper', kind: 'roster',
      roster: [
        { id: 'c1', name: 'Aarav Mehta', meta: 'Roll 01 · CSE-A' },
        { id: 'c2', name: 'Ananya Iyer', meta: 'Roll 02 · CSE-A' },
        { id: 'c3', name: 'Dev Patel', meta: 'Roll 03 · CSE-A' },
        { id: 'c4', name: 'Ishita Rao', meta: 'Roll 04 · CSE-A' },
        { id: 'c5', name: 'Kabir Singh', meta: 'Roll 05 · CSE-A' },
      ],
      successTitle: 'Attendance submitted for CSE-A',
      successBody: 'The live attendance workflow records one mark per student and date. These names and marks are sample data stored only in your browser.',
    },
    {
      id: 'college-fee-receipt', ordinal: 'Mission 4', title: 'Record a semester fee payment',
      brief: 'Record a payment against an outstanding semester fee. Overpayments are blocked.',
      status: 'live', xp: 120, badge: 'Fee Collector', kind: 'receipt',
      fees: [
        { value: 'cfee1', label: 'Aarav Mehta · Semester III fee', outstanding: 12000 },
        { value: 'cfee2', label: 'Myra Das · Library fee', outstanding: 1200 },
        { value: 'cfee3', label: 'Dev Patel · Examination fee', outstanding: 3500 },
      ],
      successTitle: 'Receipt issued, balance updated',
      successBody: 'The fee workflow records receipts and updates the outstanding balance. This simulated payment does not move real funds.',
    },
    {
      id: 'college-marks-entry', ordinal: 'Mission 5', title: 'Enter internal assessment marks',
      brief: 'Enter one score and check it against the assessment maximum.',
      status: 'live', xp: 110, badge: 'Marks Entry Clerk', kind: 'marks',
      exams: [
        { value: 'c-maths', label: 'Statistics · Internal 1', maxMarks: 50 },
        { value: 'c-data', label: 'Data Structures · Mid-term', maxMarks: 100 },
        { value: 'c-accounting', label: 'Financial Accounting · Quiz', maxMarks: 25 },
      ],
      successTitle: 'Marks saved for review',
      successBody: 'Scores above the maximum are rejected, and marks remain pending review until an authorized user publishes results.',
    },
    {
      id: 'college-result-publish', ordinal: 'Mission 6', title: 'Publish semester results',
      brief: 'Review pending marks and publish them to the student portal.',
      status: 'live', xp: 130, badge: 'Result Publisher', kind: 'publish',
      pending: [
        { id: 'cr1', name: 'Aarav Mehta · Data Structures', marks: '86', max: '100' },
        { id: 'cr2', name: 'Ananya Iyer · Statistics', marks: '44', max: '50' },
      ],
      successTitle: 'Results published to student records',
      successBody: 'Published results appear in the scoped student view. The sample records remain in this browser and are not shared across accounts.',
    },
    {
      id: 'college-placement-review', ordinal: 'Mission 7', title: 'Review a placement drive checklist',
      brief: 'Check the setup items for a sample campus recruitment drive.',
      status: 'scope', xp: 90, badge: 'Career Coordinator', kind: 'checklist',
      checklist: [
        { id: 'company', text: 'Company profile reviewed', meta: 'Company records · scope' },
        { id: 'eligibility', text: 'Student eligibility criteria confirmed', meta: 'Eligibility rules · scope' },
        { id: 'schedule', text: 'Interview schedule shared with applicants', meta: 'Drive coordination · scope' },
      ],
      successTitle: 'Drive checklist complete',
      successBody: 'Placement and career workflows are configurable scope. This checklist is a browser-only planning demo.',
    },
  ],
}

export type CollegeModule = {
  id: string
  title: string
  status: ModuleStatus
  body: string
  preview: SimPreview
  note?: string
}

export const collegeModules: CollegeModule[] = [
  {
    id: 'administration', title: 'Institution Administration', status: 'scope',
    body: 'Configure departments, programs, academic sessions and campus records around the institution’s structure.',
    preview: { kind: 'table', columns: ['Department', 'Programs', 'Session', 'Status'], rows: [['Computer Science', '6', '2026–27', 'Active'], ['Commerce', '4', '2026–27', 'Review'], ['Management', '3', '2026–27', 'Active']] },
    note: 'Institution setup is configurable scope.',
  },
  {
    id: 'admissions', title: 'Admissions & Applications', status: 'live',
    body: 'Track enquiries and applications from first contact through review and enrollment.',
    preview: { kind: 'list', items: [{ title: 'Aarav Mehta', meta: 'B.Tech · CSE', status: 'In review' }, { title: 'Ananya Iyer', meta: 'B.Tech · EEE', status: 'Enquiry' }, { title: 'Dev Patel', meta: 'MBA', status: 'Enrolled' }] },
    note: 'Admissions records and pipeline are live workflows.',
  },
  {
    id: 'academics', title: 'Academic Departments', status: 'scope',
    body: 'Coordinate HODs, faculty allocation, course offerings and department-level reporting.',
    preview: { kind: 'table', columns: ['Department', 'Faculty', 'Courses', 'Review'], rows: [['CSE', '9', '24', 'Ready'], ['EEE', '7', '18', 'Review'], ['Commerce', '8', '21', 'Ready']] },
    note: 'Department and faculty allocation is configurable scope.',
  },
  {
    id: 'faculty', title: 'Faculty Workspace', status: 'live',
    body: 'Give faculty a focused view of assigned subjects, attendance, assessments and marks entry.',
    preview: { kind: 'list', items: [{ title: 'Data Structures · CSE-A', meta: '09:00 AM · Room 204', status: 'Next' }, { title: 'Attendance · CSE-B', meta: '32 students', status: 'Pending' }, { title: 'Internal assessment', meta: '18 scripts', status: 'Review' }] },
    note: 'Assigned subjects, attendance and marks entry are live workflows.',
  },
  {
    id: 'attendance', title: 'Attendance Management', status: 'live',
    body: 'Record course attendance per student and date, then review the same record in the student view.',
    preview: { kind: 'stats', items: [{ label: 'Present today', value: '92%' }, { label: 'Classes marked', value: '38' }, { label: 'Pending', value: '4' }] },
    note: 'Attendance uses sample data in this preview.',
  },
  {
    id: 'examinations', title: 'Examinations & Results', status: 'live',
    body: 'Schedule examinations, enter marks against a maximum, review results and publish them deliberately.',
    preview: { kind: 'table', columns: ['Course', 'Assessment', 'Entries', 'Status'], rows: [['Data Structures', 'Mid-term', '32 / 32', 'Review'], ['Economics', 'Internal 1', '28 / 30', 'In progress'], ['Accounting', 'Quiz 2', '45 / 45', 'Published']] },
    note: 'Marks entry and result publishing are live workflows.',
  },
  {
    id: 'accounts', title: 'Accounts & Semester Fees', status: 'live',
    body: 'Record semester fee structures, payments and receipts, and review collection reports.',
    preview: { kind: 'chart', bars: [{ label: 'Tuition', value: 88 }, { label: 'Library', value: 72 }, { label: 'Exam', value: 61 }, { label: 'Transport', value: 46 }] },
    note: 'Fee records, receipts and financial reporting are live workflows.',
  },
  {
    id: 'library', title: 'Library & Circulation', status: 'live',
    body: 'Connect the catalog, issue and return activity, availability and overdue tracking.',
    preview: { kind: 'list', items: [{ title: 'Database Systems', meta: 'ACC-2214 · Aarav Mehta', status: 'Due 12 Nov' }, { title: 'Microeconomics', meta: 'ACC-0871 · Ananya Iyer', status: 'Due 10 Nov' }, { title: 'Business Ethics', meta: 'ACC-3390 · Dev Patel', status: 'Overdue' }] },
    note: 'Library catalog and circulation are live workflows.',
  },
  {
    id: 'student-services', title: 'Student Services Portal', status: 'live',
    body: 'Bring the student’s profile, semester, attendance, results and fee status into one scoped view.',
    preview: { kind: 'table', columns: ['My semester', 'Status', 'Updated'], rows: [['Attendance', '92%', 'Today'], ['Results', '3 posted', '18 Oct'], ['Fee status', 'Clear', '28 Oct']] },
    note: 'Student profile, attendance, results and fee views are live.',
  },
  {
    id: 'placements', title: 'Placements & Career Centre', status: 'scope',
    body: 'Plan company records, placement drives, eligibility, applications and interview outcomes.',
    preview: { kind: 'list', items: [{ title: 'Autumn intake', meta: 'Graduate trainee · 42 applicants', status: 'Shortlisting' }, { title: 'Campus hiring', meta: 'Analyst · 31 applicants', status: 'Applications' }, { title: 'Internship week', meta: 'Developer intern · 53 applicants', status: 'Scheduled' }] },
    note: 'Placement and career workflows are configurable scope.',
  },
]