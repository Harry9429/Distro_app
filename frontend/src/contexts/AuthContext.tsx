import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AUTH_USER_KEY = 'distro_app_user'
const AUTH_USERS_KEY = 'distro_app_users'

export type Role = 'merchant' | 'distributor' | 'admin' | 'purchasing_manager' | 'finance_manager'

export type AuthUser = {
  email: string
  role: Role
  name?: string
}

type StoredAccount = { password: string; role: Role; name: string }

type AuthContextValue = {
  isLoggedIn: boolean
  user: AuthUser | null
  login: (email: string, password: string) => { ok: boolean; error?: string; user?: AuthUser }
  signup: (email: string, password: string, role: Role) => { ok: boolean; error?: string; user?: AuthUser }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function parseStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    if (!raw) return null
    const u = JSON.parse(raw) as AuthUser
    if (u?.email && u?.role) return u
  } catch {}
  return null
}

function getStoredAccounts(): Record<string, StoredAccount> {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY)
    if (!raw) return {}
    const o = JSON.parse(raw) as Record<string, StoredAccount>
    return typeof o === 'object' && o !== null ? o : {}
  } catch {}
  return {}
}

function setStoredAccounts(accounts: Record<string, StoredAccount>) {
  try { localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(accounts)) } catch {}
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

function nameFromEmail(email: string): string {
  const part = email.trim().split('@')[0]
  if (!part) return 'User'
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
}

/** Fixed accounts: same password 1234 for all. Role label in UI: Admin, Distributor, etc. */
const FIXED_ACCOUNTS: Record<string, { role: Role; name: string }> = {
  'hanzla@admin.com': { role: 'admin', name: 'Hanzla' },
  'distributor@admin.com': { role: 'distributor', name: 'Distributor Admin' },
  'areeba@admin.com': { role: 'purchasing_manager', name: 'Areeba' },
  'kumail@admin.com': { role: 'finance_manager', name: 'Kumail' },
}
const FIXED_PASSWORD = '1234'

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(parseStoredUser)
  const isLoggedIn = user !== null

  const login = useCallback((email: string, password: string) => {
    const e = email.trim().toLowerCase()
    const p = String(password ?? '')
    if (!e) return { ok: false, error: 'Email is required' }
    if (!isValidEmail(email.trim())) return { ok: false, error: 'Please enter a valid email' }
    if (!p) return { ok: false, error: 'Password is required' }
    const fixed = FIXED_ACCOUNTS[e]
    if (fixed && p === FIXED_PASSWORD) {
      const authUser: AuthUser = { email: e, role: fixed.role, name: fixed.name }
      setUser(authUser)
      try { localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser)) } catch {}
      return { ok: true, user: authUser }
    }
    const accounts = getStoredAccounts()
    const acc = accounts[e]
    if (!acc) return { ok: false, error: 'No account found with this email. Sign up first.' }
    if (acc.password !== p) return { ok: false, error: 'Incorrect password' }
    const authUser: AuthUser = { email: e, role: acc.role, name: acc.name }
    setUser(authUser)
    try { localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser)) } catch {}
    return { ok: true, user: authUser }
  }, [])

  const signup = useCallback((email: string, password: string, role: Role) => {
    const e = email.trim().toLowerCase()
    const p = String(password ?? '')
    if (!e) return { ok: false, error: 'Email is required' }
    if (!isValidEmail(email.trim())) return { ok: false, error: 'Please enter a valid email' }
    if (p.length < 6) return { ok: false, error: 'Password must be at least 6 characters' }
    const accounts = getStoredAccounts()
    if (accounts[e]) return { ok: false, error: 'An account with this email already exists. Sign in instead.' }
    const name = nameFromEmail(e)
    accounts[e] = { password: p, role, name }
    setStoredAccounts(accounts)
    const authUser: AuthUser = { email: e, role, name }
    setUser(authUser)
    try { localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser)) } catch {}
    return { ok: true, user: authUser }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    try { localStorage.removeItem(AUTH_USER_KEY) } catch {}
  }, [])

  const value = useMemo(
    () => ({ isLoggedIn, user, login, signup, logout }),
    [isLoggedIn, user, login, signup, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
