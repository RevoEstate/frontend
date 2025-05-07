"use client"

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCompanyStore from "@/stores/companyStore";

export function SearchAndFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { setFilter, setSort } = useCompanyStore();

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter({ search: searchTerm });
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, setFilter]);

  // Handle status filter changes
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setFilter({
      companyStatus:
        value === "all" ? undefined : (value as "active" | "suspended"),
    });
  };

  // Handle filter type changes
  const handleFilterTypeChange = (value: string) => {
    setFilterType(value);
    switch (value) {
      case "company":
        setSort({ field: "realEstateName", direction: "asc" });
        break;
      case "date":
        setSort({ field: "createdAt", direction: "asc" });
        break;
      case "listings":
        setSort({ field: "listingsCount", direction: "desc" });
        break;
      default:
        setSort({ field: "createdAt", direction: "desc" });
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by company name..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={filterType} onValueChange={handleFilterTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            <SelectItem value="company">Company Name</SelectItem>
            <SelectItem value="date">Registration Date</SelectItem>
            <SelectItem value="listings">Listings Count</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
