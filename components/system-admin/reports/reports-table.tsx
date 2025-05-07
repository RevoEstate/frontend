"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Ban, ChevronLeft, ChevronRight, Eye, MoreHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { RemoveContentDialog } from "./remove-content-dialog"
import { DismissReportDialog } from "./dismiss-report-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for demonstration
const reports = [
  {
    id: "RPT-1001",
    reportedBy: {
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "",
    },
    contentDescription: "Luxury Penthouse listing with misleading price information",
    propertyId: "PROP-28374",
    dateReported: new Date(2023, 10, 15),
    status: "open",
    type: "price",
    comment: "The listing states $2,500/month but the actual price is $3,500/month when you inquire.",
    contentOwner: {
      name: "Horizon Properties",
      email: "info@horizonproperties.com",
      avatar: "",
    },
  },
  {
    id: "RPT-1002",
    reportedBy: {
      name: "Maria Johnson",
      email: "maria.johnson@example.com",
      avatar: "",
    },
    contentDescription: "Beachfront villa with inappropriate content in photos",
    propertyId: "PROP-39485",
    dateReported: new Date(2023, 10, 14),
    status: "open",
    type: "inappropriate",
    comment: "One of the photos shows inappropriate content that violates platform guidelines.",
    contentOwner: {
      name: "Coastal Realty",
      email: "contact@coastalrealty.com",
      avatar: "",
    },
  },
  {
    id: "RPT-1003",
    reportedBy: {
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      avatar: "",
    },
    contentDescription: "Apartment listing with fake amenities",
    propertyId: "PROP-56789",
    dateReported: new Date(2023, 10, 12),
    status: "resolved",
    type: "inaccurate",
    comment: "The listing claims to have a pool and gym, but the building has neither.",
    contentOwner: {
      name: "Metro Housing Solutions",
      email: "support@metrohousing.com",
      avatar: "",
    },
  },
  {
    id: "RPT-1004",
    reportedBy: {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      avatar: "",
    },
    contentDescription: "Downtown loft listing with discriminatory language",
    propertyId: "PROP-67890",
    dateReported: new Date(2023, 10, 10),
    status: "open",
    type: "discrimination",
    comment: "The listing contains discriminatory language regarding potential tenants.",
    contentOwner: {
      name: "Urban Living",
      email: "info@urbanliving.com",
      avatar: "",
    },
  },
  {
    id: "RPT-1005",
    reportedBy: {
      name: "David Brown",
      email: "david.brown@example.com",
      avatar: "",
    },
    contentDescription: "Commercial office space with stolen photos",
    propertyId: "PROP-78901",
    dateReported: new Date(2023, 10, 8),
    status: "dismissed",
    type: "copyright",
    comment: "These photos were stolen from our listing. We own the copyright.",
    contentOwner: {
      name: "Business Spaces Inc",
      email: "contact@businessspaces.com",
      avatar: "",
    },
  },
  {
    id: "RPT-1006",
    reportedBy: {
      name: "Sarah Miller",
      email: "sarah.miller@example.com",
      avatar: "",
    },
    contentDescription: "Mountain cabin with non-existent address",
    propertyId: "PROP-89012",
    dateReported: new Date(2023, 10, 6),
    status: "open",
    type: "fraud",
    comment: "I visited the address listed and there is no property at this location.",
    contentOwner: {
      name: "Mountain View Realty",
      email: "info@mountainviewrealty.com",
      avatar: "",
    },
  },
  {
    id: "RPT-1007",
    reportedBy: {
      name: "Michael Taylor",
      email: "michael.taylor@example.com",
      avatar: "",
    },
    contentDescription: "Suburban home with deceptive room count",
    propertyId: "PROP-90123",
    dateReported: new Date(2023, 10, 4),
    status: "resolved",
    type: "inaccurate",
    comment: "The listing claims 4 bedrooms but one is clearly a closet with no window.",
    contentOwner: {
      name: "Sunshine Estates",
      email: "hello@sunshineestates.com",
      avatar: "",
    },
  },
  {
    id: "RPT-1008",
    reportedBy: {
      name: "Jennifer White",
      email: "jennifer.white@example.com",
      avatar: "",
    },
    contentDescription: "Studio apartment with harassing messaging",
    propertyId: "PROP-01234",
    dateReported: new Date(2023, 10, 2),
    status: "dismissed",
    type: "harassment",
    comment: "The landlord sent inappropriate messages when I inquired about the property.",
    contentOwner: {
      name: "City Center Apartments",
      email: "leasing@citycenter.com",
      avatar: "",
    },
  },
  {
    id: "RPT-1009",
    reportedBy: {
      name: "James Anderson",
      email: "james.anderson@example.com",
      avatar: "",
    },
    contentDescription: "Retail space with misleading square footage",
    propertyId: "PROP-12345",
    dateReported: new Date(2023, 10, 1),
    status: "open",
    type: "inaccurate",
    comment: "The listing says 3,000 sq ft but the actual space is only about 2,200 sq ft.",
    contentOwner: {
      name: "Commercial Properties LLC",
      email: "info@commercialproperties.com",
      avatar: "",
    },
  },
  {
    id: "RPT-1010",
    reportedBy: {
      name: "Lisa Martin",
      email: "lisa.martin@example.com",
      avatar: "",
    },
    contentDescription: "Vacation home with false availability",
    propertyId: "PROP-23456",
    dateReported: new Date(2023, 9, 28),
    status: "resolved",
    type: "scam",
    comment: "They took my deposit but then said the property wasn't available for my dates.",
    contentOwner: {
      name: "Vacation Rentals",
      email: "bookings@vacationrentals.com",
      avatar: "",
    },
  },
]

export function ContentReportsTable() {
  const router = useRouter()
  const [selectedReport, setSelectedReport] = useState<(typeof reports)[0] | null>(null)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [isDismissDialogOpen, setIsDismissDialogOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7
  const totalPages = Math.ceil(reports.length / rowsPerPage)

  const handleViewDetails = (report: (typeof reports)[0]) => {
    router.push(`/dashboard/reports/${report.id}`)
  }

  const handleRemoveContent = (report: (typeof reports)[0]) => {
    setSelectedReport(report)
    setIsRemoveDialogOpen(true)
  }

  const handleDismissReport = (report: (typeof reports)[0]) => {
    setSelectedReport(report)
    setIsDismissDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="text-amber-600 bg-amber-50">
            Open
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50">
            Resolved
          </Badge>
        )
      case "dismissed":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Dismissed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Calculate the current page's data
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentReports = reports.slice(indexOfFirstRow, indexOfLastRow)

  // Pagination controls
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  return (
    <Card className="border-border/40">
      <CardContent className="p-0">
        <div className="rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableCell isHeader className="w-[80px]">Report ID</TableCell>
                  <TableCell isHeader>Reported By</TableCell>
                  <TableCell isHeader className="hidden md:table-cell">Property/Content</TableCell>
                  <TableCell isHeader>Date Reported</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader className="text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentReports.map((report) => (
                  <TableRow key={report.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback>{report.reportedBy.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:block">
                          <p className="text-sm font-medium">{report.reportedBy.name}</p>
                          <p className="text-xs text-muted-foreground">{report.reportedBy.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                      <div>
                        <p className="text-sm truncate">{report.contentDescription}</p>
                        <p className="text-xs text-muted-foreground">{report.propertyId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{format(report.dateReported, "MMM d, yyyy")}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(report)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            {report.status === "open" && (
                              <>
                                <DropdownMenuItem onClick={() => handleRemoveContent(report)}>
                                  <Ban className="mr-2 h-4 w-4" />
                                  <span>Remove Content</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDismissReport(report)}>
                                  <X className="mr-2 h-4 w-4" />
                                  <span>Dismiss Report</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRow, reports.length)}</span> of{" "}
              <span className="font-medium">{reports.length}</span> reports
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {selectedReport && (
        <>
          <RemoveContentDialog
            report={selectedReport}
            isOpen={isRemoveDialogOpen}
            onClose={() => setIsRemoveDialogOpen(false)}
            onRemove={() => {
              console.log(`Removing content for report ${selectedReport.id}`)
              setIsRemoveDialogOpen(false)
              // In a real application, you would call an API to remove the content
            }}
          />

          <DismissReportDialog
            report={selectedReport}
            isOpen={isDismissDialogOpen}
            onClose={() => setIsDismissDialogOpen(false)}
            onDismiss={(reason) => {
              console.log(`Dismissing report ${selectedReport.id} with reason: ${reason}`)
              setIsDismissDialogOpen(false)
              // In a real application, you would call an API to dismiss the report
            }}
          />
        </>
      )}
    </Card>
  )
}
