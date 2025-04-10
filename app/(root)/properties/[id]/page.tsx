
import { notFound } from 'next/navigation';
import { Bed, Bath, Ruler, Home, Car, Layers, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import properties from '@/data/property';
import { PropertyImageGallery } from '@/components/property-image-gallery';

const PropertyDetailsPage = async (props: {
    params: Promise<{ id: string }>
}) => {
    const { id } = await props.params
    const property = properties.find(p => p.id === Number(id));

  if (!property) {
    return notFound();
  }

  const formattedPrice = property.type === "For Sale" 
  ? `$${property.price.toLocaleString()}` 
  : `$${property.price.toLocaleString()}/mo`;

  return (
    <div className="bg-white dark:bg-gray-900 mt-18 container">
      <PropertyImageGallery
        images={property.images}
        title={property.title}
        location={property.location}
        formattedPrice={formattedPrice}
        propertyType={property.type}
        isFeatured={property.featured}
      />

      {/* Rest of your content remains exactly the same */}
      <div className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Property Details</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{property.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <Bed className="w-6 h-6 text-sky-500 mr-2" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Bedrooms</p>
                    <p className="font-medium">{property.beds}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bath className="w-6 h-6 text-sky-500 mr-2" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Bathrooms</p>
                    <p className="font-medium">{property.baths}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Ruler className="w-6 h-6 text-sky-500 mr-2" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Area</p>
                    <p className="font-medium">{property.areaSqft.toLocaleString()} sqft</p>
                  </div>
                </div>
                {property.yearBuilt && (
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 text-sky-500 mr-2" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Year Built</p>
                      <p className="font-medium">{property.yearBuilt}</p>
                    </div>
                  </div>
                )}
                {property.garage && (
                  <div className="flex items-center">
                    <Car className="w-6 h-6 text-sky-500 mr-2" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Garage</p>
                      <p className="font-medium">{property.garage} spaces</p>
                    </div>
                  </div>
                )}
                {property.lotSize && (
                  <div className="flex items-center">
                    <Layers className="w-6 h-6 text-sky-500 mr-2" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Lot Size</p>
                      <p className="font-medium">{property.lotSize}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

             {/* Amenities */}
             {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {property.amenities.map((amenity, index) => (
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
             {property.vrTour && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Virtual Tour</h2>
                <div className="aspect-video bg-sky-200 rounded-lg overflow-hidden">
                  <iframe 
                    src={property.vrTour} 
                    className="w-full h-full" 
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
           {/* Sidebar */}
           <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Schedule For Physical Tour</h2>
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
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
                  Request Viewing
                </Button>
              </form>

              {/* <div className="mt-8 pt-6 border-t">
                <h3 className="font-bold mb-3">Contact Agent</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Home className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{property.agent || "Revo Estate Agent"}</p>
                    <p className="text-sm text-gray-500">Licensed Realtor</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Contact Agent
                </Button>
              </div> */}
            </div>
            </div>
        </div> 
      </div>
    </div>
  )
}

export default PropertyDetailsPage
