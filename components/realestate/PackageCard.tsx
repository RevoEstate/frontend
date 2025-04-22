"use client"

import React from 'react';
import { IPackage } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

interface PackageCardProps {
    packageData: IPackage;
    id: string
  }

const PackageCard: React.FC<PackageCardProps> = ({ packageData, id }) => {
const isPremium = packageData.packageType === 'premium';

  return (
    <Card className={`relative overflow-hidden ${isPremium ? 'border-2 border-amber-500' : 'border-1 border-sky-600'}`}>
      {isPremium && (
        <div className="absolute top-0 right-0 bg-amber-600 text-white px-3 py-1 text-sm font-bold rounded-bl-lg">
          Premium
        </div>
      )}
      
      <CardHeader className='mt-5'>
        <CardTitle>{packageData.packageName}</CardTitle>
        <CardDescription>{packageData.packageDescription}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <div className="text-4xl font-bold mb-1">
            ${packageData.packagePrice.usd}
            <span className="text-lg font-normal text-muted-foreground"> / {packageData.packageDuration} days</span>
          </div>
          <div className="text-lg text-muted-foreground">
            ETB {packageData.packagePrice.etb}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{packageData.numberOfProperties} properties included</span>
          </div>
          {/* Other features... */}
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild
            className={`w-full cursor-pointer ${ isPremium ? 'bg-amber-700 hover:bg-amber-700/80' : 'bg-sky-600 hover:bg-sky-600/70' }`}
            >
              <Link href={`/realestate/packages/${id}`}>
                Get Started
              </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PackageCard;