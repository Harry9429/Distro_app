import type { Role } from '../contexts/AuthContext'

/** Display labels for roles (pill/badge, profile, login). Single source of truth – correct spelling. */
export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Admin',
  distributor: 'Distributor',
  merchant: 'Merchant',
  purchasing_manager: 'Purchasing Manager',
  finance_manager: 'Finance Manager',
}

/** Path prefixes or exact paths a role can access. Settings (Profile Setting) for all; Billing tab only admin+finance_manager; Add User only admin. */
const ROLE_PATH_PREFIXES: Record<Role, string[]> = {
  admin: ['/dashboard', '/overview', '/team', '/orders', '/approvals', '/billing', '/analytics', '/products', '/settings', '/resources', '/submit-ticket'],
  purchasing_manager: ['/dashboard', '/overview', '/orders', '/products', '/settings', '/resources', '/submit-ticket'],
  finance_manager: ['/dashboard', '/overview', '/approvals', '/orders/view/', '/billing', '/analytics', '/settings', '/resources', '/submit-ticket'],
  merchant: ['/dashboard', '/overview', '/team', '/orders', '/approvals', '/billing', '/analytics', '/products', '/settings', '/resources', '/submit-ticket'],
  distributor: ['/dashboard', '/overview', '/team', '/orders', '/approvals', '/billing', '/analytics', '/products', '/settings', '/resources', '/submit-ticket'],
}

export function canAccessPath(role: Role, pathname: string): boolean {
  const prefixes = ROLE_PATH_PREFIXES[role]
  if (!prefixes) return true
  const path = pathname.replace(/^\/+/, '/') || '/'
  return prefixes.some((p) => path === p || path.startsWith(p + '/') || path.startsWith(p) || path === p.replace(/\/$/, ''))
}

export function getDefaultPath(role: Role): string {
  switch (role) {
    case 'merchant':
      return '/overview'
    case 'purchasing_manager':
      return '/orders'
    case 'finance_manager':
      return '/approvals'
    default:
      return '/orders'
  }
}

/** Sections visible in sidebar: key is path prefix used in canAccessPath */
export const SIDEBAR_SECTIONS = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/team', label: 'Team' },
  { path: '/orders', label: 'Orders' },
  { path: '/approvals', label: 'Approvals' },
  { path: '/billing', label: 'Invoice & Billing' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/products', label: 'Products' },
] as const

/** Tabs: path or prefix used for visibility */
export const TAB_SECTIONS = [
  { path: '/overview', label: 'Overview' },
  { path: '/orders', label: 'Orders' },
  { path: '/approvals', label: 'Approvals' },
  { path: '/products', label: 'Products' },
] as const

export function canAccessSidebarSection(role: Role, path: string): boolean {
  const prefixes = ROLE_PATH_PREFIXES[role]
  if (!prefixes) return true
  return prefixes.some((p) => path === p || path.startsWith(p))
}

export function canAccessTab(role: Role, path: string): boolean {
  return canAccessSidebarSection(role, path === '/overview' ? '/dashboard' : path)
}
