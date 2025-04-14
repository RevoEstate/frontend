import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/PropertyCardDashboard";
import { Plus } from "lucide-react";
import Link from "next/link";

// Sample property data
const properties = [
  {
    id: 1,
    title: "Cozy Cottage",
    price: 450000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    image: "/images/home1.jpeg",
  },
  {
    id: 2,
    title: "Modern Apartment",
    price: 780000,
    beds: 2,
    baths: 2,
    sqft: 1500,
    image: "/images/property-2.jpg",
  },
  {
    id: 3,
    title: "Suburban House",
    price: 500000,
    beds: 4,
    baths: 3,
    sqft: 2500,
    image: "/images/property-4.jpg",
  },
  {
    id: 4,
    title: "Luxury Villa",
    price: 1200000,
    beds: 5,
    baths: 4,
    sqft: 3800,
    image: "/images/property1.jpg",
  },
];

export function PropertyDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Link href="/dashboard/add-property">
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      <p className="text-gray-600 mb-8">
        Welcome to your real estate marketplace dashboard.
      </p>

      <h2 className="text-2xl font-bold mb-6">My Properties</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
