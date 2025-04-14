"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { useState, useEffect } from "react";
import properties from "@/data/property";
import Link from "next/link";

export default function FeaturedProperties() {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "For Sale" | "For Rent"
  >("all");

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Get first 3 featured properties based on filter
  const displayedProperties = properties
    .filter((property) => {
      if (activeFilter === "all") return property.featured;
      return property.type === activeFilter && property.featured;
    })
    .slice(0, 3);

  return (
    <section className="container py-10 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex gap-2 items-center">
            <hr className="border-2 border-black w-20 hidden md:block" />
            <h2 className="md:text-5xl text-3xl font-bold mb-2">
              Featured Properties
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl md:pl-22">
            Discover handpicked homes in prime locations
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {["all", "For Sale", "For Rent"].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setActiveFilter(filter as "all" | "For Sale" | "For Rent")
              }
              className={
                activeFilter === filter
                  ? "bg-sky-500 hover:bg-sky-600 cursor-pointer"
                  : "cursor-pointer"
              }
            >
              {filter === "all" ? "All" : filter}
            </Button>
          ))}
        </motion.div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <PropertyCardSkeleton />
                  </motion.div>
                ))
            : displayedProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className=""
                >
                  <PropertyCard {...property} />
                </motion.div>
              ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/properties">
            <Button
              size="lg"
              className="px-8 bg-sky-500 hover:bg-sky-600 cursor-pointer"
            >
              Browse All Properties
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
