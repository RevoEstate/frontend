"use client"

import { RealestateForm } from '@/components/realestate/RealestateForm';
import { useRealestateById } from '@/hooks/useRealestateById';
import { useRealestateByUserId } from '@/hooks/useRealestateByUser';
import React from 'react'

const RealestateUpdatePage = () => {
    const { realestate: userRealestate, isLoading: userLoading } = useRealestateByUserId();
    const { 
    realestate, 
    isLoading, 
    error 
    } = useRealestateById(userRealestate?._id);

    console.log("Update Page: ", realestate)

  return (
    <div>
        Update
      <RealestateForm type='Update' realestate={realestate} realestateId={realestate?._id} />
    </div>
  )
}

export default RealestateUpdatePage
