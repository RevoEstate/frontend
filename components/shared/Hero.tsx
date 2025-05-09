"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen max-h-[800px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Luxury properties"
          fill
          priority
          className="object-cover"
          quality={80}
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="container relative z-10 flex h-full flex-col justify-center gap-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Find Your <span className="">Dream Home</span> Today
          </h1>
          <p className="mt-4 text-lg text-gray-100">
            Explore 1000+ properties across the country. Buy, rent, or sell with
            confidence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="w-full max-w-3xl rounded-lg bg-white/10 p-4 backdrop-blur-sm"
        >
          {/* <div className="flex flex-col gap-4 sm:flex-row">
              <Input
                type="text"
                placeholder="Location (City, Neighborhood)"
                className="bg-white/90 text-black"
              />
              <select className="rounded-md bg-white/90 px-4 py-2 text-black cursor-pointer">
                <option>Price Range</option>
                <option>$100k - $500k</option>
                <option>$500k - $1M</option>
              </select>
              <Button className="gap-2 bg-sky-600 hover:bg-sky-700 cursor-pointer">
                <Search size={18} /> Search
              </Button>
            </div> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-8 left-0 right-0 flex justify-center gap-8"
        >
          {[
            { value: "1000+", label: "Properties" },
            { value: "1m+", label: "Customers" },
            { value: "98%", label: "Satisfaction" },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
