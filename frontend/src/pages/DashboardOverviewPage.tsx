import { useContext, useEffect, useRef } from 'react'
import { ProfileCardContext } from '../layouts/AdminLayout'

export default function DashboardOverviewPage() {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const profile = useContext(ProfileCardContext)

  useEffect(() => {
    if (!profile?.isOpen) return

    function onPointerDown(e: PointerEvent) {
      const overlay = overlayRef.current
      const trigger = profile?.triggerRef.current

      if (overlay && e.target instanceof Node && overlay.contains(e.target)) return
      if (trigger && e.target instanceof Node && trigger.contains(e.target)) return

      profile?.close()
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [profile])

  return (
    <div className="content-area">
      <h2 className="section-title">Quick Overview</h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Orders Placed</div>
          <div className="stat-value">12.4k</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Orders</div>
          <div className="stat-value">3</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Backordered / Issues</div>
          <div className="stat-value">2</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Approvals</div>
          <div className="stat-value">4</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <button className="filter-button" type="button">
          Filter by status <span aria-hidden="true">▼</span>
        </button>
        <button className="filter-button" type="button">
          Filter by date <span aria-hidden="true">▼</span>
        </button>
      </div>

      {/* Action Cards */}
      <div className="action-cards">
        <div className="action-card">
          <div className="action-header">
            <svg
              className="action-icon"
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
              className="action-icon"
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
              className="action-icon"
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

      {/* Order Requests Table with Profile Card Overlay */}
      <div className="order-requests-wrapper">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }} />
                <th>Order ID</th>
                <th />
                <th>Submitted By</th>
                <th>Item Count</th>
                <th>Order Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="checkbox" className="checkbox" />
                </td>
                <td>
                  <strong>Order ID #4573</strong>
                </td>
                <td>
                  <button className="view-request-button" type="button">
                    View Request <span aria-hidden="true">▼</span>
                  </button>
                </td>
                <td>Hanzla</td>
                <td>15 items</td>
                <td>2023-10-01</td>
                <td>$1500</td>
                <td>
                  <span className="status-badge delivered">Delivered</span>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" className="checkbox" />
                </td>
                <td>
                  <strong>Order ID #4724</strong>
                </td>
                <td>
                  <button className="view-request-button" type="button">
                    View Request <span aria-hidden="true">▼</span>
                  </button>
                </td>
                <td>Sherry</td>
                <td>20 items</td>
                <td>2023-10-02</td>
                <td>$2000</td>
                <td>
                  <span className="status-badge in-transit">In Transit</span>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" className="checkbox" />
                </td>
                <td>
                  <strong>Order ID #4773</strong>
                </td>
                <td>
                  <button className="view-request-button" type="button">
                    View Request <span aria-hidden="true">▼</span>
                  </button>
                </td>
                <td>Areeba</td>
                <td>10 items</td>
                <td>2023-10-03</td>
                <td>$1000</td>
                <td>
                  <span className="status-badge on-hold">On Hold</span>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" className="checkbox" />
                </td>
                <td>
                  <strong>Order ID #4863</strong>
                </td>
                <td>
                  <button className="view-request-button" type="button">
                    View Request <span aria-hidden="true">▼</span>
                  </button>
                </td>
                <td>Hanzla</td>
                <td>40 items</td>
                <td>2023-10-03</td>
                <td>$4000</td>
                <td>
                  <span className="status-badge in-transit">In Transit</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Profile Card Overlay (toggled from sidebar profile click) */}
        <div
          ref={overlayRef}
          className={`profile-card-overlay${profile?.isOpen ? ' active' : ''}`}
        >
          <div className="profile-card-header">
            <div className="currently-in">Currently in</div>
            <div className="profile-card-user">
              <div className="profile-card-avatar" />
              <div className="profile-card-info">
                <div className="profile-card-name">Hanzla Shahid</div>
                <div className="profile-card-role">Admin</div>
                <div className="profile-card-email">areeba@admin.com</div>
              </div>
              <div className="profile-card-check">✓</div>
            </div>
          </div>
          <div className="profile-card-menu">
            <div className="profile-menu-item">
              <svg
                className="profile-menu-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.07 5.07l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.07-5.07l4.24-4.24" />
              </svg>
              <span>Profile Settings</span>
            </div>
            <div className="profile-menu-item">
              <svg
                className="profile-menu-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>Billing</span>
            </div>
            <div className="profile-menu-item">
              <svg
                className="profile-menu-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Add User</span>
              <span className="profile-menu-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

