"use client"

import { useEffect, useState } from "react";
import { Calendar, Search, SlidersHorizontal, X } from "lucide-react";

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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useIssuesStore } from "@/store/issues";
import { IssueStatus, IssueType } from "@/types/issue";
import { useDebounce } from "@/hooks/useDebounce";

export function IssueFilterBar() {
  const { filters, setFilters, resetFilters } = useIssuesStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [dateOpen, setDateOpen] = useState(false);

  // Update search term in store when debounced value changes
  useEffect(() => {
    setFilters({ search: debouncedSearch || undefined });
  }, [debouncedSearch, setFilters]);

  const clearFilter = (filterType: keyof typeof filters) => {
    setFilters({ [filterType]: undefined });
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.type || filters.dateRaised
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-3xl">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search issues..."
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
            <h4 className="font-medium leading-none">Filter Issues</h4>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Status
              </label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value: IssueStatus | "all") =>
                  setFilters({ status: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Issue Type
              </label>
              <Select
                value={filters.type || "all"}
                onValueChange={(value: IssueType | "all") =>
                  setFilters({ type: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={resetFilters}
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
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("search")}
              />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("status")}
              />
            </Badge>
          )}
          {filters.type && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {filters.type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("type")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
