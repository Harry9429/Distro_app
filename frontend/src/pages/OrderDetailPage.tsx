import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

type OrderStatus = 'approved' | 'pending' | 'rejected'

const STATUS_LABEL: Record<OrderStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
}

const PRODUCT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23e5e5e5' width='64' height='64' rx='8'/%3E%3C/svg%3E"

const DUMMY_ORDER = {
  orderNumber: '2000141-74156153',
  date: 'Jan 04, 2026',
  storeName: 'CBD Living Store',
  storeContact: 'Sean Macdonald',
  itemCount: 170,
  status: 'approved' as OrderStatus,
  address: {
    name: 'John Doe',
    building: '24',
    streetName: 'Beacon Street',
    streetAddress: 'Massachusetts State House',
    state: 'MA',
    city: 'Boston',
    postCode: '2108',
  },
  payment: { method: 'VISA', ending: '6457', amount: '$1350' },
  subtotal: '$1300',
  shipping: '$50',
  total: '$1350',
  products: [
    { qty: 40, src: PRODUCT_PLACEHOLDER },
    { qty: 20, src: PRODUCT_PLACEHOLDER },
    { qty: 70, src: PRODUCT_PLACEHOLDER },
    { qty: 20, src: PRODUCT_PLACEHOLDER },
    { qty: 10, src: PRODUCT_PLACEHOLDER },
  ],
  moreProducts: 4,
}

/** Pending view: 40 items, 4 products × 10, Subtotal $400 / Shipping $50 / Total $450, "Placed Order" button */
const PENDING_VIEW = {
  itemCount: 40,
  subtotal: '$400',
  shipping: '$50',
  total: '$450',
  products: [
    { qty: 10, src: PRODUCT_PLACEHOLDER },
    { qty: 10, src: PRODUCT_PLACEHOLDER },
    { qty: 10, src: PRODUCT_PLACEHOLDER },
    { qty: 10, src: PRODUCT_PLACEHOLDER },
  ],
  moreProducts: 0,
}

/** Rejected view: same layout as pending, red "Rejected" button + "Order again" */
const REJECTED_VIEW = {
  itemCount: 40,
  subtotal: '$400',
  shipping: '$50',
  total: '$450',
  products: [
    { qty: 10, src: PRODUCT_PLACEHOLDER },
    { qty: 10, src: PRODUCT_PLACEHOLDER },
    { qty: 10, src: PRODUCT_PLACEHOLDER },
    { qty: 10, src: PRODUCT_PLACEHOLDER },
  ],
  moreProducts: 0,
}

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const location = useLocation()
  const stateStatus = (location.state as { status?: OrderStatus } | null)?.status
  const order = { ...DUMMY_ORDER, orderNumber: orderId ? `${orderId}-752575` : DUMMY_ORDER.orderNumber }
  const [status, setStatus] = useState<OrderStatus>(stateStatus ?? order.status)
  const [statusOpen, setStatusOpen] = useState(false)
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const statusMenuRef = useRef<HTMLDivElement | null>(null)

  const isPending = status === 'pending'
  const isRejected = status === 'rejected'
  const useAltView = isPending || isRejected
  const altView = isPending ? PENDING_VIEW : REJECTED_VIEW
  const itemCount = useAltView ? altView.itemCount : order.itemCount
  const products = useAltView ? altView.products : order.products
  const moreProducts = useAltView ? altView.moreProducts : order.moreProducts
  const subtotal = useAltView ? altView.subtotal : order.subtotal
  const shipping = useAltView ? altView.shipping : order.shipping
  const total = useAltView ? altView.total : order.total

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const menu = statusMenuRef.current
      if (!menu) return
      if (e.target instanceof Node && menu.contains(e.target)) return
      setStatusOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setStatusOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div className="content-area order-detail-page">
      {/* Order identifier + print */}
      <div className="order-detail-header">
        <h2 className="order-detail-title">
          {order.date} | Order# {order.orderNumber}
        </h2>
        <button type="button" className="order-detail-print" aria-label="Print order">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          </svg>
        </button>
      </div>

      <div className="order-detail-grid">
        {/* Left column */}
        <div className="order-detail-left">
          {/* Delivery from store */}
          <div className="order-detail-card">
            <div className="order-detail-card-label">Delivery from store</div>
            <div className="order-detail-store">
              <div className="order-detail-store-avatar" />
              <div>
                <div className="order-detail-store-name">{order.storeName}</div>
                <div className="order-detail-store-contact">{order.storeContact}</div>
              </div>
            </div>
          </div>

          {/* Item selection */}
          <div className="order-detail-card">
            <div className="order-detail-item-count">
              {itemCount} item selected
            </div>
            <div className="order-detail-item-hint">
              Want to see what was substituted?
            </div>
          </div>

          {/* Product list with quantity badges */}
          <div className="order-detail-products">
            {products.map((p, i) => (
              <div key={i} className="order-detail-product-thumb">
                <img src={p.src} alt="" className="order-detail-product-img" />
                <span className="order-detail-product-qty">{p.qty}</span>
              </div>
            ))}
            {moreProducts > 0 && (
              <div className="order-detail-product-more">+{moreProducts}</div>
            )}
          </div>

          {/* Status */}
          <div className="order-detail-card">
            <div className="order-detail-card-label">Status</div>
            <div className="order-detail-status-wrap" ref={statusMenuRef}>
              <button
                type="button"
                className={`order-detail-status-pill ${status}`}
                aria-haspopup="listbox"
                aria-expanded={statusOpen}
                onClick={() => setStatusOpen((v) => !v)}
              >
                <span className={`order-detail-status-dot ${status}`} aria-hidden="true" />
                {STATUS_LABEL[status]}
                <span className="order-detail-status-caret" aria-hidden="true">▼</span>
              </button>
              {statusOpen && (
                <div className="order-detail-status-menu" role="listbox">
                  {(['approved', 'pending', 'rejected'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="option"
                      aria-selected={s === status}
                      className={`order-detail-status-option ${s}${s === status ? ' active' : ''}`}
                      onClick={() => {
                        setStatus(s)
                        setStatusOpen(false)
                      }}
                    >
                      <span className={`order-detail-status-dot ${s}`} />
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="order-detail-right">
          {/* Address */}
          <div className="order-detail-card">
            <div className="order-detail-card-label">Address</div>
            <div className="order-detail-address">
              <div>{order.address.name}</div>
              <div>Building Number: {order.address.building}</div>
              <div>Street Name: {order.address.streetName}</div>
              <div>Street Address: {order.address.streetAddress}</div>
              <div>State: {order.address.state}</div>
              <div>City: {order.address.city}</div>
              <div>Post Code: {order.address.postCode}</div>
            </div>
          </div>

          {/* Delivery Instructions (collapsible) */}
          <div className="order-detail-card">
            <button
              type="button"
              className="order-detail-collapse-head"
              onClick={() => setDeliveryOpen((v) => !v)}
              aria-expanded={deliveryOpen}
            >
              <span className="order-detail-card-label">Delivery Instructions</span>
              <span className="order-detail-collapse-caret" aria-hidden="true">
                {deliveryOpen ? '▲' : '▼'}
              </span>
            </button>
            {deliveryOpen && (
              <div className="order-detail-collapse-body">
                Placeholder for delivery instructions.
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="order-detail-card">
            <div className="order-detail-card-label">Payment Method</div>
            <div className="order-detail-payment">
              <span className="order-detail-payment-method">
                {order.payment.method} Ending with {order.payment.ending}
              </span>
              <span className="order-detail-payment-amount">{order.payment.amount}</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-detail-card order-detail-summary">
            <div className="order-detail-card-label">Order Summary</div>
            <div className="order-detail-summary-row">
              <span>Subtotal</span>
              <span>{subtotal}</span>
            </div>
            <div className="order-detail-summary-row">
              <span>Shipping</span>
              <span>{shipping}</span>
            </div>
            <div className="order-detail-summary-row order-detail-summary-total">
              <span>Total</span>
              <span>{total}</span>
            </div>
          </div>

          {/* Action buttons: Pending => "Placed Order"; Rejected => red "Rejected" + "Order again"; otherwise "Order Completed" + "Re-Order" */}
          <div className={`order-detail-actions${isPending ? ' order-detail-actions-single' : ''}${isRejected ? ' order-detail-actions-rejected' : ''}`}>
            {isPending ? (
              <Link
                to={orderId ? `/orders/view/${orderId}/payment` : '/orders'}
                className="order-detail-btn order-detail-btn-placed"
              >
                Placed Order
              </Link>
            ) : isRejected ? (
              <>
                <button type="button" className="order-detail-btn order-detail-btn-rejected" disabled aria-disabled="true">
                  Rejected
                </button>
                <Link to="/orders" className="order-detail-btn order-detail-btn-primary">
                  Order again <span aria-hidden="true">→</span>
                </Link>
              </>
            ) : (
              <>
                <button type="button" className="order-detail-btn order-detail-btn-secondary" disabled>
                  Order Completed
                </button>
                <Link to="/orders" className="order-detail-btn order-detail-btn-primary">
                  Re-Order <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="order-detail-back">
        {orderId && (
          <Link to={`/orders/view/${orderId}/payment`}>Payment details →</Link>
        )}
        <Link to="/orders">← Back to orders</Link>
      </div>
    </div>
  )
}
