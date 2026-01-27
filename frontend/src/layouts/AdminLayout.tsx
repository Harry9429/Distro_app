import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useMatch } from 'react-router-dom'
import '../pages/adminOrdersPage.css'

function TabLink({ to, label }: { to: string; label: string }) {
  const match = useMatch(to)
  const isActive = Boolean(match)
  return (
    <NavLink to={to} className={`tab${isActive ? ' active' : ''}`}>
      {label}
    </NavLink>
  )
}

function SideLink({
  to,
  icon,
  label,
  badge,
}: {
  to: string
  icon: React.ReactNode
  label: string
  badge?: string
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
    >
      {icon}
      <span>{label}</span>
      {badge ? <span className="nav-badge">{badge}</span> : null}
    </NavLink>
  )
}

export default function AdminLayout() {
  const location = useLocation()
  const storeButtonId = useId()
  const storeMenuId = useId()
  const storeDropdownRef = useRef<HTMLDivElement | null>(null)
  const userProfileTriggerRef = useRef<HTMLButtonElement | null>(null)

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
    // Close the profile overlay when navigating away from screens that render it.
    if (location.pathname !== '/overview' && location.pathname !== '/dashboard') {
      setIsProfileCardOpen(false)
    }
  }, [location.pathname])

  const profileCardContextValue = useMemo(
    () => ({
      isOpen: isProfileCardOpen,
      toggle: () => setIsProfileCardOpen((v) => !v),
      close: () => setIsProfileCardOpen(false),
      triggerRef: userProfileTriggerRef,
    }),
    [isProfileCardOpen],
  )

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="menu-icon" aria-label="Menu">
            <span />
            <span />
            <span />
          </div>
          <div className="logo">
            <div className="logo-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#2a2d35" />
                <path d="M2 17L12 22L22 17" stroke="#2a2d35" strokeWidth="2" />
                <path d="M2 12L12 17L22 12" stroke="#2a2d35" strokeWidth="2" />
              </svg>
            </div>
            <span>Distributor OS</span>
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
            <div className="store-name">{selectedStore.name}</div>
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
            icon={
              <svg
                className="nav-item-icon"
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

          <SideLink
            to="/team"
            label="Team"
            icon={
              <svg
                className="nav-item-icon"
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
            icon={
              <svg
                className="nav-item-icon"
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
            icon={
              <svg
                className="nav-item-icon"
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
            icon={
              <svg
                className="nav-item-icon"
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
            icon={
              <svg
                className="nav-item-icon"
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
            icon={
              <svg
                className="nav-item-icon"
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
            icon={
              <svg
                className="nav-item-icon"
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
            icon={
              <svg
                className="nav-item-icon"
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
            icon={
              <svg
                className="nav-item-icon"
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

          <div style={{ marginTop: 24 }}>
            <button
              ref={userProfileTriggerRef}
              type="button"
              className="user-profile user-profile-trigger"
              onClick={() => setIsProfileCardOpen((v) => !v)}
            >
              <div
                className="user-avatar"
                style={{
                  background:
                    "url(\"data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23e74c3c%22/></svg>\") center/cover",
                }}
              />
              <div className="user-info">
                <div className="user-name">Hanzla Shahid</div>
                <div className="user-role">Admin</div>
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
        {/* Top Bar */}
        <div className="top-bar">
          <div className="welcome-section">
            <h1 className="welcome-text">Welcome Hanzla</h1>
            <div className="user-badge">Distributor</div>
          </div>
          <div className="top-bar-actions">
            <div className="search-bar">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search" />
            </div>
            <button className="icon-button" type="button" aria-label="Notifications">
              <svg
                width="22"
                height="22"
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
            <button className="icon-button" type="button" aria-label="Cart">
              <svg
                width="22"
                height="22"
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
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <TabLink to="/overview" label="Overview" />
          <TabLink to="/orders" label="Orders" />
          <TabLink to="/approvals" label="Approvals" />
          <TabLink to="/products" label="Products" />
        </div>

        <ProfileCardContext.Provider value={profileCardContextValue}>
          <Outlet />
        </ProfileCardContext.Provider>
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

export const ProfileCardContext = React.createContext<ProfileCardContextValue | null>(
  null,
)

