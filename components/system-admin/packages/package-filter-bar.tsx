"use client";

import type React from "react";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import usePackageStore from "@/store/packageStore";

export default function PackageFilterBar() {
  const { filter, setFilter, resetFilters } = usePackageStore();

  // Local state for filter form
  const [searchQuery, setSearchQuery] = useState(filter.search || "");
  const [packageType, setPackageType] = useState<string>(
    filter.packageType || ""
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filter.minPrice || 0,
    filter.maxPrice || 10000,
  ]);
  const [durationRange, setDurationRange] = useState<[number, number]>([
    filter.minDuration || 1,
    filter.maxDuration || 48,
  ]);
  const [propertiesRange, setPropertiesRange] = useState<[number, number]>([
    filter.minProperties || 1,
    filter.maxProperties || 10000,
  ]);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ search: searchQuery });
  };

  // Apply all filters
  const applyFilters = () => {
    setFilter({
      search: searchQuery,
      packageType: (packageType as "premium" | "standard") || undefined,
      minPrice: priceRange[0] || undefined,
      maxPrice: priceRange[1] || undefined,
      minDuration: durationRange[0] || undefined,
      maxDuration: durationRange[1] || undefined,
      minProperties: propertiesRange[0] || undefined,
      maxProperties: propertiesRange[1] || undefined,
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setPackageType("");
    setPriceRange([0, 1000]);
    setDurationRange([1, 24]);
    setPropertiesRange([1, 100]);
    resetFilters();
  };

  // Count active filters
  const activeFilterCount = [
    filter.packageType,
    filter.minPrice,
    filter.maxPrice,
    filter.minDuration,
    filter.maxDuration,
    filter.minProperties,
    filter.maxProperties,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <form
        onSubmit={handleSearch}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <Input
          type="search"
          placeholder="Search packages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
        <Button type="submit" size="sm" className="h-9 px-3">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
        {filter.search && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 px-3"
            onClick={() => {
              setSearchQuery("");
              setFilter({ search: undefined });
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </form>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Filter Packages</SheetTitle>
            <SheetDescription>
              Adjust filters to find specific packages
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="packageType">Package Type</Label>
              <Select value={packageType} onValueChange={setPackageType}>
                <SelectTrigger id="packageType">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Price Range (USD)</Label>
                <span className="text-sm text-muted-foreground">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={priceRange}
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={(value) =>
                  setPriceRange(value as [number, number])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Duration (Months)</Label>
                <span className="text-sm text-muted-foreground">
                  {durationRange[0]} - {durationRange[1]} months
                </span>
              </div>
              <Slider
                defaultValue={durationRange}
                min={1}
                max={24}
                step={1}
                value={durationRange}
                onValueChange={(value) =>
                  setDurationRange(value as [number, number])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Number of Properties</Label>
                <span className="text-sm text-muted-foreground">
                  {propertiesRange[0]} - {propertiesRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={propertiesRange}
                min={1}
                max={100}
                step={1}
                value={propertiesRange}
                onValueChange={(value) =>
                  setPropertiesRange(value as [number, number])
                }
              />
            </div>
          </div>
          <SheetFooter className="flex flex-row justify-between sm:justify-between">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <SheetClose asChild>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
