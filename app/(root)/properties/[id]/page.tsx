"use client"

import { notFound } from "next/navigation";
import { Bed, Bath, Ruler, Home, Layers, Calendar, Recycle, Maximize, MessageSquareMore, MapPin, Phone, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import properties from "@/data/property";
import { PropertyImageGallery } from "@/components/shared/property-image-gallery";
import { useProperty } from "@/hooks/useProperty";
import React, { useState } from "react";
import { usePropertyById } from "@/hooks/usePropertyById";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import dynamic from "next/dynamic"
import Panorama from "@/components/shared/Panorama";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import axios from "axios";


const PropertyDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const Params = React.use(params);
  const { data: session } = useSession();
  const id = Params.id;
  const { 
    property,
    isLoading,
    isError,
    error
  } = usePropertyById(id);

  // State for tour scheduling
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("Authentication Required", {
        description: "You must be logged in to schedule a tour",
      });
      return;
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    
    // Check if date is on weekend (0 = Sunday, 6 = Saturday)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      toast.error("Invalid Date", {
        description: "Please select a weekday (Monday to Friday)",
      });
      return;
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error("Invalid Date", {
        description: "Please select a date in the future",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/appointment/property`,
        {
          property: property?._id,
          company: property?.companyId?._id || property?.userId._id,
          customer: session.user.id,
          scheduledDate: selectedDate.toISOString(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true 
        }
      );

      toast.success("Tour Scheduled!", {
        description: "Your property tour appointment has been sent to the realestate.",
      });
      
      // Reset form
      setDate("");
      setMessage("");
    } catch (error) {
      let errorMessage = "Failed to schedule appointment";
  
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
    
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  console.log("Property Details: ", property)

  // Handle loading state
  if (isLoading) {
    return (
      <header className="flex items-center justify-center h-[80vh]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-transparent cursor-wait text-black"
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
      </header>
    );
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

  const Map = dynamic(() => import('@/components/shared/Map'), {
    ssr: false,
    loading: () => <div>Loading map...</div>,
  })

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
              <div className="mb-5 w-full">
                <div className='mb-8'>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">Explore Our Property in 360° Panaromic View</h2>
                  <p className='text-sm md:text-base text-muted-foreground'>Immerse yourself in stunning panoramic views of our rooms.</p>
                </div>
                  <Panorama 
                    panoramicImages={property.panoramicImages} 
                  />  
              </div>
            )}

            <div className="w-full py-5">
              <div className='mb-8'>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">Property's Location</h2>
                <p className='text-sm md:text-base text-muted-foreground'>Discover the exact location and surroundings of the property</p>
              </div>
              {property?.address.geoPoint?.coordinates ? (
                <div className="mb-16 h-[500px]">
                  <Map center={property.address.geoPoint.coordinates} property={property} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[50vh] bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Map coordinates not available</p>
                </div>
              )}
            </div>

          </div>
          {/* Sidebar */}
          <div className="flex flex-col gap-5 mb-3">
            {/* Owner/Company Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <h1 className="text-2xl font-bold mb-1">Property Owner</h1>
                <Separator className="mb-4" />
                {property.companyId?.imageUrl && (
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary">
                    <img 
                      src={property.companyId.imageUrl}
                      alt={property.companyId.realEstateName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold">{property.companyId?.realEstateName || "Property Owner"}</h3>
                {property.companyId?.isVerified && (
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {property.companyId?.description && (
                  <p className="text-sm text-muted-foreground text-justify">
                    {property.companyId.description}
                  </p>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-6 h-6 text-sky-500 mr-2" />
                    <span className="text-sm">{property.companyId?.email || property.userId.email}</span>
                  </div>

                  {property.companyId?.phone && (
                    <div className="flex items-center gap-2">
                    <Phone className="w-6 h-6 text-sky-500 mr-2" />
                    <span className="text-sm">{property.companyId?.phone }</span>
                    </div>
                  )}

                  {property.companyId?.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-6 h-6 text-sky-500 mr-2" />
                      <span className="text-sm">
                        {property.companyId.address.specificLocation}<br />
                        {property.companyId.address.city}, {property.companyId.address.region}
                      </span>
                    </div>
                  )}
                </div>

                {/* Social Media Links */}
                {property.companyId?.socialMedia && (
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Connect with us</h4>
                    <div className="flex gap-3">
                      {property.companyId.socialMedia.facebook && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={property.companyId.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="w-6 h-6 text-sky-500" />
                          </a>
                        </Button>
                      )}
                      {property.companyId.socialMedia.instagram && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={property.companyId.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="w-6 h-6 text-rose-500" />
                          </a>
                        </Button>
                      )}
                      {property.companyId.socialMedia.linkedin && (
                        <Button variant="outline" size="icon" asChild>
                          <Link href={property.companyId.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className="w-6 h-6 text-sky-500" />
                          </Link>
                        </Button>
                      )}
                      {property.companyId.socialMedia.whatsapp && (
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`https://wa.me/${property.companyId.socialMedia.whatsapp}`} target="_blank" rel="noopener noreferrer">
                            <MessageSquareMore className="w-6 h-6 text-green-500" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
         {/* Updated Schedule Tour Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Schedule For Physical Tour</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="date">Appointment Date*</Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={!session}
                    value={date}
                    className="cursor-pointer"
                  />
                  {!session && (
                    <p className="text-sm text-red-500">
                      You must be logged in to schedule a tour
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-sky-600 hover:bg-sky-600/80 text-white hover:text-white"
                  disabled={!session || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    'Request Physical Tour'
                  )}
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
