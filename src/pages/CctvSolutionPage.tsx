import { LEAD_FORM_4500 } from '@/content/leadForms'
import { SmartForm } from '@/components/forms/SmartForm'

/** Live source contains the lowercase page title and the shared WPForms form. */
export function CctvSolutionPage() {
  return <section className="container-page min-h-[60vh] py-12 sm:py-16"><h1 className="text-3xl font-bold lowercase text-ink-950 sm:text-4xl">cctv solution</h1><div className="mt-8 max-w-3xl rounded-3xl border border-line bg-white p-5 sm:p-8"><SmartForm config={LEAD_FORM_4500} light/></div></section>
}
