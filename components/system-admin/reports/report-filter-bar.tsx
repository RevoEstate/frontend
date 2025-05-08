"use client"

import { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useReportsStore } from "@/store/reports";
import { ReportReason, ReportStatus } from "@/types/report";

export function ReportFilterBar() {
  const { filters, setFilters } = useReportsStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [dateOpen, setDateOpen] = useState(false);

  // Update search term with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ ...filters, search: searchTerm || undefined });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, setFilters]);

  const clearFilter = (filterType: keyof typeof filters) => {
    setFilters({
      ...filters,
      [filterType]: undefined,
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined
  );

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
              <Badge
                variant="secondary"
                className="ml-1 rounded-full h-5 w-5 p-0 flex items-center justify-center"
              >
                {Object.values(filters).filter(Boolean).length}
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
                value={filters.status || ""}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    status: (value as ReportStatus) || undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Reason
              </label>
              <Select
                value={filters.reason || ""}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    reason: (value as ReportReason) || undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Reasons</SelectItem>
                  <SelectItem value="Violent content">
                    Violent content
                  </SelectItem>
                  <SelectItem value="Sexually explicit content">
                    Sexually explicit content
                  </SelectItem>
                  <SelectItem value="Fraudulent listing">
                    Fraudulent listing
                  </SelectItem>
                  <SelectItem value="Hate speech or discrimination">
                    Hate speech or discrimination
                  </SelectItem>
                  <SelectItem value="Spam or misleading information">
                    Spam or misleading information
                  </SelectItem>
                  <SelectItem value="Inaccurate property details">
                    Inaccurate property details
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Date Range
              </label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? (
                      <span>
                        {format(filters.startDate, "MMM d, yyyy")}
                        {filters.endDate &&
                          ` - ${format(filters.endDate, "MMM d, yyyy")}`}
                      </span>
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: filters.startDate || undefined,
                      to: filters.endDate || undefined,
                    }}
                    onSelect={(range) =>
                      setFilters({
                        ...filters,
                        startDate: range?.from,
                        endDate: range?.to,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={clearAllFilters}
              >
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
          {filters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("status")}
              />
            </Badge>
          )}
          {filters.reason && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Reason: {filters.reason}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("reason")}
              />
            </Badge>
          )}
          {filters.startDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {format(filters.startDate, "MMM d, yyyy")}
              {filters.endDate &&
                ` - ${format(filters.endDate, "MMM d, yyyy")}`}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  clearFilter("startDate");
                  clearFilter("endDate");
                }}
              />
            </Badge>
          )}
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  clearFilter("search");
                  setSearchTerm("");
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
