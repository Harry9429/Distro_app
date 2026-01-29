import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

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

export default function BillingPage() {
  const [rows, _setRows] = useState<InvoiceRow[]>(() => [...INVOICES])
  const [invoicesDropdownOpen, setInvoicesDropdownOpen] = useState(false)
  const [viewDetailsOpenId, setViewDetailsOpenId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(3)
  const [search, setSearch] = useState('')
  const viewDetailsRef = useRef<HTMLDivElement | null>(null)
  const invoicesDropdownRef = useRef<HTMLDivElement | null>(null)

  const start = (currentPage - 1) * PAGE_SIZE + 1
  const end = Math.min(currentPage * PAGE_SIZE, TOTAL_ITEMS)

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const v = viewDetailsRef.current
      if (v && e.target instanceof Node && v.contains(e.target)) return
      const d = invoicesDropdownRef.current
      if (d && e.target instanceof Node && d.contains(e.target)) return
      setViewDetailsOpenId(null)
      setInvoicesDropdownOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
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
    <div className="content-area billing-page">
      <div className="billing-table-wrap table-container">
        <div className="billing-section-row">
          <div className="billing-invoices-header" ref={invoicesDropdownRef}>
            <button
              type="button"
              className="billing-invoices-btn"
              onClick={() => setInvoicesDropdownOpen((v) => !v)}
              aria-expanded={invoicesDropdownOpen}
              aria-haspopup="listbox"
            >
              Invoices
              <span className="billing-dropdown-caret" aria-hidden>▼</span>
            </button>
            {invoicesDropdownOpen && (
              <div className="billing-invoices-menu" role="listbox">
                <button type="button" className="billing-invoices-menu-item" onClick={() => setInvoicesDropdownOpen(false)}>All Invoices</button>
                <button type="button" className="billing-invoices-menu-item" onClick={() => setInvoicesDropdownOpen(false)}>Paid</button>
                <button type="button" className="billing-invoices-menu-item" onClick={() => setInvoicesDropdownOpen(false)}>Unpaid</button>
              </div>
            )}
          </div>
          <div className="billing-toolbar">
            <div className="billing-search">
              <input
                type="text"
                className="billing-search-input"
                placeholder="Order #, Buyer name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="billing-search-icon w-5 h-5 shrink-0 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <button type="button" className="billing-filter-btn">Filter by Quantity</button>
            <button type="button" className="billing-filter-btn">Category</button>
          </div>
        </div>
        <table className="billing-table fm-orders-table">
          <thead>
            <tr>
              <th className="billing-col-check">
                <input type="checkbox" className="fm-row-checkbox" aria-label="Select all" />
              </th>
              <th>Invoices</th>
              <th>Placed By</th>
              <th>Order Date</th>
              <th>Item Count</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="billing-col-check">
                  <input type="checkbox" className="fm-row-checkbox" aria-label={`Select order ${row.orderId}`} />
                </td>
                <td>
                  <div className="billing-order-id-wrap" ref={viewDetailsOpenId === row.id ? viewDetailsRef : undefined}>
                    <span className="billing-order-id">Order ID #{row.orderId}</span>
                    <button
                      type="button"
                      className="billing-view-details-btn"
                      onClick={() => setViewDetailsOpenId((v) => (v === row.id ? null : row.id))}
                      aria-expanded={viewDetailsOpenId === row.id}
                    >
                      View details
                      <span className="billing-view-caret" aria-hidden>▼</span>
                    </button>
                    {viewDetailsOpenId === row.id && (
                      <div className="billing-view-details-menu">
                        <Link to={`/orders/view/${row.orderId}`} className="billing-view-details-item" onClick={() => setViewDetailsOpenId(null)}>
                          Order details
                        </Link>
                        <Link to={`/orders/view/${row.orderId}/payment`} className="billing-view-details-item" onClick={() => setViewDetailsOpenId(null)}>
                          Payment
                        </Link>
                      </div>
                    )}
                  </div>
                </td>
                <td>{row.placedBy}</td>
                <td>{row.orderDate}</td>
                <td>{row.itemCount}</td>
                <td>{row.amount}</td>
                <td>
                  <span className={`invoice-status invoice-status--${row.status}`}>
                    <span className="invoice-status-dot" aria-hidden />
                    {STATUS_LABEL[row.status]}
                  </span>
                </td>
                <td>
                  <div className="billing-actions-wrap">
                    <button type="button" className="billing-export-btn" aria-label="Export">
                      <svg className="billing-export-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Export
                    </button>
                    <Link to={`/orders/view/${row.orderId}`} className="billing-details-btn">Details</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="billing-pagination">
        <span className="billing-pagination-info">
          Showing {start}-{end} of {TOTAL_ITEMS}
        </span>
        <div className="billing-pagination-controls">
          <button
            type="button"
            className="billing-pagination-arrow"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
            <button
              key={p}
              type="button"
              className={`billing-pagination-num${currentPage === p ? ' active' : ''}`}
              onClick={() => setCurrentPage(p)}
              aria-label={`Page ${p}`}
              aria-current={currentPage === p ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className="billing-pagination-arrow"
            onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
            disabled={currentPage === 10}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
