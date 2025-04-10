'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Button } from './ui/button';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
  location: string;
  formattedPrice: string;
  propertyType: string;
  isFeatured: boolean;
}

export function PropertyImageGallery({
  images,
  title,
  location,
  formattedPrice,
  propertyType,
  isFeatured,
}: PropertyImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    api?.scrollTo(index);
  };

  return (
    <div className="relative w-full mb-4">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent className='mb-10'>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[60vh] md:h-[80vh] w-full rounded-xl overflow-hidden">
                <Image
                  src={image}
                  alt={`${title} - Main Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" /> */}
      </Carousel>
      
      <div className="absolute bottom-30 left-0 right-0 md:p-8 mb-10">
  <div className="container">
    <div className="flex items-center gap-2">
      <h1 className="text-2xl md:text-4xl font-bold text-white">{title}</h1>
    </div>
    <p className="text-xl text-white/90 mt-2">{location}</p>
    <div className="flex items-center mt-4">
      <span className="bg-sky-500 text-white px-3 py-2 rounded-lg text-md font-bold">
        {formattedPrice}
      </span>
      <span className="ml-4 bg-white text-sky-600 px-3 py-1 rounded-md text-sm font-medium">
        {propertyType}
      </span>
      {isFeatured && (
        <span className="ml-4 bg-white text-sky-600 px-3 py-1 rounded-md text-sm font-medium">
          Featured
        </span>
      )}
    </div>
  </div>
</div>

      {/* Thumbnail Gallery */}
      <div className="mb-8">
        <div className="relative">
          <div className="flex space-x-5 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 relative aspect-square w-40 h-20 rounded-md overflow-hidden transition-all duration-200 p-0 ${currentImageIndex === index ? 'w-45 h-25' : 'opacity-80 hover:opacity-100 cursor-pointer'}`}
              >
                <Image
                  src={image}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}