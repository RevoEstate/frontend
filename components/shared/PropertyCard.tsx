import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { MapPin, Ruler, Bed, Bath, Car, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { Property } from "@/types";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useBookmarks } from "@/hooks/useBookmark";
import { useQueryClient } from '@tanstack/react-query';



export function PropertyCard({ property, onRemoveBookmark }: { property: Property, onRemoveBookmark?: () => void }) {

  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { data: bookmarks, refetch } = useBookmarks();

  const isLiked = bookmarks?.some(b => b.propertyId._id === property._id) || false;
  const bookmarkId = bookmarks?.find(b => b.propertyId._id === property._id)?._id || null;


  const formattedPrice = property.listingType === "For Sale" 
  ? `${property.price.toLocaleString()} ETB` 
  : `${property.price.toLocaleString()} ETB /month`;

  const handleLikeToggle = async () => {
    if (!session) {
      toast.error("Please login to bookmark properties");
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLiked && bookmarkId) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/bookmark/${bookmarkId}`,
          { withCredentials: true }
        );
        toast.success("Property removed from bookmarks");
        onRemoveBookmark?.();
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/bookmark/add-to-bookmark`,
          { propertyId: property._id },
          { withCredentials: true }
        );
        toast.success("Property added to bookmarks");
      }
      // Manually refetch bookmarks after any change
      await refetch();
    } catch (error) {
      toast.error(`Failed to ${isLiked ? 'remove from' : 'add to'} bookmarks`);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -1 }}
      >
          <Card className="w-full max-w-sm flex flex-col overflow-hidden group hover:shadow-md rounded-sm transition-shadow">
            <CardHeader className="p-0 overflow-hidden mt-[-25px]">
              <Link href={`/properties/${property._id}`} className="block w-full h-[250px] relative">
                <Image
                  src={property.images[0] || "/images/default-property.jpg"}
                  alt={property.title}
                  fill
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                { property.isFeatured && (
                  <div className="absolute top-2 left-2 bg-amber-200/60 text-amber-800 px-2 py-1 rounded-md text-xs font-medium">
                  Featured
                </div>
                ) }
              
                <div className="absolute top-2 right-2 bg-sky-500/60 text-white px-2 py-1 rounded-md text-xs font-medium">
                  {property.listingType}
                </div>
              </Link>
            </CardHeader>

            <CardContent className="flex-grow px-4">
              <h3 className="text-xl font-semibold line-clamp-1">{property.title}</h3>
              <p className="flex items-center text-muted-foreground mt-2">
                <MapPin className="w-4 h-4 mr-1" /> {property.address.region} {", "} {property.address.city}
              </p>
              <div className="flex gap-4 mt-4 text-sm">
                <span className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" /> {property.bedrooms} Beds
                </span>
                <span className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" /> {property.bathrooms} Baths
                </span>
                <span className="flex items-center">
                  <Ruler className="w-4 h-4 mr-1" /> {property.area.toLocaleString()} sqm
                </span>
              </div>
              <div className="mt-2 flex-wrap">
                  {property.amenities.slice(0, 5).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="mr-1 bg-sky-100">
                      {amenity}
                    </Badge>
                  ))}
                  {property.amenities.length > 5 && (
                    <Badge variant="secondary">+{property.amenities.length - 3}</Badge>
                  )}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center px-4 pb-4">
              <span className="text-lg font-bold">{formattedPrice}</span>
              <button 
                onClick={handleLikeToggle}
                disabled={isLoading}
                className={`${isLiked ? 'text-sky-600' : 'text-gray-400'} cursor-pointer hover:text-sky-700 transition-colors`}
                aria-label={isLiked ? "Remove from bookmarks" : "Add to bookmarks"}
              >
                <ThumbsUp 
                  size={26} 
                  fill={isLiked ? "currentColor" : "none"}
                  className={isLoading ? "animate-pulse" : ""}
                />
              </button>
            </CardFooter>
          </Card>
    </motion.div>
  
  );
}