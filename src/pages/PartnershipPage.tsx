import { useState } from 'react'
import { Link } from 'react-router-dom'

function PartnershipPage() {
  const [partnershipType, setPartnershipType] = useState('white-label')

  const typeOptions = [
    { label: 'White Label Partnership', value: 'white-label' },
    { label: 'Reseller Partnership', value: 'reseller' },
    { label: 'Distribution Partnership', value: 'distributor' },
  ]

  const whiteLabelSteps = [
    { title: 'Step 1: Partner Discovery', content: 'We identify businesses that align with our vision and values.', motivatedThought: '💡 Choose partners who share your commitment.' },
    { title: 'Step 2: White Label Discussion', content: 'Define the brand positioning and pricing structure.', motivatedThought: '🚀 White labeling allows you to offer premium software under your own brand.' },
    { title: 'Step 3: Partnership Agreement', content: 'Formalize the partnership agreement covering revenue sharing and terms.', motivatedThought: '📝 A well-structured agreement protects both partners.' },
    { title: 'Step 4: Launch & Scale', content: 'Launch your white-labeled solution and monitor performance.', motivatedThought: '📈 The sky\'s the limit when you have the right partner.' },
  ]

  const resellerSteps = [
    { title: 'Step 1: Partner Discovery', content: 'We identify businesses that align with our vision and values.', motivatedThought: '💡 Choose partners who share your commitment.' },
    { title: 'Step 2: Reseller Agreement', content: 'Establish the reseller partnership terms.', motivatedThought: '🚀 Becoming an authorized reseller gives you access to proven products.' },
    { title: 'Step 3: Sales & Support', content: 'Start selling MYR solutions to your customers.', motivatedThought: '🛒 Every sale is a step toward financial independence.' },
    { title: 'Step 4: Scale Your Business', content: 'Expand your reseller portfolio by onboarding more customers.', motivatedThought: '📈 Scale your business by serving more customers.' },
  ]

  const distributorSteps = [
    { title: 'Step 1: Partner Discovery', content: 'We identify businesses that align with our vision and values.', motivatedThought: '💡 Choose partners who share your commitment.' },
    { title: 'Step 2: Distribution Agreement', content: 'Establish the distribution partnership defining territories.', motivatedThought: '🚀 Distribution partnerships offer the broadest market reach.' },
    { title: 'Step 3: Orders & Fulfillment', content: 'Receive customer orders and manage delivery or implementation.', motivatedThought: '🛒 Distribution is about volume and reach.' },
    { title: 'Step 4: Market Leadership', content: 'Establish your region as the go-to destination for MYR solutions.', motivatedThought: '🏆 Market leadership is within reach. Your earnings scale with your market dominance.' },
  ]

  return (
    <section className="section-deep px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ink-950 sm:text-4xl lg:text-5xl mb-4">
            Partner with MYR Advance Solution
          </h2>
          <p className="text-ink-500 text-lg sm:text-base max-w-2xl">
            Join our growing partner network and build a thriving business while helping organizations transform their operations with our innovative software solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-flame-600 mb-6">Choose Your Partnership Type</h3>
            
            <div className="space-y-3">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPartnershipType(opt.value)}
                  className="w-full py-3 px-4 rounded-xl border border-line/{opt.value === 'white-label' ? 'flame-500/20' : 'bg-white/20'} text-ink-400 text-sm font-medium hover:border-flame-500 hover:text-flame-600 transition-colors">
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-flame-600 mb-6">Partnership Journey</h3>
            
            {['white-label', 'reseller', 'distributor'].map((type) => {
              const currentSteps = partnershipType === 'white-label' ? whiteLabelSteps
                : partnershipType === 'reseller' ? resellerSteps
                : distributorSteps
              
              return (
                <div key={type} className="p-4 rounded-xl border border-line bg-white hover:border-flame-500 transition-colors">
                  <h4 className="font-semibold text-flame-600 mb-2">{type.replace('-', ' ')} Partnership</h4>
                  {currentSteps.map((step, j) => (
                    <div key={j} className="p-4 rounded-xl border border-line bg-white hover-border-flame-500 transition-colors">
                      <h5 className="font-medium text-flame-600 mb-2">{step.title}</h5>
                      <p className="text-[11px] text-ink-500 leading-relaxed">{step.content}</p>
                      <p className="mt-3 text-sm font-medium text-flame-600">{step.motivatedThought}</p>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-line">
          <h3 className="text-2xl font-bold text-ink-950 mb-4">Why Partner with Us?</h3>
          <ul className="space-y-3 text-ink-500">
            <li>
              <span className="font-medium text-flame-600">Established Brand:</span> Leverage the MYR Advance Solution reputation and proven track record in the IT industry.
            </li>
            <li>
              <span className="font-medium text-flame-600">High-Quality Products:</span> Our software solutions are built with cutting-edge technology and rigorously tested for reliability.
            </li>
            <li>
              <span className="font-medium text-flame-600">Competitive Earnings:</span> Lucrative commission structures and revenue sharing models that reward your success.
            </li>
            <li>
              <span className="font-medium text-flame-600">Marketing Support:</span> Get co-branded marketing materials, sales collateral, and campaign support to help you succeed.
            </li>
            <li>
              <span className="font-medium text-flame-600">Technical Excellence:</span> Our team provides technical support, training, and ongoing assistance to ensure your success.
            </li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <Link to="/contact-us/" className="btn btn-primary">
            Start Partnership Conversation
          </Link>
          <Link to="/education-erp/" className="btn btn-ghost-dark ml-2">
            Education ERP Demo
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PartnershipPage