import { RealestateForm } from '@/components/realestate/RealestateForm'
import React from 'react'

const CreateProfilePage = () => {
  return (
    <div className='flex flex-col items-center'>
        <h1 className='text-xl md:text-4xl text-center font-bold border-b-2 pb-2'>Create Realestate Account</h1>
        <RealestateForm type='Create' />
    </div>
    
  )
}

export default CreateProfilePage
