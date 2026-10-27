/** Small formatting + class helpers. */

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Format an amount the way the source site displays INR. */
export function inr(amount: number, opts?: { paise?: boolean }): string {
  const showPaise = opts?.paise ?? !Number.isInteger(amount)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showPaise ? 2 : 0,
    maximumFractionDigits: showPaise ? 2 : 0,
  }).format(amount)
}

/** Plain number with Indian grouping (e.g. 150000 -> 1,50,000). */
export function numIN(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n)
}
