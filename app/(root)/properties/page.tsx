"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin } from "lucide-react";
import { useState } from "react";
import properties from "@/data/property";
import { PropertyCard } from "@/components/PropertyCard";
const PropertyPage = () => {
  // Mock filter states (replace with real state management)
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [propertyType, setPropertyType] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<string>("any");
  const [bathrooms, setBathrooms] = useState<string>("any");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const filteredProperties = properties.filter((property) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (property.title.toLowerCase().includes(searchLower) ||
        property.location.toLowerCase().includes(searchLower)) &&
      property.price >= priceRange[0] &&
      property.price <= priceRange[1] &&
      (propertyType === "all" || property.type.includes(propertyType)) &&
      (bedrooms === "any" || property.beds >= parseInt(bedrooms)) &&
      (bathrooms === "any" || property.baths >= parseInt(bathrooms)) &&
      (locationFilter === "all" || property.location.includes(locationFilter))
    );
  });

  return (
    <div className="container py-8 mt-18">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Find Your Dream Property
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the perfect home from our curated collection of premium
          properties
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-background p-6 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative w-full">
            {" "}
            {/* Full width */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location or property name..."
              className="pl-10 w-full" /* Full width */
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {" "}
          {/* Changed to 5 columns */}
          {/* Price Range Filter */}
          <div className="mr-5">
            <h3 className="text-sm font-medium mb-2">Price Range</h3>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={2000000}
              step={50000}
              className="mb-2 cursor-pointer"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
          </div>
          {/* Location Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Location</h3>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  All Locations
                </SelectItem>
                <SelectItem value="New York" className="cursor-pointer">
                  New York
                </SelectItem>
                <SelectItem value="Los Angeles" className="cursor-pointer">
                  Los Angeles
                </SelectItem>
                <SelectItem value="Chicago" className="cursor-pointer">
                  Chicago
                </SelectItem>
                <SelectItem value="Miami" className="cursor-pointer">
                  Miami
                </SelectItem>
                <SelectItem value="Houston" className="cursor-pointer">
                  Houston
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Property Type Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Property Type</h3>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  All Types
                </SelectItem>
                <SelectItem value="For Sale" className="cursor-pointer">
                  For Sale
                </SelectItem>
                <SelectItem value="For Rent" className="cursor-pointer">
                  For Rent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Bedrooms Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Bedrooms</h3>
            <ToggleGroup
              type="single"
              value={bedrooms}
              onValueChange={setBedrooms}
              className="grid grid-cols-3 gap-2"
            >
              <ToggleGroupItem
                value="any"
                className="text-xs rounded-full cursor-pointer"
              >
                Any
              </ToggleGroupItem>
              <ToggleGroupItem
                value="1"
                className="text-xs rounded-full cursor-pointer"
              >
                1+
              </ToggleGroupItem>
              <ToggleGroupItem
                value="2"
                className="text-xs rounded-full cursor-pointer"
              >
                2+
              </ToggleGroupItem>
              <ToggleGroupItem
                value="3"
                className="text-xs rounded-full cursor-pointer"
              >
                3+
              </ToggleGroupItem>
              <ToggleGroupItem
                value="4"
                className="text-xs rounded-full cursor-pointer"
              >
                4+
              </ToggleGroupItem>
              <ToggleGroupItem
                value="5"
                className="text-xs rounded-full cursor-pointer"
              >
                5+
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {/* Bathrooms Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Bathrooms</h3>
            <ToggleGroup
              type="single"
              value={bathrooms}
              onValueChange={setBathrooms}
              className="grid grid-cols-3 gap-2"
            >
              <ToggleGroupItem
                value="any"
                className="text-xs rounded-full cursor-pointer"
              >
                Any
              </ToggleGroupItem>
              <ToggleGroupItem
                value="1"
                className="text-xs rounded-full cursor-pointer"
              >
                1+
              </ToggleGroupItem>
              <ToggleGroupItem
                value="2"
                className="text-xs rounded-full cursor-pointer"
              >
                2+
              </ToggleGroupItem>
              <ToggleGroupItem
                value="3"
                className="text-xs rounded-full cursor-pointer"
              >
                3+
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {/* Reset Filters */}
          <div className="flex items-end col-span-1 md:col-span-5 md:col-start-5 mt-5">
            {" "}
            {/* Span all columns on mobile */}
            <Button
              variant="outline"
              className="w-full md:w-72 bg-sky-500 hover:bg-sky-600 cursor-pointer text-white hover:text-white"
              onClick={() => {
                setSearchQuery("");
                setPriceRange([0, 2000000]);
                setPropertyType("all");
                setBedrooms("any");
                setBathrooms("any");
                setLocationFilter("all");
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {filteredProperties.length} Properties Found
        </h2>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px] cursor-pointer">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest" className="cursor-pointer">
              Newest First
            </SelectItem>
            <SelectItem value="price-low" className="cursor-pointer">
              Price: Low to High
            </SelectItem>
            <SelectItem value="price-high" className="cursor-pointer">
              Price: High to Low
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Property Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No properties found</h3>
          <p className="text-muted-foreground text-sm text-center max-w-md">
            Try adjusting your search or filter criteria to find what you're
            looking for.
          </p>
          <Button
            variant="outline"
            className="mt-4 cursor-pointer bg-sky-50 hover:bg-sky-100"
            onClick={() => {
              setSearchQuery("");
              setPriceRange([0, 2000000]);
              setPropertyType("all");
              setBedrooms("any");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Pagination (Placeholder) */}
      {filteredProperties.length > 0 && (
        <div className="flex justify-center mt-10">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPage;
