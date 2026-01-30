import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DistributorDetailsContent from '../components/DistributorDetailsContent'
import { getDistributorProfile, setDistributorProfile, SAMPLE_PROFILE, type DistributorProfile } from '../lib/distributorProfile'
import './adminOrdersPage.css'

/** Distributor Details profile screen – shown to distributor after approval. Loads saved profile by email or sample. */
export default function DistributorDetailsPage() {
  const auth = useAuth()
  const email = auth.user?.email?.trim()?.toLowerCase() ?? ''
  const [profile, setProfile] = useState<DistributorProfile>(() => getDistributorProfile(email) ?? SAMPLE_PROFILE)

  useEffect(() => {
    const p = getDistributorProfile(email) ?? SAMPLE_PROFILE
    setProfile(p)
  }, [email])

  const handleApprove = () => {
    if (!email) return
    const next = { ...profile, status: 'approved' as const }
    setDistributorProfile(email, next)
    setProfile(next)
  }
  const handleReject = () => {
    if (!email) return
    const next = { ...profile, status: 'rejected' as const }
    setDistributorProfile(email, next)
    setProfile(next)
  }

  const isAdmin = auth.user?.role === 'admin'

  return (
    <div className="content-area distributor-details-page">
      <div className="distributor-details-card">
        <h1 className="distributor-details-title">Distributor Details</h1>
        <DistributorDetailsContent
          profile={profile}
          showActions
          isAdmin={isAdmin}
          onApprove={handleApprove}
          onReject={handleReject}
          allowFileEdit
        />
      </div>
    </div>
  )
}
