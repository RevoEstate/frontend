"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { motionImageProps, motionTextProps } from "@/lib/motionLib";
import { clientReviews } from "@/data/testimonials";

const Testimonials = () => {
  const swiperRef = useRef<{ swiper: SwiperType }>(null);

  const handleNext = () => {
    swiperRef.current?.swiper.slideNext();
  };

  const handlePrev = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  return (
    <section className="container mb-15 p-5" id="testimonials">
      <div className="container relative flex flex-col md:flex-row gap-8">
        <div className="hidden lg:flex flex-col gap-5 md:w-1/2">
          <motion.div {...motionImageProps} className="relative hidden lg:flex lg:w-[700px] xl:w-[500px] lg:h-[460px] overflow-hidden">
            <Image
              src="/images/signup-image.jpg"
              alt="Gallery Image"
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="hidden lg:flex items-center justify-left gap-5 mt-8">
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
        </div>

        {/* Right Section */}
        <div className="w-full">
        <div className="mb-5">
            <motion.h1 
                {...motionTextProps}
                className="text-2xl md:text-4xl font-bold text-gray-800 max-w-3xl mx-auto lg:mx-0"
            >
                Trusted by Real Estate Professionals <span className=" text-sky-600 mt-2">& Valued by Home Seekers</span>
            </motion.h1>
        </div>

          {/* Overlapping Slider */}
          <div className="lg:absolute mx-auto lg:bottom-0 lg:right-0 z-10">
            <div className="relative w-full mx-auto lg:w-[800px] xl:w-[1050px] lg:pl-6 lg:pt-6 bg-white">
              <Swiper
                ref={swiperRef}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                slidesPerView={1}
                modules={[Autoplay]}
                spaceBetween={20}
                speed={1000}
                loop={true}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                }}
                className="container"
              >
                {clientReviews.map((item) => (
                  <SwiperSlide key={`review-${item.id}`}>
                    <div className="bg-sky-900 text-white w-full mx-auto flex flex-col justify-between max-w-[480px] h-[350px] px-6 md:px-8 py-8 lg:py-12">
                      <div className="w-8 h-8">
                        <Image
                          src="/icons/quote.svg"
                          alt="Quote Icon"
                          width={32}
                          height={32}
                        />
                      </div>
                      <p className="text-sm sm:text-base font-light leading-relaxed">
                        {item.review}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12">
                          <Image
                            src={item.img}
                            alt={item.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {item.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Slider Controls */}
              <div className="flex lg:hidden mx-auto items-center justify-center gap-5 mt-8">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "tween",
                    ease: [0.42, 0, 0.58, 1],
                    delay: 0.5,
                    duration: 0.5,
                  }}
                  className="arrow-btn flex items-center justify-center w-12 h-12 bg-gray-200 hover:bg-gray-300 transition"
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
                  className="arrow-btn flex items-center justify-center w-12 h-12 bg-gray-200 hover:bg-gray-300 transition"
                  onClick={handleNext}
                >
                  →
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;