"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { useState, useEffect, useRef } from "react";
import properties from "@/data/property";
import Link from "next/link";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motionTextProps } from "@/lib/motionLib";

export default function FeaturedProperties() {
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<SwiperRef>(null);

  const handleNext = () => {
    swiperRef.current?.swiper.slideNext();
  };

  const handlePrev = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const featuredProperties = properties.filter(property => property.featured);

  return (
    <section className="py-10 bg-gray-100/40 dark:bg-gray-900">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className=""
        >
          <div className="flex gap-2 items-center">
            <motion.hr className="border-2 border-black w-20 hidden md:block" {...motionTextProps} />
            <motion.h1 {...motionTextProps} className="md:text-5xl text-3xl font-bold mb-2">
              Featured Properties
            </motion.h1>
          </div>
          <motion.p
            {...motionTextProps}
            transition={{ ...motionTextProps.transition, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl md:pl-22"
          >
            Discover handpicked homes in prime locations
          </motion.p>
        </motion.div>

        {/* Property Carousel */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="swiper"
          >
             {/* Navigation Buttons */}
             <div className="hidden md:flex items-center justify-center lg:justify-end gap-5 mb-">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  type: "tween",
                  ease: [0.42, 0, 0.58, 1],
                  delay: 0.5,
                  duration: 0.5,
                }}
                className="flex items-center justify-center w-12 h-12 bg-sky-600/10 hover:bg-sky-600/15 transition cursor-pointer text-sky-900 font-bold"
                onClick={handlePrev}
              >
                ←
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  type: "tween",
                  ease: [0.42, 0, 0.58, 1],
                  delay: 0.5,
                  duration: 0.5,
                }}
                className="flex items-center justify-center w-12 h-12 bg-sky-600/10 hover:bg-sky-600/15 transition cursor-pointer text-sky-900 font-bold"
                onClick={handleNext}
              >
                →
              </motion.button>
            </div>
            <Swiper
              ref={swiperRef}
              slidesPerView={1}
              spaceBetween={20}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="px-2 py-4"
            >
              {featuredProperties.map((property) => (
                <SwiperSlide key={property.id} className="p-3">
                  <PropertyCard {...property} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="flex lg:hidden items-center justify-between px-10 lg:justify-end gap-5">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  type: "tween",
                  ease: [0.42, 0, 0.58, 1],
                  delay: 0.5,
                  duration: 0.5,
                }}
                className="flex items-center justify-center w-12 h-12 bg-sky-600/10 hover:bg-sky-600/15 transition cursor-pointer text-sky-900 font-bold"
                onClick={handlePrev}
              >
                ←
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  type: "tween",
                  ease: [0.42, 0, 0.58, 1],
                  delay: 0.5,
                  duration: 0.5,
                }}
                className="flex items-center justify-center w-12 h-12 bg-sky-600/10 hover:bg-sky-600/15 transition cursor-pointer text-sky-900 font-bold"
                onClick={handleNext}
              >
                →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href='/properties'>
            <Button size="lg" className="px-8 bg-sky-500 hover:bg-sky-600">
              Browse All Properties
            </Button>
          </Link>
        </motion.div> */}
      </div>
    </section>
  );
}

