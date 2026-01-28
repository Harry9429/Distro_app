import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type OrderStatus = 'approved' | 'pending' | 'rejected'

type OrderRow = {
  id: string
  placedBy: string
  role: string
  itemCount: string
  total: string
  status: OrderStatus
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
}

export default function OrdersPage() {
  const initialRows = useMemo<OrderRow[]>(
    () => [
      {
        id: 'Order ID #4573',
        placedBy: 'Hanzla',
        role: 'Admin',
        itemCount: '15 items',
        total: '$1500',
        status: 'approved',
      },
      {
        id: 'Order ID #4724',
        placedBy: 'Sherry',
        role: 'Assistant',
        itemCount: '20 items',
        total: '$2000',
        status: 'pending',
      },
      {
        id: 'Order ID #4773',
        placedBy: 'Areeba',
        role: 'Assistant',
        itemCount: '10 items',
        total: '$1000',
        status: 'rejected',
      },
      {
        id: 'Order ID #4863',
        placedBy: 'Sherry',
        role: 'Assistant',
        itemCount: '50 items',
        total: '$1000',
        status: 'approved',
      },
    ],
    [],
  )

  const [rows, setRows] = useState<OrderRow[]>(initialRows)
  const [openForOrderId, setOpenForOrderId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const menu = menuRef.current
      if (!menu) return
      if (e.target instanceof Node && menu.contains(e.target)) return
      setOpenForOrderId(null)
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenForOrderId(null)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div className="content-area">
      <h2 className="section-title text-2xl font-semibold text-gray-900">Quick Overview</h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label text-sm font-medium text-gray-500">Total Orders Placed</div>
          <div className="stat-value text-xl font-bold text-gray-900">12.4k</div>
        </div>
        <div className="stat-card">
          <div className="stat-label text-sm font-medium text-gray-500">Active Orders</div>
          <div className="stat-value text-xl font-bold text-gray-900">3</div>
        </div>
        <div className="stat-card">
          <div className="stat-label text-sm font-medium text-gray-500">Backordered / Issues</div>
          <div className="stat-value text-xl font-bold text-gray-900">2</div>
        </div>
        <div className="stat-card">
          <div className="stat-label text-sm font-medium text-gray-500">Pending Approvals</div>
          <div className="stat-value text-xl font-bold text-gray-900">4</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <button className="filter-button text-sm font-medium text-gray-700" type="button">
          Filter by status <span aria-hidden="true">▼</span>
        </button>
        <button className="filter-button text-sm font-medium text-gray-700" type="button">
          Filter by date <span aria-hidden="true">▼</span>
        </button>
      </div>

      {/* Action Cards */}
      <div className="action-cards">
        <div className="action-card">
          <div className="action-header">
            <svg
              className="action-icon w-6 h-6 shrink-0 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <div className="action-info">
              <h3>Quick Order</h3>
              <p>Start a new order quickly with SKU search.</p>
            </div>
          </div>
          <div className="product-images">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%234a3020' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-size='10' text-anchor='middle' dy='.3em'%3EPOWER%3C/text%3E%3C/svg%3E"
              alt="Product 1"
              className="product-image"
            />
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%2390c090' width='80' height='80'/%3E%3Ccircle cx='40' cy='40' r='30' fill='%236aa06a'/%3E%3C/svg%3E"
              alt="Product 2"
              className="product-image"
            />
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23c04040' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-size='8' text-anchor='middle' dy='.3em'%3EGUMMIES%3C/text%3E%3C/svg%3E"
              alt="Product 3"
              className="product-image"
            />
          </div>
          <button className="action-button" type="button">
            Order <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="action-card">
          <div className="action-header">
            <svg
              className="action-icon w-6 h-6 shrink-0 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
              <path d="M21 7v10" />
            </svg>
            <div className="action-info">
              <h3>Reorder Last Order</h3>
              <p>Order #1234 from 2023-10-01, Total: $1,200</p>
            </div>
          </div>
          <div className="product-images">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%234a3020' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-size='10' text-anchor='middle' dy='.3em'%3EPOWER%3C/text%3E%3C/svg%3E"
              alt="Product 1"
              className="product-image"
            />
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%2390c090' width='80' height='80'/%3E%3Ccircle cx='40' cy='40' r='30' fill='%236aa06a'/%3E%3C/svg%3E"
              alt="Product 2"
              className="product-image"
            />
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23c04040' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-size='8' text-anchor='middle' dy='.3em'%3EGUMMIES%3C/text%3E%3C/svg%3E"
              alt="Product 3"
              className="product-image"
            />
          </div>
          <button className="action-button" type="button">
            Order <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="action-card">
          <div className="action-header">
            <svg
              className="action-icon w-6 h-6 shrink-0 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <div className="action-info">
              <h3>Saved Order Templates</h3>
              <p>Template for Monthly Replenishment</p>
            </div>
          </div>
          <div className="product-images">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%234a3020' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-size='10' text-anchor='middle' dy='.3em'%3EPOWER%3C/text%3E%3C/svg%3E"
              alt="Product 1"
              className="product-image"
            />
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%2390c090' width='80' height='80'/%3E%3Ccircle cx='40' cy='40' r='30' fill='%236aa06a'/%3E%3C/svg%3E"
              alt="Product 2"
              className="product-image"
            />
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23c04040' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-size='8' text-anchor='middle' dy='.3em'%3EGUMMIES%3C/text%3E%3C/svg%3E"
              alt="Product 3"
              className="product-image"
            />
          </div>
          <button className="action-button" type="button">
            Order <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* Order Requests Table */}
      <div className="order-requests-section">
        <h2 className="text-lg font-semibold text-gray-900">
          Order Requests <span aria-hidden="true">▼</span>
        </h2>
        <div className="table-container">
          <table>
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
                <tr key={row.id}>
                  <td>
                    <input type="checkbox" className="checkbox" />
                  </td>
                  <td>
                    <strong>{row.id}</strong>
                  </td>
                  <td>
                    <Link
                      to={`/orders/view/${row.id.replace(/^Order ID #/, '')}`}
                      state={{ status: row.status }}
                      className="view-request-button"
                    >
                      View Request <span aria-hidden="true">▼</span>
                    </Link>
                  </td>
                  <td>{row.placedBy}</td>
                  <td>{row.role}</td>
                  <td>{row.itemCount}</td>
                  <td>{row.total}</td>
                  <td>
                    <div className="status-dropdown-wrap">
                      <button
                        type="button"
                        className={`status-dropdown ${row.status}`}
                        aria-haspopup="menu"
                        aria-expanded={openForOrderId === row.id}
                        onClick={() =>
                          setOpenForOrderId((prev) =>
                            prev === row.id ? null : row.id,
                          )
                        }
                      >
                        {STATUS_LABEL[row.status]}
                        <span aria-hidden="true">▼</span>
                      </button>

                      {openForOrderId === row.id && (
                        <div
                          ref={menuRef}
                          className="status-menu"
                          role="menu"
                          aria-label={`Status options for ${row.id}`}
                        >
                          {(
                            ['approved', 'pending', 'rejected'] as const
                          ).map((status) => (
                            <button
                              key={status}
                              type="button"
                              role="menuitem"
                              className={`status-menu-item ${status}${
                                status === row.status ? ' active' : ''
                              }`}
                              onClick={() => {
                                setRows((prev) =>
                                  prev.map((r) =>
                                    r.id === row.id
                                      ? { ...r, status }
                                      : r,
                                  ),
                                )
                                setOpenForOrderId(null)
                              }}
                            >
                              <span
                                className={`status-dot ${status}`}
                                aria-hidden="true"
                              />
                              {STATUS_LABEL[status]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

