import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type OrderStatus = 'approved' | 'pending' | 'rejected'

type ApprovalRow = {
  id: string
  orderId: string
  approvedBy: string
  placedBy: string
  role: string
  itemCount: string
  total: string
  status: OrderStatus
  deliveredOn?: string
  orderTotal: string
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
}

const ROWS: ApprovalRow[] = [
  { id: '1', orderId: '4531', approvedBy: 'Hanzla', placedBy: 'Hanzla', role: 'Admin', itemCount: '15 items', total: '$1500', status: 'approved', deliveredOn: '4 jan', orderTotal: '$2,674' },
  { id: '2', orderId: '4724', approvedBy: 'Hanzla', placedBy: 'Sherry', role: 'Assistant', itemCount: '20 items', total: '$2000', status: 'pending', orderTotal: '$2,100' },
  { id: '3', orderId: '4773', approvedBy: 'Hanzla', placedBy: 'Areeba', role: 'Assistant', itemCount: '10 items', total: '$1000', status: 'rejected', orderTotal: '$1,000' },
  { id: '4', orderId: '4573', approvedBy: 'Hanzla', placedBy: 'Sherry', role: 'Assistant', itemCount: '50 items', total: '$1000', status: 'approved', deliveredOn: '4 jan', orderTotal: '$2,674' },
]

type TimeFilter = 'monthly' | 'weekly' | 'today'

function ThWithCaret({ children }: { children: React.ReactNode }) {
  return (
    <th>
      <span className="approvals-th-content">{children}</span>
      <span className="approvals-th-caret" aria-hidden>▼</span>
    </th>
  )
}

export default function ApprovalsPage() {
  const [search, setSearch] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today')
  const [expandedId, setExpandedId] = useState<string | null>('4')
  const [rows, setRows] = useState<ApprovalRow[]>(ROWS)
  const [noteReason, setNoteReason] = useState('Order changed')
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
        <button type="button" className="approvals-dropdown-trigger" aria-haspopup="listbox">
          Approvals <span className="approvals-dropdown-caret" aria-hidden>▼</span>
        </button>
        <div className="approvals-search-wrap">
          <input
            type="search"
            className="approvals-search-input"
            placeholder="Order #, Buyer name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search orders or buyers"
          />
          <svg className="approvals-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <div className="approvals-time-filters">
          <button type="button" className={`approvals-time-btn${timeFilter === 'monthly' ? ' active' : ''}`} onClick={() => setTimeFilter('monthly')}>
            Monthly
          </button>
          <button type="button" className={`approvals-time-btn${timeFilter === 'weekly' ? ' active' : ''}`} onClick={() => setTimeFilter('weekly')}>
            Weekly
          </button>
          <button type="button" className={`approvals-time-btn${timeFilter === 'today' ? ' active' : ''}`} onClick={() => setTimeFilter('today')}>
            Today
          </button>
        </div>
      </header>

      <section className="approvals-card">
        <h2 className="approvals-card-title">
          <button type="button" className="approvals-card-title-btn" aria-haspopup="listbox">
            Approval History <span className="approvals-dropdown-caret" aria-hidden>▼</span>
          </button>
        </h2>

        <div className="approvals-table-wrap">
          <table className="approvals-table">
            <thead>
              <tr>
                <th style={{ width: 44 }} />
                <ThWithCaret>Order ID</ThWithCaret>
                <ThWithCaret>View Details</ThWithCaret>
                <ThWithCaret>Approved By</ThWithCaret>
                <ThWithCaret>Placed By</ThWithCaret>
                <ThWithCaret>Role</ThWithCaret>
                <ThWithCaret>Item Count</ThWithCaret>
                <ThWithCaret>Total</ThWithCaret>
                <ThWithCaret>Status</ThWithCaret>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className={expandedId === row.id ? 'expanded' : ''}>
                    <td>
                      <input type="checkbox" className="approvals-checkbox" aria-label={`Select order ${row.orderId}`} />
                    </td>
                    <td>
                      <span className="approvals-order-id">Order ID #{row.orderId}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`approvals-view-details${expandedId === row.id ? ' expanded' : ''}`}
                        onClick={() => setExpandedId((prev) => (prev === row.id ? null : row.id))}
                        aria-expanded={expandedId === row.id}
                        aria-label={expandedId === row.id ? 'Collapse details' : 'View details'}
                      >
                        View Details <span aria-hidden>{expandedId === row.id ? '▲' : '▼'}</span>
                      </button>
                    </td>
                    <td>{row.approvedBy}</td>
                    <td>{row.placedBy}</td>
                    <td>{row.role}</td>
                    <td>{row.itemCount}</td>
                    <td>{row.total}</td>
                    <td>
                      <div className="status-dropdown-wrap" ref={openStatusId === row.id ? statusMenuRef : null}>
                        <button
                          type="button"
                          className={`approvals-status-btn ${row.status}`}
                          aria-haspopup="listbox"
                          aria-expanded={openStatusId === row.id}
                          onClick={() => setOpenStatusId((prev) => (prev === row.id ? null : row.id))}
                        >
                          <span className={`status-dot ${row.status}`} aria-hidden />
                          {STATUS_LABEL[row.status]}
                          <span className="approvals-status-caret" aria-hidden>▼</span>
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
                    <tr className="approvals-expanded-row">
                      <td colSpan={9} className="approvals-expanded-cell">
                        <div className="approvals-expanded-inner">
                          {row.deliveredOn && (
                            <div className="approvals-delivered-on">Delivered on {row.deliveredOn}</div>
                          )}
                          <div className="approvals-note-section">
                            <label className="approvals-note-label">Note/Reason</label>
                            <textarea
                              className="approvals-note-input"
                              value={noteReason}
                              onChange={(e) => setNoteReason(e.target.value)}
                              rows={3}
                              aria-label="Note or reason"
                            />
                          </div>
                          <div className="approvals-card-footer">
                            <Link to={`/orders/view/${row.orderId}`} className="approvals-order-details-btn">
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
