import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, type Role, type AuthUser } from '../contexts/AuthContext'
import { findCountryByName, getFlagEmoji, getFlagImageUrl, parseCountryCodeFromPhone, COUNTRY_PHONE_LIST } from '../lib/countries'
import { getDefaultPath, ROLE_LABEL } from '../lib/rolePermissions'
import './adminOrdersPage.css'

type LoginView =
  | 'cards'
  | 'merchant-signin'
  | 'merchant-signup'
  | 'merchant-signup-step1'
  | 'merchant-signup-step2'
  | 'merchant-signup-step3'
  | 'merchant-signup-step4'
  | 'merchant-signup-step5'
  | 'merchant-signup-step6'
  | 'distributor-signin'
  | 'distributor-signup'

function AuthForm({
  mode,
  role,
  onSuccess,
  onBack,
}: {
  mode: 'signin' | 'signup'
  role: Role
  onSuccess: (user?: AuthUser) => void
  onBack: () => void
}) {
  const auth = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signInStep, setSignInStep] = useState<'email' | 'password'>('email')

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const trimmed = email.trim()
    if (!trimmed) {
      setError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email')
      return
    }
    setSignInStep('password')
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const result = auth.login(email.trim(), password)
    if (result.ok) onSuccess(result.user)
    else setError(result.error ?? 'Sign in failed')
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    const result = auth.signup(email.trim(), password, role)
    if (result.ok) onSuccess(result.user)
    else setError(result.error ?? 'Sign up failed')
  }

  const title = mode === 'signin' ? `Sign In as a ${ROLE_LABEL[role]}` : `Create Account – ${ROLE_LABEL[role]}`
  const subtitle = mode === 'signin' ? 'Log in to access your dashboard' : 'Create your account to get started'

  if (mode === 'signin') {
    return (
      <div className="login-page">
        <div className="login-form-container">
          <div className="form-card">
            <div className="icon-container">
              <div className="store-icon" aria-hidden="true" />
            </div>
            <h1 className="form-title text-xl font-bold text-gray-900">{title}</h1>
            <p className="form-subtitle text-sm font-medium text-gray-600">{subtitle}</p>

            {signInStep === 'email' ? (
              <form onSubmit={handleContinue} noValidate>
                {error && <div className="form-error" role="alert">{error}</div>}
                <div className="form-group">
                  <input
                    type="email"
                    className="input-field"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null) }}
                    aria-label="Email"
                    autoComplete="email"
                  />
                </div>
                <button type="submit" className="btn-primary font-semibold text-sm">Continue</button>
                <div className="divider">
                  <span className="divider-text">or continue with</span>
                </div>
                <button type="button" className="social-btn" disabled title="Use email and password to sign in">
                  <div className="social-icon google-icon" aria-hidden="true" />
                  Google
                </button>
                <button type="button" className="social-btn" disabled title="Use email and password to sign in">
                  <div className="social-icon microsoft-icon" aria-hidden="true">
                    <span /><span /><span /><span />
                  </div>
                  Microsoft
                </button>
                <div className="footer-options">
                  <label className="remember-me">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>forgot password?</a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignIn} noValidate>
                {error && <div className="form-error" role="alert">{error}</div>}
                <div className="form-group">
                  <input
                    type="email"
                    className="input-field"
                    value={email}
                    readOnly
                    aria-label="Email"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null) }}
                    aria-label="Password"
                    autoComplete="current-password"
                  />
                </div>
                <button type="submit" className="btn-primary font-semibold text-sm">Sign In</button>
                <button type="button" className="form-back-link" onClick={() => { setSignInStep('email'); setPassword(''); setError(null) }}>
                  ← Change email
                </button>
              </form>
            )}

            <button type="button" className="form-back" onClick={onBack}>
              ← Back to choices
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-form-container">
        <div className="form-card">
          <div className="icon-container">
            <div className="store-icon" aria-hidden="true" />
          </div>
          <h1 className="form-title">{title}</h1>
          <p className="form-subtitle">{subtitle}</p>
          <form onSubmit={handleSignUp} noValidate>
            {error && <div className="form-error" role="alert">{error}</div>}
            <div className="form-group">
              <input
                type="email"
                className="input-field"
                placeholder="Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                aria-label="Email"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null) }}
                aria-label="Password"
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="input-field"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(null) }}
                aria-label="Confirm password"
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn-primary font-semibold text-sm">Create Account</button>
          </form>
          <button type="button" className="form-back" onClick={onBack}>
            ← Back to choices
          </button>
        </div>
      </div>
    </div>
  )
}

function MerchantSignupStep1({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [legalName, setLegalName] = useState('')
  const [tradingName, setTradingName] = useState('')
  const [companyRegNo, setCompanyRegNo] = useState('')
  const [taxId, setTaxId] = useState('')
  const [yearEst, setYearEst] = useState('')
  const [website, setWebsite] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [registeredAddress, setRegisteredAddress] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [sameAsRegistered, setSameAsRegistered] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!legalName.trim()) {
      setError('Legal Company Name is required')
      return
    }
    onNext()
  }

  return (
    <div className="login-page merchant-signup-flow">
      <div className="signup-flow-container">
        <div className="signup-flow-card">
          <p className="signup-flow-step">STEP 1</p>
          <h2 className="signup-flow-heading">COMPANY & LEGAL DETAILS</h2>
          <p className="signup-flow-desc">This information is required to set up your merchant account and commercial terms.</p>
          <form onSubmit={handleSubmit} noValidate className="signup-flow-form">
            {error && <div className="form-error" role="alert">{error}</div>}
            <div className="signup-flow-row">
              <div className="signup-flow-field">
                <label>Legal Company Name*</label>
                <input
                  type="text"
                  placeholder="Required"
                  value={legalName}
                  onChange={(e) => { setLegalName(e.target.value); setError(null) }}
                  aria-label="Legal Company Name"
                />
              </div>
              <div className="signup-flow-field">
                <label>Trading / DBA Name</label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={tradingName}
                  onChange={(e) => setTradingName(e.target.value)}
                  aria-label="Trading / DBA Name"
                />
              </div>
            </div>
            <div className="signup-flow-row">
              <div className="signup-flow-field">
                <label>Company Registration Number</label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={companyRegNo}
                  onChange={(e) => setCompanyRegNo(e.target.value)}
                  aria-label="Company Registration Number"
                />
              </div>
              <div className="signup-flow-field">
                <label>Tax ID / VAT / EIN</label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  aria-label="Tax ID / VAT / EIN"
                />
              </div>
            </div>
            <div className="signup-flow-row">
              <div className="signup-flow-field">
                <label>Year Established</label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={yearEst}
                  onChange={(e) => setYearEst(e.target.value)}
                  aria-label="Year Established"
                />
              </div>
              <div className="signup-flow-field">
                <label>Company Website</label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  aria-label="Company Website"
                />
              </div>
            </div>
            <div className="signup-flow-row">
              <div className="signup-flow-field">
                <label>Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  aria-label="Country"
                  className="signup-flow-select"
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
              <div className="signup-flow-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-label="Phone Number"
                />
              </div>
            </div>
            <div className="signup-flow-field signup-flow-full">
              <label>Registered Business Address</label>
              <input
                type="text"
                placeholder="Address Line 1, City, State / Province, Postal Code"
                value={registeredAddress}
                onChange={(e) => setRegisteredAddress(e.target.value)}
                aria-label="Registered Business Address"
              />
            </div>
            <div className="signup-flow-row signup-flow-shipping-row">
              <div className="signup-flow-field signup-flow-shipping">
                <label>Shipping Address</label>
                <input
                  type="text"
                  placeholder="Add here"
                  value={sameAsRegistered ? registeredAddress : shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  readOnly={sameAsRegistered}
                  aria-label="Shipping Address"
                />
              </div>
              <label className="signup-flow-checkbox">
                <input
                  type="checkbox"
                  checked={sameAsRegistered}
                  onChange={(e) => setSameAsRegistered(e.target.checked)}
                />
                <span>Same as Shipping Address</span>
              </label>
            </div>
            <button type="submit" className="signup-flow-next">Next</button>
          </form>
          <button type="button" className="form-back" onClick={onBack}>
            ← Back to choices
          </button>
        </div>
      </div>
    </div>
  )
}

type ExtraContact = { id: number; name: string; email: string }

function MerchantSignupStep2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [workEmail, setWorkEmail] = useState('')
  const [phoneCountry, setPhoneCountry] = useState('US')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [financeName, setFinanceName] = useState('')
  const [financeEmail, setFinanceEmail] = useState('')
  const [opsName, setOpsName] = useState('')
  const [opsEmail, setOpsEmail] = useState('')
  const [salesName, setSalesName] = useState('')
  const [salesEmail, setSalesEmail] = useState('')
  const [extraContacts, setExtraContacts] = useState<ExtraContact[]>([])
  const [error, setError] = useState<string | null>(null)

  const addMoreContact = () => {
    setExtraContacts((prev) => [...prev, { id: Date.now(), name: '', email: '' }])
  }

  const updateExtraContact = (id: number, field: 'name' | 'email', value: string) => {
    setExtraContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )
  }

  const removeExtraContact = (id: number) => {
    setExtraContacts((prev) => prev.filter((c) => c.id !== id))
  }

  const handleAddPrimary = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!firstName.trim() || !lastName.trim()) {
      setError('First Name and Last Name are required for Primary Admin')
      return
    }
    if (!workEmail.trim()) {
      setError('Work Email is required for Primary Admin')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail.trim())) {
      setError('Please enter a valid Work Email')
      return
    }
    onNext()
  }

  return (
    <div className="signup-step2-page">
      <div className="signup-step2-container">
        <div className="signup-step2-card">
          <p className="signup-step2-step">STEP 2</p>
          <h2 className="signup-step2-heading">Contacts & users</h2>
          <p className="signup-step2-desc">These users will receive order and account notifications.</p>

          <form onSubmit={handleAddPrimary} noValidate className="signup-step2-form">
            {error && <div className="form-error" role="alert">{error}</div>}

            <p className="signup-step2-section-title">Primary Admin (Required)</p>
            <div className="signup-step2-row">
              <div className="signup-step2-field">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setError(null) }}
                  aria-label="First Name"
                />
              </div>
              <div className="signup-step2-field">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setError(null) }}
                  aria-label="Last Name"
                />
              </div>
            </div>
            <div className="signup-step2-field signup-step2-full">
              <label>Job Title</label>
              <select
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                aria-label="Job Title"
                className="signup-step2-select"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>
            <div className="signup-step2-field signup-step2-full">
              <label>Work Email</label>
              <input
                type="email"
                placeholder="Email"
                value={workEmail}
                onChange={(e) => { setWorkEmail(e.target.value); setError(null) }}
                aria-label="Work Email"
              />
            </div>
            <div className="signup-step2-field signup-step2-full">
              <label>Country Phone Number</label>
              <div className="signup-step2-phone-wrap">
                <div className="signup-step2-country-display-wrap">
                  <span className="signup-step2-country-display" aria-hidden="true">
                    <img
                      src={getFlagImageUrl(phoneCountry)}
                      alt=""
                      className="signup-step2-flag-img"
                      width={24}
                      height={18}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement | null
                        if (fallback) fallback.style.display = 'inline'
                      }}
                    />
                    <span className="signup-step2-flag-emoji-fallback" aria-hidden="true" style={{ display: 'none' }}>{getFlagEmoji(phoneCountry)}</span>
                  </span>
                  <select
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value)}
                    aria-label="Country code"
                    className="signup-step2-country-select"
                    title={COUNTRY_PHONE_LIST.find((c) => c.iso === phoneCountry)?.country ?? 'Country'}
                  >
                    {COUNTRY_PHONE_LIST.map((c) => (
                      <option key={c.iso} value={c.iso}>
                        {getFlagEmoji(c.iso)} +{c.code} {c.country}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value
                    const parsed = parseCountryCodeFromPhone(value, COUNTRY_PHONE_LIST)
                    if (parsed) {
                      setPhoneCountry(parsed.iso)
                      setPhoneNumber(parsed.rest)
                    } else {
                      setPhoneNumber(value)
                    }
                  }}
                  aria-label="Phone Number"
                  className="signup-step2-phone-input"
                />
              </div>
            </div>
            <button type="button" className="signup-step2-add-btn">Add</button>

            <p className="signup-step2-section-title signup-step2-secondary-title">Secondary Contacts</p>
            <div className="signup-step2-contact-block">
              <label className="signup-step2-contact-label">Finance Contact</label>
              <div className="signup-step2-row">
                <div className="signup-step2-field">
                  <input type="text" placeholder="Name" value={financeName} onChange={(e) => setFinanceName(e.target.value)} aria-label="Finance Name" />
                </div>
                <div className="signup-step2-field">
                  <input type="email" placeholder="Email" value={financeEmail} onChange={(e) => setFinanceEmail(e.target.value)} aria-label="Finance Email" />
                </div>
              </div>
            </div>
            <div className="signup-step2-contact-block">
              <label className="signup-step2-contact-label">Operations / Warehouse Contact</label>
              <div className="signup-step2-row">
                <div className="signup-step2-field">
                  <input type="text" placeholder="Name" value={opsName} onChange={(e) => setOpsName(e.target.value)} aria-label="Operations Name" />
                </div>
                <div className="signup-step2-field">
                  <input type="email" placeholder="Email" value={opsEmail} onChange={(e) => setOpsEmail(e.target.value)} aria-label="Operations Email" />
                </div>
              </div>
            </div>
            <div className="signup-step2-contact-block">
              <label className="signup-step2-contact-label">Sales / Buyer Contact</label>
              <div className="signup-step2-row">
                <div className="signup-step2-field">
                  <input type="text" placeholder="Name" value={salesName} onChange={(e) => setSalesName(e.target.value)} aria-label="Sales Name" />
                </div>
                <div className="signup-step2-field">
                  <input type="email" placeholder="Email" value={salesEmail} onChange={(e) => setSalesEmail(e.target.value)} aria-label="Sales Email" />
                </div>
              </div>
            </div>
            {extraContacts.map((c, index) => (
              <div key={c.id} className="signup-step2-contact-block signup-step2-contact-block-extra">
                <div className="signup-step2-contact-label-row">
                  <label className="signup-step2-contact-label">Additional Contact {index + 1}</label>
                  <button type="button" className="signup-step2-remove-contact" onClick={() => removeExtraContact(c.id)} aria-label="Remove contact">
                    Remove
                  </button>
                </div>
                <div className="signup-step2-row">
                  <div className="signup-step2-field">
                    <input type="text" placeholder="Name" value={c.name} onChange={(e) => updateExtraContact(c.id, 'name', e.target.value)} aria-label="Contact Name" />
                  </div>
                  <div className="signup-step2-field">
                    <input type="email" placeholder="Email" value={c.email} onChange={(e) => updateExtraContact(c.id, 'email', e.target.value)} aria-label="Contact Email" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="signup-step2-add-more-btn" onClick={addMoreContact}>+ Add more</button>

            <button type="submit" className="signup-step2-next">Next</button>
          </form>

          <button type="button" className="form-back signup-step2-back" onClick={onBack}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}

const DISTRIBUTOR_TYPES = ['Regional', 'National', 'Online', 'Retail chain', 'Wholesale', 'B2B only'] as const
const INDUSTRIES = ['CPG', 'Supplements', 'Beverage', 'Parts', 'Cannabis', 'Electronics', 'Fashion', 'Health', 'Other'] as const
const LOCATION_COUNTS = ['1', '2-5', '6-20', '20+'] as const
function MerchantSignupStep3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [distributorType, setDistributorType] = useState<string>('')
  const [industries, setIndustries] = useState<Set<string>>(new Set())
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'BR', 'DK', 'DE'])
  const [countriesInput, setCountriesInput] = useState('')
  const [locations, setLocations] = useState<string>('')

  const addCountryFromInput = () => {
    const found = findCountryByName(countriesInput, COUNTRY_PHONE_LIST)
    if (found && !selectedCountries.includes(found.iso)) {
      setSelectedCountries((prev) => [...prev, found.iso])
      setCountriesInput('')
    }
  }

  const removeCountry = (iso: string) => {
    setSelectedCountries((prev) => prev.filter((c) => c !== iso))
  }

  const handleCountriesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addCountryFromInput()
    }
  }

  const toggleIndustry = (v: string) => {
    setIndustries((prev) => {
      const next = new Set(prev)
      if (next.has(v)) next.delete(v)
      else next.add(v)
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="signup-step3-page">
      <div className="signup-step3-container">
        <div className="signup-step3-card">
          <p className="signup-step3-step">STEP 3</p>
          <h2 className="signup-step3-heading">DISTRIBUTION & OPERATIONS PROFILE</h2>
          <p className="signup-step3-desc">Helps us configure ordering, approvals, and logistics correctly.</p>

          <form onSubmit={handleSubmit} noValidate className="signup-step3-form">
            <div className="signup-step3-section">
              <label className="signup-step3-section-label">Distributor Type</label>
              <div className="signup-step3-pills">
                {DISTRIBUTOR_TYPES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`signup-step3-pill ${distributorType === v ? 'selected' : ''}`}
                    onClick={() => setDistributorType(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="signup-step3-section">
              <label className="signup-step3-section-label">Industries Served</label>
              <div className="signup-step3-pills">
                {INDUSTRIES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`signup-step3-pill ${industries.has(v) ? 'selected' : ''}`}
                    onClick={() => toggleIndustry(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="signup-step3-section">
              <label className="signup-step3-section-label">Countries Served</label>
              <div className="signup-step3-countries-wrap">
                <div className="signup-step3-countries-chips">
                  {selectedCountries.map((iso) => (
                    <span key={iso} className="signup-step3-country-chip" title={COUNTRY_PHONE_LIST.find((c) => c.iso === iso)?.country ?? iso}>
                      <img
                        src={getFlagImageUrl(iso)}
                        alt=""
                        className="signup-step3-flag-img"
                        width={24}
                        height={18}
                        loading="lazy"
                      />
                      <button
                        type="button"
                        className="signup-step3-chip-remove"
                        onClick={() => removeCountry(iso)}
                        aria-label={`Remove ${COUNTRY_PHONE_LIST.find((c) => c.iso === iso)?.country ?? iso}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type"
                  value={countriesInput}
                  onChange={(e) => setCountriesInput(e.target.value)}
                  onKeyDown={handleCountriesKeyDown}
                  onBlur={addCountryFromInput}
                  className="signup-step3-countries-input"
                  aria-label="Countries Served"
                />
              </div>
            </div>

            <div className="signup-step3-section">
              <label className="signup-step3-section-label">Number of Locations</label>
              <div className="signup-step3-pills">
                {LOCATION_COUNTS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`signup-step3-pill ${locations === v ? 'selected' : ''}`}
                    onClick={() => setLocations(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="signup-step3-next">Next</button>
          </form>

          <button type="button" className="form-back signup-step3-back" onClick={onBack}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}

const ORDER_FREQUENCY = ['Weekly', 'Bi-weekly', 'Monthly', 'Ad-hoc'] as const
const ORDER_SIZE = ['<$5k', '$5k-$25k', '$25k-$100k', '$100k+'] as const

function MerchantSignupStep4({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [orderFrequency, setOrderFrequency] = useState<string>('Weekly')
  const [orderSize, setOrderSize] = useState<string>('<$5k')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="signup-step4-page">
      <div className="signup-step3-container">
        <div className="signup-step3-card">
          <p className="signup-step3-step">STEP 4</p>
          <h2 className="signup-step4-heading">Ordering setup</h2>
          <p className="signup-step3-desc">These settings can be changed later by your admin.</p>

          <form onSubmit={handleSubmit} noValidate className="signup-step3-form">
            <div className="signup-step3-section">
              <label className="signup-step3-section-label">Typical Order Frequency</label>
              <div className="signup-step3-pills">
                {ORDER_FREQUENCY.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`signup-step3-pill ${orderFrequency === v ? 'selected' : ''}`}
                    onClick={() => setOrderFrequency(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="signup-step3-section">
              <label className="signup-step3-section-label">Average Order Size</label>
              <div className="signup-step3-pills">
                {ORDER_SIZE.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`signup-step3-pill ${orderSize === v ? 'selected' : ''}`}
                    onClick={() => setOrderSize(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="signup-step3-next">Next</button>
          </form>

          <button type="button" className="form-back signup-step3-back" onClick={onBack}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}

const PAYMENT_METHODS = ['Invoice (Net terms)', 'Credit card', 'Bank transfer'] as const
const CREDIT_TERMS = ['Net 15', 'Net 30', 'Net 60', 'Prepaid'] as const

function MerchantSignupStep5({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [creditTerms, setCreditTerms] = useState<string>('')
  const [authorized, setAuthorized] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!authorized || !termsAgreed) {
      setError('Please confirm both checkboxes to continue.')
      return
    }
    onNext()
  }

  return (
    <div className="signup-step5-page">
      <div className="signup-step3-container">
        <div className="signup-step3-card">
          <p className="signup-step3-step">STEP 5</p>
          <h2 className="signup-step4-heading">Billing & Authorization</h2>

          <form onSubmit={handleSubmit} noValidate className="signup-step3-form">
            <div className="signup-step3-section">
              <label className="signup-step3-section-label">Financial Details</label>
              <div className="signup-step5-subsection">
                <span className="signup-step5-sublabel">Preferred Payment Method</span>
                <div className="signup-step3-pills">
                  {PAYMENT_METHODS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`signup-step3-pill ${paymentMethod === v ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="signup-step5-subsection">
                <span className="signup-step5-sublabel">Existing Credit Terms?</span>
                <div className="signup-step3-pills">
                  {CREDIT_TERMS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`signup-step3-pill ${creditTerms === v ? 'selected' : ''}`}
                      onClick={() => setCreditTerms(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="signup-step3-section">
              <label className="signup-step3-section-label">Attach Documents</label>
              <label className="signup-step5-upload">
                <input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png" className="signup-step5-upload-input" aria-label="Upload files" />
                <span className="signup-step5-upload-inner">
                  <span className="signup-step5-upload-icon" aria-hidden>☁</span>
                  <span className="signup-step5-upload-text">Upload Files</span>
                  <span className="signup-step5-upload-hint">PDF, DOC, PPT, JPG, PNG</span>
                </span>
              </label>
            </div>

            <div className="signup-step5-checkboxes">
              <label className="signup-step5-checkbox">
                <input type="checkbox" checked={authorized} onChange={(e) => { setAuthorized(e.target.checked); setError(null) }} />
                <span>I am authorized to place orders on behalf of this distributor.</span>
              </label>
              <label className="signup-step5-checkbox">
                <input type="checkbox" checked={termsAgreed} onChange={(e) => { setTermsAgreed(e.target.checked); setError(null) }} />
                <span>I agree to the Terms of Service and Privacy Policy.</span>
              </label>
            </div>

            {error && <div className="signup-step5-error" role="alert">{error}</div>}

            <button type="submit" className="signup-step5-create">Create distributor account</button>
          </form>

          <button type="button" className="form-back signup-step3-back" onClick={onBack}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}

function MerchantSignupStep6({ onNext }: { onNext: () => void }) {
  return (
    <div className="signup-step6-page">
      <div className="signup-step6-container">
        <div className="signup-step6-card">
          <div className="signup-step6-icon" aria-hidden>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8" />
              <path d="M12 17v4" />
              <path d="M9 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="signup-step6-title">Account submitted</h2>
          <p className="signup-step6-desc">
            Your distributor account is being set up. You will receive access once approved by DISTRIBUTOR OS.
          </p>
          <button type="button" className="signup-step6-next" onClick={onNext}>
            Next
          </button>
          <p className="signup-step6-step-label">STEP 6</p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [view, setView] = useState<LoginView>('cards')

  const goToApp = (user?: AuthUser) => {
    const path = user ? getDefaultPath(user.role) : '/orders'
    // Defer navigation so auth state is committed before layout reads it (fixes role badge showing previous user)
    setTimeout(() => navigate(path), 0)
  }

  if (view === 'merchant-signin') {
    return <AuthForm mode="signin" role="merchant" onSuccess={goToApp} onBack={() => setView('cards')} />
  }
  if (view === 'merchant-signup-step1') {
    return (
      <MerchantSignupStep1
        onNext={() => setView('merchant-signup-step2')}
        onBack={() => setView('cards')}
      />
    )
  }
  if (view === 'merchant-signup-step2') {
    return (
      <MerchantSignupStep2
        onNext={() => setView('merchant-signup-step3')}
        onBack={() => setView('merchant-signup-step1')}
      />
    )
  }
  if (view === 'merchant-signup-step3') {
    return (
      <MerchantSignupStep3
        onNext={() => setView('merchant-signup-step4')}
        onBack={() => setView('merchant-signup-step2')}
      />
    )
  }
  if (view === 'merchant-signup-step4') {
    return (
      <MerchantSignupStep4
        onNext={() => setView('merchant-signup-step5')}
        onBack={() => setView('merchant-signup-step3')}
      />
    )
  }
  if (view === 'merchant-signup-step5') {
    return (
      <MerchantSignupStep5
        onNext={() => setView('merchant-signup-step6')}
        onBack={() => setView('merchant-signup-step4')}
      />
    )
  }
  if (view === 'merchant-signup-step6') {
    return <MerchantSignupStep6 onNext={() => setView('cards')} />
  }
  if (view === 'merchant-signup') {
    return <AuthForm mode="signup" role="merchant" onSuccess={goToApp} onBack={() => setView('merchant-signup-step5')} />
  }
  if (view === 'distributor-signin') {
    return <AuthForm mode="signin" role="distributor" onSuccess={goToApp} onBack={() => setView('cards')} />
  }
  if (view === 'distributor-signup') {
    return <AuthForm mode="signup" role="distributor" onSuccess={goToApp} onBack={() => setView('cards')} />
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon" aria-hidden="true" />
            <span>Distributor OS</span>
          </div>
        </div>

        <div className="cards-container">
          <div className="card light">
            <div className="card-icon">
              <div className="store-icon" aria-hidden="true" />
            </div>
            <h2>Sign Up as a Merchant</h2>
            <p>Log in to access your dashboard</p>
            <button type="button" className="button primary" onClick={() => setView('merchant-signin')}>
              Sign In
            </button>
            <button type="button" className="button secondary" onClick={() => setView('merchant-signup-step1')}>
              Create Account
            </button>
          </div>

          <div className="card dark">
            <div className="card-icon">
              <div className="distributor-icon" aria-hidden="true">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <span key={i} className="distributor-dot" />
                ))}
              </div>
            </div>
            <h2>Sign Up as a Distributor</h2>
            <p>Log in to access your dashboard</p>
            <button type="button" className="button primary" onClick={() => setView('distributor-signin')}>
              Sign In
            </button>
            <button type="button" className="button secondary" onClick={() => setView('distributor-signup')}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
