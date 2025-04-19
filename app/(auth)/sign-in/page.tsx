import SignInForm from '@/components/auth/SignInForm'
import React, { Suspense } from 'react'

const SignInPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
}

export default SignInPage
