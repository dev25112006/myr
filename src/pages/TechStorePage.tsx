import { Link } from 'react-router-dom'

export function TechStorePage() {
  return (
    <section className="section-deep px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-ink-950 sm:text-4xl lg:text-5xl mb-4">
            Our Service Solutions
          </h2>
          <p className="text-ink-500 text-lg sm:text-base max-w-2xl">
            Comprehensive IT services and software solutions for businesses of all sizes. From CRM management to full ERP implementations, we have the expertise to transform your business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-line p-6 shadow-card">
            <h3 className="text-xl font-bold text-ink-950 mb-4">Education ERP</h3>
            <p className="text-[11px] text-ink-500 leading-relaxed mb-4">
              Connected systems for school, college and coaching institute operations. Manage admissions, attendance, examinations, fees and institutional operations from one platform.
            </p>
            <p className="text-flame-600 font-medium">Starting at ₹5,000/month</p>
            <ul className="space-y-2 text-[10px] text-flame-500">
              <li>• Admissions</li>
              <li>• Attendance</li>
              <li>• Examinations</li>
              <li>• Fees</li>
              <li>• Institutional Operations</li>
            </ul>
            <Link to="/education-erp/" className="btn btn-primary mt-4">Learn More</Link>
          </div>
          <div className="bg-white rounded-2xl border border-line p-6 shadow-card">
            <h3 className="text-xl font-bold text-ink-950 mb-4">CRM Development</h3>
            <p className="text-[11px] text-ink-500 leading-relaxed mb-4">
              Tailored CRM solutions for your business success. Manage customer relationships, sales pipelines, and client interactions with our custom-built CRM platforms.
            </p>
            <p className="text-flame-600 font-medium">Starting at ₹8,000/month</p>
            <ul className="space-y-2 text-[10px] text-flame-500">
              <li>• Pipeline Management</li>
              <li>• Customer Tracking</li>
              <li>• Sales Automation</li>
              <li>• Reporting</li>
            </ul>
            <Link to="/crm-development/" className="btn btn-primary mt-4">Learn More</Link>
          </div>
          <div className="bg-white rounded-2xl border border-line p-6 shadow-card">
            <h3 className="text-xl font-bold text-ink-950 mb-4">HRM Solutions</h3>
            <p className="text-[11px] text-ink-500 leading-relaxed mb-4">
              Human Resource Management systems to simplify employee onboarding, attendance tracking, payroll and performance management. Streamline your HR workflows efficiently.
            </p>
            <p className="text-flame-600 font-medium">Starting at ₹3,000/month</p>
            <ul className="space-y-2 text-[10px] text-flame-500">
              <li>• Employee Onboarding</li>
              <li>• Attendance Tracking</li>
              <li>• Payroll</li>
              <li>• Performance Management</li>
            </ul>
            <Link to="/hrm-solutions/" className="btn btn-primary mt-4">Learn More</Link>
          </div>
          <div className="bg-white rounded-2xl border border-line p-6 shadow-card">
            <h3 className="text-xl font-bold text-ink-950 mb-4">Website Development</h3>
            <p className="text-[11px] text-ink-500 leading-relaxed mb-4">
              We craft sleek, user-friendly designs tailored for your success. responsive websites that engage your audience and drive business growth.
            </p>
            <p className="text-flame-600 font-medium">Starting at ₹10,000</p>
            <ul className="space-y-2 text-[10px] text-flame-500">
              <li>• Responsive Design</li>
              <li>• CMS</li>
              <li>• E-commerce</li>
              <li>• SEO</li>
            </ul>
            <Link to="/website-development/" className="btn btn-primary mt-4">Learn More</Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/education-erp/" className="btn btn-primary">
            Education ERP
          </Link>
        </div>
      </div>
    </section>
  )
}
