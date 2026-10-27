import { Link, useLocation } from 'react-router-dom'

/**
 * 404 — source: /not-found/ (also served for /services/web-development/ and
 * /product-category/networking-devices/ which 404 on the original site).
 * Source content: audit/pages/not-found.md
 */
export function NotFoundPage() {
  const { pathname } = useLocation()
  const isSource404 = pathname === '/services/web-development/' || pathname === '/product-category/networking-devices/'

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <img
        src="/assets/2024-10-Go-back-home-find-page.png"
        alt=""
        className="mx-auto mb-8 max-h-56 w-auto object-contain opacity-90"
      />
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-bold text-ink-950 sm:text-5xl">
        {isSource404 ? 'not found' : 'Page not found'}
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-400">
        The page <span className="font-mono text-ink-200">{pathname}</span> could not be found.
        {isSource404 && ' (This route also returns a 404 on the original website — preserved.)'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary btn-md">
          Back to Home
        </Link>
        <Link to="/tech-store/" className="btn btn-ghost-dark btn-md">
          Visit Shop
        </Link>
      </div>
    </div>
  )
}
