/**
 * Shared types for the Education ERP experience — simulated dashboards,
 * tour locations, roles and missions.
 *
 * Honesty contract: everything rendered from these types is demo content.
 * Components must show <DemoBadge/> on simulated surfaces, and `status`
 * distinguishes workflows that exist in the MYR product today ('live')
 * from configurable implementation scope ('scope').
 */

export type Status = 'live' | 'scope'

export type SimStat = { label: string; value: string; note?: string }

export type SimTable = { columns: string[]; rows: string[][] }

/** A simulated dashboard screen (role / location / mission surface). */
export type SimScreen = {
  title: string
  subtitle?: string
  /** Left navigation entries of the simulated product. */
  nav: string[]
  /** Highlighted nav entry. */
  active: string
  stats?: SimStat[]
  table?: SimTable
  /** Simple checklist lines (announcements, reviews, etc.). */
  lines?: { title: string; meta?: string; status?: string }[]
  note?: string
}

/** Compact dashboard preview used inside module showcase cards. */
export type SimPreview =
  | { kind: 'stats'; items: SimStat[] }
  | { kind: 'table'; columns: string[]; rows: string[][] }
  | { kind: 'calendar'; days: { label: string; state: 'ok' | 'miss' | 'due' | 'off' }[] }
  | { kind: 'form'; fields: { label: string; value: string }[] }
  | { kind: 'chart'; bars: { label: string; value: number }[] }
  | { kind: 'list'; items: { title: string; meta?: string; status?: string }[] }

/* ------------------------------------------------------------------ */
/* Tour model                                                          */
/* ------------------------------------------------------------------ */

export type TourLocation = {
  id: string
  label: string
  /** Hotspot position on the campus scene (% of container). */
  x: number
  y: number
  status: Status
  /** Workflow explanation shown with the simulated dashboard. */
  workflow: string[]
  screen: SimScreen
}

export type RoleResponsibility = { text: string; status: Status }

export type TourRole = {
  id: string
  label: string
  blurb: string
  responsibilities: RoleResponsibility[]
  screen: SimScreen
}

export type MissionField = {
  name: string
  label: string
  kind: 'text' | 'email' | 'textarea' | 'select' | 'number'
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  hint?: string
  max?: number
}

export type TourMission = {
  id: string
  /** Display order label, e.g. "Mission 1". */
  ordinal: string
  title: string
  brief: string
  status: Status
  xp: number
  badge: string
  kind: 'form' | 'roster' | 'receipt' | 'marks' | 'publish' | 'checklist' | 'chart'
  fields?: MissionField[]
  /** roster: demo students to mark. */
  roster?: { id: string; name: string; meta: string }[]
  /** receipt: fee records with outstanding amounts (INR). */
  fees?: { value: string; label: string; outstanding: number }[]
  /** marks: exams with maximum marks. */
  exams?: { value: string; label: string; maxMarks: number }[]
  /** publish: pending results awaiting review. */
  pending?: { id: string; name: string; marks: string; max: string }[]
  /** checklist: figures to review before signing off. */
  checklist?: { id: string; text: string; meta?: string }[]
  successTitle: string
  successBody: string
}

export type TourConfig = {
  segmentId: string
  title: string
  intro: string
  locations: TourLocation[]
  roles: TourRole[]
  missions: TourMission[]
}
