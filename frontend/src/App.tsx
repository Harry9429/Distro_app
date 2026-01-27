import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import AnalyticsPage from './pages/AnalyticsPage'
import ApprovalsPage from './pages/ApprovalsPage'
import BillingPage from './pages/BillingPage'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import OverviewPage from './pages/OverviewPage'
import ProductsPage from './pages/ProductsPage'
import ResourcesPage from './pages/ResourcesPage'
import SettingsPage from './pages/SettingsPage'
import SubmitTicketPage from './pages/SubmitTicketPage'
import TeamPage from './pages/TeamPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/submit-ticket" element={<SubmitTicketPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

