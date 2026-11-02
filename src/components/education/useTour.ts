import { createContext, useContext } from 'react'
import type { TourConfig, TourLocation, TourMission, TourRole } from './types'

/**
 * Tour context lives apart from TourProvider so that provider file only
 * exports a component (keeps fast refresh working). The engine itself —
 * reducer, localStorage hydration, XP recomputation — stays in
 * TourProvider.tsx.
 */

export type TourPhase = 'intro' | 'campus' | 'roles' | 'missions' | 'summary'

export type TourState = {
  open: boolean
  phase: TourPhase
  paused: boolean
  badges: string[]
  doneMissions: string[]
  visitedLocations: string[]
  activeRole: string | null
  activeLocation: string | null
  /** Mission currently being run in the dialog (id). */
  runMission: string | null
  hydrated: boolean
}

export type TourCtx = {
  state: TourState
  config: TourConfig
  /** XP recomputed from completed missions (never read from storage). */
  xp: number
  totalXp: number
  open: (phase?: TourPhase) => void
  close: () => void
  setPhase: (phase: TourPhase) => void
  setPaused: (paused: boolean) => void
  selectLocation: (loc: TourLocation | null) => void
  pickRole: (role: TourRole) => void
  runMission: (id: string | null) => void
  completeMission: (mission: TourMission) => void
  reset: () => void
}

export const TourContext = createContext<TourCtx | null>(null)

export function useTour(): TourCtx {
  const ctx = useContext(TourContext)
  if (!ctx) throw new Error('useTour must be used within TourProvider')
  return ctx
}
