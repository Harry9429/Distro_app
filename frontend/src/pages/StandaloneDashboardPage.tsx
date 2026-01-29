import { useEffect, useRef, useState } from 'react'
import './StandaloneDashboardPage.css'

type InvoiceStatus = 'paid' | 'unpaid'

type InvoiceRow = {
  id: string
  orderId: string
  placedBy: string
  orderDate: string
  itemCount: string
  amount: string
  status: InvoiceStatus
}

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: 'Paid',
  unpaid: 'Unpaid',
}

const INVOICES: InvoiceRow[] = [
  { id: '1', orderId: '4545', placedBy: 'Hanzla', orderDate: '2023-10-01', itemCount: '15 items', amount: '$1500', status: 'paid' },
  { id: '2', orderId: '4572', placedBy: 'Sherry', orderDate: '2023-10-02', itemCount: '20 items', amount: '$2000', status: 'unpaid' },
  { id: '3', orderId: '4580', placedBy: 'Areeba', orderDate: '2023-10-03', itemCount: '50 items', amount: '$1000', status: 'paid' },
  { id: '4', orderId: '4591', placedBy: 'Hanzla', orderDate: '2023-10-04', itemCount: '10 items', amount: '$800', status: 'unpaid' },
  { id: '5', orderId: '4602', placedBy: 'Sherry', orderDate: '2023-10-05', itemCount: '25 items', amount: '$2500', status: 'paid' },
  { id: '6', orderId: '4615', placedBy: 'Areeba', orderDate: '2023-10-06', itemCount: '30 items', amount: '$1800', status: 'unpaid' },
  { id: '7', orderId: '4620', placedBy: 'Hanzla', orderDate: '2023-10-07', itemCount: '12 items', amount: '$1200', status: 'paid' },
  { id: '8', orderId: '4633', placedBy: 'Sherry', orderDate: '2023-10-08', itemCount: '18 items', amount: '$2100', status: 'paid' },
  { id: '9', orderId: '4641', placedBy: 'Areeba', orderDate: '2023-10-09', itemCount: '22 items', amount: '$1650', status: 'unpaid' },
  { id: '10', orderId: '4650', placedBy: 'Hanzla', orderDate: '2023-10-10', itemCount: '40 items', amount: '$3200', status: 'paid' },
]

const PAGE_SIZE = 10
const TOTAL_ITEMS = 1000

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'billing', label: 'Invoice & Billing', active: true },
  { id: 'analytics', label: 'Analytics' },
  { id: 'approvals', label: 'Approvals' },
  { id: 'products', label: 'Products' },
] as const

export default function StandaloneDashboardPage() {
  const [invoicesDropdownOpen, setInvoicesDropdownOpen] = useState(false)
  const [actionsOpenId, setActionsOpenId] = useState<string | null>(null)
  const [viewDetailsOpenId, setViewDetailsOpenId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(3)
  const [search, setSearch] = useState('')
  const actionsRef = useRef<HTMLDivElement | null>(null)
  const viewDetailsRef = useRef<HTMLDivElement | null>(null)
  const invoicesDropdownRef = useRef<HTMLDivElement | null>(null)

  const start = (currentPage - 1) * PAGE_SIZE + 1
  const end = Math.min(currentPage * PAGE_SIZE, TOTAL_ITEMS)

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const el = actionsRef.current
      if (el && e.target instanceof Node && el.contains(e.target)) return
      const v = viewDetailsRef.current
      if (v && e.target instanceof Node && v.contains(e.target)) return
      const d = invoicesDropdownRef.current
      if (d && e.target instanceof Node && d.contains(e.target)) return
      setActionsOpenId(null)
      setViewDetailsOpenId(null)
      setInvoicesDropdownOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActionsOpenId(null)
        setViewDetailsOpenId(null)
        setInvoicesDropdownOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div className="standalone-dashboard">
      {/* TOP HEADER – full width, white, subtle bottom border */}
      <header className="standalone-header">
        <div className="standalone-header-inner">
          {/* Left: Welcome + role badge */}
          <div className="standalone-header-left">
            <h1 className="standalone-welcome">
              Welcome Kumail
              <span className="standalone-welcome-caret" aria-hidden>▼</span>
            </h1>
            <span className="standalone-role-badge">
              <span className="standalone-role-dot" aria-hidden />
              Finance Manager
            </span>
          </div>

          {/* Center: tabs */}
          <nav className="standalone-tabs" aria-label="Main navigation">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`standalone-tab${tab.active ? ' standalone-tab--active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right: search, bell, menu */}
          <div className="standalone-header-right">
            <div className="standalone-header-search">
              <svg className="standalone-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" className="standalone-search-input" placeholder="Search" aria-label="Search" />
            </div>
            <button type="button" className="standalone-icon-btn" aria-label="Notifications">
              <svg className="standalone-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="standalone-notification-dot" aria-hidden />
            </button>
            <button type="button" className="standalone-icon-btn" aria-label="More options">
              <svg className="standalone-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT – light gray bg, centered container */}
      <main className="standalone-main">
        <div className="standalone-container">
          {/* Invoice & Billing section */}
          <section className="standalone-section">
            <div className="standalone-section-header" ref={invoicesDropdownRef}>
              <button
                type="button"
                className="standalone-invoices-title"
                onClick={() => setInvoicesDropdownOpen((v) => !v)}
                aria-expanded={invoicesDropdownOpen}
              >
                Invoices
                <span className="standalone-caret" aria-hidden>▼</span>
              </button>
              {invoicesDropdownOpen && (
                <div className="standalone-invoices-menu">
                  <button type="button" className="standalone-menu-item" onClick={() => setInvoicesDropdownOpen(false)}>All Invoices</button>
                  <button type="button" className="standalone-menu-item" onClick={() => setInvoicesDropdownOpen(false)}>Paid</button>
                  <button type="button" className="standalone-menu-item" onClick={() => setInvoicesDropdownOpen(false)}>Unpaid</button>
                </div>
              )}
            </div>

            <div className="standalone-controls">
              <div className="standalone-controls-search">
                <svg className="standalone-controls-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  className="standalone-controls-search-input"
                  placeholder="Order #, Buyer name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="button" className="standalone-dropdown-btn">Filter by Quantity <span aria-hidden>▼</span></button>
              <button type="button" className="standalone-dropdown-btn">Category <span aria-hidden>▼</span></button>
            </div>

            {/* White card – invoice table */}
            <div className="standalone-card standalone-table-card">
              <div className="standalone-table-wrap">
                <table className="standalone-table">
                  <thead>
                    <tr>
                      <th className="standalone-th-check"><input type="checkbox" className="standalone-checkbox" aria-label="Select all" /></th>
                      <th>Order ID</th>
                      <th>Placed By</th>
                      <th>Order Date</th>
                      <th>Item Count</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INVOICES.map((row) => (
                      <tr key={row.id} className="standalone-tr">
                        <td className="standalone-td-check"><input type="checkbox" className="standalone-checkbox" aria-label={`Select ${row.orderId}`} /></td>
                        <td>
                          <div className="standalone-order-cell" ref={viewDetailsOpenId === row.id ? viewDetailsRef : undefined}>
                            <span className="standalone-order-id">Order ID #{row.orderId}</span>
                            <button
                              type="button"
                              className="standalone-view-details-btn"
                              onClick={() => setViewDetailsOpenId((v) => (v === row.id ? null : row.id))}
                              aria-expanded={viewDetailsOpenId === row.id}
                            >
                              View details <span className="standalone-btn-caret" aria-hidden>▼</span>
                            </button>
                            {viewDetailsOpenId === row.id && (
                              <div className="standalone-view-menu">
                                <button type="button" className="standalone-view-menu-item" onClick={() => setViewDetailsOpenId(null)}>Order details</button>
                                <button type="button" className="standalone-view-menu-item" onClick={() => setViewDetailsOpenId(null)}>Payment</button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>{row.placedBy}</td>
                        <td>{row.orderDate}</td>
                        <td>{row.itemCount}</td>
                        <td>{row.amount}</td>
                        <td>
                          <span className={`standalone-status standalone-status--${row.status}`}>
                            <span className="standalone-status-dot" aria-hidden />
                            {STATUS_LABEL[row.status]}
                          </span>
                        </td>
                        <td>
                          <div className="standalone-action-cell" ref={actionsOpenId === row.id ? actionsRef : undefined}>
                            <button
                              type="button"
                              className="standalone-actions-outline-btn"
                              onClick={() => setActionsOpenId((v) => (v === row.id ? null : row.id))}
                              aria-expanded={actionsOpenId === row.id}
                            >
                              Actions <span className="standalone-btn-caret" aria-hidden>▼</span>
                            </button>
                            <button type="button" className="standalone-void-btn">Void Invoice</button>
                            {actionsOpenId === row.id && (
                              <div className="standalone-actions-menu">
                                <button type="button" className="standalone-actions-menu-item" onClick={() => setActionsOpenId(null)}>Send Reminder</button>
                                <button type="button" className="standalone-actions-menu-item" onClick={() => setActionsOpenId(null)}>Mark as Paid</button>
                                <button type="button" className="standalone-actions-menu-item" onClick={() => setActionsOpenId(null)}>Download PDF</button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer */}
              <div className="standalone-pagination">
                <span className="standalone-pagination-info">Showing {start}–{end} of {TOTAL_ITEMS}</span>
                <div className="standalone-pagination-btns">
                  <button type="button" className="standalone-pagination-arrow" aria-label="Previous" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`standalone-pagination-num${currentPage === p ? ' standalone-pagination-num--active' : ''}`}
                      onClick={() => setCurrentPage(p)}
                      aria-label={`Page ${p}`}
                      aria-current={currentPage === p ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  ))}
                  <button type="button" className="standalone-pagination-arrow" aria-label="Next" onClick={() => setCurrentPage((p) => Math.min(10, p + 1))} disabled={currentPage === 10}>›</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
