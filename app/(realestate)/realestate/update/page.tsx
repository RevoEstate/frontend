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

  return (
    <div className='flex flex-col items-center'>
        <h1 className='text-xl md:text-4xl text-center font-bold border-b-2 pb-2'>Update Realestate Account</h1>
      <RealestateForm type='Update' realestate={realestate} realestateId={realestate?._id} />
    </div>
  )
}

export default RealestateUpdatePage
