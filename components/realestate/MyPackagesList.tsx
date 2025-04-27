"use client"

import { useMyPackages } from '@/hooks/useMyPackages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { MyPackagesSkeleton } from './MyPackagesSkeleton';

function MyPackagesList() {
  const { data: packages, isLoading, error } = useMyPackages();
  console.log("My Packages: ", packages)

  if (isLoading) {
    return (
      <MyPackagesSkeleton />
    );
  }

  if (error) {
    return (
      <div className="text-center border-1 flex flex-col justify-center items-center mt-30 py-8 md:mx-60 shadow-md rounded-md">
        <h1 className='text-lg md:text-2xl text-gray-800 font-bold pb-2'>Error loading packages</h1>
        <p className='text-gray-600'>{error.message}</p>
        <Link 
          href='/realestate/packages' 
          className='mt-4 underline text-sky-600 hover:text-sky-500'
        >
          Browse Packages
        </Link>
      </div>
    );
  }


  if (!packages || packages.length === 0) {
    return (
      <div className="text-center border-1 flex flex-col justify-center items-center mt-30 py-8 md:mx-60 shadow-md rounded-md">
        <h1 className='text-lg md:text-3xl text-gray-800 font-bold pb-2'>No packages purchased yet</h1>
        <p className='text-gray-600'>Get some packages <Link href='/realestate/packages' className='underline text-sky-600 hover:text-sky-500'>here</Link></p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {packages.map((purchase) => {
        const remainingProperties = purchase.maxnumberOfProperties - purchase.numberOfProperties;
        const isPackageFull = remainingProperties <= 0;
        const isActive = new Date(purchase.expireDate) > new Date();

        return (
          <Card key={purchase._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{purchase.packageId.packageName}</CardTitle>
              <div className="flex justify-between items-center">
                <span 
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    purchase.packageId.packageType === 'premium' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {purchase.packageId.packageType}
                </span>
                <span className="text-sm font-medium">
                  {purchase.paymentMethod === 'stripe'
                    ? `$${purchase.price.usd.toFixed(2)}`
                    : `${purchase.price.etb.toFixed(2)} Birr`}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <span>Max Properties:</span>
                <span>{purchase.maxnumberOfProperties}</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span>Properties Used:</span>
                <span>{purchase.numberOfProperties}</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span>Availability:</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isPackageFull 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {isPackageFull ? 'Package Full' : `${remainingProperties} properties`}
                </span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span>Expires:</span>
                <span>{new Date(purchase.expireDate).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span>Status:</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isActive ? 'Active' : 'Expired'}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  );
}

export default MyPackagesList;