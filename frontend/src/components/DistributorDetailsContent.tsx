import React, { useState } from 'react'
import { COUNTRY_PHONE_LIST } from '../lib/countries'
import type { DistributorProfile } from '../lib/distributorProfile'

export type DistributorDetailsContentProps = {
  profile: DistributorProfile
  /** Show Approve / Reject / Message buttons (default true on page, false in modal). */
  showActions?: boolean
  /** Show Approve/Reject only when admin. */
  isAdmin?: boolean
  onApprove?: () => void
  onReject?: () => void
  /** Allow file upload and remove (default true on page, false in modal). */
  allowFileEdit?: boolean
}

export default function DistributorDetailsContent({
  profile,
  showActions = true,
  isAdmin = false,
  onApprove,
  onReject,
  allowFileEdit = true,
}: DistributorDetailsContentProps) {
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>(
    profile.attachedFiles?.length ? profile.attachedFiles : [{ name: 'Contact.pdf', size: '456 KB' }]
  )

  const removeFile = (name: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.name !== name))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      const size = f.size < 1024 ? `${f.size} B` : f.size < 1024 * 1024 ? `${Math.round(f.size / 1024)} KB` : `${(f.size / (1024 * 1024)).toFixed(1)} MB`
      setAttachedFiles((prev) => [...prev, { name: f.name, size }])
    }
    e.target.value = ''
  }

  const displayName = profile.step2 ? `${profile.step2.firstName} ${profile.step2.lastName}`.trim() || '—' : '—'
  const displayEmail = profile.step2?.workEmail || '—'
  const phoneDisplay = (() => {
    if (!profile.step2?.phoneNumber) return '—'
    const c = profile.step2.phoneCountry ? COUNTRY_PHONE_LIST.find((x) => x.iso === profile.step2!.phoneCountry) : null
    const code = c?.code ?? ''
    return code ? `+${code} ${profile.step2.phoneNumber}` : profile.step2.phoneNumber
  })()
  const jobTitleDisplay =
    profile.step2?.jobTitle === 'admin'
      ? 'Admin'
      : profile.step2?.jobTitle === 'manager'
        ? 'Manager'
        : profile.step2?.jobTitle === 'buyer'
          ? 'Buyer'
          : (profile.step2?.jobTitle || '—')

  return (
    <>
      {/* Admin Details */}
      <section className="distributor-details-section">
        <h2 className="distributor-details-section-title">Admin Details</h2>
        <div className="distributor-details-admin-row">
          <div className="distributor-details-admin-left">
            <div
              className="distributor-details-avatar"
              style={{
                background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e5e7eb'/%3E%3Cpath fill='%239ca3af' d='M50 48c6.6 0 12-5.4 12-12s-5.4-12-12-12-12 5.4-12 12 5.4 12 12 12zm0 6c-11 0-30 5.5-30 16v10h60V70c0-10.5-19-16-30-16z'/%3E%3C/svg%3E\") center/cover",
              }}
              aria-hidden
            />
            <div className="distributor-details-admin-fields">
              <div className="distributor-details-field-row">
                <div className="distributor-details-field">
                  <label className="distributor-details-label">Name</label>
                  <div className="distributor-details-value-box">{displayName}</div>
                </div>
                <div className="distributor-details-field">
                  <label className="distributor-details-label">Email</label>
                  <div className="distributor-details-value-box">{displayEmail}</div>
                </div>
              </div>
              <div className="distributor-details-field-row">
                <div className="distributor-details-field">
                  <label className="distributor-details-label">Job Title</label>
                  <div className="distributor-details-value-box">{jobTitleDisplay}</div>
                </div>
                <div className="distributor-details-field">
                  <label className="distributor-details-label">Phone</label>
                  <div className="distributor-details-value-box">{phoneDisplay}</div>
                </div>
              </div>
            </div>
          </div>
          <span
            className={`distributor-details-badge ${
              profile.status === 'approved'
                ? 'distributor-details-badge--approved'
                : profile.status === 'rejected'
                  ? 'distributor-details-badge--rejected'
                  : 'distributor-details-badge--pending'
            }`}
          >
            <span className="distributor-details-badge-dot" aria-hidden />
            {profile.status === 'approved' ? 'Approved' : profile.status === 'rejected' ? 'Rejected' : 'Pending Approval'}
          </span>
        </div>
      </section>

      {/* Company & Legal Details */}
      <section className="distributor-details-section">
        <h2 className="distributor-details-section-title">Company & Legal Details</h2>
        <div className="distributor-details-grid distributor-details-grid--3">
          <div className="distributor-details-field">
            <label className="distributor-details-label">Legal Company Name</label>
            <div className="distributor-details-value-box">{profile.step1.legalName || '—'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Trading / DBA Name</label>
            <div className="distributor-details-value-box">{profile.step1.tradingName || '—'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Company Registration Number</label>
            <div className="distributor-details-value-box">{profile.step1.companyRegNo || '—'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Registered Business Address</label>
            <div className="distributor-details-value-box">{profile.step1.registeredAddress || '—'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Tax ID / EIN</label>
            <div className="distributor-details-value-box">{profile.step1.taxId || '—'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Year Established</label>
            <div className="distributor-details-value-box">{profile.step1.yearEst || '—'}</div>
          </div>
          <div className="distributor-details-field distributor-details-field--full">
            <label className="distributor-details-label">Shipping Address</label>
            <div className="distributor-details-value-box">
              {profile.step1.sameAsRegistered ? 'Same as registered business address' : (profile.step1.shippingAddress || '—')}
            </div>
          </div>
        </div>
      </section>

      {/* Distribution & Operations Profile */}
      <section className="distributor-details-section">
        <h2 className="distributor-details-section-title">Distribution & Operations Profile</h2>
        <div className="distributor-details-grid distributor-details-grid--4">
          <div className="distributor-details-field">
            <label className="distributor-details-label">Distributor Type</label>
            <div className="distributor-details-value-box">{profile.step3.distributorType || '—'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Number of Locations</label>
            <div className="distributor-details-value-box">{profile.step3.locations ? `${profile.step3.locations} locations` : '—'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Industries Served</label>
            <div className="distributor-details-value-box">{profile.step3.industries?.length ? profile.step3.industries.join(', ') : '—'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Countries / Regions Served</label>
            <div className="distributor-details-value-box">
              {profile.step3.selectedCountries?.length
                ? profile.step3.selectedCountries.map((iso) => COUNTRY_PHONE_LIST.find((c) => c.iso === iso)?.country ?? iso).join(', ')
                : '—'}
            </div>
          </div>
        </div>
      </section>

      {/* Ordering & Approval Preferences */}
      <section className="distributor-details-section">
        <h2 className="distributor-details-section-title">Ordering & Approval Preferences</h2>
        <div className="distributor-details-grid distributor-details-grid--4">
          <div className="distributor-details-field">
            <label className="distributor-details-label">Typical Order Frequency</label>
            <div className="distributor-details-value-box">{profile.step4.orderFrequency || '—'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Average Order Size</label>
            <div className="distributor-details-value-box">{profile.step4.orderSize || '—'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Internal Order Approvals</label>
            <div className="distributor-details-value-box">{profile.step5.authorized ? 'Yes' : 'No'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Approval Rule</label>
            <div className="distributor-details-value-box">Approval required for orders over $5,000</div>
          </div>
        </div>
      </section>

      {/* Billing, Terms & Authorization */}
      <section className="distributor-details-section">
        <h2 className="distributor-details-section-title">Billing, Terms & Authorization</h2>
        <div className="distributor-details-grid distributor-details-grid--4">
          <div className="distributor-details-field">
            <label className="distributor-details-label">Preferred Payment Method</label>
            <div className="distributor-details-value-box">{profile.step5.paymentMethod || '—'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Invoice (Net terms)</label>
            <div className="distributor-details-value-box">{profile.step5.creditTerms || '—'}</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Accounting Software</label>
            <div className="distributor-details-value-box">NetSuite</div>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Authorized Buyer</label>
            <div className="distributor-details-value-box">{profile.step5.authorized ? 'Confirmed' : '—'}</div>
          </div>
        </div>
      </section>

      {/* Assigned pricing & Order limits */}
      <section className="distributor-details-section distributor-details-section--inline">
        <div className="distributor-details-inline-group">
          <div className="distributor-details-field">
            <label className="distributor-details-label">Assigned pricing</label>
            <span className="distributor-details-pill">{profile.assignedPricing ?? '-50% on all order'}</span>
          </div>
          <div className="distributor-details-field">
            <label className="distributor-details-label">Order limits</label>
            <span className="distributor-details-pill">{profile.orderLimits ?? '20/30'}</span>
          </div>
        </div>
      </section>

      {/* Terms & Privacy */}
      <section className="distributor-details-section distributor-details-section--compact">
        <label className="distributor-details-terms-checkbox">
          <input type="checkbox" checked={profile.step5.termsAgreed} readOnly className="distributor-details-checkbox" aria-label="Terms accepted" />
          <span>Terms & Privacy: {profile.step5.termsAgreed ? 'Accepted' : '—'}</span>
        </label>
      </section>

      {/* Attached Documents */}
      <section className="distributor-details-section">
        <h2 className="distributor-details-section-title">Attached Documents</h2>
        <div className="distributor-details-docs-row">
          {allowFileEdit && (
            <label className="distributor-details-upload">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                className="distributor-details-upload-input"
                aria-label="Upload files"
                onChange={handleFileChange}
              />
              <span className="distributor-details-upload-inner">
                <span className="distributor-details-upload-icon" aria-hidden>☁</span>
                <span className="distributor-details-upload-text">Upload Files</span>
                <span className="distributor-details-upload-hint">PDF, DOC, PPT, JPG, PNG</span>
              </span>
            </label>
          )}
          <div className="distributor-details-file-chips">
            {attachedFiles.map((f) => (
              <div key={f.name} className="distributor-details-file-chip">
                <span className="distributor-details-file-chip-icon" aria-hidden>📄</span>
                <span className="distributor-details-file-chip-name">{f.name}</span>
                <span className="distributor-details-file-chip-size">{f.size}</span>
                {allowFileEdit && (
                  <button
                    type="button"
                    className="distributor-details-file-chip-remove"
                    onClick={() => removeFile(f.name)}
                    aria-label={`Remove ${f.name}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      {showActions && (
        <div className="distributor-details-actions">
          {isAdmin && onApprove && onReject && (
            <>
              <button type="button" className="distributor-details-btn distributor-details-btn--approve" onClick={onApprove}>
                Approve
              </button>
              <button type="button" className="distributor-details-btn distributor-details-btn--reject" onClick={onReject}>
                Reject
              </button>
            </>
          )}
          <button type="button" className="distributor-details-btn distributor-details-btn--message">
            <svg className="distributor-details-btn-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Message
          </button>
        </div>
      )}
    </>
  )
}
