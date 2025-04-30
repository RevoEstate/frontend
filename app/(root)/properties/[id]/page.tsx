"use client"

import { notFound } from "next/navigation";
import { Bed, Bath, Ruler, Home, Layers, Calendar, Recycle, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import properties from "@/data/property";
import { PropertyImageGallery } from "@/components/shared/property-image-gallery";
import { useProperty } from "@/hooks/useProperty";
import React from "react";
import { usePropertyById } from "@/hooks/usePropertyById";

const PropertyDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const Params = React.use(params);
  const id = Params.id;
  const { 
    property,
    isLoading,
    isError,
    error
  } = usePropertyById(id);

  console.log("Property Detail: ", property)

  // Handle loading state
  if (isLoading) {
    return <div className="container mt-18 flex justify-center py-12">
      <p>Loading property details...</p>
    </div>;
  }

  // Handle error state
  if (isError) {
    if (error?.message.includes('404')) {
      notFound(); // Return 404 page for not found properties
    }
    return <div className="container mt-18 flex justify-center py-12">
      <p>Error loading property: {error?.message}</p>
    </div>
  }

 

  const formattedPrice =
    property?.listingType === "For Sale"
      ? `$${property?.price.toLocaleString()}`
      : `$${property?.price.toLocaleString()}/mo`;

  return (
    <div className="bg-white dark:bg-gray-900 mt-18 container">
      <PropertyImageGallery
        images={property?.images}
        title={property?.title}
        region={property?.address.region} 
        city={property?.address.city} 
        specificLocation={property?.address.specificLocation} 
        formattedPrice={formattedPrice}
        propertyType={property?.listingType}
        isFeatured={property?.isFeatured}
      />

      {/* Rest of your content remains exactly the same */}
      <div className="py-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {property?.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <Bed className="w-6 h-6 text-sky-500 mr-2" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Bedrooms
                    </p>
                    <p className="font-medium">{property?.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bath className="w-6 h-6 text-sky-500 mr-2" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Bathrooms
                    </p>
                    <p className="font-medium">{property?.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Ruler className="w-6 h-6 text-sky-500 mr-2" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Area
                    </p>
                    <p className="font-medium">
                      {property?.area.toLocaleString()} sqm
                    </p>
                  </div>
                </div>
                {property?.builtInYear && (
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 text-sky-500 mr-2" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Year Built
                      </p>
                      <p className="font-medium">{property?.builtInYear} G.C</p>
                    </div>
                  </div>
                )}
                {property?.furnished && (
                  <div className="flex items-center">
                    <Recycle className="w-6 h-6 text-sky-500 mr-2" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Is it furnished?
                      </p>            
                      <p className="font-medium">Furnished</p>
                    </div>
                  </div>
                )}
                {property?.landArea && (
                  <div className="flex items-center">
                    <Maximize className="w-6 h-6 text-sky-500 mr-2" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Plot Area/Total Area
                      </p>
                      <p className="font-medium">{property?.landArea}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {property?.amenities && property?.amenities.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {property?.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-sky-100 dark:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* VR Tour */}
            {property.panoramicImages && (
              <div className="p-6">
                <div className='mb-8'>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">Explore Our Property in 360° Panaromic View</h2>
                  <p className='text-sm md:text-base text-muted-foreground'>Immerse yourself in stunning panoramic views of our rooms.</p>
                </div>
                  {/* <Panorama 
                    panoramicImages={property.panoramicImages} 
                    // hotspots={hotspots} 
                  />   */}
                  VR SOON
              </div>
            )}
            
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">
                Schedule For Physical Tour
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-sky-500 hover:bg-sky-600"
                >
                  Request Viewing
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
