"use client"

import PropertyUpdateForm from '@/components/realestate/PropertyUpdateForm';
import { usePropertyById } from '@/hooks/usePropertyById';
import React from 'react'

const PropertyUpdatePage = ({ params }: { params: Promise<{ id: string }> }) => {
    const Params = React.use(params);
    const id = Params.id;
    const { 
      property,
      isLoading,
      isError,
      error,
      refetch
    } = usePropertyById(id);
    
    if (isLoading) {
      return <div>Loading property details...</div>;
    }

    if (isError) {
      return <div>Error loading property: {error?.message}</div>;
    }

  return (
    <div>
        <h1 className="text-xl md:text-4xl font-bold text-center border-b-1 pb-2 shadow-xs mb-6 p-3 rounded-xl">
        Update Property
      </h1>
      <PropertyUpdateForm 
        property={property} 
        onSuccess={() => refetch()} 
      />
    </div>
  )
}

export default PropertyUpdatePage