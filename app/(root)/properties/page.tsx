"use client";

import { useState } from "react";
import { PropertyFilters, useProperty } from "@/hooks/useProperty";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, X } from "lucide-react";
import Pagination from "@/components/shared/Pagination";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { Property } from "@/types";
import { PropertyCardSkeleton } from "@/components/shared/PropertyCardSkeleton";

const propertyTypes = [
  "Apartment",
  "Villa",
  "House",
  "Office",
  "Land",
  "Commercial",
];

const ETHIOPIA_REGIONS = [
  {
    name: "Addis Ababa",
    cities: [
      "Addis Ket你好，感谢你的提问！请问有什么我可以帮助你的吗？ema",
      "Akaky Kaliti",
      "Arada",
      "Bole",
      "Gullele",
      "Kirkos",
      "Kolfe Keranio",
      "Lideta",
      "Nifas Silk-Lafto",
      "Yeka",
      "Lemi Kura",
    ],
  },
  { name: "Afar", cities: ["Semera", "Asaita", "Awash"] },
  { name: "Amhara", cities: ["Bahir Dar", "Gondar", "Dessie"] },
  { name: "Benishangul-Gumuz", cities: ["Asosa", "Bambasi"] },
  { name: "Dire Dawa", cities: ["Dire Dawa"] },
  { name: "Gambela", cities: ["Gambela"] },
  { name: "Harari", cities: ["Harar"] },
  { name: "Oromia", cities: ["Adama", "Jimma", "Bishoftu"] },
  { name: "Sidama", cities: ["Hawassa", "Yirgalem"] },
  { name: "Somali", cities: ["Jijiga", "Degehabur"] },
  { name: "SNNPR", cities: ["Arba Minch", "Sodo", "Wolaita"] },
  { name: "Tigray", cities: ["Mekelle", "Axum", "Adigrat"] },
];

export default function PropertiesPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<PropertyFilters>({
    listingType: "For Sale",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Get cities based on selected region
  const selectedRegionCities = ETHIOPIA_REGIONS.find(
    (region) => region.name === filters.region
  )?.cities || [];

  const { data, isLoading, error } = useProperty(
    { ...filters, searchQuery },
    { page, limit: 6 }
  );

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "region") {
      setFilters((prev) => ({ ...prev, city: "" }));
    }
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ listingType: "For Sale" });
    setSearchQuery("");
    setPage(1);
  };

  const activeFiltersCount = Object.keys(filters).filter(
    (key) => key !== "listingType" && filters[key as keyof PropertyFilters]
  ).length + (searchQuery ? 1 : 0);

  return (
    <div className="container py-8 mt-18">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Find Your Dream Property
        </h1>
        <p className="text-normal text-muted-foreground max-w-2xl mx-auto">
          Discover the perfect home from our curated collection of properties
        </p>
      </div>

      <div className="bg-background p-6 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by location or property name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Filters Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-3 justify-items-start gap-5">
          {/* Price Range Filter */}
          <div className="md:max-w-80">
            <h4 className="text-sm font-medium mb-2">Price Range</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Min"
                  type="number"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>
              <Slider
                defaultValue={[filters.minPrice || 0, filters.maxPrice || 1000000]}
                max={1000000}
                step={10000}
                onValueChange={(value) => {
                  handleFilterChange("minPrice", value[0]);
                  handleFilterChange("maxPrice", value[1]);
                }}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>ETB {filters.minPrice?.toLocaleString() || "0"}</span>
                <span>ETB {filters.maxPrice?.toLocaleString() || "1M"}</span>
              </div>
            </div>
          </div>

          {/* Location Filter */}
          <div className="md:max-w-80">
            <h4 className="text-sm font-medium mb-2">Location</h4>
            <div className="flex gap-3 items-center">
              <Select
                value={filters.region}
                onValueChange={(value) => handleFilterChange("region", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {ETHIOPIA_REGIONS.map((region) => (
                    <SelectItem key={region.name} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.city || ""}
                onValueChange={(value) => handleFilterChange("city", value)}
                disabled={!filters.region}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={filters.region ? "Select City" : "Select region first"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {selectedRegionCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Type Filter */}
          <div className="md:w-80">
            <h4 className="text-sm font-medium mb-2">Property Type</h4>
            <Select
              value={filters.propertyType}
              onValueChange={(value) => handleFilterChange("propertyType", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Listing Type Filter */}
          <div>
            <h4 className="text-sm font-medium mb-2">Listing Type</h4>
            <ToggleGroup
              type="single"
              value={filters.listingType}
              onValueChange={(value) => handleFilterChange("listingType", value)}
              className="grid grid-cols-2 gap-2"
            >
              <ToggleGroupItem value="For Sale" className="w-full cursor-pointer">
                For Sale
              </ToggleGroupItem>
              <ToggleGroupItem value="For Rent" className="w-full cursor-pointer">
                For Rent
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Rooms Filter */}
          <div className="md:max-w-80">
            <h4 className="text-sm font-medium mb-2">Rooms</h4>
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={filters.bedrooms ? filters.bedrooms.toString() : ""}
                onValueChange={(value) =>
                  handleFilterChange("bedrooms", value ? Number(value) : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.bathrooms ? filters.bathrooms.toString() : ""}
                onValueChange={(value) =>
                  handleFilterChange("bathrooms", value ? Number(value) : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {filters.bedrooms >= 10 && (
              <p className="text-sm text-yellow-600 mt-1">
                High bedroom counts may return no results.
              </p>
            )}
            {filters.bathrooms >= 10 && (
              <p className="text-sm text-yellow-600 mt-1">
                High bathroom counts may return no results.
              </p>
            )}
          </div>

          {/* Active Filters Badges */}
          <div>
            {activeFiltersCount > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Active Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-sky-100 text-blue-600"
                    >
                      <span className="pr-1">Search: {searchQuery}</span>
                      <Button
                        className="rounded-full cursor-pointer hover:text-red-800"
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || key === "listingType") return null;
                    return (
                      <Badge
                        key={key}
                        variant="outline"
                        className="flex items-center gap-1 bg-sky-100 text-blue-600"
                      >
                        <span className="capitalize pr-1">
                          {key.replace(/([A-Z])/g, " $1")}: {value}
                        </span>
                        <Button
                          className="rounded-full cursor-pointer hover:text-red-800"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleFilterChange(key as keyof PropertyFilters, "")
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-end col-span-1 md:col-span-5">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-white bg-red-600 hover:bg-red-700 hover:text-white cursor-pointer hover:font-bold"
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>

        {/* Properties Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 border rounded-lg shadow-sm">
              <p className="text-destructive text-lg font-medium">{error.message}</p>
              <Button
                variant="ghost"
                className="mt-4 cursor-pointer"
                onClick={clearFilters}
              >
                Try resetting filters
              </Button>
            </div>
          ) : !data || data.properties.length === 0 ? (
            <div className="text-center py-12 border rounded-lg shadow-xl flex flex-col items-center justify-center md:max-w-[50vw] mx-auto">
              <p className="text-muted-foreground text-lg font-medium">
                No properties found matching your criteria
              </p>
              <>
                {filters.bedrooms >= 10 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try reducing the number of bedrooms (e.g., 5 or fewer).
                  </p>
                )}

                {filters.bathrooms >= 10 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try reducing the number of bathrooms (e.g., 5 or fewer).
                  </p>
                )}

                {filters.region !== "Addis Ababa" && (
                   <p className="text-sm text-muted-foreground mt-2">
                    Most of our properties found in addis ababa.
                  </p>
                )}
              </>
              <Button
                variant="ghost"
                className="mt-4 cursor-pointer"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="md:text-2xl font-bold">
                  {data.total} Properties Found
                </h2>
                <Select
                  value={filters.listingType}
                  onValueChange={(value) => handleFilterChange("listingType", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="For Sale">For Sale</SelectItem>
                    <SelectItem value="For Rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.properties.map((property: Property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil((data.total || 0) / 6)}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}