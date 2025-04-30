'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
  region: string;
  city: string;
  specificLocation: string;
  formattedPrice: string;
  propertyType: string;
  isFeatured: boolean;
}

export function PropertyImageGallery({
  images,
  title,
  region,
  city,
  specificLocation,
  formattedPrice,
  propertyType,
  isFeatured,
}: PropertyImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    api?.scrollTo(index);
    
    // Center the clicked thumbnail
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const thumb = container.children[index] as HTMLElement;
      const containerWidth = container.clientWidth;
      const thumbLeft = thumb.offsetLeft;
      const thumbWidth = thumb.clientWidth;
      
      container.scrollTo({
        left: thumbLeft - (containerWidth / 2) + (thumbWidth / 2),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Main Carousel */}
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent className='mb-5'>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[60vh] md:h-[90vh] w-full rounded-xl overflow-hidden">
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
      </Carousel>
      
      {/* Property Info Overlay */}
      <div className="absolute bottom-30 left-0 right-0 md:p-8 mb-10">
        <div className="container">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">{title}</h1>
          </div>
          <p className="text-xl text-white/90 mt-2 drop-shadow-md">{region} {", "} {city} {", "} {specificLocation}</p>
          <div className="flex items-center mt-4 gap-2">
            <span className="bg-sky-500 text-white px-3 py-2 rounded-lg text-xs md:text-base font-bold">
              {formattedPrice}
            </span>
            <span className="bg-white text-sky-600 px-3 py-1 rounded-md text-xs md:text-sm font-medium">
              {propertyType}
            </span>
            {isFeatured && (
              <span className="bg-white text-sky-600 px-3 py-1 rounded-md text-xs md:text-sm font-medium">
                Featured
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Thumbnail Gallery */}
      <div>
        <div className="relative">
          <motion.div 
            ref={thumbnailContainerRef}
            className="flex space-x-4 overflow-x-auto"
            initial={false}
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.95 }}
                  animate={{ 
                    scale: currentImageIndex === index ? 1.0 : 0.95,
                    opacity: currentImageIndex === index ? 1 : 0.85
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex-shrink-0 relative"
                >
                  <Button
                    variant="ghost"
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative aspect-square w-40 h-20 rounded-md overflow-hidden p-0 hover:opacity-100 cursor-pointer ${currentImageIndex === index ? 'w-45 h-25' : ''}`}
                  >
                    <Image
                      src={image}
                      alt={`${title} - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    />
                    {currentImageIndex === index && (
                      <motion.div 
                        className="absolute rounded-md shadow-md"
                        layoutId="activeThumbnail"
                        transition={{ duration: 0.4 }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}