import React, { useState, useEffect } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useAuth, type Role } from '../contexts/AuthContext'
import './adminOrdersPage.css'

type SettingsTab = 'profile' | 'billing' | 'add-user' | 'add-store'

type AddUserFormState = { firstName: string; lastName: string; email: string; role: Role | '' }
const INITIAL_ADD_USER: AddUserFormState = { firstName: '', lastName: '', email: '', role: '' }

export default function SettingsPage() {
  const auth = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') as SettingsTab | null
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => (tabParam && ['profile', 'billing', 'add-user', 'add-store'].includes(tabParam) ? tabParam : 'profile'))
  const [isShopifyModalOpen, setIsShopifyModalOpen] = useState(false)

  useEffect(() => {
    if (tabParam && ['profile', 'billing', 'add-user', 'add-store'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])
  useEffect(() => {
    if (isShopifyModalOpen) {
      document.body.classList.add('shopify-modal-open')
      return () => document.body.classList.remove('shopify-modal-open')
    }
  }, [isShopifyModalOpen])
  const [addUserForm, setAddUserForm] = useState(INITIAL_ADD_USER)
  const [addUserMessage, setAddUserMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const user = auth.user

  if (!user) return <Navigate to="/login" replace />

  const isAdmin = user.role === 'admin'


  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    setAddUserMessage(null)
    const { firstName, lastName, email, role } = addUserForm
    if (!email.trim()) {
      setAddUserMessage({ type: 'error', text: 'Email is required.' })
      return
    }
    if (!role) {
      setAddUserMessage({ type: 'error', text: 'Please select a role.' })
      return
    }
    const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || email.trim()
    const result = auth.addUserByAdmin(email.trim(), name, role as Role)
    if (result.ok) {
      setAddUserMessage({ type: 'success', text: 'User added. They can sign in with this email and password 1234.' })
      setAddUserForm(INITIAL_ADD_USER)
    } else {
      setAddUserMessage({ type: 'error', text: result.error ?? 'Could not add user.' })
    }
  }

  return (
    <div className="content-area settings-page">
      <header className="settings-header">
        <div className="settings-tabs">
          <button
            type="button"
            className={`settings-tab font-medium text-base${activeTab === 'profile' ? ' active' : ''}`}
            onClick={() => { setActiveTab('profile'); setSearchParams({}) }}
          >
            Profile Setting
          </button>
          <button
            type="button"
            className={`settings-tab font-medium text-base${activeTab === 'billing' ? ' active' : ''}`}
            onClick={() => { setActiveTab('billing'); setSearchParams({ tab: 'billing' }) }}
          >
            Billing
          </button>
          <button
            type="button"
            className={`settings-tab font-medium text-base${activeTab === 'add-user' ? ' active' : ''}`}
            onClick={() => { setActiveTab('add-user'); setSearchParams({ tab: 'add-user' }) }}
          >
            + Add User
          </button>
          <button
            type="button"
            className={`settings-tab font-medium text-base${activeTab === 'add-store' ? ' active' : ''}`}
            onClick={() => { setActiveTab('add-store'); setSearchParams({ tab: 'add-store' }) }}
          >
            + Add Store
          </button>
        </div>
        {activeTab === 'profile' && (
          <button type="button" className="settings-save-btn">
            Save Changes
          </button>
        )}
      </header>

      {activeTab === 'profile' && (
        <div className="settings-tab-content profile-setting-tab">
          <div className="profile-setting-layout">
            <section className="profile-picture-section">
              <div className="profile-picture-wrap">
                <div
                  className="profile-picture"
                  style={{
                    background: "url(\"data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23e5e7eb%22/><circle cx=%2250%22 cy=%2240%22 r=%2212%22 fill=%22%239ca3af%22/><path d=%22M30 85 Q50 65 70 85%22 fill=%22%239ca3af%22/></svg>\") center/cover",
                  }}
                />
                <button type="button" className="profile-picture-edit" aria-label="Edit profile picture">
                  <svg className="w-4 h-4 shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
            </section>

            <section className="profile-form-section">
              <h3 className="profile-section-heading text-lg font-semibold text-gray-900">Personal Information</h3>
              <div className="profile-fields-grid">
                <div className="profile-field">
                  <label htmlFor="settings-first-name">First Name</label>
                  <input id="settings-first-name" type="text" className="profile-input" placeholder="Enter your first name" defaultValue={user?.name?.split(' ')[0] ?? ''} />
                </div>
                <div className="profile-field">
                  <label htmlFor="settings-last-name">Last Name</label>
                  <input id="settings-last-name" type="text" className="profile-input" placeholder="Enter your last name" defaultValue={user?.name?.split(' ').slice(1).join(' ') ?? ''} />
                </div>
                <div className="profile-field">
                  <label htmlFor="settings-display-name">Display Name</label>
                  <input id="settings-display-name" type="text" className="profile-input" placeholder="Enter your display name" defaultValue={user?.name ?? ''} />
                </div>
                <div className="profile-field">
                  <label htmlFor="settings-email">Email Address</label>
                  <input id="settings-email" type="email" className="profile-input" placeholder="Enter your email address" defaultValue={user?.email ?? ''} />
                </div>
                <div className="profile-field">
                  <label htmlFor="settings-phone">Phone Number</label>
                  <input id="settings-phone" type="tel" className="profile-input" placeholder="Enter your phone number" />
                </div>
                <div className="profile-field">
                  <label htmlFor="settings-dob">Date of Birth</label>
                  <input id="settings-dob" type="text" className="profile-input" placeholder="Enter your date of birth" />
                </div>
              </div>
              <div className="profile-field profile-field--full">
                <label htmlFor="settings-bio">Short Bio</label>
                <input id="settings-bio" type="text" className="profile-input" placeholder="Enter a short bio about yourself" />
              </div>

              <h3 className="profile-section-heading">Change Password</h3>
              <div className="profile-fields-grid profile-fields-grid--pass">
                <div className="profile-field">
                  <label htmlFor="settings-new-password">New Password</label>
                  <input id="settings-new-password" type="password" className="profile-input" placeholder="Enter your new password" />
                </div>
                <div className="profile-field">
                  <label htmlFor="settings-confirm-password">Confirm New Password</label>
                  <input id="settings-confirm-password" type="password" className="profile-input" placeholder="Confirm your new password" />
                </div>
              </div>
              <div className="profile-password-actions">
                <button type="button" className="profile-btn profile-btn--primary">Change Password</button>
                <button type="button" className="profile-btn profile-btn--secondary">Enable 2FA</button>
              </div>
            </section>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="settings-tab-content settings-billing-tab">
          <h2 className="settings-billing-title">Billing Details</h2>
          <div className="settings-billing-cards">
            <div className="settings-billing-card">
              <button type="button" className="settings-billing-card-help" aria-label="Help">
                <span className="settings-billing-help-icon" aria-hidden>?</span>
              </button>
              <div className="settings-billing-info">
                <div className="settings-billing-row">
                  <span className="settings-billing-label">Name</span>
                  <span className="settings-billing-value">{user?.name ?? 'Hanzla Shahid'}</span>
                </div>
                <div className="settings-billing-row">
                  <span className="settings-billing-label">Company Name :</span>
                  <span className="settings-billing-value">CBD Living</span>
                </div>
                <div className="settings-billing-row">
                  <span className="settings-billing-label">Email Address :</span>
                  <span className="settings-billing-value">{user?.email ?? 'hanzla.shaid@cbd.com'}</span>
                </div>
                <div className="settings-billing-row settings-billing-row--action">
                  <span className="settings-billing-label">VAT number :</span>
                  <span className="settings-billing-value">FRB1235476</span>
                  <button type="button" className="settings-billing-edit-btn">Edit</button>
                </div>
              </div>
            </div>
            <div className="settings-billing-card settings-billing-card--payment">
              <button type="button" className="settings-billing-card-help" aria-label="Help">
                <span className="settings-billing-help-icon" aria-hidden>?</span>
              </button>
              <div className="settings-billing-card-type">Visa Card</div>
              <div className="settings-billing-payment-info">
                <div className="settings-billing-payment-row">{user?.name ?? 'Hanzla Shahid'}</div>
                <button type="button" className="settings-billing-change-btn">Change</button>
                <div className="settings-billing-payment-masked">Master 1234 **** 6457</div>
                <div className="settings-billing-payment-exp">Expire 12/23</div>
              </div>
              <div className="settings-billing-card-logo" aria-hidden>
                <span className="settings-billing-visa-logo">VISA</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'add-user' && (
        <div className="settings-tab-content settings-add-user-tab">
          {isAdmin ? (
            <>
          <h2 className="settings-add-user-title">Add Team Member</h2>
          {addUserMessage && (
            <div className={`settings-add-user-message settings-add-user-message--${addUserMessage.type}`} role="alert">
              {addUserMessage.text}
            </div>
          )}
          <form className="settings-add-user-form" onSubmit={handleAddUser}>
            <div className="settings-add-user-grid">
              <div className="settings-add-user-field">
                <label htmlFor="add-user-first-name">First Name</label>
                <input
                  id="add-user-first-name"
                  type="text"
                  className="profile-input"
                  placeholder="e.g., Aiden"
                  value={addUserForm.firstName}
                  onChange={(e) => setAddUserForm((f) => ({ ...f, firstName: e.target.value }))}
                />
              </div>
              <div className="settings-add-user-field">
                <label htmlFor="add-user-last-name">Last Name</label>
                <input
                  id="add-user-last-name"
                  type="text"
                  className="profile-input"
                  placeholder="e.g., Montgomery"
                  value={addUserForm.lastName}
                  onChange={(e) => setAddUserForm((f) => ({ ...f, lastName: e.target.value }))}
                />
              </div>
              <div className="settings-add-user-field">
                <label htmlFor="add-user-email">Email Address</label>
                <input
                  id="add-user-email"
                  type="email"
                  className="profile-input"
                  placeholder="e.g., aiden@example.com"
                  value={addUserForm.email}
                  onChange={(e) => setAddUserForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="settings-add-user-field">
                <label htmlFor="add-user-phone">Phone Number</label>
                <input id="add-user-phone" type="tel" className="profile-input" placeholder="e.g., +1 234 567 890" />
              </div>
              <div className="settings-add-user-field">
                <label htmlFor="add-user-job-title">Job Title / Designation</label>
                <input id="add-user-job-title" type="text" className="profile-input" placeholder="e.g., Software Engineer" />
              </div>
              <div className="settings-add-user-field">
                <label htmlFor="add-user-role">Role</label>
                <select
                  id="add-user-role"
                  className="profile-input settings-add-user-select"
                  value={addUserForm.role}
                  onChange={(e) => setAddUserForm((f) => ({ ...f, role: e.target.value as typeof addUserForm.role }))}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="finance_manager">Finance Manager</option>
                  <option value="merchant">Merchant</option>
                  <option value="distributor">Distributor</option>
                  <option value="purchasing_manager">Purchasing Manager</option>
                </select>
              </div>
              <div className="settings-add-user-field settings-add-user-field--attachment">
                <label>Profile Picture</label>
                <div className="settings-add-user-attachment">
                  <svg className="settings-add-user-attachment-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  <span>Add an attachment (optional)</span>
                </div>
              </div>
            </div>
            <div className="settings-add-user-field settings-add-user-field--notes">
              <label htmlFor="add-user-notes">Internal Notes</label>
              <textarea id="add-user-notes" className="profile-input settings-add-user-notes" placeholder="Add any notes for internal use" rows={4} />
            </div>
            <button type="submit" className="settings-add-user-btn">Add User</button>
          </form>
            </>
          ) : (
            <>
              <h2 className="settings-add-user-title">Add Team Member</h2>
              <p className="settings-placeholder-desc">Only administrators can add users. Contact your admin for access.</p>
            </>
          )}
        </div>
      )}

      {activeTab === 'add-store' && (
        <div className="settings-tab-content settings-add-store-tab">
          <section className="settings-add-store-section settings-add-store-section--centered">
            <h2 className="settings-add-store-title">Add Store Manually</h2>
            <form className="settings-add-store-form" onSubmit={(e) => e.preventDefault()}>
              <div className="settings-add-store-grid">
                <div className="settings-add-store-field">
                  <label htmlFor="add-store-name">Store Name</label>
                  <input id="add-store-name" type="text" className="settings-add-store-input" placeholder="e.g., Aiden" />
                </div>
                <div className="settings-add-store-field">
                  <label htmlFor="add-store-owner">Owner Name</label>
                  <input id="add-store-owner" type="text" className="settings-add-store-input" placeholder="e.g., Montgomery" />
                </div>
                <div className="settings-add-store-field">
                  <label htmlFor="add-store-email">Email Address</label>
                  <input id="add-store-email" type="email" className="settings-add-store-input" placeholder="e.g., aiden@example.com" />
                </div>
                <div className="settings-add-store-field">
                  <label htmlFor="add-store-link">Store Link</label>
                  <input id="add-store-link" type="text" className="settings-add-store-input" placeholder="link to your store" />
                </div>
              </div>
              <div className="settings-add-store-btn-wrap">
                <button type="submit" className="settings-add-store-btn">Add Store</button>
              </div>
            </form>
          </section>

          <section className="settings-add-store-section settings-add-store-section--shopify settings-add-store-section--centered">
            <div className="settings-add-store-shopify-header">
              <div className="settings-add-store-shopify-icons" aria-hidden>
                <span className="settings-add-store-shopify-tile settings-add-store-shopify-tile--shopify" aria-hidden>
                  <svg width="42" height="42" viewBox="0 0 48 48" fill="none" aria-hidden>
                    <rect x="8" y="10" width="32" height="30" rx="4" fill="#111111"/>
                    <path d="M18 12c0-3 2.5-6 6-6s6 3 6 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M21 26c0-3 3-5 6-5 2 0 4 .7 5 1.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                    <text x="24" y="33" textAnchor="middle" fontSize="14" fontWeight="700" fill="#ffffff">S</text>
                  </svg>
                </span>
                <span className="settings-add-store-shopify-plus">+</span>
                <span className="settings-add-store-shopify-tile settings-add-store-shopify-tile--app" aria-hidden>
                  <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M24 12c3 0 6 2 6 6s-3 6-6 6-6-2-6-6 3-6 6-6z"/>
                    <path d="M12 24h6M30 24h6M24 12v-6M24 42v-6M16.5 16.5l-4-4M31.5 31.5l4 4M31.5 16.5l4-4M16.5 31.5l-4 4"/>
                  </svg>
                </span>
              </div>
              <h2 className="settings-add-store-title">Integrate with Shopify</h2>
              <p className="settings-add-store-shopify-desc">In order to use full functionality of the app, an active shopify connection is required.</p>
            </div>
            <div className="settings-add-store-shopify-input-wrap">
              <input
                type="text"
                className="settings-add-store-input settings-add-store-shopify-input"
                placeholder="your-store-name"
                aria-label="Shopify store name"
              />
              <span className="settings-add-store-shopify-suffix">.myshopify.com</span>
            </div>
            <div className="settings-add-store-btn-wrap">
              <button type="button" className="settings-add-store-btn" onClick={() => setIsShopifyModalOpen(true)}>Integrate now</button>
            </div>
          </section>
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
        </div>
      )}
    </div>
  )
}
