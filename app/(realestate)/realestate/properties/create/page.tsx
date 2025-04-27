import PropertyForm from '@/components/realestate/PropertyForm';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: 'Create Property',
  };

const CreatePropertyPage = () => {
  return (
    <div className='flex flex-col items-center gap-5'>
      <h1 className='text-xl md:text-4xl text-center font-bold border-b-2 pb-2'>Create Property</h1>
      <PropertyForm />
    </div>
    
  )

}

export default CreatePropertyPage
