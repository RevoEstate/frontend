"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { useState, useEffect } from "react";

const mockProperties = [
  {
    id: 1,
    title: "Modern Villa in Beverly Hills",
    price: "$2,500,000",
    beds: 4,
    baths: 3,
    sqft: 3200,
    location: "Los Angeles, CA",
    image: "/images/property1.jpg",
    type: "sale",
    featured: true,
  },
  {
    id: 2,
    title: "Downtown Luxury Condo",
    price: "$3,200/month",
    beds: 2,
    baths: 2,
    sqft: 1800,
    location: "New York, NY",
    image: "/images/property-2.jpg",
    type: "rent",
  },
  {
    id: 3,
    title: "Luxury Appartment",
    price: "$3,200/month",
    beds: 2,
    baths: 2,
    sqft: 1800,
    location: "New York, NY",
    image: "/images/property-3.jpg",
    type: "rent",
  },
];

export default function FeaturedProperties() {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProperties = mockProperties.filter((property) => {
    if (activeFilter === "all") return true;
    return property.type === activeFilter;
  });

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
              Featured Properties</h2>
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
          {["all", "sale", "rent"].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={activeFilter === filter ? 'bg-sky-500 hover:bg-sky-600 cursor-pointer' : 'cursor-pointer'}
            >
              {filter === "all" ? "All" : filter === "sale" ? "For Sale" : "For Rent"}
            </Button>
          ))}
        </motion.div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6)
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
          ) : (
            filteredProperties.map((property, index) => (
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
            ))
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button size="lg" className="px-8 bg-sky-500 hover:bg-sky-600 cursor-pointer">
            Browse All Properties
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
