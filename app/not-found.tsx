import Link from 'next/link'
import Head from 'next/head'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found | 404</title>
      </Head>
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto h-24 w-24 text-sky-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          
          <p className="text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link href="/" passHref>
            <Button className="cursor-pointer px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 shadow-md">
              Return to Homepage
            </Button>
          </Link>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? <a href="/" className="text-indigo-600 hover:underline">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}