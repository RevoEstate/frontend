'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from '@/lib/auth-client'

export default function AuthGuard({ 
  children,
  isAuthRoute = false
}: {
  children: React.ReactNode
  isAuthRoute?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    // Only check after session status is determined
    if (status !== 'loading') {
      // If this is an auth route and user is logged in, redirect home
      if (isAuthRoute && status === 'authenticated') {
        router.push('/')
      }
      // If this is a protected route and user is not logged in, redirect to sign-in
      else if (!isAuthRoute && status === 'unauthenticated') {
        router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`)
      }
    }
  }, [status, isAuthRoute, router, pathname])

  // Show loading state while checking session
  if (status === 'loading') {
    return <div>Loading...</div>
  }

  // Render children if:
  // - On auth route and not logged in, OR
  // - On protected route and logged in
  return <>{children}</>
}