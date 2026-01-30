import React, { useState } from 'react'
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
  orderTotal: string
  deliveryDate?: string
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
}

const ROWS: ApprovalRow[] = [
  { id: '1', orderId: '4545', placedBy: 'Hanzla', role: 'Admin', itemCount: '15 items', total: '$1500', status: 'approved', orderTotal: '$1,500', deliveryDate: '4 jan' },
  { id: '2', orderId: '4513', placedBy: 'Sherry', role: 'Assistant', itemCount: '20 items', total: '$2000', status: 'pending', orderTotal: '$2,000', deliveryDate: '12 jan' },
  { id: '3', orderId: '4594', placedBy: 'Areeba', role: 'Assistant', itemCount: '10 items', total: '$1000', status: 'approved', orderTotal: '$1,000', deliveryDate: '5 jan' },
  { id: '4', orderId: '4542', placedBy: 'Sherry', role: 'Assistant', itemCount: '50 items', total: '$1000', status: 'rejected', orderTotal: '$1,000' },
  { id: '5', orderId: '4582', placedBy: 'Hanzla', role: 'Admin', itemCount: '120 items', total: '$2300', status: 'approved', orderTotal: '$2,300', deliveryDate: '8 jan' },
  { id: '6', orderId: '4564', placedBy: 'Hanzla', role: 'Admin', itemCount: '40 items', total: '$14000', status: 'approved', orderTotal: '$14,000', deliveryDate: '10 jan' },
  { id: '7', orderId: '4573', placedBy: 'Sherry', role: 'Assistant', itemCount: '80 items', total: '$2674', status: 'approved', orderTotal: '$2,674', deliveryDate: '4 jan' },
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

const PRODUCT_PLACEHOLDER_COLORS = ['#c0392b', '#27ae60', '#8e44ad', '#2980b9', '#c0392b', '#ecf0f1', '#ecf0f1']

export default function ApprovalsPage() {
  const [search, setSearch] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today')
  const [expandedId, setExpandedId] = useState<string | null>('7')
  const [rows] = useState<ApprovalRow[]>(ROWS)

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
            Order Approvals <span className="approvals-dropdown-caret" aria-hidden>▼</span>
          </button>
        </h2>

        <div className="approvals-table-wrap">
          <table className="approvals-table">
            <thead>
              <tr>
                <th style={{ width: 44 }} />
                <ThWithCaret>Order ID</ThWithCaret>
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
                      <div className="approvals-order-id-cell">
                        <span className="approvals-order-id">Order ID #{row.orderId}</span>
                        <button
                          type="button"
                          className={`approvals-view-details${expandedId === row.id ? ' expanded' : ''}`}
                          onClick={() => setExpandedId((prev) => (prev === row.id ? null : row.id))}
                          aria-expanded={expandedId === row.id}
                          aria-label={expandedId === row.id ? 'Collapse details' : 'View details'}
                        >
                          View Details <span aria-hidden>{expandedId === row.id ? '▲' : '▼'}</span>
                        </button>
                      </div>
                    </td>
                    <td>{row.placedBy}</td>
                    <td>{row.role}</td>
                    <td>{row.itemCount}</td>
                    <td>{row.total}</td>
                    <td>
                      <span className={`approvals-status-pill ${row.status}`}>
                        <span className={`status-dot ${row.status}`} aria-hidden />
                        {STATUS_LABEL[row.status]}
                      </span>
                    </td>
                  </tr>
                  {expandedId === row.id && (
                    <tr className="approvals-expanded-row">
                      <td colSpan={7} className="approvals-expanded-cell">
                        <div className="approvals-expanded-inner">
                          {row.deliveryDate && (
                            <div className="approvals-delivered-on">Delivered on {row.deliveryDate}</div>
                          )}
                          <div className="approvals-product-images">
                            {PRODUCT_PLACEHOLDER_COLORS.map((color, i) => (
                              <div key={i} className="approvals-product-thumb" style={{ background: color }} aria-hidden />
                            ))}
                            <div className="approvals-product-more">+4</div>
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
