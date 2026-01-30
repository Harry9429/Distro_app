import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { getDefaultPath } from './lib/rolePermissions'
import AdminLayout from './layouts/AdminLayout'
import AnalyticsPage from './pages/AnalyticsPage'
import ApprovalsPage from './pages/ApprovalsPage'
import BillingPage from './pages/BillingPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import OrderDetailPage from './pages/OrderDetailPage'
import OrdersPage from './pages/OrdersPage'
import PaymentDetailsPage from './pages/PaymentDetailsPage'
import OverviewPage from './pages/OverviewPage'
import ProductsPage from './pages/ProductsPage'
import ResourcesPage from './pages/ResourcesPage'
import SettingsPage from './pages/SettingsPage'
import SubmitTicketPage from './pages/SubmitTicketPage'
import TeamPage from './pages/TeamPage'
import StandaloneDashboardPage from './pages/StandaloneDashboardPage'
import DistributorDetailsPage from './pages/DistributorDetailsPage'
import DistributorsPage from './pages/DistributorsPage'
import AddDistributorPage from './pages/AddDistributorPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  if (!auth.isLoggedIn) return <Navigate to="/login" replace />
  return <>{children}</>
}

function LoginGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  if (auth.isLoggedIn && auth.user) return <Navigate to={getDefaultPath(auth.user.role)} replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginGuard><LoginPage /></LoginGuard>} />
          <Route path="/standalone" element={<StandaloneDashboardPage />} />
          <Route path="/" element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route index element={<Navigate to="/orders" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/view/:orderId" element={<OrderDetailPage />} />
            <Route path="orders/view/:orderId/payment" element={<PaymentDetailsPage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="submit-ticket" element={<SubmitTicketPage />} />
            <Route path="profile" element={<DistributorDetailsPage />} />
            <Route path="distributors" element={<DistributorsPage />} />
            <Route path="distributors/add" element={<AddDistributorPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

