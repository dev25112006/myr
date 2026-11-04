import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { resolveAddToCart } from '@/lib/catalog'

/* ---------------------------------- types --------------------------------- */

export type CartItem = {
  /** Woo product id */
  id: number
  name: string
  price: number
  compareAt?: number
  slug?: string
  image?: string
  qty: number
  /** e.g. plan/variation label */
  variant?: string
}

export type AuthUser = { id: string; email: string; role: 'customer' | 'admin' | 'manager'; emailVerified?: boolean; createdAt: string; mfaEnabled?: boolean }
export type TeamMember = { id: string; name: string; email: string; department: string; title: string; addedAt: string }
export type InboxEntry = { id: string; type: 'lead' | 'ticket' | 'form' | 'order'; subject: string; name: string; email: string; message: string; date: string; status: 'New' | 'In progress' | 'Resolved'; source: string; replies?: Array<{ id: string; author: string; message: string; date: string }> }

/* --------------------------------- helpers -------------------------------- */

const CART_KEY = 'myr.cart.v1'
const CART_OWNER_KEY = 'myr.cart.owner.v1'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}


function normalizeCartQuantity(value: number, unitPrice = 1) {
  if (!Number.isFinite(value)) return 1
  const maxByAmount = Math.floor(Number.MAX_SAFE_INTEGER / Math.max(1, unitPrice))
  return Math.max(1, Math.min(maxByAmount, Math.floor(value)))
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — cart stays in memory */
  }
}

/* --------------------------------- cart ----------------------------------- */

type CartCtx = {
  items: CartItem[]
  count: number
  total: number
  add: (input: {
    id: number
    qty?: number
    variant?: string
    /** price override (source CTAs show different prices for same id) */
    price?: number
    name?: string
  }) => boolean
  setQty: (id: number, qty: number, variant?: string) => void
  remove: (id: number, variant?: string) => void
  clear: () => void
}

const CartContext = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>(() => load<CartItem[]>(CART_KEY, []))
  const [cartLoadedFor, setCartLoadedFor] = useState<string | null>(null)

  useEffect(() => save(CART_KEY, items), [items])
  useEffect(() => {
    const clearOnLogout = () => {
      setItems([])
      try { localStorage.removeItem(CART_KEY); localStorage.removeItem(CART_OWNER_KEY) } catch {}
    }
    window.addEventListener('myr:cart-logout', clearOnLogout)
    return () => window.removeEventListener('myr:cart-logout', clearOnLogout)
  }, [])
  useEffect(() => {
    if (!user) { setCartLoadedFor(null); try { localStorage.removeItem(CART_OWNER_KEY) } catch {}; return }
    let cancelled = false; setCartLoadedFor(null)
    const priorOwner = (() => { try { return localStorage.getItem(CART_OWNER_KEY) } catch { return null } })()
    void fetch('/api/account/cart', { credentials: 'same-origin' }).then((r) => r.ok ? r.json() : null).then((data) => {
      if (cancelled || !data) return
      const remote: CartItem[] = data.items.flatMap((row: { id: number; qty: number; variant?: string }) => { const product = resolveAddToCart(row.id); return product ? [{ ...product, qty: row.qty, variant: row.variant || undefined }] : [] })
      if (priorOwner !== null) setItems(remote)
      else if (remote.length) setItems((local) => { const merged = [...remote]; for (const item of local) { const at = merged.findIndex((existing) => existing.id === item.id && existing.variant === item.variant); if (at < 0) merged.push(item); else merged[at] = { ...merged[at], qty: normalizeCartQuantity(merged[at].qty + item.qty, merged[at].price) } }; return merged })
      try { localStorage.setItem(CART_OWNER_KEY, user.id) } catch {}
    }).catch(() => {}).finally(() => { if (!cancelled) setCartLoadedFor(user.id) })
    return () => { cancelled = true }
  }, [user?.id])
  useEffect(() => {
    if (!user || cartLoadedFor !== user.id) return
    void fetch('/api/account/cart', { method: 'PUT', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: items.map(({ id, qty, variant }) => ({ id, qty, variant })) }) }).catch(() => {})
  }, [items, user?.id, cartLoadedFor])

  const add: CartCtx['add'] = useCallback(({ id, qty = 1, variant, price, name }) => {
    const product = resolveAddToCart(id)
    if (!product && price === undefined) return false
    setItems((prev) => {
      const key = (i: CartItem) => i.id === id && i.variant === variant
      const existing = prev.find(key)
      if (existing) {
        return prev.map((i) => (key(i) ? { ...i, qty: normalizeCartQuantity(i.qty + qty, i.price) } : i))
      }
      return [
        ...prev,
        {
          id,
          name: name ?? product!.name,
          price: price ?? product!.price,
          compareAt: product?.compareAt,
          slug: product?.slug,
          image: product?.image,
          qty: normalizeCartQuantity(qty, price ?? product!.price),
          variant,
        },
      ]
    })
    return true
  }, [])

  const setQty: CartCtx['setQty'] = useCallback((id, qty, variant) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => !(i.id === id && i.variant === variant))
        : prev.map((i) => (i.id === id && i.variant === variant ? { ...i, qty: normalizeCartQuantity(qty, i.price) } : i)),
    )
  }, [])

  const remove: CartCtx['remove'] = useCallback((id, variant) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.variant === variant)))
  }, [])

  const clear = useCallback(() => setItems([]), [])
  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0)
    const total = items.reduce((n, i) => n + i.qty * i.price, 0)
    return { items, count, total, add, setQty, remove, clear }
  }, [items, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartCtx {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

/* --------------------------------- auth ----------------------------------- */

type AuthCtx = {
  user: AuthUser | null
  authLoading: boolean
  authError: string
  users: AuthUser[]
  serverInbox: InboxEntry[]
  login: (identifier: string, password: string, humanToken: string) => Promise<void>
  register: (email: string, password: string, humanToken: string, otpVerified?: boolean) => Promise<void>
  refreshUsers: () => Promise<void>
  setUserRole: (id: string, role: AuthUser['role']) => Promise<void>
  refreshInbox: () => Promise<void>
  submitInbox: (entry: Omit<InboxEntry, 'id' | 'date' | 'status'> & { humanToken: string }) => Promise<void>
  setServerInboxStatus: (id: string, status: InboxEntry['status']) => Promise<void>
  logout: () => void
  otpSend: (email: string, purpose: 'register' | 'login' | 'reset') => Promise<{ ok: boolean; message?: string; expiresIn?: number }>
  otpVerify: (email: string, code: string, purpose: 'register' | 'login' | 'reset') => Promise<{ ok: boolean; email?: string; purpose?: string; verified?: boolean }>
  otpResend: (email: string, purpose: 'register' | 'login' | 'reset') => Promise<{ ok: boolean; message?: string; expiresIn?: number }>
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [users, setUsers] = useState<AuthUser[]>([])
  const [serverInbox, setServerInbox] = useState<InboxEntry[]>([])

  const api = useCallback(async (url: string, options: RequestInit = {}) => {
    let response: Response
    try {
      response = await fetch(url, { ...options, credentials: 'same-origin', headers: { 'content-type': 'application/json', ...options.headers } })
    } catch {
      throw new Error('Cannot reach the account server. Start it with `npm run dev:api` and try again.')
    }
    let data: { error?: string; [key: string]: any }
    try { data = await response.json() } catch { throw new Error(`The account server returned an empty or invalid response (HTTP ${response.status}). Check that the API server is running.`) }
    if (!response.ok) throw new Error(data.error || 'Request failed')
    return data
  }, [])
  useEffect(() => {
    void api('/api/auth/session').then((data) => setUser(data.user)).catch(() => setAuthError('Unable to connect to the account server.')).finally(() => setAuthLoading(false))
  }, [api])
  const refreshUsers = useCallback(async () => {
    const data = await api('/api/admin/users')
    setUsers(data.users)
  }, [api])
  const setUserRole = useCallback(async (id: string, role: AuthUser['role']) => {
    const data = await api(`/api/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) })
    setUsers((previous) => previous.map((item) => item.id === id ? data.user : item))
  }, [api])
  const refreshInbox = useCallback(async () => {
    const data = await api('/api/manager/inbox')
    setServerInbox(data.inbox)
  }, [api])
  const submitInbox = useCallback(async (entry: Omit<InboxEntry, 'id' | 'date' | 'status'>) => {
    await api('/api/inbox', { method: 'POST', body: JSON.stringify(entry) })
  }, [api])
  const otpSend = useCallback(async (email: string, purpose: 'register' | 'login' | 'reset') => {
    return await api('/api/auth/otp/send', { method: 'POST', body: JSON.stringify({ email, purpose }) }) as Promise<{ ok: boolean; message?: string; expiresIn?: number }>
  }, [api])
  const otpVerify = useCallback(async (email: string, code: string, purpose: 'register' | 'login' | 'reset') => {
    return await api('/api/auth/otp/verify', { method: 'POST', body: JSON.stringify({ email, code, purpose }) }) as Promise<{ ok: boolean; email?: string; purpose?: string; verified?: boolean }>
  }, [api])
  const otpResend = useCallback(async (email: string, purpose: 'register' | 'login' | 'reset') => {
    return await api('/api/auth/otp/resend', { method: 'POST', body: JSON.stringify({ email, purpose }) }) as Promise<{ ok: boolean; message?: string; expiresIn?: number }>
  }, [api])
  const setServerInboxStatus = useCallback(async (id: string, status: InboxEntry['status']) => {
    const data = await api(`/api/manager/inbox/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    setServerInbox((previous) => previous.map((entry) => entry.id === id ? data.entry : entry))
  }, [api])
  useEffect(() => { if (user && ['admin', 'manager'].includes(user.role)) void refreshInbox().catch(() => {}) }, [user, refreshInbox])
  useEffect(() => { if (user?.role === 'admin') void refreshUsers().catch(() => {}) }, [user, refreshUsers])

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      authLoading,
      authError,
      users,
      serverInbox,
      login: async (identifier, password, humanToken) => {
        setAuthError('')
        const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: identifier, password, humanToken }) })
        setUser(data.user)
      },
      register: async (email, password, humanToken, otpVerified) => {
        setAuthError('')
        const data = await api('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, humanToken, otpVerified }) })
        setUser(data.user)
      },
      refreshUsers,
      setUserRole,
      refreshInbox,
      submitInbox,
      setServerInboxStatus,
      otpSend,
      otpVerify,
      otpResend,
      logout: async () => { await api('/api/auth/logout', { method: 'POST', body: '{}' }); setUser(null); setUsers([]); window.dispatchEvent(new Event('myr:cart-logout')) },
    }),
    [user, authLoading, authError, users, serverInbox, api, refreshUsers, setUserRole, refreshInbox, submitInbox, setServerInboxStatus, otpSend, otpVerify, otpResend],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/* ------------------------------- popups/modals ---------------------------- */

export type PopupId = 'login' | 'partner' | 'services' | 'appointment' | 'readmore' | 'privyr-signup' | null

type PopupCtx = {
  open: PopupId
  setOpen: (id: PopupId) => void
}

const PopupContext = createContext<PopupCtx | null>(null)

export function PopupProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<PopupId>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return <PopupContext.Provider value={{ open, setOpen }}>{children}</PopupContext.Provider>
}

export function usePopup(): PopupCtx {
  const ctx = useContext(PopupContext)
  if (!ctx) throw new Error('usePopup must be used within PopupProvider')
  return ctx
}
