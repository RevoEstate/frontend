"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export function SearchAndFilter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<{
    status: string | null
    location: string | null
    verificationStatus: string | null
  }>({
    status: null,
    location: null,
    verificationStatus: null,
  })

  const locations = [
    "All Locations",
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
  ]

  const clearFilter = (filterType: keyof typeof activeFilters) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: null,
    }))
  }

  const clearAllFilters = () => {
    setActiveFilters({
      status: null,
      location: null,
      verificationStatus: null,
    })
  }

  const hasActiveFilters = Object.values(activeFilters).some((value) => value !== null)

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-3xl">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search companies..."
          className="pl-8 bg-background"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 rounded-full h-5 w-5 p-0 flex items-center justify-center">
                {Object.values(activeFilters).filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Filter Companies</h4>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Status
              </label>
              <Select
                value={activeFilters.status || ""}
                onValueChange={(value) => setActiveFilters((prev) => ({ ...prev, status: value || null }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Location
              </label>
              <Select
                value={activeFilters.location || ""}
                onValueChange={(value) => setActiveFilters((prev) => ({ ...prev, location: value || null }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.slice(1).map((location) => (
                    <SelectItem key={location} value={location.toLowerCase()}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Verification Status
              </label>
              <Select
                value={activeFilters.verificationStatus || ""}
                onValueChange={(value) => setActiveFilters((prev) => ({ ...prev, verificationStatus: value || null }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select verification status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verification Statuses</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending Verification</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={clearAllFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear all filters
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {activeFilters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {activeFilters.status}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("status")} />
            </Badge>
          )}
          {activeFilters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {activeFilters.location}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("location")} />
            </Badge>
          )}
          {activeFilters.verificationStatus && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Verification: {activeFilters.verificationStatus}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("verificationStatus")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
