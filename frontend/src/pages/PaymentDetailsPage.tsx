import { Link, useParams } from 'react-router-dom'

const INFO_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
)

/** Dummy data for payment details screen */
const PAYMENT_DETAILS = {
  orderNumber: '2000141-74156153',
  date: 'Jan 04, 2026',
  product: {
    name: 'Hanzla Shahid',
    role: 'Manager CDB Living',
    deliveryEstimate: 'Order will be delivered in 2 days',
  },
  payment: {
    cardType: 'Master Card',
    maskedNumber: '1234 **** 6457',
    expire: '12/23',
    cardholder: 'Hanzla Shahid',
  },
  billing: {
    name: 'Hanzla Shahid',
    companyName: 'CBD Living',
    email: 'hanzla.shaid@cbd.com',
    vatNumber: 'FRB1235476',
  },
  summary: {
    productPrice: '$1400',
    delivery: '$50',
    taxes: '$20',
    total: '$1350',
  },
}

export default function PaymentDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const orderNumber = orderId ? `Order# ${orderId}-74156153` : `Order# ${PAYMENT_DETAILS.orderNumber}`
  const fromDate = PAYMENT_DETAILS.date

  return (
    <div className="content-area payment-details-page">
      <header className="payment-details-header">
        <h1 className="payment-details-title">Payment Details</h1>
        <div className="payment-details-meta">
          <span>Order no: {orderNumber}</span>
          <span>From: {fromDate}</span>
        </div>
      </header>

      <div className="payment-details-grid">
        {/* Left column */}
        <div className="payment-details-left">
          {/* Product detail card */}
          <div className="payment-details-card">
            <div className="payment-details-card-head">
              <h2 className="payment-details-card-title">Product detail</h2>
              <button type="button" className="payment-details-info" aria-label="More information">
                {INFO_ICON}
              </button>
            </div>
            <div className="payment-details-product">
              <div className="payment-details-avatar" aria-hidden="true" />
              <div className="payment-details-product-info">
                <div className="payment-details-product-name">{PAYMENT_DETAILS.product.name}</div>
                <div className="payment-details-product-role">{PAYMENT_DETAILS.product.role}</div>
                <div className="payment-details-delivery">{PAYMENT_DETAILS.product.deliveryEstimate}</div>
              </div>
            </div>
          </div>

          {/* Payment detail card */}
          <div className="payment-details-card">
            <div className="payment-details-card-head">
              <h2 className="payment-details-card-title">Payment detail</h2>
              <button type="button" className="payment-details-info" aria-label="More information">
                {INFO_ICON}
              </button>
            </div>
            <div className="payment-details-payment">
              <div className="payment-details-payment-row">
                <span className="payment-details-payment-type">{PAYMENT_DETAILS.payment.cardType}</span>
                <span className="payment-details-payment-logo">VISA</span>
              </div>
              <div className="payment-details-payment-number">
                Master {PAYMENT_DETAILS.payment.maskedNumber}
              </div>
              <div className="payment-details-payment-meta">
                <span>Expire {PAYMENT_DETAILS.payment.expire}</span>
                <span>{PAYMENT_DETAILS.payment.cardholder}</span>
              </div>
              <button type="button" className="payment-details-link">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="payment-details-right">
          {/* Billing Information card */}
          <div className="payment-details-card">
            <div className="payment-details-card-head">
              <h2 className="payment-details-card-title">Billing Information</h2>
              <button type="button" className="payment-details-info" aria-label="More information">
                {INFO_ICON}
              </button>
            </div>
            <div className="payment-details-billing">
              <div className="payment-details-billing-row">
                <span className="payment-details-billing-label">Name:</span>
                <span>{PAYMENT_DETAILS.billing.name}</span>
              </div>
              <div className="payment-details-billing-row">
                <span className="payment-details-billing-label">Company Name:</span>
                <span>{PAYMENT_DETAILS.billing.companyName}</span>
              </div>
              <div className="payment-details-billing-row">
                <span className="payment-details-billing-label">Email Address:</span>
                <span>{PAYMENT_DETAILS.billing.email}</span>
              </div>
              <div className="payment-details-billing-row payment-details-billing-actions">
                <span className="payment-details-billing-label">VAT number:</span>
                <span>{PAYMENT_DETAILS.billing.vatNumber}</span>
                <button type="button" className="payment-details-link">Edit</button>
              </div>
            </div>
          </div>

          {/* Order Summary card */}
          <div className="payment-details-card">
            <div className="payment-details-card-head">
              <h2 className="payment-details-card-title">Order Summary</h2>
              <button type="button" className="payment-details-info" aria-label="More information">
                {INFO_ICON}
              </button>
            </div>
            <div className="payment-details-summary">
              <div className="payment-details-summary-row">
                <span>Product Price :</span>
                <span>{PAYMENT_DETAILS.summary.productPrice}</span>
              </div>
              <div className="payment-details-summary-row">
                <span>Delivery :</span>
                <span>{PAYMENT_DETAILS.summary.delivery}</span>
              </div>
              <div className="payment-details-summary-row">
                <span>Taxes :</span>
                <span>{PAYMENT_DETAILS.summary.taxes}</span>
              </div>
              <div className="payment-details-summary-row payment-details-summary-total">
                <span>Total :</span>
                <span>{PAYMENT_DETAILS.summary.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="payment-details-actions">
        <button type="button" className="payment-details-btn-proceed">
          Proceed to Pay
        </button>
      </div>

      <div className="payment-details-back">
        <Link to={orderId ? `/orders/view/${orderId}` : '/orders'}>← Back to order</Link>
      </div>
    </div>
  )
}
