"use client";
import { MapPin, Bed, Bath, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  beds: number;
  baths: number;
  areaSqft: number;
  location: string;
  images: string[];
  type: "For Sale" | "For Rent";
  yearBuilt?: number;
  status?: string;
  featured?: boolean;
  vrTour?: string;
}

export function PropertyCard({
  id,
  title,
  price,
  beds,
  baths,
  areaSqft,
  location,
  images,
  type,
}: PropertyCardProps) {
  const formattedPrice = type === "For Sale" 
    ? `$${price.toLocaleString()}` 
    : `$${price.toLocaleString()}/mo`;

  return (
    <Card className="w-full max-w-sm flex flex-col overflow-hidden group hover:shadow-md rounded-sm transition-shadow">
      <CardHeader className="p-0 overflow-hidden mt-[-25px]">
        <Link href={`/properties/${id}`} className="block w-full h-[250px] relative">
          <Image
            src={images[0] || "/images/default-property.jpg"}
            alt={title}
            fill
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-sky-500/60 text-white px-2 py-1 rounded-md text-xs font-medium">
            {type}
          </div>
        </Link>
      </CardHeader>

      <CardContent className="mt-4 flex-grow px-4">
        <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
        <p className="flex items-center text-muted-foreground mt-2">
          <MapPin className="w-4 h-4 mr-1" /> {location}
        </p>
        <div className="flex gap-4 mt-4 text-sm">
          <span className="flex items-center">
            <Bed className="w-4 h-4 mr-1" /> {beds} Beds
          </span>
          <span className="flex items-center">
            <Bath className="w-4 h-4 mr-1" /> {baths} Baths
          </span>
          <span className="flex items-center">
            <Ruler className="w-4 h-4 mr-1" /> {areaSqft.toLocaleString()} sqft
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center px-4 pb-4">
        <span className="text-lg font-bold">{formattedPrice}</span>
        {/* <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
          <Link href={`/properties/${id}`}>View Details</Link>
        </Button> */}
      </CardFooter>
    </Card>
  );
}