"use client"

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Bed, Bath, Ruler, Pencil, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";


export const RealestatePropertyCard = ({ property, onDelete }: any) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const location = `${property.address.region}, ${property.address.city}`;
  const formattedPrice = property.listingType === "For Sale" 
    ? `$${property.price.toLocaleString()}` 
    : `$${property.price.toLocaleString()}/mo`;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/properties/${property._id}`,
        { withCredentials: true }
      );
      toast.success("Property deleted successfully.");
      onDelete?.(); // Notify parent to refetch or update state
    } catch (error) {
      toast.error("Failed to delete property. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full max-w-sm flex flex-col overflow-hidden group hover:shadow-md rounded-sm transition-shadow">
      <CardHeader className="p-0 overflow-hidden mt-[-25px]">
        <Link href={`realestate/properties/${property._id}`} className="block w-full h-[250px] relative">
          <Image
            src={property.images[0] || "/images/default-property.jpg"}
            alt={property.title}
            fill
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-sky-500/60 text-white px-2 py-1 rounded-md text-xs font-medium">
            {property.listingType}
          </div>
        </Link>
      </CardHeader>

      <CardContent className="mt-4 flex-grow px-4">
        <h3 className="text-xl font-semibold line-clamp-1">{property.title}</h3>
        <p className="flex items-center text-muted-foreground mt-2">
          <MapPin className="w-4 h-4 mr-1" /> {location}
        </p>
        <div className="flex gap-4 mt-4 text-sm">
          <span className="flex items-center">
            <Bed className="w-4 h-4 mr-1" /> {property.bedrooms} Beds
          </span>
          <span className="flex items-center">
            <Bath className="w-4 h-4 mr-1" /> {property.bathrooms} Baths
          </span>
          <span className="flex items-center">
            <Ruler className="w-4 h-4 mr-1" /> {property.area.toLocaleString()} sqft
          </span>
        </div>
        {property.amenities && property.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-xs text-gray-500">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center px-4 pb-4">
        <span className="text-lg font-bold">{formattedPrice}</span>
        <div className="flex gap-5 justify-end items-center">
          <Link href={`/realestate/properties/${property._id}`} title="Edit Property">
            <Pencil className="w-5 h-5 text-sky-600 hover:text-sky-800 transition-colors cursor-pointer" />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button disabled={isDeleting} title="Delete Property">
                <Trash
                  className={`w-5 h-5 ${isDeleting ? 'text-gray-400' : 'text-red-600 hover:text-red-800'} transition-colors cursor-pointer`} 
                />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the property "{property.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700 hover:text-white cursor-pointer" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};