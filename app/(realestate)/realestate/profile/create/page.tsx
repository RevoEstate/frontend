import { RealestateForm } from '@/components/realestate/RealestateForm'
import React from 'react'

const CreateProfilePage = () => {
  return (
    <div className='container'>
        <h1 className='text-xl md:text-4xl text-center font-bold'>Create Realestate Account</h1>
        <hr className='my-3' />
        <RealestateForm type='Create' />
    </div>
    
  )
}

export default CreateProfilePage
