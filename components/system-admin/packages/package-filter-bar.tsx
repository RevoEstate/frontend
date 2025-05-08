"use client";

import type React from "react";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import usePackageStore from "@/store/packageStore";

export default function PackageFilterBar() {
  const { filter, setFilter, resetFilters } = usePackageStore();

  // Local state for filter form
  const [localFilter, setLocalFilter] = useState<{
    search?: string;
    packageType?: "premium" | "standard";
    priceRange: [number, number];
    durationRange: [number, number];
    propertiesRange: [number, number];
  }>({
    search: filter.search,
    packageType: filter.packageType,
    priceRange: [filter.minPrice || 0, filter.maxPrice || 1000],
    durationRange: [filter.minDuration || 0, filter.maxDuration || 36],
    propertiesRange: [filter.minProperties || 0, filter.maxProperties || 100],
  });

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalFilter((prev) => ({ ...prev, search: value }));

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      setFilter({ search: value || undefined });
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Apply filters from sheet
  const applyFilters = () => {
    setFilter({
      packageType: localFilter.packageType,
      minPrice: localFilter.priceRange[0] || undefined,
      maxPrice: localFilter.priceRange[1] || undefined,
      minDuration: localFilter.durationRange[0] || undefined,
      maxDuration: localFilter.durationRange[1] || undefined,
      minProperties: localFilter.propertiesRange[0] || undefined,
      maxProperties: localFilter.propertiesRange[1] || undefined,
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setLocalFilter({
      search: "",
      packageType: undefined,
      priceRange: [0, 1000],
      durationRange: [0, 36],
      propertiesRange: [0, 100],
    });
    resetFilters();
  };

  // Count active filters (excluding search)
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
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search packages..."
          className="pl-8"
          value={localFilter.search || ""}
          onChange={handleSearch}
        />
        {localFilter.search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-9 w-9 p-0"
            onClick={() => {
              setLocalFilter((prev) => ({ ...prev, search: "" }));
              setFilter({ search: undefined });
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filter Packages</SheetTitle>
          </SheetHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="packageType">Package Type</Label>
              <Select
                value={localFilter.packageType || ""}
                onValueChange={(value) =>
                  setLocalFilter((prev) => ({
                    ...prev,
                    packageType:
                      value === "all"
                        ? undefined
                        : (value as "premium" | "standard"),
                  }))
                }
              >
                <SelectTrigger id="packageType">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Price Range (USD)</Label>
                <span className="text-sm text-muted-foreground">
                  ${localFilter.priceRange[0]} - ${localFilter.priceRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={localFilter.priceRange}
                min={0}
                max={1000}
                step={10}
                value={localFilter.priceRange}
                onValueChange={(value) =>
                  setLocalFilter((prev) => ({
                    ...prev,
                    priceRange: value as [number, number],
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Duration (Months)</Label>
                <span className="text-sm text-muted-foreground">
                  {localFilter.durationRange[0]} -{" "}
                  {localFilter.durationRange[1]} months
                </span>
              </div>
              <Slider
                defaultValue={localFilter.durationRange}
                min={0}
                max={36}
                step={1}
                value={localFilter.durationRange}
                onValueChange={(value) =>
                  setLocalFilter((prev) => ({
                    ...prev,
                    durationRange: value as [number, number],
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Number of Properties</Label>
                <span className="text-sm text-muted-foreground">
                  {localFilter.propertiesRange[0]} -{" "}
                  {localFilter.propertiesRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={localFilter.propertiesRange}
                min={0}
                max={100}
                step={1}
                value={localFilter.propertiesRange}
                onValueChange={(value) =>
                  setLocalFilter((prev) => ({
                    ...prev,
                    propertiesRange: value as [number, number],
                  }))
                }
              />
            </div>
          </div>

          <SheetFooter className="flex flex-row gap-2 sm:space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
            <SheetClose asChild>
              <Button className="flex-1" onClick={applyFilters}>
                Apply Filters
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
