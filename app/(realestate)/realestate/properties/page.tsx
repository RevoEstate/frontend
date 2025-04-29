"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import { RealestatePropertyCard } from '@/components/realestate/RealestatePropertyCard';
import Pagination from '@/components/shared/Pagination';
import { usePropertyByRealestate } from '@/hooks/usePropertyByRealestate';

const RealestatePropertyPage = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { data: response, isLoading, error } = usePropertyByRealestate(page);
  console.log("Realestate Properties Response: ", response);

  // Extract properties array and total from response
  const properties = response?.properties || [];
  const total = response?.total || 0;
  const pageSize = 10; // Assumed page size based on original code
  const totalPages = Math.ceil(total / pageSize); // Calculate total pages

  // Handle deletion by invalidating the query
  const handleDelete = () => {
    queryClient.invalidateQueries({ queryKey: ['company-properties'] });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
        <div className='flex justify-center'>
          <Skeleton className="h-8 w-1/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No properties found</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => setPage(1)}
        >
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Properties</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property: any) => (
          <RealestatePropertyCard 
            key={property._id} 
            property={property} 
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        pagesToShow={5}
      />
    </div>
  );
};

export default RealestatePropertyPage;