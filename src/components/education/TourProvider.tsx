import { useCallback, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { TourConfig, TourLocation, TourMission, TourRole } from './types'
import { TourContext, type TourPhase, type TourState, type TourCtx } from './useTour'

/**
 * MYR Virtual Campus tour engine.
 *
 * - Optional experience: never auto-opens, always skippable/exitable.
 * - Progress (XP, badges, completed missions) is LOCAL ONLY, stored in
 *   localStorage under `myr.edu-tour.v1.<segment>`. Nothing is sent anywhere.
 * - XP is always recomputed from completed mission ids — stored values are
 *   never trusted, so tampering with storage cannot inflate XP.
 * - Simulated actions never touch real MYR data.
 *
 * Context and the useTour hook live in ./useTour so this file exports
 * nothing but the provider component (fast refresh).
 */

const STORAGE_PREFIX = 'myr.edu-tour.v1.'

type TourAction =
  | { type: 'hydrate'; visitedLocations: string[]; doneMissions: string[]; badges: string[] }
  | { type: 'open'; phase?: TourPhase }
  | { type: 'close' }
  | { type: 'phase'; phase: TourPhase }
  | { type: 'pause'; paused: boolean }
  | { type: 'visit'; id: string }
  | { type: 'location'; id: string | null }
  | { type: 'role'; id: string }
  | { type: 'run-mission'; id: string | null }
  | { type: 'mission-done'; id: string; badge: string }
  | { type: 'reset' }

const initial: TourState = {
  open: false,
  phase: 'intro',
  paused: false,
  badges: [],
  doneMissions: [],
  visitedLocations: [],
  activeRole: null,
  activeLocation: null,
  runMission: null,
  hydrated: false,
}

function reducer(state: TourState, action: TourAction): TourState {
  switch (action.type) {
    case 'hydrate':
      return {
        ...state,
        visitedLocations: action.visitedLocations,
        doneMissions: action.doneMissions,
        badges: action.badges,
        hydrated: true,
      }
    case 'open':
      return { ...state, open: true, phase: action.phase ?? 'intro', paused: false }
    case 'close':
      return { ...state, open: false, paused: false, runMission: null }
    case 'phase':
      return { ...state, phase: action.phase }
    case 'pause':
      return { ...state, paused: action.paused }
    case 'visit':
      return state.visitedLocations.includes(action.id)
        ? state
        : { ...state, visitedLocations: [...state.visitedLocations, action.id] }
    case 'location':
      return { ...state, activeLocation: action.id }
    case 'role':
      return { ...state, activeRole: action.id }
    case 'run-mission':
      return { ...state, runMission: action.id }
    case 'mission-done': {
      if (state.doneMissions.includes(action.id)) return { ...state, runMission: null }
      return {
        ...state,
        badges: action.badge && !state.badges.includes(action.badge) ? [...state.badges, action.badge] : state.badges,
        doneMissions: [...state.doneMissions, action.id],
        // Keep the runner mounted so its success panel (title, body, badge)
        // stays visible; the user backs out manually.
      }
    }
    case 'reset':
      return { ...initial, open: true, phase: 'intro', hydrated: true }
    default:
      return state
  }
}

type SavedProgress = { visitedLocations: string[]; doneMissions: string[]; badges: string[] }

export function TourProvider({ config, children }: { config: TourConfig; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial)
  const storageKey = STORAGE_PREFIX + config.segmentId

  // Hydrate LOCAL progress once on mount (validated, then ignored if bad).
  useEffect(() => {
    let saved: SavedProgress | null = null
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          const p = parsed as Partial<SavedProgress>
          const strArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])
          const validMissions = strArr(p.doneMissions).filter((id) => config.missions.some((m) => m.id === id))
          saved = {
            visitedLocations: strArr(p.visitedLocations).filter((id) => config.locations.some((l) => l.id === id)),
            doneMissions: validMissions,
            // Badges are re-derived from completed missions — never trusted.
            badges: config.missions.filter((m) => validMissions.includes(m.id)).map((m) => m.badge),
          }
        }
      }
    } catch {
      saved = null /* corrupted storage — start fresh */
    }
    dispatch({
      type: 'hydrate',
      visitedLocations: saved?.visitedLocations ?? [],
      doneMissions: saved?.doneMissions ?? [],
      badges: saved?.badges ?? [],
    })
  }, [storageKey, config.missions, config.locations])

  // Persist LOCAL progress.
  useEffect(() => {
    if (!state.hydrated) return
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          xp: 0, // XP is always recomputed; kept only for forward compatibility
          badges: state.badges,
          doneMissions: state.doneMissions,
          visitedLocations: state.visitedLocations,
        }),
      )
    } catch {
      /* storage blocked/full — tour still works in-memory */
    }
  }, [state.hydrated, state.badges, state.doneMissions, state.visitedLocations, storageKey])

  // Lock body scroll while open.
  useEffect(() => {
    if (!state.open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [state.open])

  const xp = useMemo(
    () => config.missions.filter((m) => state.doneMissions.includes(m.id)).reduce((sum, m) => sum + m.xp, 0),
    [config.missions, state.doneMissions],
  )
  const totalXp = useMemo(() => config.missions.reduce((sum, m) => sum + m.xp, 0), [config.missions])

  const open = useCallback((phase?: TourPhase) => dispatch({ type: 'open', phase }), [])
  const close = useCallback(() => dispatch({ type: 'close' }), [])
  const setPhase = useCallback((phase: TourPhase) => dispatch({ type: 'phase', phase }), [])
  const setPaused = useCallback((paused: boolean) => dispatch({ type: 'pause', paused }), [])
  const selectLocation = useCallback((loc: TourLocation | null) => {
    dispatch({ type: 'location', id: loc?.id ?? null })
    if (loc) dispatch({ type: 'visit', id: loc.id })
  }, [])
  const pickRole = useCallback((role: TourRole) => dispatch({ type: 'role', id: role.id }), [])
  const runMission = useCallback((id: string | null) => dispatch({ type: 'run-mission', id }), [])
  const completeMission = useCallback(
    (mission: TourMission) => dispatch({ type: 'mission-done', id: mission.id, badge: mission.badge }),
    [],
  )
  const reset = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
    dispatch({ type: 'reset' })
  }, [storageKey])

  const value: TourCtx = {
    state,
    config,
    xp,
    totalXp,
    open,
    close,
    setPhase,
    setPaused,
    selectLocation,
    pickRole,
    runMission,
    completeMission,
    reset,
  }

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>
}
