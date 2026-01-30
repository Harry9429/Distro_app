import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  getDistributorDraft,
  saveDistributorDraftStep,
  buildProfileFromDraft,
  setDistributorProfile,
  clearDistributorDraft,
} from '../lib/distributorProfile'
import {
  DistributorSignupStep1,
  DistributorSignupStep2,
  DistributorSignupStep3,
  DistributorSignupStep4,
  DistributorSignupStep5,
  DistributorSignupStep6,
} from './LoginPage'
import './adminOrdersPage.css'

type Step = 1 | 2 | 3 | 4 | 5 | 6

export default function AddDistributorPage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [step, setStep] = useState<Step>(1)

  const handleStep6Complete = () => {
    const draft = getDistributorDraft()
    const profile = buildProfileFromDraft(draft)
    const email = draft.step2?.workEmail?.trim()?.toLowerCase()
    if (email && profile) {
      setDistributorProfile(email, profile)
      clearDistributorDraft()
      auth.signup(email, 'Welcome1!', 'distributor')
      setTimeout(() => navigate('/distributors'), 0)
      return
    }
    navigate('/distributors')
  }

  const goBackFromStep1 = () => navigate('/distributors')

  if (step === 1) {
    return (
      <DistributorSignupStep1
        onNext={(data) => {
          saveDistributorDraftStep(1, data)
          setStep(2)
        }}
        onBack={goBackFromStep1}
      />
    )
  }
  if (step === 2) {
    return (
      <DistributorSignupStep2
        onNext={(data) => {
          saveDistributorDraftStep(2, data)
          setStep(3)
        }}
        onBack={() => setStep(1)}
      />
    )
  }
  if (step === 3) {
    return (
      <DistributorSignupStep3
        onNext={(data) => {
          saveDistributorDraftStep(3, data)
          setStep(4)
        }}
        onBack={() => setStep(2)}
      />
    )
  }
  if (step === 4) {
    return (
      <DistributorSignupStep4
        onNext={(data) => {
          saveDistributorDraftStep(4, data)
          setStep(5)
        }}
        onBack={() => setStep(3)}
      />
    )
  }
  if (step === 5) {
    return (
      <DistributorSignupStep5
        onNext={(data) => {
          saveDistributorDraftStep(5, data)
          setStep(6)
        }}
        onBack={() => setStep(4)}
      />
    )
  }
  return (
    <DistributorSignupStep6 onNext={handleStep6Complete} />
  )
}
