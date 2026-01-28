import React from 'react'
import { Link } from 'react-router-dom'
import './adminOrdersPage.css'

type FMOrderStatus = 'Delivered' | 'In Transit' | 'On Hold'

type FMOrderRow = {
  id: string
  submittedBy: string
  itemCount: string
  orderDate: string
  totalAmount: string
  deliveryCost: string
  status: FMOrderStatus
}

const FM_ROWS: FMOrderRow[] = [
  { id: '#4545', submittedBy: 'Hanzla', itemCount: '15 items', orderDate: '2023-10-01', totalAmount: '$1500', deliveryCost: '$50', status: 'Delivered' },
  { id: '#4526', submittedBy: 'Sherry', itemCount: '20 items', orderDate: '2023-10-02', totalAmount: '$2000', deliveryCost: '$70', status: 'In Transit' },
  { id: '#4585', submittedBy: 'Hanzla', itemCount: '15 items', orderDate: '2023-10-01', totalAmount: '$1500', deliveryCost: '$50', status: 'Delivered' },
  { id: '#4590', submittedBy: 'Areeba', itemCount: '10 items', orderDate: '2023-10-03', totalAmount: '$1000', deliveryCost: '$40', status: 'On Hold' },
  { id: '#4595', submittedBy: 'Hanzla', itemCount: '40 items', orderDate: '2023-10-03', totalAmount: '$4000', deliveryCost: '$140', status: 'In Transit' },
  { id: '#4600', submittedBy: 'Hanzla', itemCount: '15 items', orderDate: '2023-10-01', totalAmount: '$1500', deliveryCost: '$50', status: 'Delivered' },
  { id: '#4605', submittedBy: 'Hanzla', itemCount: '15 items', orderDate: '2023-10-01', totalAmount: '$1500', deliveryCost: '$50', status: 'Delivered' },
]

function parseAmount(s: string): number {
  return parseInt(s.replace(/[^0-9]/g, ''), 10) || 0
}

export default function FinanceManagerOverview() {
  const totalAmountSum = FM_ROWS.reduce((s, r) => s + parseAmount(r.totalAmount), 0)
  const deliveryCostSum = FM_ROWS.reduce((s, r) => s + parseAmount(r.deliveryCost), 0)
  return (
    <div className="content-area fm-overview">
      <h2 className="section-title text-2xl font-semibold text-gray-900">Quick Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label text-sm font-medium text-gray-500">Total Orders Placed</div>
          <div className="stat-value text-xl font-bold text-gray-900">12.4k</div>
        </div>
        <div className="stat-card">
          <div className="stat-label text-sm font-medium text-gray-500">Total Amount Spent</div>
          <div className="stat-value text-xl font-bold text-gray-900">$205k</div>
        </div>
        <div className="stat-card">
          <div className="stat-label text-sm font-medium text-gray-500">Pending Order Payment</div>
          <div className="stat-value text-xl font-bold text-gray-900">$3550</div>
        </div>
        <div className="stat-card">
          <div className="stat-label text-sm font-medium text-gray-500">In Transit Order</div>
          <div className="stat-value text-xl font-bold text-gray-900">4</div>
        </div>
      </div>

      <section className="fm-orders-section">
        <header className="fm-orders-header">
          <button type="button" className="fm-orders-heading-btn text-lg font-semibold text-gray-900" aria-haspopup="listbox">
            Orders <span className="fm-dropdown-caret text-gray-500" aria-hidden="true">▼</span>
          </button>
          <div className="fm-orders-toolbar">
            <div className="fm-order-search">
              <svg className="fm-search-icon w-[18px] h-[18px] shrink-0 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input type="search" className="fm-search-input" placeholder="Order #, Buyer name" aria-label="Search orders or buyers" />
            </div>
            <button type="button" className="fm-filter-btn text-sm font-medium text-gray-700">
              Filter by Quantity <span aria-hidden="true">▼</span>
            </button>
            <button type="button" className="fm-filter-btn text-sm font-medium text-gray-700">
              Category <span aria-hidden="true">▼</span>
            </button>
          </div>
        </header>

        <div className="fm-orders-history-wrap">
          <button type="button" className="fm-orders-history-heading text-base font-semibold text-gray-900" aria-haspopup="listbox">
            Order History <span className="fm-dropdown-caret text-gray-500" aria-hidden="true">▼</span>
          </button>
          <div className="table-container fm-orders-table-wrap">
            <table className="fm-orders-table">
              <thead>
                <tr>
                  <th className="fm-col-check"><span className="fm-sort-placeholder" /></th>
                  <th className="fm-col-id">Order ID <span className="fm-sort-icon" aria-hidden="true">▼</span></th>
                  <th className="fm-col-by">Submitted By <span className="fm-sort-icon" aria-hidden="true">▼</span></th>
                  <th className="fm-col-count">Item Count <span className="fm-sort-icon" aria-hidden="true">▼</span></th>
                  <th className="fm-col-date">Order Date <span className="fm-sort-icon" aria-hidden="true">▼</span></th>
                  <th className="fm-col-total">Total Amount <span className="fm-sort-icon" aria-hidden="true">▼</span></th>
                  <th className="fm-col-delivery">Delivery Cost <span className="fm-sort-icon" aria-hidden="true">▼</span></th>
                  <th className="fm-col-status">Status <span className="fm-sort-icon" aria-hidden="true">▼</span></th>
                </tr>
              </thead>
              <tbody>
                {FM_ROWS.map((row, i) => (
                  <tr key={i}>
                    <td className="fm-col-check">
                      <input type="checkbox" className="fm-row-checkbox" aria-label={`Select order ${row.id}`} />
                    </td>
                    <td className="fm-col-id">Order ID {row.id}</td>
                    <td className="fm-col-by">{row.submittedBy}</td>
                    <td className="fm-col-count">{row.itemCount}</td>
                    <td className="fm-col-date">{row.orderDate}</td>
                    <td className="fm-col-total">{row.totalAmount}</td>
                    <td className="fm-col-delivery">{row.deliveryCost}</td>
                    <td className="fm-col-status">
                      <span className={`status-badge ${row.status.toLowerCase().replace(' ', '-')}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="fm-orders-total-row">
                  <td className="fm-col-check" />
                  <td className="fm-col-id" colSpan={4}>
                    <span className="fm-total-label">Total</span>
                  </td>
                  <td className="fm-col-total fm-total-cell">
                    ${totalAmountSum.toLocaleString()}
                  </td>
                  <td className="fm-col-delivery fm-total-cell">
                    ${deliveryCostSum.toLocaleString()}
                  </td>
                  <td className="fm-col-status" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <footer className="fm-summary-bar">
          <div className="fm-summary-right">
            <div className="fm-summary-amounts">
              <span className="fm-summary-value text-lg font-bold text-gray-900">$8500</span>
              <span className="fm-summary-value text-lg font-bold text-gray-900">$300</span>
            </div>
            <Link to="/analytics" className="fm-analytics-link text-sm font-semibold text-white">
              Analytics <span aria-hidden="true">→</span>
            </Link>
          </div>
        </footer>
      </section>
    </div>
  )
}
