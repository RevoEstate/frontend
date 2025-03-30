"use client";
import { MapPin, Bed, Bath, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
  id: number;
  title: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  location: string;
  image: string;
}

export function PropertyCard({
  id,
  title,
  price,
  beds,
  baths,
  sqft,
  location,
  image,
}: PropertyCardProps) {
  return (
    <Card className="w-full max-w-sm flex flex-col overflow-hidden group">
      <CardHeader className="p-0 overflow-hidden mt-[-25px]">
        <Link href={`/product/${id}`} className="block w-full h-[250px]">
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
        </Link>
      </CardHeader>

      <CardContent className="mt-4 flex-grow px-4">
        <h3 className="text-xl font-semibold">{title}</h3>
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
            <Ruler className="w-4 h-4 mr-1" /> {sqft} sqft
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center px-4 pb-4">
        <span className="text-lg font-bold">{price}</span>
        <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
