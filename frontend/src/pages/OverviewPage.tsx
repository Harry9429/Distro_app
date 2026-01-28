import { useAuth } from '../contexts/AuthContext'
import DashboardOverviewPage from './DashboardOverviewPage'
import FinanceManagerOverview from './FinanceManagerOverview'

export default function OverviewPage() {
  const auth = useAuth()
  if (auth.user?.role === 'finance_manager') {
    return <FinanceManagerOverview />
  }
  return <DashboardOverviewPage />
}

