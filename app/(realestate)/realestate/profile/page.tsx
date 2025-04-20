import { RealEstateProfile } from '@/components/realestate/RealestateProfile'
import { mockCompany } from '@/data/realestate'
import React from 'react'

const RealestateProfilePage = () => {
  return (
   <RealEstateProfile company={mockCompany} />
  )
}

export default RealestateProfilePage
