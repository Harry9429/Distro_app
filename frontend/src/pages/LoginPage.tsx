import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, type Role, type AuthUser } from '../contexts/AuthContext'
import { getDefaultPath } from '../lib/rolePermissions'
import './adminOrdersPage.css'

type LoginView =
  | 'cards'
  | 'merchant-signin'
  | 'merchant-signup'
  | 'distributor-signin'
  | 'distributor-signup'

const ROLE_LABEL: Record<Role, string> = {
  merchant: 'Merchant',
  distributor: 'Distributor',
  admin: 'Admin',
  purchasing_manager: 'Purchasing Manager',
  finance_manager: 'Finance Manager',
}

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

export default function LoginPage() {
  const navigate = useNavigate()
  const [view, setView] = useState<LoginView>('cards')

  const goToApp = (user?: AuthUser) => navigate(user ? getDefaultPath(user.role) : '/orders')

  if (view === 'merchant-signin') {
    return <AuthForm mode="signin" role="merchant" onSuccess={goToApp} onBack={() => setView('cards')} />
  }
  if (view === 'merchant-signup') {
    return <AuthForm mode="signup" role="merchant" onSuccess={goToApp} onBack={() => setView('cards')} />
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
            <button type="button" className="button secondary" onClick={() => setView('merchant-signup')}>
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
