/**
 * Distributor application/profile storage.
 * Sign-up steps save draft; step 6 builds and saves profile keyed by primary admin email.
 * Profile page loads by auth.user.email.
 */

const DRAFT_KEY = 'distro_distributor_draft'
const PROFILES_KEY = 'distro_distributor_profiles'

export type DistributorStep1 = {
  legalName: string
  tradingName: string
  companyRegNo: string
  taxId: string
  yearEst: string
  website: string
  country: string
  phone: string
  registeredAddress: string
  shippingAddress: string
  sameAsRegistered: boolean
}

export type DistributorStep2 = {
  firstName: string
  lastName: string
  jobTitle: string
  workEmail: string
  phoneCountry: string
  phoneNumber: string
  financeName: string
  financeEmail: string
  opsName: string
  opsEmail: string
  salesName: string
  salesEmail: string
}

export type DistributorStep3 = {
  distributorType: string
  industries: string[]
  selectedCountries: string[]
  locations: string
}

export type DistributorStep4 = {
  orderFrequency: string
  orderSize: string
}

export type DistributorStep5 = {
  paymentMethod: string
  creditTerms: string
  authorized: boolean
  termsAgreed: boolean
}

export type DistributorDraft = {
  step1?: DistributorStep1
  step2?: DistributorStep2
  step3?: DistributorStep3
  step4?: DistributorStep4
  step5?: DistributorStep5
}

export type DistributorProfile = {
  status: 'pending' | 'approved' | 'rejected'
  step1: DistributorStep1
  step2: DistributorStep2
  step3: DistributorStep3
  step4: DistributorStep4
  step5: DistributorStep5
  assignedPricing?: string
  orderLimits?: string
  attachedFiles?: { name: string; size: string }[]
}

function getDraftRaw(): unknown {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getDistributorDraft(): DistributorDraft {
  const raw = getDraftRaw()
  return raw && typeof raw === 'object' ? (raw as DistributorDraft) : {}
}

export function saveDistributorDraftStep(
  step: 1 | 2 | 3 | 4 | 5,
  data: DistributorStep1 | DistributorStep2 | DistributorStep3 | DistributorStep4 | DistributorStep5
): void {
  const draft = getDistributorDraft()
  if (step === 1) draft.step1 = data as DistributorStep1
  else if (step === 2) draft.step2 = data as DistributorStep2
  else if (step === 3) draft.step3 = data as DistributorStep3
  else if (step === 4) draft.step4 = data as DistributorStep4
  else if (step === 5) draft.step5 = data as DistributorStep5
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {}
}

export function clearDistributorDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {}
}

function getProfilesRaw(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    if (!raw) return {}
    const o = JSON.parse(raw)
    return typeof o === 'object' && o !== null ? (o as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export function getDistributorProfile(email: string): DistributorProfile | null {
  const key = email.trim().toLowerCase()
  if (!key) return null
  const profiles = getProfilesRaw()
  const p = profiles[key]
  return p && typeof p === 'object' ? (p as DistributorProfile) : null
}

export function setDistributorProfile(email: string, profile: DistributorProfile): void {
  const key = email.trim().toLowerCase()
  if (!key) return
  const profiles = getProfilesRaw()
  profiles[key] = profile
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  } catch {}
}

export function buildProfileFromDraft(draft: DistributorDraft): DistributorProfile | null {
  const s1 = draft.step1
  const s2 = draft.step2
  const s3 = draft.step3
  const s4 = draft.step4
  const s5 = draft.step5
  if (!s1 || !s2 || !s3 || !s4 || !s5) return null
  return {
    status: 'pending',
    step1: s1,
    step2: s2,
    step3: s3,
    step4: s4,
    step5: s5,
    assignedPricing: '-50% on all order',
    orderLimits: '20/30',
    attachedFiles: [],
  }
}

export const SAMPLE_PROFILE: DistributorProfile = {
  status: 'pending',
  step1: {
    legalName: 'Northstar Distribution Group LLC',
    tradingName: 'Northstar Distributors',
    companyRegNo: 'REG-4583921',
    taxId: '87-6543210',
    yearEst: '2016',
    website: '',
    country: 'US',
    phone: '+1 (303) 555-0198',
    registeredAddress: '2450 Industrial Parkway, Suite 300, Denver, CO 80216, United States',
    shippingAddress: 'Same as registered business address',
    sameAsRegistered: true,
  },
  step2: {
    firstName: 'Michael',
    lastName: 'Turner',
    jobTitle: 'Operations Manager',
    workEmail: 'm.turner@northstardistribution.com',
    phoneCountry: 'US',
    phoneNumber: '(303) 555-0198',
    financeName: '',
    financeEmail: '',
    opsName: '',
    opsEmail: '',
    salesName: '',
    salesEmail: '',
  },
  step3: {
    distributorType: 'Regional, Wholesale, B2B only',
    industries: ['CPG', 'Beverage', 'Supplements', 'Health'],
    selectedCountries: ['US'],
    locations: '6-20',
  },
  step4: {
    orderFrequency: 'Bi-weekly',
    orderSize: '$25k-$100k',
  },
  step5: {
    paymentMethod: 'Invoice (Net terms)',
    creditTerms: 'Net 30',
    authorized: true,
    termsAgreed: true,
  },
  assignedPricing: '-50% on all order',
  orderLimits: '20/30',
  attachedFiles: [{ name: 'Contact.pdf', size: '456 KB' }],
}

/** Build a profile from table row data when no saved profile exists (e.g. for View modal). */
export function buildProfileFromTableRow(row: {
  name: string
  businessName: string
  email: string
  phone: string
  status?: string
}): DistributorProfile {
  const parts = row.name.trim().split(/\s+/)
  const firstName = parts[0] ?? row.name
  const lastName = parts.slice(1).join(' ') || row.name
  const status: DistributorProfile['status'] =
    row.status === 'active' ? 'approved' : row.status === 'paused' ? 'pending' : 'pending'
  return {
    ...SAMPLE_PROFILE,
    status,
    step1: {
      ...SAMPLE_PROFILE.step1,
      legalName: row.businessName || SAMPLE_PROFILE.step1.legalName,
      tradingName: row.businessName || SAMPLE_PROFILE.step1.tradingName,
    },
    step2: {
      ...SAMPLE_PROFILE.step2,
      firstName,
      lastName,
      workEmail: row.email,
      phoneNumber: row.phone,
    },
  }
}
