import { useAuth } from '../contexts/AuthContext'
import DashboardOverviewPage from './DashboardOverviewPage'
import FinanceManagerOverview from './FinanceManagerOverview'
import MerchantOverview from './MerchantOverview'

export default function OverviewPage() {
  const auth = useAuth()
  if (auth.user?.role === 'finance_manager') {
    return <FinanceManagerOverview />
  }
  if (auth.user?.role === 'merchant') {
    return <MerchantOverview />
  }
  return <DashboardOverviewPage />
}

