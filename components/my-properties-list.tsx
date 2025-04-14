"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  MoreHorizontal,
  ArrowUpDown,
  Sun,
  Moon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Sample property data
const properties = [
  {
    id: 1,
    title: "Cozy Cottage",
    price: 450000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    status: "For Sale",
    location: "123 Main St, Anytown, USA",
    image: "/images/property-2.jpg",
    createdAt: "2023-05-15",
  },
  {
    id: 2,
    title: "Modern Apartment",
    price: 780000,
    beds: 2,
    baths: 2,
    sqft: 1500,
    status: "For Sale",
    location: "456 Park Ave, Metropolis, USA",
    image: "/images/property-3.jpg",
    createdAt: "2023-06-22",
  },
  {
    id: 3,
    title: "Suburban House",
    price: 500000,
    beds: 4,
    baths: 3,
    sqft: 2500,
    status: "Pending",
    location: "789 Oak Dr, Woodland, USA",
    image: "/images/property-4.jpg",
    createdAt: "2023-07-10",
  },
  {
    id: 4,
    title: "Luxury Villa",
    price: 1200000,
    beds: 5,
    baths: 4,
    sqft: 3800,
    status: "Sold",
    location: "101 Ocean Blvd, Beachside, USA",
    image: "/images/property-3.jpg",
    createdAt: "2023-04-05",
  },
  {
    id: 5,
    title: "Downtown Loft",
    price: 650000,
    beds: 1,
    baths: 2,
    sqft: 1200,
    status: "For Sale",
    location: "555 Urban St, Downtown, USA",
    image: "/images/property-2.jpg",
    createdAt: "2023-08-12",
  },
  {
    id: 6,
    title: "Beachfront Condo",
    price: 950000,
    beds: 3,
    baths: 3,
    sqft: 2000,
    status: "For Sale",
    location: "777 Beach Rd, Seaside, USA",
    image: "/images/property-3.jpg",
    createdAt: "2023-09-01",
  },
  {
    id: 7,
    title: "Mountain Cabin",
    price: 320000,
    beds: 2,
    baths: 1,
    sqft: 1100,
    status: "Pending",
    location: "222 Pine Trail, Mountain View, USA",
    image: "/images/property-2.jpg",
    createdAt: "2023-07-25",
  },
  {
    id: 8,
    title: "Country Estate",
    price: 1500000,
    beds: 6,
    baths: 5,
    sqft: 4500,
    status: "For Sale",
    location: "888 Rural Route, Countryside, USA",
    image: "/images/property-4.jpg",
    createdAt: "2023-06-10",
  },
  {
    id: 9,
    title: "City Townhouse",
    price: 720000,
    beds: 3,
    baths: 2.5,
    sqft: 1900,
    status: "Sold",
    location: "333 Urban Lane, Cityville, USA",
    image: "/images/property-3.jpg",
    createdAt: "2023-05-20",
  },
  {
    id: 10,
    title: "Lakefront Property",
    price: 880000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    status: "For Sale",
    location: "444 Lake Shore Dr, Lakeside, USA",
    image: "/images/property-2.jpg",
    createdAt: "2023-08-05",
  },
  {
    id: 11,
    title: "Historic Brownstone",
    price: 1100000,
    beds: 4,
    baths: 3.5,
    sqft: 3200,
    status: "For Sale",
    location: "666 Heritage Ave, Historic District, USA",
    image: "/images/property-2.jpg",
    createdAt: "2023-07-15",
  },
  {
    id: 12,
    title: "Golf Course Home",
    price: 920000,
    beds: 4,
    baths: 4,
    sqft: 3000,
    status: "Pending",
    location: "999 Fairway Dr, Green Valley, USA",
    image: "/images/property-2.jpg",
    createdAt: "2023-09-10",
  },
];

export function MyPropertiesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    }
    return "light";
  });

  const itemsPerPage = 5;

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (newTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      localStorage.setItem("theme", newTheme);
    }
  };

  // Filter properties based on search term and status
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      property.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("ellipsis1");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis2");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleDelete = (id: number) => {
    // In a real app, this would call an API to delete the property
    alert(`Delete property ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="mr-2"
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/dashboard/add-property">
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Listings</CardTitle>
          <CardDescription>
            Manage all your real estate listings in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search properties..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="for sale">For Sale</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Details
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Listed Date
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProperties.length > 0 ? (
                  paginatedProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-md overflow-hidden">
                            <Image
                              src={property.image || "/placeholder.svg"}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{property.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-[200px]">
                              {property.location}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(property.price)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {property.beds} beds • {property.baths} bath •{" "}
                        {property.sqft.toLocaleString()} sq ft
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            property.status === "For Sale"
                              ? "bg-green-100 text-green-800"
                              : property.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {property.status}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/properties/${property.id}`}
                              >
                                <Eye className="mr-2 h-4 w-4" /> View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/properties/${property.id}/edit`}
                              >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(property.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No properties found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredProperties.length > 0 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                      size={undefined}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, i) =>
                    typeof page === "number" ? (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                          size={undefined}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                      size={undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
