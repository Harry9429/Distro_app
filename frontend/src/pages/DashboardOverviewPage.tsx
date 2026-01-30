import { useEffect, useState } from 'react'

export default function DashboardOverviewPage() {
  const [isShopifyModalOpen, setIsShopifyModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  useEffect(() => {
    if (isShopifyModalOpen || isImportModalOpen) {
      document.body.classList.add('shopify-modal-open')
      return () => document.body.classList.remove('shopify-modal-open')
    }
  }, [isShopifyModalOpen, isImportModalOpen])

  return (
    <div className="content-area admin-dashboard">
      <div className="admin-dashboard-intro">
        <p className="admin-dashboard-kicker">We’ll walk you through this — 10 minutes total.</p>
        <h2 className="admin-dashboard-title">Let’s get your distributor system ready</h2>
        <p className="admin-dashboard-subtitle">Complete these steps to start accepting distributor orders.</p>
      </div>

      <div className="admin-dashboard-steps">
        <button
          type="button"
          className="admin-dashboard-step admin-dashboard-step--done"
          onClick={() => setIsShopifyModalOpen(true)}
        >
          <span className="admin-dashboard-step-label">STEP 1</span>
          <span className="admin-dashboard-step-text">Connect Your Store</span>
          <span className="admin-dashboard-step-icon" aria-hidden>✓</span>
        </button>
        <button type="button" className="admin-dashboard-step" onClick={() => setIsImportModalOpen(true)}>
          <span className="admin-dashboard-step-label">STEP 2</span>
          <span className="admin-dashboard-step-text">Add Your Products</span>
          <span className="admin-dashboard-step-chevron" aria-hidden>›</span>
        </button>
        {[
          'Configure Payments & Order Flow',
          'Set Default Pricing Rules',
          'Configure Approval Rules',
          'Add Your First Distributor',
        ].map((label, i) => (
          <button key={label} type="button" className="admin-dashboard-step">
            <span className="admin-dashboard-step-label">STEP {i + 3}</span>
            <span className="admin-dashboard-step-text">{label}</span>
            <span className="admin-dashboard-step-chevron" aria-hidden>›</span>
          </button>
        ))}
      </div>

      <button type="button" className="admin-dashboard-cta">Go to Dashboard</button>

      {isShopifyModalOpen && (
        <div
          className="shopify-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setIsShopifyModalOpen(false)}
        >
          <div className="shopify-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="shopify-modal-close"
              aria-label="Close"
              onClick={() => setIsShopifyModalOpen(false)}
            >
              ×
            </button>
            <div className="shopify-modal-body">
              <div className="shopify-modal-form-grid">
                <input className="shopify-modal-input" type="text" placeholder="Store Name" aria-label="Store Name" />
                <input className="shopify-modal-input" type="text" placeholder="Owner Name" aria-label="Owner Name" />
                <input className="shopify-modal-input" type="email" placeholder="Email Address" aria-label="Email Address" />
                <input className="shopify-modal-input" type="text" placeholder="Store Link" aria-label="Store Link" />
              </div>
              <div className="shopify-modal-btn-wrap">
                <button type="button" className="shopify-modal-btn">Add Store</button>
              </div>

              <div className="shopify-modal-divider" />

              <div className="shopify-modal-connect">
                <div className="shopify-modal-icons" aria-hidden>
                  <span className="shopify-modal-icon-box">
                    <span className="shopify-modal-icon-text">S</span>
                  </span>
                  <span className="shopify-modal-plus">+</span>
                  <span className="shopify-modal-icon-box">
                    <span className="shopify-modal-icon-knot" />
                  </span>
                </div>
                <h3 className="shopify-modal-title">Integrate with Shopify</h3>
                <p className="shopify-modal-desc">In order to use full functionality of the app, an active shopify connection is required.</p>
                <div className="shopify-modal-input-wrap">
                  <input className="shopify-modal-input shopify-modal-input--store" type="text" placeholder="your-store-name" aria-label="Shopify store name" />
                  <span className="shopify-modal-suffix">.myshopify.com</span>
                </div>
                <div className="shopify-modal-btn-wrap">
                  <button type="button" className="shopify-modal-btn">Integrate now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isImportModalOpen && (
        <div
          className="shopify-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setIsImportModalOpen(false)}
        >
          <div className="shopify-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="shopify-modal-close"
              aria-label="Close"
              onClick={() => setIsImportModalOpen(false)}
            >
              ×
            </button>
            <div className="shopify-import-content">
              <h3 className="shopify-import-title">Import Products</h3>
              <div className="shopify-import-card">
                <span className="shopify-import-badge">
                  <span className="shopify-import-dot" aria-hidden />
                  Connected
                </span>
                <span className="shopify-import-logo" aria-hidden>
                  <span className="shopify-import-logo-text">S</span>
                </span>
              </div>
              <button type="button" className="shopify-import-btn">Start Importing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
