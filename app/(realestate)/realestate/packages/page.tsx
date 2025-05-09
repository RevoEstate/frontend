"use client"

import PackageCard from '@/components/realestate/PackageCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/lib/auth-client'
import React, { useEffect, useState } from 'react'

const PackagePage = () => {
  const [packages, setPackages] = useState<any[]>([])
  console.log('packages here', packages)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/system-admin/getallpackages`, {
          method: 'GET',
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log("API Response: ", result);
        
        setPackages(result.data.packages || []); 
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-h-screen">
        <div className="max-w-7xl mx-auto text-center md:w-[50vw] mt-20">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 rounded-md py-10 relative">
            <strong>Error loading packages:</strong> {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Our Pricing Packages</h1>
          <p className="text-sm md:text-normal text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect package for your business needs.
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="text-center border-1 py-8 rounded-2xl md:mx-20 px-3 shadow-xl">
            <p className="text-muted-foreground text-lg">No packages available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} packageData={pkg} id={pkg._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PackagePage