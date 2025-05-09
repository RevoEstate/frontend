"use client"

import { useEffect, useState } from "react";
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStaffStore } from "@/hooks/useStaff";
import { useDebounce } from "@/hooks/useDebounce";

export function SubAccountSearch() {
  const { filters, setFilters } = useStaffStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [roleFilter, setRoleFilter] = useState(filters.role || "all");
  const [statusFilter, setStatusFilter] = useState(filters.status || "all");

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Update search term in store when debounced value changes
  useEffect(() => {
    setFilters({ search: debouncedSearch || undefined });
  }, [debouncedSearch, setFilters]);

  // Update role filter in store
  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setFilters({ role: value === "all" ? undefined : value });
  };

  // Update status filter in store
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setFilters({ status: value === "all" ? undefined : value });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row w-full md:max-w-3xl">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or email..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={roleFilter} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Sub-Admin">Sub-Admin</SelectItem>
            <SelectItem value="Support">Support</SelectItem>
            <SelectItem value="Content Moderator">Content Moderator</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
