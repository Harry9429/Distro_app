import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type OrderStatus = 'approved' | 'pending' | 'rejected'

type ApprovalRow = {
  id: string
  orderId: string
  placedBy: string
  role: string
  itemCount: string
  total: string
  status: OrderStatus
  deliveredOn?: string
  orderTotal: string
  productThumbs: string[]
  moreCount: number
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
}

const THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23e5e7eb' width='64' height='64' rx='8'/%3E%3C/svg%3E"

const ROWS: ApprovalRow[] = [
  { id: '1', orderId: '4573', placedBy: 'Hanzla', role: 'Admin', itemCount: '15 items', total: '$1500', status: 'approved', deliveredOn: '4 Jan', orderTotal: '$2,674', productThumbs: [THUMB, THUMB, THUMB, THUMB, THUMB], moreCount: 4 },
  { id: '2', orderId: '4724', placedBy: 'Sherry', role: 'Assistant', itemCount: '20 items', total: '$2000', status: 'pending', orderTotal: '$2,100', productThumbs: [THUMB, THUMB, THUMB], moreCount: 2 },
  { id: '3', orderId: '4773', placedBy: 'Areeba', role: 'Assistant', itemCount: '10 items', total: '$1000', status: 'rejected', orderTotal: '$1,000', productThumbs: [THUMB, THUMB], moreCount: 0 },
  { id: '4', orderId: '4863', placedBy: 'Sherry', role: 'Assistant', itemCount: '50 items', total: '$1000', status: 'approved', deliveredOn: '5 Jan', orderTotal: '$5,200', productThumbs: [THUMB, THUMB, THUMB, THUMB], moreCount: 6 },
]

type TimeFilter = 'monthly' | 'weekly' | 'today'

export default function ApprovalsPage() {
  const [search, setSearch] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today')
  const [expandedId, setExpandedId] = useState<string | null>('1')
  const [rows, setRows] = useState<ApprovalRow[]>(ROWS)
  const statusMenuRef = useRef<HTMLDivElement | null>(null)
  const [openStatusId, setOpenStatusId] = useState<string | null>(null)

  const setRowStatus = (rowId: string, status: OrderStatus) => {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, status } : r)))
    setOpenStatusId(null)
  }

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const el = statusMenuRef.current
      if (!el || !openStatusId) return
      if (e.target instanceof Node && el.contains(e.target)) return
      setOpenStatusId(null)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenStatusId(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openStatusId])

  return (
    <div className="content-area approvals-page">
      <header className="approvals-header">
        <div className="approvals-header-left">
          <button type="button" className="approvals-dropdown-trigger" aria-haspopup="listbox">
            Approvals <span className="approvals-dropdown-caret" aria-hidden="true">▼</span>
          </button>
        </div>
        <div className="approvals-search-wrap">
          <svg className="approvals-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            className="approvals-search-input"
            placeholder="Order #, Buyer name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search orders or buyers"
          />
        </div>
        <div className="approvals-time-filters">
          <button
            type="button"
            className={`approvals-time-btn${timeFilter === 'monthly' ? ' active' : ''}`}
            onClick={() => setTimeFilter('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`approvals-time-btn${timeFilter === 'weekly' ? ' active' : ''}`}
            onClick={() => setTimeFilter('weekly')}
          >
            Weekly
          </button>
          <button
            type="button"
            className={`approvals-time-btn${timeFilter === 'today' ? ' active' : ''}`}
            onClick={() => setTimeFilter('today')}
          >
            Today
          </button>
        </div>
      </header>

      <section className="approvals-section">
        <h2 className="approvals-section-title">Order Approvals</h2>
        <div className="table-container approvals-table-wrap">
          <table className="approvals-table">
            <thead>
              <tr>
                <th style={{ width: 40 }} />
                <th>Order ID</th>
                <th />
                <th>Placed By</th>
                <th>Role</th>
                <th>Item Count</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className={expandedId === row.id ? 'expanded' : ''}>
                    <td>
                      <input type="checkbox" className="checkbox" aria-label={`Select ${row.orderId}`} />
                    </td>
                    <td>
                      <strong>{row.orderId}</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="approvals-view-details"
                        onClick={() => setExpandedId((prev) => (prev === row.id ? null : row.id))}
                        aria-expanded={expandedId === row.id}
                        aria-label={expandedId === row.id ? 'Collapse details' : 'View details'}
                      >
                        View Details <span aria-hidden="true">{expandedId === row.id ? '▲' : '▼'}</span>
                      </button>
                    </td>
                    <td>{row.placedBy}</td>
                    <td>{row.role}</td>
                    <td>{row.itemCount}</td>
                    <td>{row.total}</td>
                    <td>
                      <div className="status-dropdown-wrap" ref={openStatusId === row.id ? statusMenuRef : null}>
                        <button
                          type="button"
                          className={`status-dropdown ${row.status}`}
                          aria-haspopup="listbox"
                          aria-expanded={openStatusId === row.id}
                          onClick={() => setOpenStatusId((prev) => (prev === row.id ? null : row.id))}
                        >
                          <span className={`status-dot ${row.status}`} aria-hidden="true" />
                          {STATUS_LABEL[row.status]}
                          <span aria-hidden="true">▼</span>
                        </button>
                        {openStatusId === row.id && (
                          <div className="status-menu" role="listbox">
                            {(['approved', 'pending', 'rejected'] as const).map((s) => (
                              <button
                                key={s}
                                type="button"
                                role="option"
                                className={`status-menu-item ${s}${s === row.status ? ' active' : ''}`}
                                onClick={() => setRowStatus(row.id, s)}
                              >
                                <span className={`status-dot ${s}`} />
                                {STATUS_LABEL[s]}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedId === row.id && (
                    <tr className="approvals-detail-row">
                      <td colSpan={8} className="approvals-detail-cell">
                        <div className="approvals-detail-inner">
                          <div className="approvals-detail-label">
                            Order ID #{row.orderId}
                            {row.deliveredOn ? ` Delivered on ${row.deliveredOn}` : ''}
                          </div>
                          <div className="approvals-product-thumbs">
                            {row.productThumbs.map((src, i) => (
                              <img key={i} src={src} alt="" className="approvals-thumb" />
                            ))}
                            {row.moreCount > 0 && (
                              <div className="approvals-thumb-more">+{row.moreCount}</div>
                            )}
                          </div>
                          <div className="approvals-detail-actions">
                            <Link
                              to={`/orders/view/${row.orderId}`}
                              state={{ status: row.status }}
                              className="approvals-order-details-btn"
                            >
                              Order Details
                            </Link>
                            <span className="approvals-order-total">Order Total {row.orderTotal}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
