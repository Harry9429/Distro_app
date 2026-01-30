import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useMatch, useNavigate } from 'react-router-dom'
import { CartProvider, useCart, type ProductForCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { canAccessPath, canAccessSidebarSection, canAccessTab, getDefaultPath, ROLE_LABEL } from '../lib/rolePermissions'
import '../pages/adminOrdersPage.css'

function TabLink({
  to,
  label,
  forceActive,
  end,
}: {
  to: string
  label: string
  forceActive?: boolean
  end?: boolean
}) {
  const match = useMatch(end ? { path: to, end: true } : to)
  const isActive = Boolean(match) || Boolean(forceActive)
  return (
    <NavLink to={to} end={end} className={`tab font-medium text-[15px]${isActive ? ' active' : ''}`}>
      {label}
    </NavLink>
  )
}

function SideLink({
  to,
  icon,
  label,
  badge,
  forceActive,
  end,
  disabled,
}: {
  to: string
  icon: React.ReactNode
  label: string
  badge?: string
  forceActive?: boolean
  end?: boolean
  disabled?: boolean
}) {
  if (disabled) {
    return (
      <span
        className="nav-item nav-item--disabled font-medium text-sm"
        aria-disabled="true"
        title="You don't have access to this section"
      >
        {icon}
        <span>{label}</span>
        {badge ? <span className="nav-badge">{badge}</span> : null}
      </span>
    )
  }
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `nav-item font-medium text-sm${isActive || forceActive ? ' active' : ''}`
      }
    >
      {icon}
      <span>{label}</span>
      {badge ? <span className="nav-badge">{badge}</span> : null}
    </NavLink>
  )
}

const CART_IMG_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23e5e7eb' width='80' height='80' rx='8'/%3E%3C/svg%3E"

export default function AdminLayout() {
  return (
    <CartProvider>
      <AdminLayoutInner />
    </CartProvider>
  )
}

function AdminLayoutInner() {
  const cart = useCart()
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const storeButtonId = useId()
  const storeMenuId = useId()
  const storeDropdownRef = useRef<HTMLDivElement | null>(null)
  const userProfileTriggerRef = useRef<HTMLButtonElement | null>(null)
  const profileOverlayRef = useRef<HTMLDivElement | null>(null)

  const stores = [
    { id: 'cbd', name: 'CBD Living Store', emoji: '🏪' },
    { id: 'sunrise', name: 'Sunrise Market', emoji: '🛒' },
    { id: 'north', name: 'Northside Wholesale', emoji: '🏬' },
    { id: 'fresh', name: 'Fresh & Co.', emoji: '🥬' },
  ] as const

  const [selectedStoreId, setSelectedStoreId] = useState<
    (typeof stores)[number]['id']
  >('cbd')
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false)
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const frequentReorders: (ProductForCart & { marketPrice?: string })[] = [
    { id: 'f1', name: 'CBD Water', sku: 'PAT-234', yourPrice: '$10.00', marketPrice: '$18.00', image: CART_IMG_PLACEHOLDER },
    { id: 'f2', name: 'CBD Sparkling Water Black Cherry', sku: 'PAT-234', yourPrice: '$10.00', marketPrice: '$18.00', image: CART_IMG_PLACEHOLDER },
    { id: 'f3', name: 'CBD Sparkling Water Lemon', sku: 'PAT-234', yourPrice: '$10.00', marketPrice: '$18.00', image: CART_IMG_PLACEHOLDER },
    { id: 'f4', name: 'CBD Sparkling Water Grapefruit', sku: 'PAT-234', yourPrice: '$10.00', marketPrice: '$18.00', image: CART_IMG_PLACEHOLDER },
    { id: 'f5', name: 'CBD Sparkling Water Mango', sku: 'PAT-234', yourPrice: '$10.00', marketPrice: '$18.00', image: CART_IMG_PLACEHOLDER },
  ]
  const cartTotalQty = cart.items.reduce((s, i) => s + i.qty, 0)
  const cartSubTotal = cart.items.reduce((s, i) => {
    const n = parseInt(i.price.replace(/[^0-9]/g, ''), 10)
    return s + (Number.isNaN(n) ? 0 : n)
  }, 0)

  const selectedStore =
    stores.find((s) => s.id === selectedStoreId) ?? stores[0]

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const root = storeDropdownRef.current
      if (!root) return
      if (e.target instanceof Node && root.contains(e.target)) return
      setIsStoreMenuOpen(false)
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsStoreMenuOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!isProfileCardOpen) return
    function onPointerDown(e: PointerEvent) {
      const overlay = profileOverlayRef.current
      const trigger = userProfileTriggerRef.current
      if (overlay && e.target instanceof Node && overlay.contains(e.target)) return
      if (trigger && e.target instanceof Node && trigger.contains(e.target)) return
      setIsProfileCardOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsProfileCardOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isProfileCardOpen])

  const profileCardContextValue = useMemo(
    () => ({
      isOpen: isProfileCardOpen,
      toggle: () => setIsProfileCardOpen((v) => !v),
      close: () => setIsProfileCardOpen(false),
      triggerRef: userProfileTriggerRef,
    }),
    [isProfileCardOpen],
  )

  const role = auth.user?.role ?? 'admin'
  if (auth.user && !canAccessPath(role, location.pathname)) {
    return <Navigate to={getDefaultPath(role)} replace />
  }

  return (
    <div className={`container${isSidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className={`sidebar${isSidebarCollapsed ? ' sidebar--collapsed' : ''}`} aria-expanded={!isSidebarCollapsed}>
        <div className="sidebar-header">
          <button
            type="button"
            className="menu-icon"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setIsSidebarCollapsed((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="logo logo--dashboard">
            <div className="logo-icon flex items-center justify-center shrink-0" aria-hidden="true">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="9" height="14" rx="3" fill="currentColor" />
                <rect x="8" y="7" width="10" height="10" rx="3" fill="currentColor" />
              </svg>
            </div>
            <span className="font-semibold text-white">Distributor OS</span>
          </div>
        </div>

        <div className="store-dropdown" ref={storeDropdownRef}>
          <button
            id={storeButtonId}
            type="button"
            className="store-selector"
            aria-haspopup="menu"
            aria-expanded={isStoreMenuOpen}
            aria-controls={storeMenuId}
            onClick={() => setIsStoreMenuOpen((v) => !v)}
          >
            <div className="store-icon" aria-hidden="true">
              {selectedStore.emoji}
            </div>
            <div className="store-name font-medium text-white">{selectedStore.name}</div>
            <span
              className={`store-caret${isStoreMenuOpen ? ' open' : ''}`}
              aria-hidden="true"
            >
              ▼
            </span>
          </button>

          {isStoreMenuOpen && (
            <div
              id={storeMenuId}
              role="menu"
              aria-labelledby={storeButtonId}
              className="store-menu"
            >
              {stores.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  role="menuitem"
                  className={`store-menu-item${
                    store.id === selectedStoreId ? ' active' : ''
                  }`}
                  onClick={() => {
                    setSelectedStoreId(store.id)
                    setIsStoreMenuOpen(false)
                  }}
                >
                  <span className="store-menu-emoji" aria-hidden="true">
                    {store.emoji}
                  </span>
                  <span className="store-menu-name">{store.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="nav-menu" aria-label="Main navigation">
          <SideLink
            to="/dashboard"
            label="Dashboard"
            forceActive={location.pathname === '/overview'}
            disabled={!canAccessSidebarSection(role, '/dashboard')}
            icon={
              <svg
                className="nav-item-icon w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            }
          />
          {canAccessSidebarSection(role, '/distributors') && (
            <SideLink
              to="/distributors"
              label="Distributors"
              forceActive={location.pathname === '/distributors'}
              icon={
                <svg
                  className="nav-item-icon w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
          )}
          <SideLink
            to="/team"
            label="Team"
            disabled={!canAccessSidebarSection(role, '/team')}
            icon={
              <svg
                className="nav-item-icon w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <SideLink
            to="/orders"
            label="Orders"
            badge="10"
            end
            disabled={!canAccessSidebarSection(role, '/orders')}
            icon={
              <svg
                className="nav-item-icon w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
              </svg>
            }
          />
          <SideLink
            to="/approvals"
            label="Approvals"
            forceActive={location.pathname === '/approvals' || location.pathname.startsWith('/orders/view/')}
            disabled={!canAccessSidebarSection(role, '/approvals')}
            icon={
              <svg
                className="nav-item-icon w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            }
          />
          <SideLink
            to="/billing"
            label="Invoice & Billing"
            disabled={!canAccessSidebarSection(role, '/billing')}
            icon={
              <svg
                className="nav-item-icon w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M22 10H2M6 6V2M10 6V2M14 6V2M18 6V2" />
              </svg>
            }
          />
          <SideLink
            to="/analytics"
            label="Analytics"
            disabled={!canAccessSidebarSection(role, '/analytics')}
            icon={
              <svg
                className="nav-item-icon w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 17V7M15 17V11" />
              </svg>
            }
          />
          <SideLink
            to="/products"
            label="Products"
            forceActive={location.pathname.startsWith('/products')}
            disabled={!canAccessSidebarSection(role, '/products')}
            icon={
              <svg
                className="nav-item-icon w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            }
          />
        </nav>

        <div className="sidebar-footer">
          <SideLink
            to="/settings"
            label="Settings"
            disabled={!canAccessSidebarSection(role, '/settings')}
            icon={
              <svg
                className="nav-item-icon w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.07 5.07l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.07-5.07l4.24-4.24" />
              </svg>
            }
          />
          <SideLink
            to="/resources"
            label="Resources"
            disabled={!canAccessSidebarSection(role, '/resources')}
            icon={
              <svg
                className="nav-item-icon w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            }
          />
          <SideLink
            to="/submit-ticket"
            label="Submit Ticket"
            disabled={!canAccessSidebarSection(role, '/submit-ticket')}
            icon={
              <svg
                className="nav-item-icon w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
          />

          <div className="user-card-trigger-wrap">
            <button
              ref={userProfileTriggerRef}
              type="button"
              className="user-profile user-profile-trigger"
              onClick={() => setIsProfileCardOpen((v) => !v)}
              aria-label="Open user card"
              aria-expanded={isProfileCardOpen}
              aria-haspopup="true"
            >
              <div
                className="user-avatar"
                style={{
                  background:
                    "url(\"data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23e74c3c%22/></svg>\") center/cover",
                }}
              />
              <div className="user-info">
                <div className="user-name font-medium text-white text-sm">{auth.user?.name ?? auth.user?.email ?? 'User'}</div>
                <div className="user-role text-xs text-white/80">{auth.user ? ROLE_LABEL[auth.user.role] : 'User'}</div>
              </div>
              <div className="user-menu" aria-hidden="true">
                ⋮
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-content-inner">
          <div className="main-content-primary">
            {/* Top Bar */}
            <div className="top-bar flex items-center justify-between">
          <div className="welcome-section flex items-center gap-4 shrink-0">
            <h1 className="welcome-text text-2xl font-bold text-gray-900 flex items-center gap-2">
              Welcome {auth.user?.name ?? auth.user?.email?.split('@')[0] ?? 'User'}
              <span className="welcome-caret" aria-hidden>▼</span>
            </h1>
            <div className="user-badge text-sm font-medium text-gray-700">{auth.user ? ROLE_LABEL[auth.user.role] : 'User'}</div>
          </div>
          <div className="top-bar-actions flex items-center gap-5 shrink-0">
            <div className="search-bar flex items-center gap-3">
              <input type="text" className="search-bar-input min-w-0 flex-1" placeholder="Search" />
              <svg
                className="search-bar-icon w-[18px] h-[18px] shrink-0 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <button className="icon-button flex items-center justify-center shrink-0" type="button" aria-label="Notifications">
              <svg
                className="icon-button-svg w-[22px] h-[22px] shrink-0 block text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notification-badge" />
            </button>
            {(role === 'finance_manager' || role === 'merchant' || role === 'admin') ? (
              <button
                className="icon-button icon-button-ellipsis flex items-center justify-center shrink-0"
                type="button"
                aria-label="More options"
              >
                <svg className="icon-button-svg w-[22px] h-[22px] shrink-0 block text-gray-900" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <circle cx="6" cy="12" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="18" cy="12" r="1.5" />
                </svg>
              </button>
            ) : (
              <button
                className="icon-button flex items-center justify-center shrink-0"
                type="button"
                aria-label="Cart"
                aria-expanded={cart.isOpen}
                onClick={() => (cart.isOpen ? cart.closeCart() : cart.openCart())}
              >
                <svg
                  className="icon-button-svg w-[22px] h-[22px] shrink-0 block text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </button>
            )}
            {(role === 'merchant' || role === 'admin') && (
              <Link to="/distributors/add" className="top-bar-add-distributor">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Distributor
              </Link>
            )}
          </div>
        </div>

        {/* Tabs – hidden on Settings page. Only show tabs the role can access (no disabled tabs) */}
        {location.pathname !== '/settings' && location.pathname !== '/profile' && location.pathname !== '/distributors/add' && location.pathname !== '/billing' && (
        <div className="tabs">
          {canAccessTab(role, '/overview') && (
            <TabLink
              to="/overview"
              label="Dashboard"
              forceActive={location.pathname === '/dashboard'}
            />
          )}
          {canAccessTab(role, '/distributors') && (
            <TabLink to="/distributors" label="Distributors" forceActive={location.pathname === '/distributors'} />
          )}
          {canAccessTab(role, '/orders') && (
            <TabLink to="/orders" label="Orders" end />
          )}
          {canAccessTab(role, '/billing') && (
            <TabLink to="/billing" label="Invoice & Billing" forceActive={location.pathname === '/billing'} />
          )}
          {canAccessTab(role, '/analytics') && (
            <TabLink to="/analytics" label="Analytics" forceActive={location.pathname === '/analytics'} />
          )}
          {canAccessTab(role, '/approvals') && (
            <TabLink to="/approvals" label="Approvals" forceActive={location.pathname === '/approvals' || location.pathname.startsWith('/orders/view/')} />
          )}
          {canAccessTab(role, '/products') && (
            <TabLink to="/products" label="Products" forceActive={location.pathname.startsWith('/products')} />
          )}
        </div>
        )}

        <ProfileCardContext.Provider value={profileCardContextValue}>
          <Outlet />
        </ProfileCardContext.Provider>
          </div>
        </div>

        {/* User card – opens when user clicks their name/avatar in sidebar; matches reference design */}
        {isProfileCardOpen && (
          <div
            ref={profileOverlayRef}
            className="profile-card-overlay profile-card-overlay--layout active"
            role="dialog"
            aria-label="User card"
          >
            <div className="profile-card-header">
              <div className="currently-in text-sm font-medium text-gray-500">Currently in</div>
              <div className="profile-card-user">
                <div
                  className="profile-card-avatar"
                  style={{
                    background:
                      "url(\"data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23e74c3c%22/></svg>\") center/cover",
                  }}
                />
                <div className="profile-card-info">
                  <div className="profile-card-name font-semibold text-gray-900">{auth.user?.name ?? auth.user?.email ?? 'User'}</div>
                  <div className="profile-card-role text-sm font-medium text-gray-600">{auth.user ? ROLE_LABEL[auth.user.role] : 'User'}</div>
                  <div className="profile-card-email text-sm text-gray-500">{auth.user?.email ?? ''}</div>
                </div>
                <div className="profile-card-check">✓</div>
              </div>
            </div>
            <div className="profile-card-menu">
              {canAccessSidebarSection(role, '/settings') && (
                <NavLink to="/settings" className="profile-menu-item font-medium text-gray-700" onClick={() => setIsProfileCardOpen(false)}>
                  <svg className="profile-menu-icon w-5 h-5 shrink-0 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.07 5.07l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.07-5.07l4.24-4.24" />
                  </svg>
                  <span>Profile Settings</span>
                </NavLink>
              )}
              <NavLink to="/billing" className="profile-menu-item font-medium text-gray-700" onClick={() => setIsProfileCardOpen(false)}>
                <svg className="profile-menu-icon w-5 h-5 shrink-0 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span>Billing</span>
              </NavLink>
              <NavLink to="/distributors/add" className="profile-menu-item font-medium text-gray-700" onClick={() => setIsProfileCardOpen(false)}>
                <svg className="profile-menu-icon w-5 h-5 shrink-0 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Add User</span>
                <span className="profile-menu-arrow">→</span>
              </NavLink>
              <button
                type="button"
                className="profile-menu-item profile-menu-item--logout font-medium text-gray-700"
                onClick={() => {
                  setIsProfileCardOpen(false)
                  auth.logout()
                  navigate('/login')
                }}
              >
                <svg className="profile-menu-icon w-5 h-5 shrink-0 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Cart overlay - fixed panel from right, half screen, backdrop blur; not part of layout */}
        <div
          className={`cart-overlay${cart.isOpen ? ' cart-overlay--open' : ''}`}
          aria-hidden={!cart.isOpen}
        >
          <div
            className="cart-backdrop"
            role="presentation"
            aria-hidden
            onClick={cart.closeCart}
          />
          <aside className="cart-sidebar cart-drawer" aria-label="Your Order">
              <div className="cart-sidebar-header">
                <h2 className="cart-sidebar-title">Your Order</h2>
                <button
                  type="button"
                  className="cart-close-btn"
                  aria-label="Close cart"
                  onClick={() => cart.closeCart()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="cart-sidebar-body">
                <div className="cart-order-items">
                  {cart.items.length === 0 ? (
                    <div className="cart-order-empty">Your order is empty</div>
                  ) : (
                  <>
                  {cart.items.map((item) => (
                    <div key={item.id} className="cart-order-item">
                      <div className="cart-order-item-row">
                        <div className="cart-order-item-top">
                          <img src={item.image} alt="" className="cart-order-item-img" />
                          <div className="cart-order-item-info">
                            <div className="cart-order-item-sku">SKU: {item.sku}</div>
                            <div className="cart-order-item-name">{item.name}</div>
                            <div className="cart-order-item-meta">Size: {item.size}, Color: {item.color}</div>
                          </div>
                        </div>
                        <div className="cart-order-item-actions">
                          <div className="cart-qty-wrap">
                            <button
                              type="button"
                              className="cart-qty-btn"
                              aria-label="Decrease quantity"
                              onClick={() => cart.updateQty(item.id, item.qty - 1)}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              className="cart-qty-input"
                              value={item.qty}
                              onChange={(e) => {
                                const v = parseInt(e.target.value, 10)
                                if (!Number.isNaN(v) && v >= 0) cart.updateQty(item.id, v)
                              }}
                              min={0}
                              aria-label={`Quantity for ${item.name}`}
                            />
                            <button
                              type="button"
                              className="cart-qty-btn"
                              aria-label="Increase quantity"
                              onClick={() => cart.updateQty(item.id, item.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="cart-delete-btn"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => cart.removeItem(item.id)}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="cart-order-item-price">Price: {item.price}</div>
                    </div>
                  ))}
                  </>
                  )}
                </div>
                <div className="cart-frequent">
                  <button type="button" className="cart-frequent-title">
                    Frequent Reorders <span aria-hidden="true">&gt;</span>
                  </button>
                  <div className="cart-frequent-list">
                    {frequentReorders.map((p) => (
                      <div key={p.id} className="cart-frequent-card">
                        <div className="cart-frequent-img-wrap">
                          <img src={p.image} alt="" className="cart-frequent-img" />
                          <button type="button" className="cart-frequent-eye" aria-label="View">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </div>
                        <div className="cart-frequent-sku">SKU: {p.sku}</div>
                        <div className="cart-frequent-name">{p.name}</div>
                        <div className="cart-frequent-pricing">
                          <span className="cart-frequent-your">Your Price: {p.yourPrice}</span>
                          <span className="cart-frequent-market">{p.marketPrice}</span>
                        </div>
                        <button
                          type="button"
                          className="cart-frequent-add"
                          onClick={() => cart.addItem({ id: p.id, name: p.name, sku: p.sku, yourPrice: p.yourPrice, image: p.image }, 1)}
                        >
                          Add to Order
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="cart-sidebar-footer">
                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span>Selected Item</span>
                    <span>{cartTotalQty}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Sub Total</span>
                    <span>${cartSubTotal}</span>
                  </div>
                </div>
                <div className="cart-sidebar-actions">
                  <button type="button" className="cart-btn cart-btn-save">
                    Save Order for Later
                  </button>
                  <button type="button" className="cart-btn cart-btn-checkout">
                    Checkout
                  </button>
                </div>
              </div>
            </aside>
        </div>
      </main>
    </div>
  )
}

export type ProfileCardContextValue = {
  isOpen: boolean
  toggle: () => void
  close: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

export const ProfileCardContext =
  React.createContext<ProfileCardContextValue | null>(null)

