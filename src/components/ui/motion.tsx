import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/format'

const EASE = [0.22, 1, 0.36, 1] as const

export type RevealVariant = 'rise' | 'fade' | 'blur' | 'scale' | 'left' | 'right'

const VARIANT_INIT: Record<RevealVariant, Record<string, number | string>> = {
  rise: { opacity: 0, y: 26 },
  fade: { opacity: 0 },
  blur: { opacity: 0, y: 16, filter: 'blur(8px)' },
  scale: { opacity: 0, scale: 0.94 },
  left: { opacity: 0, x: -34 },
  right: { opacity: 0, x: 34 },
}

const VARIANT_END: Record<RevealVariant, Record<string, number | string>> = {
  rise: { opacity: 1, y: 0 },
  fade: { opacity: 1 },
  blur: { opacity: 1, y: 0, filter: 'blur(0px)' },
  scale: { opacity: 1, scale: 1 },
  left: { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
}

/** Scroll reveal with premium variants (respects prefers-reduced-motion). */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  variant = 'rise',
  duration = 0.6,
  once = true,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  variant?: RevealVariant
  duration?: number
  once?: boolean
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'span'
}) {
  const reduce = useReducedMotion()
  const M = motion[as] as typeof motion.div
  const init = { ...VARIANT_INIT[variant] }
  if (variant === 'rise') init.y = y
  return (
    <M
      initial={reduce ? false : init}
      whileInView={VARIANT_END[variant]}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </M>
  )
}

/** Stagger container — pair with Reveal children for orchestrated sequences. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  as?: 'div' | 'ol' | 'ul'
}) {
  const reduce = useReducedMotion()
  const M = motion[as] as typeof motion.div
  return (
    <M
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </M>
  )
}

/** Child of <Stagger> — rises with blur, premium staggered feel. */
export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li'
}) {
  const reduce = useReducedMotion()
  const M = motion[as] as typeof motion.div
  return (
    <M
      variants={
        reduce
          ? undefined
          : {
              hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
              show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE } },
            }
      }
      className={className}
    >
      {children}
    </M>
  )
}

/** 3D tilt card on hover (pointer-fine devices only; reduced-motion safe). */
export function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  if (reduce) return <div className={className}>{children}</div>

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateY(-3px)`
  }
  const onLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn('will-change-transform transition-transform duration-300 ease-out', className)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

/** Count-up number; pauses at final value if reduced motion. */
export function CountUp({
  to,
  suffix = '',
  prefix = '',
  duration = 1400,
  decimals = 0,
  className,
  locale = 'en-IN',
}: {
  to: number
  suffix?: string
  prefix?: string
  duration?: number
  decimals?: number
  className?: string
  /** Number grouping locale — default Indian; pass 'en-US' when source shows western grouping (e.g. "250,000"). */
  locale?: 'en-IN' | 'en-US'
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: false, margin: '-40px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setValue(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(to * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration, reduce])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {value.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}
