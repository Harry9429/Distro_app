import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './adminOrdersPage.css'

type SettingsTab = 'profile' | 'billing' | 'add-user' | 'add-store'

export default function SettingsPage() {
  const auth = useAuth()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  const user = auth.user

  return (
    <div className="content-area settings-page">
      <header className="settings-header">
        <div className="settings-tabs">
          <button
            type="button"
            className={`settings-tab font-medium text-base${activeTab === 'profile' ? ' active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Setting
          </button>
          <button
            type="button"
            className={`settings-tab font-medium text-base${activeTab === 'billing' ? ' active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            Billing
          </button>
          <button
            type="button"
            className={`settings-tab font-medium text-base${activeTab === 'add-user' ? ' active' : ''}`}
            onClick={() => setActiveTab('add-user')}
          >
            + Add User
          </button>
          <button
            type="button"
            className={`settings-tab font-medium text-base${activeTab === 'add-store' ? ' active' : ''}`}
            onClick={() => setActiveTab('add-store')}
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
        <div className="settings-tab-content">
          <h3 className="profile-section-heading">Billing</h3>
          <p className="settings-placeholder-desc">Billing and payment methods will appear here.</p>
        </div>
      )}

      {activeTab === 'add-user' && (
        <div className="settings-tab-content">
          <h3 className="profile-section-heading">Add User</h3>
          <p className="settings-placeholder-desc">Add a new user to your account.</p>
        </div>
      )}

      {activeTab === 'add-store' && (
        <div className="settings-tab-content">
          <h3 className="profile-section-heading">Add Store</h3>
          <p className="settings-placeholder-desc">Add a new store to manage.</p>
        </div>
      )}
    </div>
  )
}
