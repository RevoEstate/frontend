"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Ban, Building2, ChevronDown, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SuspendCompanyDialog } from "./suspend-company-dialog"
import { DeactivateCompanyDialog } from "./deactivate-company-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data for demonstration
const companies = [
  {
    id: "1",
    name: "Acme Real Estate",
    logo: "A",
    contactEmail: "contact@acmerealestate.com",
    registrationDate: new Date(2023, 0, 15),
    numberOfListings: 24,
    status: "active",
    location: "New York",
    verificationStatus: "verified",
    licenseNumber: "RE-12345-NY",
    website: "https://acmerealestate.com",
    phone: "(212) 555-1234",
    address: "123 Broadway, New York, NY 10001",
  },
  {
    id: "2",
    name: "Horizon Properties",
    logo: "H",
    contactEmail: "info@horizonproperties.com",
    registrationDate: new Date(2023, 1, 22),
    numberOfListings: 18,
    status: "active",
    location: "Los Angeles",
    verificationStatus: "verified",
    licenseNumber: "RE-67890-CA",
    website: "https://horizonproperties.com",
    phone: "(310) 555-6789",
    address: "456 Sunset Blvd, Los Angeles, CA 90028",
  },
  {
    id: "3",
    name: "Cityscape Realty",
    logo: "C",
    contactEmail: "hello@cityscaperealty.com",
    registrationDate: new Date(2023, 2, 10),
    numberOfListings: 31,
    status: "suspended",
    location: "Chicago",
    verificationStatus: "verified",
    licenseNumber: "RE-24680-IL",
    website: "https://cityscaperealty.com",
    phone: "(312) 555-2468",
    address: "789 Michigan Ave, Chicago, IL 60611",
  },
  {
    id: "4",
    name: "Metro Housing Solutions",
    logo: "M",
    contactEmail: "support@metrohousing.com",
    registrationDate: new Date(2023, 3, 5),
    numberOfListings: 12,
    status: "active",
    location: "Houston",
    verificationStatus: "pending",
    licenseNumber: "RE-13579-TX",
    website: "https://metrohousing.com",
    phone: "(713) 555-1357",
    address: "101 Main St, Houston, TX 77002",
  },
  {
    id: "5",
    name: "Golden Gate Properties",
    logo: "G",
    contactEmail: "inquiries@goldengate.com",
    registrationDate: new Date(2023, 4, 18),
    numberOfListings: 27,
    status: "active",
    location: "San Francisco",
    verificationStatus: "verified",
    licenseNumber: "RE-97531-CA",
    website: "https://goldengateproperties.com",
    phone: "(415) 555-9753",
    address: "222 Market St, San Francisco, CA 94105",
  },
  {
    id: "6",
    name: "Sunshine Estates",
    logo: "S",
    contactEmail: "hello@sunshineestates.com",
    registrationDate: new Date(2023, 5, 7),
    numberOfListings: 15,
    status: "inactive",
    location: "Miami",
    verificationStatus: "unverified",
    licenseNumber: "RE-86420-FL",
    website: "https://sunshineestates.com",
    phone: "(305) 555-8642",
    address: "333 Ocean Dr, Miami, FL 33139",
  },
  {
    id: "7",
    name: "Mountain View Realty",
    logo: "M",
    contactEmail: "info@mountainviewrealty.com",
    registrationDate: new Date(2023, 6, 12),
    numberOfListings: 22,
    status: "active",
    location: "Denver",
    verificationStatus: "verified",
    licenseNumber: "RE-75319-CO",
    website: "https://mountainviewrealty.com",
    phone: "(720) 555-7531",
    address: "444 Pine St, Denver, CO 80202",
  },
  {
    id: "8",
    name: "Capital City Homes",
    logo: "C",
    contactEmail: "support@capitalcityhomes.com",
    registrationDate: new Date(2023, 7, 3),
    numberOfListings: 19,
    status: "active",
    location: "Washington DC",
    verificationStatus: "verified",
    licenseNumber: "RE-95173-DC",
    website: "https://capitalcityhomes.com",
    phone: "(202) 555-9517",
    address: "555 Constitution Ave, Washington, DC 20001",
  },
  {
    id: "9",
    name: "Lakefront Properties",
    logo: "L",
    contactEmail: "hello@lakefrontproperties.com",
    registrationDate: new Date(2023, 8, 21),
    numberOfListings: 14,
    status: "suspended",
    location: "Chicago",
    verificationStatus: "verified",
    licenseNumber: "RE-35791-IL",
    website: "https://lakefrontproperties.com",
    phone: "(312) 555-3579",
    address: "666 Lakeshore Dr, Chicago, IL 60611",
  },
  {
    id: "10",
    name: "Desert Oasis Realty",
    logo: "D",
    contactEmail: "info@desertoasis.com",
    registrationDate: new Date(2023, 9, 9),
    numberOfListings: 16,
    status: "active",
    location: "Phoenix",
    verificationStatus: "pending",
    licenseNumber: "RE-24680-AZ",
    website: "https://desertoasisrealty.com",
    phone: "(602) 555-2468",
    address: "777 Cactus Rd, Phoenix, AZ 85001",
  },
]

export function CompaniesTable() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<
    (typeof companies)[0] | null
  >(null);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7
  const totalPages = Math.ceil(companies.length / rowsPerPage)

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleViewProfile = (company: (typeof companies)[0]) => {
    // Navigate to the company profile page instead of opening a modal
    router.push(`/dashboard/companies/${company.id}`);
  }

  const handleSuspend = (company: (typeof companies)[0]) => {
    setSelectedCompany(company)
    setIsSuspendDialogOpen(true)
  }

  const handleDeactivate = (company: (typeof companies)[0]) => {
    setSelectedCompany(company)
    setIsDeactivateDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "suspended":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Suspended
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Inactive
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Calculate the current page's data
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage

  // Apply sorting if needed
  const sortedCompanies = [...companies]
  if (sortField) {
    sortedCompanies.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }

  const currentCompanies = sortedCompanies.slice(indexOfFirstRow, indexOfLastRow)

  // Pagination controls
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  return (
    <Card className="border-border/40">
      <CardContent className="p-0">
        <div className="rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-3.5 text-sm font-medium text-muted-foreground w-[60px]">
                    #
                  </th>
                  <th
                    className="px-4 py-3.5 text-sm font-medium text-muted-foreground cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Company Name
                      {sortField === "name" && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-sm font-medium text-muted-foreground">
                    Contact Email
                  </th>
                  <th
                    className="px-4 py-3.5 text-sm font-medium text-muted-foreground cursor-pointer"
                    onClick={() => handleSort("registrationDate")}
                  >
                    <div className="flex items-center gap-1">
                      Registration Date
                      {sortField === "registrationDate" && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3.5 text-sm font-medium text-muted-foreground cursor-pointer"
                    onClick={() => handleSort("numberOfListings")}
                  >
                    <div className="flex items-center gap-1">
                      Listings
                      {sortField === "numberOfListings" && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3.5 text-sm font-medium text-muted-foreground cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortField === "status" && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-sm font-medium text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {currentCompanies.map((company, index) => (
                  <tr
                    key={company.id}
                    className="group hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {indexOfFirstRow + index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 bg-primary/10 text-primary">
                          <AvatarFallback>
                            <Building2 className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {company.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <a
                        href={`mailto:${company.contactEmail}`}
                        className="text-primary hover:underline"
                      >
                        {company.contactEmail}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {format(company.registrationDate, "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      {company.numberOfListings}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {getStatusBadge(company.status)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewProfile(company)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Profile</span>
                            </DropdownMenuItem>
                            {company.status !== "suspended" && (
                              <DropdownMenuItem
                                onClick={() => handleSuspend(company)}
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                <span>Suspend</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeactivate(company)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Deactivate</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{indexOfFirstRow + 1}</span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastRow, companies.length)}
              </span>{" "}
              of <span className="font-medium">{companies.length}</span>{" "}
              companies
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {selectedCompany && (
        <>
          <SuspendCompanyDialog
            company={selectedCompany}
            isOpen={isSuspendDialogOpen}
            onClose={() => setIsSuspendDialogOpen(false)}
            onSuspend={(reason) => {
              console.log(
                `Suspending company ${selectedCompany.id} with reason: ${reason}`
              );
              setIsSuspendDialogOpen(false);
              // In a real application, you would call an API to update the status
            }}
          />

          <DeactivateCompanyDialog
            company={selectedCompany}
            isOpen={isDeactivateDialogOpen}
            onClose={() => setIsDeactivateDialogOpen(false)}
            onDeactivate={() => {
              console.log(`Deactivating company ${selectedCompany.id}`);
              setIsDeactivateDialogOpen(false);
              // In a real application, you would call an API to update the status
            }}
          />
        </>
      )}
    </Card>
  );
}
