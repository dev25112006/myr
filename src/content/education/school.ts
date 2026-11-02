/**
 * School ERP page content — tour locations, roles, missions, modules.
 *
 * Status rules:
 *  - 'live'  → the workflow exists in the MYR product today (attendance,
 *    fees and receipts, exams and results, HRM staff, portal access,
 *    reports).
 *  - 'scope' → configurable implementation scope discussed with MYR.
 *    Shown as labelled demo walkthroughs, never as shipped features.
 *
 * All dashboard content is demo data rendered with <DemoBadge/>.
 * Nothing here calls an API or invents customers or statistics.
 */
import type { SimPreview, Status, TourConfig, TourMission } from '@/components/education/types'

/* ------------------------------------------------------------------ */
/* Tour: 8 campus locations                                            */
/* ------------------------------------------------------------------ */

export const SCHOOL_TOUR: TourConfig = {
  segmentId: 'school',
  title: 'Virtual School',
  intro: 'Pick any location to see how that department works inside the platform. Every screen runs on sample data.',
  locations: [
    {
      id: 'administration',
      label: 'Main Administration Office',
      x: 50, y: 34, status: 'scope',
      workflow: [
        'A registration form captures name, class applied for and guardian contact once.',
        'Applications move through enquiry, applied and enrolled, so nobody keeps a second register.',
        'Class, section and academic year get configured per session and reused all term.',
        'Every change is written to the workspace audit history.',
      ],
      screen: {
        title: 'Administration · Admissions', subtitle: 'Academic year 2026–27 · Term 2',
        nav: ['Overview', 'Admissions', 'Students', 'Classes', 'Sessions', 'Reports'],
        active: 'Admissions',
        stats: [
          { label: 'New enquiries today', value: '12' },
          { label: 'Applications in review', value: '5' },
          { label: 'Enrolled this term', value: '38' },
        ],
        table: {
          columns: ['Applicant', 'Applied for', 'Stage', 'Follow-up'],
          rows: [
            ['Aarav Mehta', 'Class 6 · Section B', 'Enrolled', 'Complete'],
            ['Ishita Rao', 'Class 4 · Section A', 'In review', 'Documents pending'],
            ['Kabir Singh', 'Class 8 · Section C', 'Enquiry', 'Campus visit Fri'],
            ['Myra Das', 'Class 5 · Section B', 'Enrolled', 'Complete'],
          ],
        },
        note: 'Admissions and class setup are configurable scope, planned with MYR per institution.',
      },
    },
    {
      id: 'classrooms',
      label: 'Classrooms',
      x: 24, y: 56, status: 'live',
      workflow: [
        'The teacher opens their assigned class and marks each student present, absent or late.',
        'One mark per student per date. A duplicate gets rejected instead of quietly corrupting a report.',
        'The morning roll feeds the guardian portal and the weekly attendance report. No re-entry.',
        'Homework and assignment status sits right beside the same class list.',
      ],
      screen: {
        title: 'Class 8-B · Daily attendance', subtitle: 'Mathematics · Mon, 2 Nov 2026',
        nav: ['My classes', 'Attendance', 'Timetable', 'Homework', 'Marks'],
        active: 'Attendance',
        stats: [
          { label: 'Present', value: '28 / 32' },
          { label: 'Absent', value: '3' },
          { label: 'Late', value: '1' },
        ],
        table: {
          columns: ['Roll', 'Student', 'Mark', 'Note'],
          rows: [
            ['01', 'Aarav Mehta', 'Present', ''],
            ['02', 'Ananya Iyer', 'Present', ''],
            ['03', 'Dev Patel', 'Late', 'Bus delay'],
            ['04', 'Ishita Rao', 'Absent', 'Guardian informed'],
            ['05', 'Kabir Singh', 'Present', ''],
          ],
        },
        note: 'Attendance runs live in the MYR workspace today.',
      },
    },
    {
      id: 'examination',
      label: 'Examination Department',
      x: 74, y: 44, status: 'live',
      workflow: [
        'Exams are created per subject with a date and a maximum mark.',
        'Marks are entered student by student and checked against that maximum.',
        'Results wait in pending until review finishes. Publishing is a deliberate step, never automatic.',
      ],
      screen: {
        title: 'Examinations · Term 2', subtitle: 'Class 8 · Answer sheet review',
        nav: ['Overview', 'Schedule', 'Marks entry', 'Review', 'Publish'],
        active: 'Marks entry',
        stats: [
          { label: 'Exams scheduled', value: '6' },
          { label: 'Sheets pending review', value: '14' },
          { label: 'Results published', value: '2' },
        ],
        table: {
          columns: ['Subject', 'Date', 'Max marks', 'Status'],
          rows: [
            ['Mathematics', '12 Nov 2026', '100', 'Marks entry'],
            ['Science', '14 Nov 2026', '100', 'Scheduled'],
            ['English', '06 Nov 2026', '80', 'Published'],
            ['Social Studies', '04 Nov 2026', '80', 'Published'],
          ],
        },
        note: 'Exams, marks entry and result publishing run live in the MYR workspace today.',
      },
    },
    {
      id: 'accounts',
      label: 'Accounts Department',
      x: 68, y: 66, status: 'live',
      workflow: [
        'A fee record carries a title, an amount, a due date and a student. Not a spreadsheet row.',
        'Payments sit against the fee. Receipt numbers generate on their own.',
        'You cannot pay more than what is outstanding. Partial payments move unpaid, partial, paid.',
        'Voiding a receipt keeps it on file. The audit trail does not lose history.',
      ],
      screen: {
        title: 'Accounts · Fee collection', subtitle: 'Today · front counter',
        nav: ['Overview', 'Fee records', 'Receipts', 'Dues', 'Reports'],
        active: 'Receipts',
        stats: [
          { label: 'Collected today', value: '₹ 84,500' },
          { label: 'Open dues', value: '₹ 1,26,000' },
          { label: 'Receipts issued', value: '17' },
        ],
        table: {
          columns: ['Receipt', 'Student', 'Amount', 'Method'],
          rows: [
            ['RCPT-8QF21', 'Aarav Mehta', '₹ 12,000', 'UPI'],
            ['RCPT-9KD04', 'Myra Das', '₹ 8,500', 'Cash'],
            ['RCPT-3MP77', 'Dev Patel', '₹ 4,000', 'Card'],
            ['RCPT-6TZ19', 'Ananya Iyer', '₹ 12,000', 'Bank'],
          ],
        },
        note: 'Fees, receipts, partial payments and dues run live in the MYR workspace today.',
      },
    },
    {
      id: 'staffroom',
      label: 'Staff Room',
      x: 38, y: 30, status: 'live',
      workflow: [
        'Teacher and support staff records hold department, role and onboarding status.',
        'Weekly shifts and leave requests are handled per employee, with an approval step.',
        'Staff documents stay private. Downloads are membership-scoped and retention-controlled.',
        'Headcount and department reports read straight off these records.',
      ],
      screen: {
        title: 'Staff Room · People', subtitle: 'Teaching and non-teaching',
        nav: ['Overview', 'Employees', 'Shifts', 'Leave', 'Documents', 'Reports'],
        active: 'Leave',
        stats: [
          { label: 'On duty', value: '41 / 46' },
          { label: 'Leave pending', value: '3' },
          { label: 'Shifts this week', value: '12' },
        ],
        table: {
          columns: ['Staff member', 'Department', 'Request', 'Status'],
          rows: [
            ['S. Kulkarni', 'Science', 'Casual · 4 Nov', 'Approved'],
            ['R. Verma', 'Mathematics', 'Sick · 2–3 Nov', 'Approved'],
            ['P. Nair', 'English', 'Casual · 9 Nov', 'Pending'],
            ['Admin desk', 'Operations', 'Shift swap', 'Pending'],
          ],
        },
        note: 'Employee records, shifts, leave and private documents run live in the MYR HRM module.',
      },
    },
    {
      id: 'library',
      label: 'Library',
      x: 14, y: 40, status: 'scope',
      workflow: [
        'Catalog entries hold titles, copies and shelf location.',
        'Issue and return update availability in one scan.',
        'Overdue lists and stock reports come out of the issue history.',
      ],
      screen: {
        title: 'Library · Issue counter', subtitle: 'Catalog and circulation',
        nav: ['Catalog', 'Issue / Return', 'Overdue', 'Stock report'],
        active: 'Issue / Return',
        stats: [
          { label: 'Titles in catalog', value: '1,240' },
          { label: 'Issued today', value: '34' },
          { label: 'Overdue', value: '9' },
        ],
        table: {
          columns: ['Accession', 'Title', 'Class', 'Due'],
          rows: [
            ['ACC-2214', 'New Treasure Island', '6-A', '12 Nov'],
            ['ACC-0871', 'Concise Physics', '9-B', '10 Nov'],
            ['ACC-3390', 'Bharatiya Ganit', '7-C', '08 Nov'],
            ['ACC-1044', 'Wings of Fire', '8-A', 'Overdue'],
          ],
        },
        note: 'Library management is configurable scope, discussed during implementation.',
      },
    },
    {
      id: 'transport',
      label: 'Transport Department',
      x: 86, y: 58, status: 'scope',
      workflow: [
        'Routes and stops are defined once, then assigned to vehicles and drivers.',
        'Transport attendance records which student boarded which route.',
        'Transport fees link payments to the route instead of a side register.',
      ],
      screen: {
        title: 'Transport · Routes', subtitle: 'Fleet and routes',
        nav: ['Routes', 'Vehicles', 'Drivers', 'Boarding', 'Fees'],
        active: 'Routes',
        stats: [
          { label: 'Active routes', value: '7' },
          { label: 'Vehicles', value: '9' },
          { label: 'Students onboard', value: '214' },
        ],
        table: {
          columns: ['Route', 'Stops', 'Vehicle', 'Driver'],
          rows: [
            ['R1 · North loop', '8', 'Bus 01', 'M. Yadav'],
            ['R2 · Lakeside', '6', 'Bus 04', 'S. Thakur'],
            ['R3 · Market road', '9', 'Bus 07', 'A. Khan'],
            ['R4 · Station', '5', 'Van 02', 'J. Menon'],
          ],
        },
        note: 'Transport management is configurable scope. Transport fee tracking uses the live fee workflow.',
      },
    },
    {
      id: 'parents',
      label: 'Parent Communication Centre',
      x: 44, y: 70, status: 'live',
      workflow: [
        'Guardian access is granted by verified email with a guardian role attached.',
        'Access activates when the invited email verifies its MYR account. It can be pulled just as fast.',
        'Parents see their own child — attendance, fees, results, notices. Never another family.',
        'Every invitation, role change and removal is written to the audit trail.',
      ],
      screen: {
        title: 'Parent portal · Myra Das', subtitle: 'Guardian view',
        nav: ['Overview', 'Attendance', 'Fees', 'Results', 'Notices'],
        active: 'Overview',
        stats: [
          { label: 'Attendance this term', value: '96%' },
          { label: 'Fee status', value: 'Paid' },
          { label: 'New results', value: '2' },
        ],
        lines: [
          { title: 'English · Term 2 test published', meta: '06 Nov 2026', status: 'New' },
          { title: 'PTM on Saturday, 9:30 AM', meta: 'Notice · 02 Nov', status: 'New' },
          { title: 'Fee receipt RCPT-9KD04 issued', meta: '28 Oct 2026', status: 'Receipt' },
          { title: 'Mathematics homework due Monday', meta: 'Class 8-B', status: 'Task' },
        ],
        note: 'Guardian and student portal access runs live in the MYR workspace today.',
      },
    },
  ],
  roles: [],
  missions: [],
}

/* ------------------------------------------------------------------ */
/* Tour: 7 roles                                                       */
/* ------------------------------------------------------------------ */

SCHOOL_TOUR.roles = [
  {
    id: 'administrator', label: 'School Administrator', blurb: 'Runs registrations, classes, sessions and fee structures.',
    responsibilities: [
      { text: 'Student registration and admission', status: 'scope' },
      { text: 'Class and section management', status: 'scope' },
      { text: 'Staff management', status: 'live' },
      { text: 'Academic session configuration', status: 'scope' },
      { text: 'Fee structure setup', status: 'live' },
      { text: 'Institution reports', status: 'live' },
    ],
    screen: {
      title: 'Administrator · Institution overview', subtitle: 'Riverside Public School',
      nav: ['Dashboard', 'Admissions', 'Classes', 'Staff', 'Fee setup', 'Reports'],
      active: 'Dashboard',
      stats: [
        { label: 'Classes running', value: '24' },
        { label: 'Staff records', value: '46' },
        { label: 'Fee heads configured', value: '9' },
      ],
      table: {
        columns: ['Task', 'Owner', 'Due', 'Status'],
        rows: [
          ['Class allotment · Term 2', 'Admin desk', '04 Nov', 'In progress'],
          ['Fee structure · Annual', 'Accounts', '07 Nov', 'Review'],
          ['Staff onboarding ×2', 'HR', '05 Nov', 'Open'],
        ],
      },
      note: 'Staff management and fee setup are live today. Class and session configuration is implementation scope.',
    },
  },
  {
    id: 'principal', label: 'Principal', blurb: 'Institution performance, attendance, exams and announcements.',
    responsibilities: [
      { text: 'Overall school performance', status: 'live' },
      { text: 'Student attendance overview', status: 'live' },
      { text: 'Staff performance', status: 'scope' },
      { text: 'Examination reports', status: 'live' },
      { text: 'Academic progress', status: 'scope' },
      { text: 'Institution announcements', status: 'scope' },
    ],
    screen: {
      title: 'Principal · School report', subtitle: 'Week of 26 Oct – 1 Nov',
      nav: ['Overview', 'Attendance', 'Exams', 'Staff', 'Notices'],
      active: 'Overview',
      stats: [
        { label: 'Attendance rate', value: '94%' },
        { label: 'Results published', value: '2 / 6' },
        { label: 'Open escalations', value: '3' },
      ],
      table: {
        columns: ['Indicator', 'This week', 'Last week'],
        rows: [
          ['Class-wise attendance', '94%', '93%'],
          ['Assignments submitted', '88%', '90%'],
          ['Fee collection progress', '82%', '79%'],
        ],
      },
      note: 'Attendance, exam and collection roll-ups read live workspace records. Staff performance review is implementation scope.',
    },
  },
  {
    id: 'teacher', label: 'Teacher', blurb: 'Own classes, attendance, marks and homework.',
    responsibilities: [
      { text: 'Assigned classes', status: 'live' },
      { text: 'Daily attendance', status: 'live' },
      { text: 'Timetable', status: 'scope' },
      { text: 'Homework and assignments', status: 'scope' },
      { text: 'Examination marks', status: 'live' },
      { text: 'Student performance', status: 'live' },
    ],
    screen: {
      title: 'Teacher · My day', subtitle: 'Mrs. Fernandes · class teacher 8-B',
      nav: ['My day', 'Classes', 'Attendance', 'Homework', 'Marks'],
      active: 'My day',
      stats: [
        { label: 'Classes today', value: '5' },
        { label: 'Attendance pending', value: '1' },
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
    id: 'student', label: 'Student', blurb: 'Schedule, attendance, homework and results in one view.',
    responsibilities: [
      { text: 'Personal dashboard', status: 'live' },
      { text: 'Timetable', status: 'scope' },
      { text: 'Attendance record', status: 'live' },
      { text: 'Homework', status: 'scope' },
      { text: 'Examination results', status: 'live' },
      { text: 'Study materials', status: 'scope' },
      { text: 'Notifications', status: 'scope' },
    ],
    screen: {
      title: 'Student · My dashboard', subtitle: 'Myra Das · Class 8-B',
      nav: ['Home', 'Attendance', 'Results', 'Fees', 'Notices'],
      active: 'Home',
      stats: [
        { label: 'Attendance', value: '96%' },
        { label: 'New results', value: '2' },
        { label: 'Fee status', value: 'Clear' },
      ],
      lines: [
        { title: 'English · 68 / 80 published', meta: 'Term 2', status: 'New' },
        { title: 'Social Studies · 71 / 80 published', meta: 'Term 2', status: 'New' },
        { title: 'Science test · Friday', meta: 'Chapters 4–6', status: 'Upcoming' },
      ],
      note: 'Attendance, results and fee status are live. Timetable, homework and study material libraries are implementation scope.',
    },
  },
  {
    id: 'parent', label: 'Parent', blurb: 'One child. Their attendance, performance, fees and notices.',
    responsibilities: [
      { text: 'Child’s attendance', status: 'live' },
      { text: 'Academic performance', status: 'live' },
      { text: 'Fee status', status: 'live' },
      { text: 'School announcements', status: 'scope' },
      { text: 'Teacher communication', status: 'scope' },
    ],
    screen: {
      title: 'Parent · Child overview', subtitle: 'Guardian of Myra Das',
      nav: ['Overview', 'Attendance', 'Fees', 'Results', 'Notices'],
      active: 'Overview',
      stats: [
        { label: 'Attendance', value: '96%' },
        { label: 'Dues', value: '₹ 0' },
        { label: 'Published results', value: '2' },
      ],
      lines: [
        { title: 'Fee receipt RCPT-9KD04', meta: '28 Oct · ₹ 8,500', status: 'Paid' },
        { title: 'Attendance · October', meta: '22 of 23 days present', status: '96%' },
        { title: 'PTM invitation', meta: 'Saturday 9:30 AM', status: 'New' },
      ],
      note: 'Attendance, fee status and results views are live through portal access. Broadcast announcements are implementation scope.',
    },
  },
  {
    id: 'accountant', label: 'Accountant', blurb: 'Collections, receipts, dues and financial reports.',
    responsibilities: [
      { text: 'Fee collection', status: 'live' },
      { text: 'Receipts', status: 'live' },
      { text: 'Pending dues', status: 'live' },
      { text: 'Discounts and concessions', status: 'scope' },
      { text: 'Financial reports', status: 'live' },
    ],
    screen: {
      title: 'Accountant · Collection desk', subtitle: 'Counter 1',
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
          ['Kabir Singh', 'Term fee', '₹ 3,500', 'Record payment'],
          ['Ishita Rao', 'Transport', '₹ 1,200', 'Record payment'],
          ['Dev Patel', 'Term fee', '₹ 0', 'Clear'],
        ],
      },
      note: 'Collection, receipts, dues and financial reports are live. Concession approval workflows are implementation scope.',
    },
  },
  {
    id: 'transport', label: 'Transport Manager', blurb: 'Routes, vehicles, drivers and transport fees.',
    responsibilities: [
      { text: 'Routes and stops', status: 'scope' },
      { text: 'Vehicle allocation', status: 'scope' },
      { text: 'Driver records', status: 'scope' },
      { text: 'Transport attendance', status: 'scope' },
      { text: 'Transport fee tracking', status: 'live' },
    ],
    screen: {
      title: 'Transport · Daily operations', subtitle: 'Morning shift',
      nav: ['Routes', 'Vehicles', 'Boarding', 'Fees', 'Reports'],
      active: 'Boarding',
      stats: [
        { label: 'Routes running', value: '7 / 7' },
        { label: 'Boarded', value: '208 / 214' },
        { label: 'Transport dues', value: '₹ 18,400' },
      ],
      lines: [
        { title: 'R1 · North loop', meta: 'Left 6:40 AM', status: 'On time' },
        { title: 'R2 · Lakeside', meta: 'Left 6:35 AM', status: 'On time' },
        { title: 'R4 · Station', meta: 'Pickup 7:10 AM', status: 'Delayed' },
      ],
      note: 'Transport fee tracking uses the live fee and receipt workflow. Fleet, route and boarding modules are implementation scope.',
    },
  },
]

/* ------------------------------------------------------------------ */
/* Tour: 7 missions                                                    */
/* ------------------------------------------------------------------ */

export const schoolMissions: TourMission[] = [
  {
    id: 'admit', ordinal: 'Mission 1', title: 'Admit a new student',
    brief: 'Register a fresh admission — name, guardian contact and the class applied for.',
    status: 'scope', xp: 100, badge: 'Registrar', kind: 'form',
    fields: [
      { name: 'student', label: 'Student name', kind: 'text', required: true, placeholder: 'e.g. Aisha Kapoor' },
      { name: 'guardian', label: 'Guardian email', kind: 'email', required: true, placeholder: 'guardian@example.com' },
      { name: 'klass', label: 'Class applied for', kind: 'select', required: true, options: [
        { value: '5A', label: 'Class 5 · Section A' }, { value: '6B', label: 'Class 6 · Section B' },
        { value: '7A', label: 'Class 7 · Section A' }, { value: '8B', label: 'Class 8 · Section B' },
      ] },
    ],
    successTitle: 'Admission record created',
    successBody: 'The applicant enters the enquiry pipeline with a guardian contact on file. Admissions and class setup are configurable scope. This record stayed in your browser.',
  },
  {
    id: 'assign', ordinal: 'Mission 2', title: 'Assign the student to a class',
    brief: 'Place the new student into a class, section and house for the current term.',
    status: 'scope', xp: 80, badge: 'Class Allocator', kind: 'form',
    fields: [
      { name: 'student', label: 'Student', kind: 'select', required: true, options: [
        { value: 'aisha', label: 'Aisha Kapoor (new admission)' }, { value: 'aarav', label: 'Aarav Mehta' }, { value: 'dev', label: 'Dev Patel' },
      ] },
      { name: 'section', label: 'Class and section', kind: 'select', required: true, options: [
        { value: '6B', label: 'Class 6 · Section B' }, { value: '7A', label: 'Class 7 · Section A' }, { value: '8B', label: 'Class 8 · Section B' },
      ] },
      { name: 'house', label: 'House', kind: 'select', required: true, options: [
        { value: 'indigo', label: 'Indigo house' }, { value: 'amber', label: 'Amber house' }, { value: 'emerald', label: 'Emerald house' },
      ] },
    ],
    successTitle: 'Student placed in class',
    successBody: 'That student now appears on the class roll for attendance, exams and fees. Class allotment is configurable scope in this demo.',
  },
  {
    id: 'attendance', ordinal: 'Mission 3', title: 'Mark class attendance',
    brief: 'Mark every student in the roll. One mark per student per date is enforced.',
    status: 'live', xp: 120, badge: 'Attendance Keeper', kind: 'roster',
    roster: [
      { id: 's1', name: 'Aarav Mehta', meta: 'Roll 01' },
      { id: 's2', name: 'Ananya Iyer', meta: 'Roll 02' },
      { id: 's3', name: 'Dev Patel', meta: 'Roll 03' },
      { id: 's4', name: 'Ishita Rao', meta: 'Roll 04' },
      { id: 's5', name: 'Kabir Singh', meta: 'Roll 05' },
      { id: 's6', name: 'Myra Das', meta: 'Roll 06' },
    ],
    successTitle: 'Attendance submitted for Class 8-B',
    successBody: 'Present, absent and late marks are stored against today’s date. The real workflow rejects a duplicate mark for the same student and date. Guardians can see this record.',
  },
  {
    id: 'receipt', ordinal: 'Mission 4', title: 'Generate a fee receipt',
    brief: 'Record a payment against an open fee. The amount cannot exceed the outstanding balance.',
    status: 'live', xp: 120, badge: 'Fee Collector', kind: 'receipt',
    fees: [
      { value: 'f1', label: 'Kabir Singh · Term fee', outstanding: 3500 },
      { value: 'f2', label: 'Ishita Rao · Transport fee', outstanding: 1200 },
      { value: 'f3', label: 'Dev Patel · Term fee', outstanding: 6000 },
    ],
    successTitle: 'Receipt issued, balance updated',
    successBody: 'A receipt number generates automatically and the fee moves unpaid, partial, paid as the balance clears. Over-payments are rejected. A voided receipt stays in the audit trail.',
  },
  {
    id: 'marks', ordinal: 'Mission 5', title: 'Enter examination marks',
    brief: 'Enter a score for one student. It is validated against the exam’s maximum.',
    status: 'live', xp: 110, badge: 'Marks Entry Clerk', kind: 'marks',
    exams: [
      { value: 'maths', label: 'Mathematics · Term 2 test', maxMarks: 100 },
      { value: 'science', label: 'Science · Term 2 test', maxMarks: 100 },
      { value: 'english', label: 'English · Term 2 test', maxMarks: 80 },
    ],
    successTitle: 'Mark recorded, pending review',
    successBody: 'Scores above the maximum are blocked in the real workflow. The result waits in pending until review is complete. Nothing publishes on its own.',
  },
  {
    id: 'publish', ordinal: 'Mission 6', title: 'Publish a result',
    brief: 'Review two pending results, then publish them to the student and guardian portals.',
    status: 'live', xp: 130, badge: 'Result Publisher', kind: 'publish',
    pending: [
      { id: 'r1', name: 'Aarav Mehta · Mathematics', marks: '86', max: '100' },
      { id: 'r2', name: 'Ananya Iyer · Mathematics', marks: '92', max: '100' },
    ],
    successTitle: 'Results published',
    successBody: 'Published results show up on the student and guardian portals right away. Scoped to that family. Never shared across students.',
  },
  {
    id: 'announce', ordinal: 'Mission 7', title: 'Send an announcement to parents',
    brief: 'Compose a notice for guardians — audience, subject and message.',
    status: 'scope', xp: 90, badge: 'Notice Board', kind: 'form',
    fields: [
      { name: 'audience', label: 'Audience', kind: 'select', required: true, options: [
        { value: 'all', label: 'All guardians' }, { value: '8b', label: 'Class 8-B guardians' }, { value: 'fees', label: 'Guardians with open dues' },
      ] },
      { name: 'subject', label: 'Subject', kind: 'text', required: true, placeholder: 'e.g. Parent–teacher meeting on Saturday' },
      { name: 'body', label: 'Message', kind: 'textarea', required: true, placeholder: 'Keep it short and clear…' },
    ],
    successTitle: 'Announcement queued for guardians',
    successBody: 'Notices appear in each guardian’s portal view for their own children. App, email and SMS delivery is configurable scope, set up per institution.',
  },
]

SCHOOL_TOUR.missions = schoolMissions

/* ------------------------------------------------------------------ */
/* Module showcase (14 modules, dashboard previews, honest status)     */
/* ------------------------------------------------------------------ */

export type SchoolModule = {
  id: string
  title: string
  status: Status
  body: string
  preview: SimPreview
  note?: string
}

export const schoolModules: SchoolModule[] = [
  {
    id: 'admissions', title: 'Admission Management', status: 'scope',
    body: 'Enquiry capture, application stages and enrolment in one pipeline. A new admission becomes the student record every other module reuses.',
    preview: { kind: 'list', items: [
      { title: 'Aarav Mehta', meta: 'Class 6 · Enquiry', status: 'New' },
      { title: 'Ishita Rao', meta: 'Class 4 · Documents pending', status: 'In review' },
      { title: 'Myra Das', meta: 'Class 5 · Fee cleared', status: 'Enrolled' },
      { title: 'Kabir Singh', meta: 'Class 8 · Campus visit', status: 'Enquiry' },
    ] },
    note: 'Admissions workflow: configurable scope.',
  },
  {
    id: 'sis', title: 'Student Information System', status: 'live',
    body: 'One record per child. Identity, class, guardian link, attendance, fees and results all hang off it instead of living in separate sheets.',
    preview: { kind: 'table', columns: ['Student', 'Class', 'Guardian', 'Status'], rows: [
      ['Aarav Mehta', '8-B', 'Linked', 'Active'],
      ['Ananya Iyer', '8-B', 'Linked', 'Active'],
      ['Dev Patel', '7-A', 'Pending verify', 'Active'],
      ['Myra Das', '8-B', 'Linked', 'Active'],
    ] },
    note: 'Student records are live in the workspace today.',
  },
  {
    id: 'classes', title: 'Class & Section Management', status: 'scope',
    body: 'Classes, sections and the academic year get configured once per session. Attendance, timetables and exam lists all read from that setup.',
    preview: { kind: 'list', items: [
      { title: 'Class 8 · A/B/C', meta: '32 / 31 / 33 students', status: 'Term 2' },
      { title: 'Class 7 · A/B', meta: '30 / 29 students', status: 'Term 2' },
      { title: 'Class 6 · A/B', meta: '28 / 30 students', status: 'Term 2' },
    ] },
    note: 'Class and section configuration: configurable scope.',
  },
  {
    id: 'staff', title: 'Teacher & Staff Management', status: 'live',
    body: 'Employee records with department, role and onboarding status. The same records carry shifts, leave and private documents.',
    preview: { kind: 'table', columns: ['Staff', 'Department', 'Role', 'Status'], rows: [
      ['S. Kulkarni', 'Science', 'Teacher', 'Active'],
      ['R. Verma', 'Mathematics', 'Teacher', 'Active'],
      ['P. Nair', 'English', 'Teacher', 'On leave'],
      ['Admin desk', 'Operations', 'Admin', 'Active'],
    ] },
    note: 'HRM employee records are live today.',
  },
  {
    id: 'attendance', title: 'Attendance Management', status: 'live',
    body: 'Present, absent or late. One mark per student per date, duplicates rejected. Feeds guardian views and reports without anyone re-typing it.',
    preview: { kind: 'stats', items: [
      { label: 'Present today', value: '94%' },
      { label: 'Late arrivals', value: '5' },
      { label: 'Unmarked classes', value: '1' },
    ] },
    note: 'Attendance is live in the workspace today.',
  },
  {
    id: 'timetable', title: 'Timetable Management', status: 'scope',
    body: 'Period schedules per class and teacher, with room and substitute planning around the school day.',
    preview: { kind: 'calendar', days: [
      { label: 'Mon', state: 'ok' }, { label: 'Tue', state: 'ok' }, { label: 'Wed', state: 'ok' },
      { label: 'Thu', state: 'due' }, { label: 'Fri', state: 'ok' }, { label: 'Sat', state: 'off' },
    ] },
    note: 'Timetable planning: configurable scope.',
  },
  {
    id: 'fees', title: 'Fee & Accounts Management', status: 'live',
    body: 'Fee records with due dates, partial payments, automatic receipt numbers and balance caps. Dues and collection reports included.',
    preview: { kind: 'chart', bars: [
      { label: 'Jul', value: 82 }, { label: 'Aug', value: 74 }, { label: 'Sep', value: 88 },
      { label: 'Oct', value: 91 }, { label: 'Nov', value: 63 },
    ] },
    note: 'Fees, receipts and dues are live today.',
  },
  {
    id: 'exams', title: 'Examination & Results', status: 'live',
    body: 'Exams with dates and maximum marks. Mark entry validated per student, review, then publish to student and guardian portals.',
    preview: { kind: 'list', items: [
      { title: 'Mathematics · Term 2', meta: 'Max 100 · Marks entry', status: 'Pending' },
      { title: 'Science · Term 2', meta: 'Max 100 · Scheduled 14 Nov', status: 'Scheduled' },
      { title: 'English · Term 2', meta: 'Max 80 · Published', status: 'Done' },
    ] },
    note: 'Exams and result publishing are live today.',
  },
  {
    id: 'homework', title: 'Homework & Assignments', status: 'scope',
    body: 'Assign work per class, track who submitted, and surface due items beside the student’s daily dashboard.',
    preview: { kind: 'list', items: [
      { title: 'Maths · Ch 7 exercises', meta: 'Class 8-B · Due Monday', status: 'Assigned' },
      { title: 'Science · Lab record', meta: 'Class 7-A · Due Thursday', status: 'Assigned' },
      { title: 'English · Essay', meta: 'Class 8-B · Submitted 28/32', status: 'Review' },
    ] },
    note: 'Homework and assignment tracking: configurable scope.',
  },
  {
    id: 'library', title: 'Library Management', status: 'scope',
    body: 'Catalog, issue and return at one counter. Availability and overdue lists update from the issue history.',
    preview: { kind: 'table', columns: ['Accession', 'Title', 'Status', 'Due'], rows: [
      ['ACC-2214', 'New Treasure Island', 'Issued', '12 Nov'],
      ['ACC-0871', 'Concise Physics', 'Issued', '10 Nov'],
      ['ACC-3390', 'Bharatiya Ganit', 'Issued', '08 Nov'],
      ['ACC-1044', 'Wings of Fire', 'Overdue', '29 Oct'],
    ] },
    note: 'Library management: configurable scope.',
  },
  {
    id: 'transport', title: 'Transport Management', status: 'scope',
    body: 'Routes, stops, vehicles and driver records. Boarding attendance and transport fees sit on the same student record.',
    preview: { kind: 'list', items: [
      { title: 'R1 · North loop', meta: 'Bus 01 · 8 stops', status: 'On time' },
      { title: 'R2 · Lakeside', meta: 'Bus 04 · 6 stops', status: 'On time' },
      { title: 'R4 · Station', meta: 'Van 02 · 5 stops', status: 'Delayed' },
    ] },
    note: 'Transport management: configurable scope. Transport fees use the live fee workflow.',
  },
  {
    id: 'parents', title: 'Parent Communication', status: 'live',
    body: 'Guardian portals verified by email, scoped to each family. Notices land on the child’s own dashboard. Access is grantable and revocable, with an audit trail.',
    preview: { kind: 'stats', items: [
      { label: 'Guardian portals active', value: '31' },
      { label: 'Pending verification', value: '4' },
      { label: 'Notices published', value: '6' },
    ] },
    note: 'Portal access is live. Broadcast announcements are configurable scope.',
  },
  {
    id: 'hr', title: 'HR & Payroll', status: 'scope',
    body: 'Staff records, shifts, leave and documents are live today. Payroll processing gets scoped per institution during implementation.',
    preview: { kind: 'table', columns: ['Employee', 'Shift', 'Leave', 'Payroll'], rows: [
      ['S. Kulkarni', 'Morning', '—', 'Scope'],
      ['R. Verma', 'Morning', '2 days', 'Scope'],
      ['P. Nair', 'Evening', 'Pending', 'Scope'],
    ] },
    note: 'Employees, shifts and leave are live. Payroll processing is configurable scope.',
  },
  {
    id: 'reports', title: 'Reports & Analytics', status: 'live',
    body: 'Attendance, collection, headcount and pipeline reports computed from live workspace records. Nobody rebuilds the month in a spreadsheet.',
    preview: { kind: 'chart', bars: [
      { label: 'Att.', value: 94 }, { label: 'Fees', value: 82 }, { label: 'Exams', value: 40 },
      { label: 'Staff', value: 89 },
    ] },
    note: 'Module reports are live in the workspace today.',
  },
]
