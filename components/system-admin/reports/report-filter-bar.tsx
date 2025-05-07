"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"

export function ReportFilterBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<{
    status: string | null
    reportDate: Date | null
    propertyId: string | null
  }>({
    status: null,
    reportDate: null,
    propertyId: null,
  })

  const [dateOpen, setDateOpen] = useState(false)

  const clearFilter = (filterType: keyof typeof activeFilters) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: null,
    }))
  }

  const clearAllFilters = () => {
    setActiveFilters({
      status: null,
      reportDate: null,
      propertyId: null,
    })
  }

  const hasActiveFilters = Object.values(activeFilters).some((value) => value !== null)

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-3xl">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search reports..."
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
            <h4 className="font-medium leading-none">Filter Reports</h4>

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
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Report Date
              </label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {activeFilters.reportDate ? (
                      format(activeFilters.reportDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={activeFilters.reportDate || undefined}
                    onSelect={(date) => {
                      setActiveFilters((prev) => ({ ...prev, reportDate: date }))
                      setDateOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Property ID
              </label>
              <Input
                placeholder="Enter property ID"
                value={activeFilters.propertyId || ""}
                onChange={(e) => setActiveFilters((prev) => ({ ...prev, propertyId: e.target.value || null }))}
              />
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
          {activeFilters.reportDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {format(activeFilters.reportDate, "MMM d, yyyy")}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("reportDate")} />
            </Badge>
          )}
          {activeFilters.propertyId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Property ID: {activeFilters.propertyId}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("propertyId")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
